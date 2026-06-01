"use client";

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export const getInvoiceData = (order = {}) => ({
  invoiceNo: order.serviceNo || order.razorpayOrderId || order._id || "-",
  customerName: order.customer?.name || order.userId?.name || "-",
  customerMobile: order.customer?.mobile || order.userId?.mobile || "-",
  customerEmail: order.customer?.email || order.userId?.email || "-",
  serviceTitle: order.serviceId?.title || order.serviceSlug || "-",
  serviceName: order.serviceId?.heading || order.serviceId?.title || "-",
  amount: order.amount || 0,
  paymentMode: order.paymentMode || "Online",
  paymentStatus: order.status || "-",
  paymentId: order.razorpayPaymentId || "-",
  date: order.paymentDate || order.createdAt || new Date(),
});

export const printServiceInvoice = (order) => {
  const invoice = getInvoiceData(order);
  const printable = window.open("", "_blank", "width=900,height=700");

  if (!printable) return;

  printable.document.write(`
    <html>
      <head>
        <title>Invoice ${invoice.invoiceNo}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 32px; }
          .top { display: flex; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 18px; }
          h1 { margin: 0; color: #2563eb; letter-spacing: 1px; }
          h2 { margin: 8px 0 0; }
          .box { margin-top: 26px; border: 1px solid #dbeafe; border-radius: 14px; padding: 18px; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding: 12px 0; gap: 24px; }
          .row:last-child { border-bottom: 0; }
          .label { color: #64748b; font-weight: 700; }
          .total { margin-top: 22px; background: #eff6ff; padding: 18px; border-radius: 14px; font-size: 22px; font-weight: 800; }
        </style>
      </head>
      <body>
        <div class="top">
          <div>
            <h1>BRIEFCASSE</h1>
            <p>Legal | Compliance | IP Services</p>
          </div>
          <div>
            <h2>Tax Invoice</h2>
            <p><b>Invoice:</b> ${invoice.invoiceNo}</p>
            <p><b>Date:</b> ${new Date(invoice.date).toLocaleDateString("en-IN")}</p>
          </div>
        </div>
        <div class="box">
          <h3>Bill To</h3>
          <p>${invoice.customerName}</p>
          <p>${invoice.customerMobile}</p>
          <p>${invoice.customerEmail}</p>
        </div>
        <div class="box">
          ${[
            ["Service Title", invoice.serviceTitle],
            ["Service", invoice.serviceName],
            ["Payment Mode", invoice.paymentMode],
            ["Payment Status", invoice.paymentStatus],
            ["Payment ID", invoice.paymentId],
          ]
            .map(
              ([label, value]) =>
                `<div class="row"><span class="label">${label}</span><span>${value}</span></div>`
            )
            .join("")}
        </div>
        <div class="total">Total Paid: ${formatCurrency(invoice.amount)}</div>
      </body>
    </html>
  `);
  printable.document.close();
  printable.focus();
  printable.print();
};

export const downloadServiceInvoice = (order) => {
  const invoice = getInvoiceData(order);
  const content = `Briefcasse Invoice

Invoice No: ${invoice.invoiceNo}
Date: ${new Date(invoice.date).toLocaleDateString("en-IN")}

Customer: ${invoice.customerName}
Mobile: ${invoice.customerMobile}
Email: ${invoice.customerEmail}

Service Title: ${invoice.serviceTitle}
Service: ${invoice.serviceName}
Payment Mode: ${invoice.paymentMode}
Payment Status: ${invoice.paymentStatus}
Payment ID: ${invoice.paymentId}
Total Paid: ${formatCurrency(invoice.amount)}
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `briefcasse-invoice-${invoice.invoiceNo}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
