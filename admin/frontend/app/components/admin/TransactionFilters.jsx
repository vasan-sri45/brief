
"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  setMonth,
  setDate,
  setAssigned,
  setStatus,
  setSearch,
  resetUI,
} from "../../store/features/ui.slice";
import {useExportTransactions} from "../../hooks/useService";

import { useGetEmployees } from "../../hooks/useEmployeeAuthMutations";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function TransactionFilters({ fetching }) {

  const exportMutation = useExportTransactions();

  const dispatch = useDispatch();
  const { search, month, date, assigned, status } = useSelector((s) => s.ui);

  const { data: empRes, isLoading: empLoading } = useGetEmployees();
  const employees = Array.isArray(empRes?.users) ? empRes.users : [];

  return (
    <div className="w-full bg-white border-b">
      <div className="w-full lg:w-10/12 mx-auto py-5 px-4 flex flex-wrap items-center gap-3">

        {/* Month */}
        <select
          value={month}
          onChange={(e) => dispatch(setMonth(e.target.value))}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">Select Month</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => dispatch(setDate(e.target.value))}
          className="border px-4 py-2 rounded-md"
        />

        {/* Assigned Filter */}
        <select
          value={assigned}
          onChange={(e) => dispatch(setAssigned(e.target.value))}
          className="border px-4 py-2 rounded-md"
        >
          <option value="All">All</option>
          <option value="Assigned">Assigned Only</option>
          <option value="Unassigned">Unassigned Only</option>

          {!empLoading &&
            employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))
          }
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => dispatch(setStatus(e.target.value))}
          className="border px-4 py-2 rounded-md"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="border px-4 py-2 rounded-md"
          placeholder="Search transactions"
        />

        {/* Reset */}
        <button
          onClick={() => dispatch(resetUI())}
          className="bg-gray-300 px-4 py-2 rounded-md"
        >
          Reset
        </button>

        {/* Export */}
        {/* <button
          disabled={fetching}
          className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-60"
        >
          {fetching ? "Exporting…" : "Export"}
        </button> */}

        <button
  onClick={() => exportMutation.mutate()}
  disabled={exportMutation.isPending}
  className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-md"
>
  {exportMutation.isPending ? "Exporting..." : "Export"}
</button>
      </div>
    </div>
  );
}
