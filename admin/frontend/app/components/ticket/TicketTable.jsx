// "use client";

// import { useMemo, useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   flexRender,
// } from "@tanstack/react-table";

// import TicketDetailsModal from "./TicketDetailsModal";

// export default function TicketTable({
//   services = [],
//   loading,
//   error,
//   onUpdate,
//   userRole
// }) {

//   const [selectedService, setSelectedService] = useState(null);

//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(10);

//   const columns = useMemo(
//     () => [
//       {
//         header: "No",
//         id: "rowNo",
//         accessorFn: (_r, i) => i + 1 + pageIndex * pageSize,
//       },

//       { header: "Customer", accessorKey: "clientName" },

//       { header: "Service", accessorKey: "service" },

//       {
//         header: "Amount",
//         accessorFn: (row) =>
//           `₹${(row.totalPayment || 0).toLocaleString()}`,
//       },

//       { header: "Payment Mode", accessorKey: "paymentMode" },

//       { header: "Payment Status", accessorKey: "paymentStatus" },

//       { header: "Service Status", accessorKey: "serviceStatus" },

//       {
//         header: "Date",
//         accessorFn: (row) =>
//           new Date(row.createdAt).toLocaleDateString(),
//       },

//       {
//         id: "view",
//         header: "View",
//         cell: (info) => (
//           <button
//             onClick={() => setSelectedService(info.row.original)}
//             className="bg-blue-600 text-white w-7 h-7 rounded hover:bg-blue-700"
//           >
//             ▶
//           </button>
//         ),
//       },
//     ],
//     [pageIndex, pageSize]
//   );

//   const table = useReactTable({
//     data: services,
//     columns,
//     state: { pagination: { pageIndex, pageSize } },

//     onPaginationChange: (updater) => {
//       const next =
//         typeof updater === "function"
//           ? updater({ pageIndex, pageSize })
//           : updater;

//       setPageIndex(next.pageIndex);
//       setPageSize(next.pageSize);
//     },

//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   if (loading)
//     return <div className="text-center py-10">Loading...</div>;

//   if (error)
//     return <div className="text-center py-10 text-red-500">Failed to load</div>;

//   return (
//     <>
//       <section className="w-full lg:w-11/12 mx-auto mt-10">

//         <h2 className="text-custom-blue font-semibold text-lg mb-4">
//           Total Ticket Raised
//         </h2>

//         <div className="border rounded bg-white overflow-x-auto">

//           <table className="w-full text-sm">

//             <thead className="bg-gray-100">
//               {table.getHeaderGroups().map((hg) => (
//                 <tr key={hg.id}>
//                   {hg.headers.map((header) => (
//                     <th key={header.id} className="px-4 py-2 border-b">
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>

//             <tbody>
//               {table.getRowModel().rows.map((row) => (
//                 <tr key={row.id} className="hover:bg-gray-50">
//                   {row.getVisibleCells().map((cell) => (
//                     <td
//                       key={cell.id}
//                       className="px-4 py-2 border-b text-center"
//                     >
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>

//           </table>

//           {/* Pagination */}

//           <div className="flex items-center justify-between p-4 border-t">

//             <div className="flex gap-2">
//               <button
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//                 className="px-3 py-1 bg-gray-200 rounded"
//               >
//                 Previous
//               </button>

//               <button
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//                 className="px-3 py-1 bg-gray-200 rounded"
//               >
//                 Next
//               </button>
//             </div>

//             <div className="flex gap-1">
//               {Array.from({ length: table.getPageCount() }).map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setPageIndex(i)}
//                   className={`px-3 py-1 rounded ${
//                     pageIndex === i
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>

//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value));
//                 setPageIndex(0);
//               }}
//               className="border px-2 py-1 rounded"
//             >
//               {[10, 20, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>

//           </div>
//         </div>
//       </section>

//       {/* MODAL */}

//       <TicketDetailsModal
//         open={!!selectedService}
//         service={selectedService}
//         userRole={userRole}
//         onClose={() => setSelectedService(null)}
//         onUpdate={({ id, payload }) => {

//           onUpdate({
//             id,
//             payload,
//             source: selectedService?.source
//           });

//           setSelectedService(null);
//         }}
//       />
//     </>
//   );
// }


"use client";

