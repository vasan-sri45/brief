import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateSalarySlip = (employee) => {
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFillColor(0, 0, 0);
  doc.rect(65, 15, 80, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BRIEFCASSE", 88, 33);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text("PAYSLIP", 92, 58);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Salary Month:", 15, 70);

  doc.setFont("helvetica", "normal");
  doc.text(employee.month || "Current Month", 42, 70);
  doc.text("Generated for payroll record", 15, 75);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Employee Details", 15, 90);

  autoTable(doc, {
    startY: 94,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    body: [
      [
        "Employee Name",
        employee.employeeName || "-",
        "Employee ID",
        employee.employeeCode || "-",
      ],
      [
        "Father Name",
        employee.fatherName || "-",
        "Mother Name",
        employee.motherName || "-",
      ],
      [
        "Designation",
        employee.designation || "To be updated",
        "Department",
        employee.department || "To be updated",
      ],
      [
        "PAN",
        employee.panNo || "To be updated",
        "UAN",
        employee.uanNumber || "Not Available",
      ],
      [
        "ESI No.",
        employee.esiNumber || "To be updated",
        "Location",
        employee.location || "India",
      ],
      [
        "Bank Name",
        employee.bankName || "To be updated",
        "Account No.",
        employee.accountNo || "To be updated",
      ],
      [
        "IFSC Code",
        employee.ifscNo || "To be updated",
        "Branch Name",
        employee.branchName || "To be updated",
      ],
      [
        "Address",
        employee.address || "To be updated",
        "Pay Period",
        employee.month || "Current Month",
      ],
    ],
  });

  const y1 = doc.lastAutoTable.finalY + 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Attendance Details", 15, y1);

  autoTable(doc, {
    startY: y1 + 4,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    body: [
      [
        "Total Working Days",
        employee.totalWorkingDays || 30,
        "Paid Days",
        employee.paidDays || employee.presentDays || 0,
      ],
      [
        "LOP Days",
        employee.lopDays || 0,
        "Casual Leave",
        employee.casualLeaveDays || 0,
      ],
    ],
  });

  const y2 = doc.lastAutoTable.finalY + 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Salary Details", 15, y2);

  autoTable(doc, {
    startY: y2 + 4,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [210, 210, 210],
      textColor: [0, 0, 0],
    },
    head: [["Earnings", "Amount (₹)", "Deductions", "Amount (₹)"]],
    body: [
      [
        "Basic Salary",
        employee.basicSalary || employee.monthlySalary || 0,
        "Employee PF",
        employee.pf || 0,
      ],
      ["HRA", employee.hra || 0, "Employee ESI", employee.esi || 0],
      ["Conveyance", employee.conveyanceAllowance || 0, "Professional Tax", employee.professionalTax || 0],
      ["Medical", employee.medicalAllowance || 0, "TDS", employee.tds || 0],
      ["Special Allowance", employee.specialAllowance || 0, "LOP Deduction", employee.lopDeduction || 0],
      ["Other Allowances", employee.allowances || 0, "", ""],
      [
        "Gross Earnings",
        Number(employee.monthlySalary || 0) + Number(employee.allowances || 0),
        "Total Deductions",
        Number(employee.lopDeduction || 0) +
          Number(employee.statutoryDeduction || 0),
      ],
      [
        "LOP Recovery",
        employee.lopRecoveryAmount || 0,
        "",
        "",
      ],
    ],
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [230, 240, 255],
      textColor: [0, 0, 0],
    },
    head: [["Employer Contributions", "Amount"]],
    body: [
      ["Employer PF", employee.employerPf || 0],
      ["Employer ESI", employee.employerEsi || 0],
    ],
  });

  const y3 = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Net Salary Payable: Rs. ${employee.payableSalary || 0}`, 15, y3);

  doc.setFontSize(9);
  doc.text(
    `Amount in Words: ${employee.amountInWords || "Rupees amount only"}`,
    15,
    y3 + 8
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Note: This payslip has been prepared from salary and employee records. Please verify PAN, bank details, attendance and payment confirmation before official use.",
    15,
    y3 + 22,
    { maxWidth: 180 }
  );

  doc.setFont("helvetica", "bold");
  doc.text("For Briefcasse", 15, y3 + 45);

  doc.setFont("helvetica", "normal");
  doc.text("Authorized Signatory", 15, y3 + 55);

  doc.save(`${employee.employeeName || "employee"}-payslip.pdf`);
};
