// "use client";
// import { useState } from "react";
// import TicketRow from "./TicketRow";
// import TicketDetailsModal from "./TicketDetailsModal";
// import { ChevronDown } from "lucide-react";
// import { useUpdatePaidService } from "../../hooks/useService";

// const TicketTable = ({ services = [], loading, error }) => {
//   const [selectedService, setSelectedService] = useState(null);
//   const updateMutation = useUpdatePaidService();

//   const handleUpdate = ({ id, payload }) => {
//     updateMutation.mutate({ id, payload });
//     setSelectedService(null);
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-10 text-custom-blue font-poppins">
//         Loading services...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10 text-red-500 font-poppins">
//         Failed to load services
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* SECTION */}
//       <section className="w-full lg:w-10/12 mx-auto mt-8 md:mt-12 px-4 lg:px-0">
//         <h2 className="text-custom-blue font-poppins font-semibold text-base md:text-lg">
//           Total Ticket Raised
//         </h2>

//         <div className="h-[2.5px] bg-custom-blue mt-2 mb-4 md:mb-6" />

//         {/* TABLE CONTAINER */}
//         <div
//           className="
//             relative bg-white rounded-2xl
//             shadow-[0_10px_25px_rgba(0,0,0,0.2)]
//             max-h-[420px] md:max-h-[520px]
//             overflow-y-auto pb-16
//           "
//         >
//           {/* EMPTY STATE */}
//           {services.length === 0 && (
//             <p className="text-center py-10 text-gray-500 font-poppins">
//               No tickets found
//             </p>
//           )}

//           {/* ROWS */}
//           <div className="flex flex-col divide-y">
//             {services.map((service) => (
//               <TicketRow
//                 key={service._id}
//                 client={service.customer?.name}
//                 date={new Date(service.createdAt).toLocaleDateString()}
//                 ticketNo={service.serviceNo}
//                 status={
//                   service.serviceStatus === "Completed"
//                     ? "Availed"
//                     : "Not Availed"
//                 }
//                 onView={() => setSelectedService(service)}
//               />
//             ))}
//           </div>

//           {/* BOTTOM SCROLL INDICATOR */}
//           <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 pointer-events-none">
//             <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow
//                             flex items-center justify-center">
//               <ChevronDown className="text-custom-blue w-6 h-6 md:w-7 md:h-7" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* MODAL */}
//       <TicketDetailsModal
//         open={!!selectedService}
//         service={selectedService}
//         onClose={() => setSelectedService(null)}
//         onUpdate={handleUpdate}
//       />
//     </>
//   );
// };

// export default TicketTable;


"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import TicketDetailsModal from "./TicketDetailsModal";

export default function TicketTable({
  services = [],
  loading,
  error,
  onUpdate,
  userRole
}) {

  const [selectedService, setSelectedService] = useState(null);

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
          `₹${(row.totalPayment || 0).toLocaleString()}`,
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
            onClick={() => setSelectedService(info.row.original)}
            className="bg-blue-600 text-white w-7 h-7 rounded hover:bg-blue-700"
          >
            ▶
          </button>
        ),
      },
    ],
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: services,
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

  if (loading)
    return <div className="text-center py-10">Loading...</div>;

  if (error)
    return <div className="text-center py-10 text-red-500">Failed to load</div>;

  return (
    <>
      <section className="w-full lg:w-11/12 mx-auto mt-10">

        <h2 className="text-custom-blue font-semibold text-lg mb-4">
          Total Ticket Raised
        </h2>

        <div className="border rounded bg-white overflow-x-auto">

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

          {/* Pagination */}

          <div className="flex items-center justify-between p-4 border-t">

            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Previous
              </button>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Next
              </button>
            </div>

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
      </section>

      {/* MODAL */}

      <TicketDetailsModal
        open={!!selectedService}
        service={selectedService}
        userRole={userRole}
        onClose={() => setSelectedService(null)}
        onUpdate={({ id, payload }) => {

          onUpdate({
            id,
            payload,
            source: selectedService?.source
          });

          setSelectedService(null);
        }}
      />
    </>
  );
}