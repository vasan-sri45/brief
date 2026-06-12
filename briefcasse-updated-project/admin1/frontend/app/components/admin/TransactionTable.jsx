"use client";

import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  downloadServiceInvoice,
  printServiceInvoice,
} from "../../config/generateServiceInvoice";

const serviceName = (row) =>
  typeof row.service === "object"
    ? row.service?.heading || row.service?.title || "-"
    : row.service || "-";

const assignedName = (row) =>
  row.assignedToName || row.assignedTo?.name || "Unassigned";

const statusClass = (value = "") => {
  const normalized = String(value).toLowerCase();

  if (normalized.includes("completed") || normalized.includes("paid")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }
  if (normalized.includes("progress")) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }
  if (normalized.includes("failed") || normalized.includes("cancel")) {
    return "bg-red-50 text-red-700 ring-red-100";
  }
  return "bg-slate-100 text-slate-600 ring-slate-200";
};

const StatusPill = ({ value }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClass(value)}`}>
    {value || "-"}
  </span>
);

const isPaidRow = (row) =>
  String(row.paymentStatus || "").toLowerCase() === "paid";

export default function TransactionTable({ data = [], onView }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(
    () => [
      {
        header: "No",
        id: "rowNo",
        accessorFn: (_row, index) => index + 1 + pageIndex * pageSize,
      },
      {
        header: "Customer",
        accessorFn: (row) => row.clientName || row.customer?.name || "-",
      },
      {
        header: "Service ID",
        accessorFn: (row) => row.serviceNo || row.customer?.userCode || "-",
      },
      {
        header: "Service",
        accessorFn: serviceName,
      },
      {
        header: "Assigned",
        accessorFn: assignedName,
      },
      {
        header: "Amount",
        accessorFn: (row) =>
          `Rs. ${(row.totalPayment || row.amount || 0).toLocaleString()}`,
      },
      { header: "Payment Mode", accessorKey: "paymentMode" },
      {
        header: "Payment Status",
        accessorKey: "paymentStatus",
        cell: (info) => <StatusPill value={info.getValue()} />,
      },
      {
        header: "Service Status",
        accessorKey: "serviceStatus",
        cell: (info) => <StatusPill value={info.getValue()} />,
      },
      {
        header: "Date",
        accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
      },
      {
        id: "view",
        header: "Actions",
        cell: (info) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onView?.(info.row.original)}
              className="h-9 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
            >
              View
            </button>

            {isPaidRow(info.row.original) && (
              <>
                <button
                  type="button"
                  onClick={() => downloadServiceInvoice(info.row.original)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                  aria-label="Download invoice"
                >
                  <Download size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => printServiceInvoice(info.row.original)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
                  aria-label="Print invoice"
                >
                  <Printer size={15} />
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [pageIndex, pageSize, onView]
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;

      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
      <div className="grid gap-3 p-4 md:hidden">
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map(({ original: row }) => (
            <article
              key={row._id}
              className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {row.serviceNo || row.customer?.userCode || "-"}
                  </p>
                  <h3 className="mt-1 font-bold text-gray-900">
                    {row.clientName || row.customer?.name || "-"}
                  </h3>
                  <p className="text-sm text-gray-500">{serviceName(row)}</p>
                </div>
                <button
                  onClick={() => onView?.(row)}
                  className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white"
                >
                  View
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info
                  label="Amount"
                  value={`Rs. ${row.totalPayment || row.amount || 0}`}
                />
                <Info label="Status" value={<StatusPill value={row.serviceStatus} />} />
                <Info label="Payment" value={<StatusPill value={row.paymentStatus} />} />
                <Info label="Assigned" value={assignedName(row)} />
              </div>

              {isPaidRow(row) && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => downloadServiceInvoice(row)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100"
                  >
                    <Download size={15} />
                    Invoice
                  </button>

                  <button
                    type="button"
                    onClick={() => printServiceInvoice(row)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200"
                  >
                    <Printer size={15} />
                    Print
                  </button>
                </div>
              )}
            </article>
          ))
        ) : (
          <div className="rounded-2xl bg-gray-50 p-6 text-center font-semibold text-gray-500">
            No transactions found.
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-4 text-xs font-bold uppercase tracking-wide">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="odd:bg-white even:bg-slate-50/70 hover:bg-blue-50/60"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b border-slate-100 px-4 py-4 text-center font-medium text-slate-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {Array.from({ length: table.getPageCount() }).map((_, index) => (
            <button
              key={index}
              onClick={() => setPageIndex(index)}
              className={`rounded-xl px-3 py-2 text-sm font-bold ${
                pageIndex === index ? "bg-blue-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <select
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPageIndex(0);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div className="rounded-xl bg-gray-50 p-3">
    <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
    <p className="mt-1 font-semibold text-gray-700">{value}</p>
  </div>
);
