import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const money = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const plainAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

const valueOrDefault = (value, fallback = "To be updated") => {
  if (value === 0) return "0";
  return value ? String(value) : fallback;
};

const formatDate = (value) => {
  if (!value) return "Not Available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not Available";
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
};

const loadImageAsDataUrl = async (src) => {
  const response = await fetch(src);
  if (!response.ok) throw new Error("Could not load payslip logo");
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
  doc.roundedRect(17, 12, 30, 24, 1, 1, "F");
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.2);
  doc.line(22, 29, 42, 20);
  doc.line(22, 29, 22, 34);
  doc.line(31, 25, 31, 34);
  doc.line(42, 20, 42, 34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("BRIEFCASSE", 14, 47);
};

const numberToWords = (amount) => {
  const value = Math.round(Number(amount || 0));
  if (!value) return "Zero Rupees Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const belowHundred = (num) =>
    num < 20
      ? ones[num]
      : `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();

  const belowThousand = (num) => {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    return `${hundred ? `${ones[hundred]} Hundred` : ""} ${
      rest ? belowHundred(rest) : ""
    }`.trim();
  };

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const rest = value % 1000;

  return `${[
    crore ? `${belowThousand(crore)} Crore` : "",
    lakh ? `${belowThousand(lakh)} Lakh` : "",
    thousand ? `${belowThousand(thousand)} Thousand` : "",
    rest ? belowThousand(rest) : "",
  ]
    .filter(Boolean)
    .join(" ")} Rupees Only`;
};

const resolvePayPeriod = (employee) =>
  employee.month ||
  employee.payPeriod ||
  employee.salaryMonth ||
  employee.monthName ||
  "Current Month";

const tableTheme = {
  theme: "grid",
  margin: { left: 14, right: 14 },
  styles: {
    font: "helvetica",
    fontSize: 7,
    cellPadding: 1.8,
    lineColor: [170, 170, 170],
    lineWidth: 0.12,
    textColor: [0, 0, 0],
    valign: "middle",
  },
  headStyles: {
    fillColor: [245, 247, 250],
    textColor: [0, 0, 0],
    fontStyle: "bold",
  },
  alternateRowStyles: {
    fillColor: [252, 252, 252],
  },
};

export const generateSalarySlip = async (employee = {}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const payPeriod = resolvePayPeriod(employee);

  const basicSalary = Number(employee.basicSalary || 0);
  const monthlySalary = Number(employee.monthlySalary || 0);
  const hra = Number(employee.hra || 0);
  const conveyance = Number(employee.conveyanceAllowance || 0);
  const medical = Number(employee.medicalAllowance || 0);
  const special = Number(employee.specialAllowance || 0);
  const otherAllowances = Number(employee.allowances || 0);
  const grossEarnings =
    basicSalary + hra + conveyance + medical + special + otherAllowances ||
    monthlySalary + otherAllowances;

  const employeePf = Number(employee.pf || 0);
  const employeeEsi = Number(employee.esi || 0);
  const professionalTax = Number(employee.professionalTax || 0);
  const tds = Number(employee.tds || 0);
  const lopDeduction = Number(employee.lopDeduction || 0);
  const totalDeductions =
    employeePf + employeeEsi + professionalTax + tds + lopDeduction;
  const lopRecovery = Number(employee.lopRecoveryAmount || 0);
  const netSalary =
    employee.payableSalary ?? grossEarnings - totalDeductions + lopRecovery;

  try {
    const logo = await loadImageAsDataUrl("/assets/brief_blue.png");
    doc.addImage(logo, "PNG", 14, 10, 42, 37);
  } catch {
    drawFallbackLogo(doc);
  }
  doc.setTextColor(55, 66, 150);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Briefcasse", 14, 52);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(
    ["296, 10th Street, 3rd Main Road,", "Astalakshmi Nagar, Valasaravakam,", "Chennai - 116"],
    pageWidth - 14,
    28,
    { align: "right" }
  );

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("Salary Month:", 14, 65);
  doc.setFont("helvetica", "normal");
  doc.text(payPeriod, 39, 65);
  doc.text("Generated for payroll record", 14, 70);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Employee Details", 14, 86);

  autoTable(doc, {
    ...tableTheme,
    startY: 91,
    columnStyles: {
      0: { cellWidth: 34 },
      1: { cellWidth: 78 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
    },
    body: [
      [
        "Employee Name",
        valueOrDefault(employee.employeeName, "-"),
        "Employee ID",
        valueOrDefault(employee.employeeCode, "-"),
      ],
      [
        "Date of Birth",
        formatDate(employee.dateOfBirth),
        "Date of Joining",
        formatDate(employee.dateOfJoining),
      ],
      [
        "Designation",
        valueOrDefault(employee.designation),
        "Department",
        valueOrDefault(employee.department),
      ],
      [
        "PAN",
        valueOrDefault(employee.panNo || employee.panNumber),
        "UAN",
        valueOrDefault(employee.uanNumber, "Not Available"),
      ],
      [
        "ESI No.",
        valueOrDefault(employee.esiNumber),
        "Location",
        valueOrDefault(employee.location, "India"),
      ],
      [
        "Bank Name",
        valueOrDefault(employee.bankName),
        "Account No.",
        valueOrDefault(employee.accountNo || employee.bankAccountNumber),
      ],
      [
        "IFSC Code",
        valueOrDefault(employee.ifscNo || employee.ifscCode),
        "Branch Name",
        valueOrDefault(employee.branchName),
      ],
      [
        "Address",
        valueOrDefault(employee.address),
        "Pay Period",
        payPeriod,
      ],
    ],
  });

  let y = doc.lastAutoTable.finalY + 11;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Attendance Details", 14, y);

  autoTable(doc, {
    ...tableTheme,
    startY: y + 4,
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 70 },
      1: { cellWidth: 18 },
      2: { fontStyle: "bold", cellWidth: 54 },
      3: { cellWidth: 32 },
    },
    body: [
      [
        "Total Working Days",
        employee.totalWorkingDays ?? 0,
        "Paid Days",
        employee.paidDays ?? employee.presentDays ?? 0,
      ],
      [
        "LOP Days",
        employee.lopDays ?? 0,
        "Casual Leave",
        employee.casualLeaveDays ?? employee.casualLeave ?? 0,
      ],
    ],
  });

  y = doc.lastAutoTable.finalY + 11;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Salary Details", 14, y);

  autoTable(doc, {
    ...tableTheme,
    startY: y + 4,
    head: [["Earnings", "Amount", "Deductions", "Amount"]],
    headStyles: {
      fillColor: [205, 205, 205],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 63 },
      1: { cellWidth: 36 },
      2: { cellWidth: 55 },
      3: { cellWidth: 28 },
    },
    body: [
      ["Basic Salary", plainAmount(basicSalary), "Employee PF", plainAmount(employeePf)],
      ["HRA", plainAmount(hra), "Employee ESI", plainAmount(employeeEsi)],
      [
        "Conveyance",
        plainAmount(conveyance),
        "Professional Tax",
        plainAmount(professionalTax),
      ],
      ["Medical", plainAmount(medical), "TDS", plainAmount(tds)],
      ["Special Allowance", plainAmount(special), "LOP Deduction", plainAmount(lopDeduction)],
      ["Other Allowances", plainAmount(otherAllowances), "", ""],
      [
        "Gross Earnings",
        plainAmount(grossEarnings),
        "Total Deductions",
        plainAmount(totalDeductions),
      ],
      ["LOP Recovery", plainAmount(lopRecovery), "Net Salary", plainAmount(netSalary)],
    ],
  });

  y = doc.lastAutoTable.finalY + 8;

  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Employer Contributions", "Amount"]],
    headStyles: {
      fillColor: [227, 240, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 150 },
      1: { cellWidth: 32 },
    },
    body: [
      ["Employer PF", plainAmount(employee.employerPf || 0)],
      ["Employer ESI", plainAmount(employee.employerEsi || 0)],
    ],
  });

  y = doc.lastAutoTable.finalY + 10;

  doc.setFillColor(245, 248, 255);
  doc.roundedRect(18, y, 174, 18, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Net Salary Payable", 24, y + 7);
  doc.setFontSize(15);
  doc.text(money(netSalary), 186, y + 8, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    `Amount in Words: ${employee.amountInWords || numberToWords(netSalary)}`,
    24,
    y + 14
  );

  y += 28;
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(
    "Note: This is a system generated payslip prepared from employee, attendance, and payroll records.",
    18,
    y,
    { maxWidth: 174 }
  );

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("For Briefcasse", 18, y + 22);
  doc.setFont("helvetica", "normal");
  doc.text("Authorized Signatory", 18, y + 32);

  doc.save(`${employee.employeeName || "employee"}_payslip.pdf`);
};