import { useMemo, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import TicketDetailsModal from "./TicketDetailsModal";

export default function TicketTable({
  services = [],
  loading,
  error,
  onUpdate,
  onSoftDelete,
  userRole,
}) {

  const [selectedService, setSelectedService] =
    useState(null);

  const [pageIndex, setPageIndex] =
    useState(0);

  const [pageSize, setPageSize] =
    useState(10);

  // =========================================
  // TABLE COLUMNS
  // =========================================

  const columns = useMemo(
    () => [
      {
        header: "No",
        id: "rowNo",
        accessorFn: (_r, i) =>
          i + 1 + pageIndex * pageSize,
      },

      {
        header: "Customer",
        accessorKey: "clientName",
      },

      {
        header: "Service ID",
        accessorFn: (row) => row.serviceNo || "-",
      },

      {
        header: "Service",
        accessorKey: "service",
      },

      {
        header: "Amount",
        accessorFn: (row) =>
          `₹${(
            row.totalPayment || 0
          ).toLocaleString()}`,
      },

      {
        header: "Payment Mode",
        accessorKey: "paymentMode",
      },

      {
        header: "Payment Status",

        cell: ({ row }) => {

          const status = row.original.paymentStatus;
          const normalized = String(status || "").toLowerCase();

          return (
            <span
              className={`
                px-3 py-1 rounded-full
                text-xs font-semibold
                ${
                  normalized === "paid"
                    ? "bg-green-100 text-green-700"
                    : normalized === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {status}
            </span>
          );
        },
      },

      {
        header: "Service Status",

        cell: ({ row }) => {

          const status =
            row.original.serviceStatus;

          return (
            <span
              className={`
                px-3 py-1 rounded-full
                text-xs font-semibold
                ${
                  status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {status}
            </span>
          );
        },
      },

      {
        header: "Date",

        accessorFn: (row) =>
          new Date(
            row.createdAt
          ).toLocaleDateString(),
      },

      {
        id: "view",

        header: "View",

        cell: (info) => (
          <button
            onClick={() =>
              setSelectedService(
                info.row.original
              )
            }
            className="
              w-9 h-9
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              flex items-center justify-center
              transition
            "
          >
            <Eye size={18} />
          </button>
        ),
      },
    ],

    [pageIndex, pageSize]
  );

  // =========================================
  // TABLE
  // =========================================

  const table = useReactTable({
    data: services,

    columns,

    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },

    onPaginationChange: (
      updater
    ) => {

      const next =
        typeof updater ===
        "function"
          ? updater({
              pageIndex,
              pageSize,
            })
          : updater;

      setPageIndex(
        next.pageIndex
      );

      setPageSize(
        next.pageSize
      );
    },

    getCoreRowModel:
      getCoreRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),
  });

  // =========================================
  // LOADING
  // =========================================

  if (loading)
    return (
      <div className="text-center py-16 text-gray-500 font-medium">
        Loading Tickets...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-16 text-red-500 font-medium">
        Failed to load tickets
      </div>
    );

  return (
    <>
      <section className="w-full lg:w-11/12 mx-auto mt-10 px-4 lg:px-0">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <div>
            <h2 className="text-custom-blue font-bold text-xl">
              Total Ticket Raised
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage and track all customer service requests.
            </p>
          </div>

          <div className="text-sm font-medium text-gray-500">
            Total Records:
            <span className="ml-2 text-custom-blue font-bold">
              {services.length}
            </span>
          </div>

        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(15,23,42,0.08)] overflow-hidden">

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px] text-sm">

              <thead className="bg-blue-50">

                {table
                  .getHeaderGroups()
                  .map((hg) => (
                    <tr key={hg.id}>

                      {hg.headers.map(
                        (header) => (
                          <th
                            key={header.id}
                            className="
                              px-5 py-4
                              text-left
                              font-bold
                              text-gray-700
                              whitespace-nowrap
                            "
                          >
                            {flexRender(
                              header.column
                                .columnDef
                                .header,

                              header.getContext()
                            )}
                          </th>
                        )
                      )}

                    </tr>
                  ))}

              </thead>

              <tbody>

                {table
                  .getRowModel()
                  .rows.map((row) => (

                    <tr
                      key={row.id}
                      className="
                        border-t border-gray-100
                        hover:bg-gray-50
                        transition
                      "
                    >

                      {row
                        .getVisibleCells()
                        .map((cell) => (

                          <td
                            key={cell.id}
                            className="
                              px-5 py-4
                              text-gray-600
                              whitespace-nowrap
                            "
                          >
                            {flexRender(
                              cell.column
                                .columnDef
                                .cell,

                              cell.getContext()
                            )}
                          </td>
                        ))}

                    </tr>
                  ))}

              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-5 border-t border-gray-100">

            {/* PREVIOUS / NEXT */}
            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  table.previousPage()
                }

                disabled={
                  !table.getCanPreviousPage()
                }

                className="
                  flex items-center gap-2
                  px-4 py-2
                  rounded-xl
                  bg-gray-100
                  hover:bg-gray-200
                  disabled:opacity-40
                  transition
                "
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <button
                onClick={() =>
                  table.nextPage()
                }

                disabled={
                  !table.getCanNextPage()
                }

                className="
                  flex items-center gap-2
                  px-4 py-2
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  disabled:opacity-40
                  transition
                "
              >
                Next
                <ChevronRight size={18} />
              </button>

            </div>

            {/* PAGE NUMBERS */}
            <div className="flex flex-wrap items-center gap-2">

              {Array.from({
                length:
                  table.getPageCount(),
              }).map((_, i) => (

                <button
                  key={i}

                  onClick={() =>
                    setPageIndex(i)
                  }

                  className={`
                    w-10 h-10
                    rounded-xl
                    font-semibold
                    transition
                    ${
                      pageIndex === i
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}

            </div>

            {/* PAGE SIZE */}
            <select
              value={pageSize}

              onChange={(e) => {

                setPageSize(
                  Number(
                    e.target.value
                  )
                );

                setPageIndex(0);
              }}

              className="
                border border-gray-200
                rounded-xl
                px-4 py-2
                text-sm
                outline-none
              "
            >
              {[10, 20, 50].map(
                (size) => (
                  <option
                    key={size}
                    value={size}
                  >
                    Show {size}
                  </option>
                )
              )}
            </select>

          </div>
        </div>
      </section>

      {/* MODAL */}

      <TicketDetailsModal
        open={!!selectedService}

        service={selectedService}

        userRole={userRole}

        onClose={() =>
          setSelectedService(null)
        }

        onUpdate={({
          id,
          payload,
        }) => {

          onUpdate({
            id,
            payload,
            source:
              selectedService?.source,
          });

          setSelectedService(null);
        }}

        onSoftDelete={(id) => {
          onSoftDelete?.({
            id,
            source: selectedService?.source,
          });

          setSelectedService(null);
        }}
      />
    </>
  );
}
