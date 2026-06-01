"use client";

import jsPDF from "jspdf";

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export const getInvoiceData = (service = {}) => ({
  invoiceNo: service.serviceNo || service.razorpayOrderId || service._id || "-",
  customerName: service.clientName || service.customer?.name || "-",
  customerMobile: service.mobile || service.customer?.mobile || "-",
  customerEmail: service.email || service.customer?.email || "-",
  serviceTitle:
    service.serviceTitle ||
    service.service?.title ||
    service.serviceId?.title ||
    service.serviceSlug ||
    "-",
  serviceName:
    (typeof service.service === "object"
      ? service.service?.heading || service.service?.title
      : service.service) ||
    service.serviceId?.heading ||
    service.serviceId?.title ||
    "-",
  amount: service.totalPayment || service.amount || 0,
  paymentMode: service.paymentMode || "Online",
  paymentStatus: service.paymentStatus || service.status || "-",
  paymentId: service.razorpayPaymentId || "-",
  date: service.paymentDate || service.createdAt || new Date(),
});

export const downloadServiceInvoice = (service) => {
  const invoice = getInvoiceData(service);
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BRIEFCASSE", 20, 22);
  doc.setFontSize(15);
  doc.text("Tax Invoice", 20, 34);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Legal | Compliance | IP Services", 20, 42);
  doc.text(`Invoice No: ${invoice.invoiceNo}`, 130, 24);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString("en-IN")}`, 130, 32);

  doc.setDrawColor(37, 99, 235);
  doc.line(20, 50, 190, 50);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Bill To", 20, 62);

  doc.setFont("helvetica", "normal");
  doc.text(invoice.customerName, 20, 72);
  doc.text(invoice.customerMobile, 20, 80);
  doc.text(invoice.customerEmail, 20, 88);

  const rows = [
    ["Service Title", invoice.serviceTitle],
    ["Service", invoice.serviceName],
    ["Payment Mode", invoice.paymentMode],
    ["Payment Status", invoice.paymentStatus],
    ["Payment ID", invoice.paymentId],
    ["Amount", formatCurrency(invoice.amount)],
  ];

  let y = 106;
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), 80, y);
    y += 12;
  });

  doc.setFillColor(239, 246, 255);
  doc.rect(20, y + 6, 170, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Total Paid: ${formatCurrency(invoice.amount)}`, 25, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("This is a computer-generated invoice.", 20, 280);

  doc.save(`briefcasse-invoice-${invoice.invoiceNo}.pdf`);
};

export const printServiceInvoice = (service) => {
  const invoice = getInvoiceData(service);
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
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding: 12px 0; }
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
