import XLSX from "xlsx";
import Payment from "../../models/services/pament.model.js";
import PaidService from "../../models/selling/paidService.model.js";

export const exportTransactions = async (req, res) => {
  try {

 const createdBy = req.user?.id;
  if (!createdBy) {
    res.status(401);
    throw new Error('Authentication required');
  }

    /* ONLINE ORDERS */
    const online = await Payment.find()
      .populate("serviceId", "title heading")
      .populate("userId", "name email mobile")
      .lean();

    /* OFFLINE SERVICES */
    const office = await PaidService.find()
      .populate("service", "title heading")
      .populate("assignedTo", "name")
      .lean();

    /* NORMALIZE DATA */
    const combined = [
      ...online.map((item) => ({
        ServiceNo: item.razorpayOrderId || "-",
        Customer: item.userId?.name,
        Mobile: item.userId?.mobile,
        Email: item.userId?.email,
        ServiceTitle: item.serviceId?.title,
        Service: item.serviceId?.heading,
        Amount: item.amount,
        PaymentMode: item.paymentMode,
        PaymentStatus: item.status,
        Date: item.createdAt,
      })),

      ...office.map((item) => ({
        ServiceNo: item.serviceNo,
        Customer: item.customer?.name,
        Mobile: item.customer?.mobile,
        Email: item.customer?.email,
        ServiceTitle: item.service?.title,
        Service: item.service?.heading,
        Amount: item.totalPayment,
        PaymentMode: item.paymentMode,
        PaymentStatus: item.paymentStatus,
        Date: item.createdAt,
      })),
    ];

    /* CREATE EXCEL */
    const worksheet = XLSX.utils.json_to_sheet(combined);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    /* SEND FILE */
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.xlsx"
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};