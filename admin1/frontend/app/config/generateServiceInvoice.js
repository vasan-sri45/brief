"use client";

import jsPDF from "jspdf";

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const loadImageAsDataUrl = async (src) => {
  const response = await fetch(src);
  if (!response.ok) throw new Error("Could not load invoice logo");
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const drawFallbackLogo = (doc) => {
  doc.setTextColor(55, 66, 150);
  doc.setFillColor(55, 66, 150);
  doc.roundedRect(20, 14, 20, 16, 1, 1, "F");
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.9);
  doc.line(24, 26, 37, 20);
  doc.line(24, 26, 24, 29);
  doc.line(30, 23, 30, 29);
  doc.line(37, 20, 37, 29);
};

const getAmountBreakdown = (service = {}) => {
  const totalAmount = Number(service.totalPayment || service.amount || 0);
  const baseAmount = Number(service.baseAmount || totalAmount);
  const gstRate = Number(service.gstRate ?? 18);
  const gstAmount = Number(service.gstAmount || 0);

  return {
    baseAmount,
    gstRate,
    gstAmount,
    totalAmount,
  };
};

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
  ...getAmountBreakdown(service),
  paymentMode: service.paymentMode || "Online",
  paymentStatus: service.paymentStatus || service.status || "-",
  paymentId: service.razorpayPaymentId || "-",
  date: service.paymentDate || service.createdAt || new Date(),
});

export const downloadServiceInvoice = async (service) => {
  const invoice = getInvoiceData(service);
  const doc = new jsPDF();

  try {
    const logo = await loadImageAsDataUrl("/assets/brief_blue.png");
    doc.addImage(logo, "PNG", 18, 12, 32, 28);
  } catch {
    drawFallbackLogo(doc);
  }

  doc.setTextColor(55, 66, 150);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Briefcasse", 52, 23);
  doc.setFontSize(11);
  doc.text("Legal | Compliance | IP Services", 52, 31);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Tax Invoice", 130, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoice.invoiceNo}`, 130, 30);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString("en-IN")}`, 130, 38);

  doc.setDrawColor(55, 66, 150);
  doc.setLineWidth(0.8);
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
    ["Service Price", formatCurrency(invoice.baseAmount)],
    [`GST (${invoice.gstRate}%)`, formatCurrency(invoice.gstAmount)],
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
  doc.text(`Total Paid: ${formatCurrency(invoice.totalAmount)}`, 25, y + 18);

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
          .top { display: flex; justify-content: space-between; border-bottom: 3px solid #374296; padding-bottom: 18px; }
          .brand { display: flex; align-items: center; gap: 14px; }
          .brand img { width: 72px; height: auto; }
          h1 { margin: 0; color: #374296; letter-spacing: .3px; }
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
          <div class="brand">
            <img src="/assets/brief_blue.png" alt="Briefcasse" />
            <div>
              <h1>Briefcasse</h1>
              <p>Legal | Compliance | IP Services</p>
            </div>
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
            ["Service Price", formatCurrency(invoice.baseAmount)],
            [`GST (${invoice.gstRate}%)`, formatCurrency(invoice.gstAmount)],
          ]
            .map(
              ([label, value]) =>
                `<div class="row"><span class="label">${label}</span><span>${value}</span></div>`
            )
            .join("")}
        </div>
        <div class="total">Total Paid: ${formatCurrency(invoice.totalAmount)}</div>
      </body>
    </html>
  `);
  printable.document.close();
  printable.focus();
  printable.print();
};
