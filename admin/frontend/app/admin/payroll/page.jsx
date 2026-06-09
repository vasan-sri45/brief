// "use client";

// import React, { useState } from "react";
// import PayrollTable from "../../components/payroll/PayrollTable";
// import PayrollStatsCards from "../../components/payroll/PayrollStatsCards";
// import { useMonthlyPayroll } from "../../hooks/useAttendanceMutations";

// const PayrollDashboard = () => {
//   const currentDate = new Date();

//   const [month, setMonth] = useState(
//     currentDate.getMonth() + 1
//   );

//   const [year, setYear] = useState(
//     currentDate.getFullYear()
//   );

//   const { data, isLoading, isError } =
//     useMonthlyPayroll(month, year);

//   const payrollData = data?.payroll || [];

//   const totalSalary = payrollData.reduce(
//     (sum, item) => sum + (item.monthlySalary || 0),
//     0
//   );

//   const totalDeduction = payrollData.reduce(
//     (sum, item) => sum + (item.lopDeduction || 0),
//     0
//   );

//   const totalPayable = payrollData.reduce(
//     (sum, item) => sum + (item.payableSalary || 0),
//     0
//   );

//   const pendingSalary = payrollData.filter(
//     (item) => item.status !== "Paid"
//   ).length;

//   if (isLoading) {
//     return (
//       <div className="p-6 text-gray-500 font-semibold">
//         Loading payroll...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-6 text-red-500 font-semibold">
//         Failed to load payroll
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-5">

//       <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-custom-blue">
//             Payroll Dashboard
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Manage monthly salary, LOP deduction, and salary slips.
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3">
//           <select
//             value={month}
//             onChange={(e) => setMonth(Number(e.target.value))}
//             className="px-4 py-3 rounded-xl border border-gray-300 outline-none"
//           >
//             {Array.from({ length: 12 }).map((_, i) => (
//               <option key={i + 1} value={i + 1}>
//                 {new Date(2026, i).toLocaleString("default", {
//                   month: "long",
//                 })}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             value={year}
//             onChange={(e) => setYear(Number(e.target.value))}
//             className="px-4 py-3 rounded-xl border border-gray-300 outline-none"
//           />
//         </div>
//       </div>

//       <PayrollStatsCards
//         totalSalary={totalSalary}
//         totalDeduction={totalDeduction}
//         totalPayable={totalPayable}
//         pendingSalary={pendingSalary}
//       />

//       <PayrollTable payrollData={payrollData} />
//     </div>
//   );
// };

// export default PayrollDashboard;


"use client";

import React, { useMemo, useState } from "react";
import PayrollTable from "../../components/payroll/PayrollTable";
import PayrollStatsCards from "../../components/payroll/PayrollStatsCards";
import { useMonthlyPayroll } from "../../hooks/useAttendanceMutations";

const PayrollDashboard = () => {
  const currentDate = new Date();

  const [month, setMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [year, setYear] = useState(
    currentDate.getFullYear()
  );

  const { data, isLoading, isError } =
    useMonthlyPayroll(month, year);

  const selectedMonthName = new Date(
    year,
    month - 1
  ).toLocaleString("default", {
    month: "long",
  });

  const payrollData = useMemo(() => {
    return (data?.payroll || []).map((item) => ({
      ...item,
      month: `${selectedMonthName} ${year}`,
    }));
  }, [data, selectedMonthName, year]);

  const payrollTotals = useMemo(() => {
    return payrollData.reduce(
      (totals, item) => {
        totals.totalSalary += Number(item.monthlySalary || 0);
        totals.totalDeduction +=
          Number(item.lopDeduction || 0) +
          Number(item.statutoryDeduction || 0);
        totals.totalPayable += Number(item.payableSalary || 0);
        if (item.status !== "Paid") totals.pendingSalary += 1;
        return totals;
      },
      {
        totalSalary: 0,
        totalDeduction: 0,
        totalPayable: 0,
        pendingSalary: 0,
      }
    );
  }, [payrollData]);

  if (isLoading) {
    return (
      <div className="p-6 text-gray-500 font-semibold">
        Loading payroll...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        Failed to load payroll
      </div>
    );
  }

  return (
    <div className="p-4 md:p-5 bg-[#F8FBFF] min-h-screen">
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <span className="inline-flex px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-semibold shadow-sm">
            Payroll Management
          </span>

          <h1 className="text-2xl md:text-4xl font-bold text-custom-blue mt-4">
            Payroll Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage monthly salary, LOP deduction, and salary slips.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 bg-white border border-blue-100 rounded-2xl p-3 shadow-sm">
          <select
            value={month}
            onChange={(e) =>
              setMonth(Number(e.target.value))
            }
            className="px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white font-semibold text-gray-700"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(year, i).toLocaleString(
                  "default",
                  {
                    month: "long",
                  }
                )}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
            className="px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white font-semibold text-gray-700"
          />
        </div>
      </div>

      <PayrollStatsCards
        totalSalary={payrollTotals.totalSalary}
        totalDeduction={payrollTotals.totalDeduction}
        totalPayable={payrollTotals.totalPayable}
        pendingSalary={payrollTotals.pendingSalary}
      />

      <PayrollTable payrollData={payrollData} />
    </div>
  );
};

export default PayrollDashboard;
