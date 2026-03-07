"use client";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function TransactionTable({ data = [], onView }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(
    () => [
      {
        header: "No",
        id: "rowNo",
        accessorFn: (_r, i) => i + 1 + pageIndex * pageSize,
      },
      { header: "Customer", accessorKey: "clientName" },
      { header: "Service", accessorKey: "service" },
      {
        header: "Amount",
        accessorFn: (row) =>
          `₹${(row.totalPayment || row.amount || 0).toLocaleString()}`,
      },
      { header: "Payment Mode", accessorKey: "paymentMode" },
      { header: "Payment Status", accessorKey: "paymentStatus" },
      { header: "Service Status", accessorKey: "serviceStatus" },
      {
        header: "Date",
        accessorFn: (row) =>
          new Date(row.createdAt).toLocaleDateString(),
      },
      {
        id: "view",
        header: "View",
        cell: (info) => (
          <button
            onClick={() => onView?.(info.row.original)}
            className="bg-blue-600 text-white w-7 h-7 rounded hover:bg-blue-700"
          >
            ▶
          </button>
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
    <div className="border rounded bg-white overflow-x-auto">
      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 border-b">
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
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-2 border-b text-center"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION CONTROLS */}
      <div className="flex items-center justify-between p-4 border-t">
        {/* Previous / Next */}
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {Array.from({ length: table.getPageCount() }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPageIndex(i)}
              className={`px-3 py-1 rounded ${
                pageIndex === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Page Size Selector */}
        <div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className="border px-2 py-1 rounded"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}