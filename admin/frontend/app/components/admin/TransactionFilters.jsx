
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
import { Download, Filter, RotateCcw, Search } from "lucide-react";

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
    <div className="w-full bg-slate-50 px-4 py-5">
      <div className="mx-auto w-full max-w-[1500px] rounded-3xl border border-blue-100 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
        <div className="mb-4 flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-blue-700">
              <Filter size={14} />
              Filters
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-slate-900">
              Transactions
            </h2>
          </div>

          <button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending || fetching}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-60"
          >
            <Download size={16} />
            {exportMutation.isPending ? "Exporting..." : "Export"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">

        {/* Month */}
        <select
          value={month}
          onChange={(e) => dispatch(setMonth(e.target.value))}
          className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Select Month</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => dispatch(setDate(e.target.value))}
          className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />

        {/* Assigned Filter */}
        <select
          value={assigned}
          onChange={(e) => dispatch(setAssigned(e.target.value))}
          className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
          className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Search */}
        <div className="relative sm:col-span-2 xl:col-span-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder="Search transactions"
          />
        </div>

        {/* Reset */}
        <button
          onClick={() => dispatch(resetUI())}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        >
          <RotateCcw size={15} />
          Reset
        </button>

        {/* Export */}
        {/* <button
          disabled={fetching}
          className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-60"
        >
          {fetching ? "Exporting…" : "Export"}
        </button> */}

        </div>
      </div>
    </div>
  );
}
