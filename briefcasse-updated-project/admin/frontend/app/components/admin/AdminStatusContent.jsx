// "use client";

// import { useMemo, useState } from "react";
// import TransactionFilters from "./TransactionFilters";
// import TransactionTable from "./TransactionTable";
// import { useGetPaidServices } from "../../hooks/useService";

// export default function AdminStatusContent() {
//   const [search, setSearch] = useState("");

//   // Fetch all paid services
//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     isFetching,
//   } = useGetPaidServices();

//   /** Normalize list */
//   const list = useMemo(() => {
//     if (Array.isArray(data?.data)) return data.data;
//     return [];
//   }, [data]);

//   /** Filter: show ONLY completed services */
//   const completedList = useMemo(
//     () => list.filter((s) => s.serviceStatus === "Completed"),
//     [list]
//   );

//   /** Apply search */
//   const filteredData = useMemo(() => {
//     const q = (search || "").toLowerCase();
//     if (!q) return completedList;

//     return completedList.filter((txn) =>
//       Object.values(txn).some(
//         (val) =>
//           (typeof val === "string" || typeof val === "number") &&
//           String(val).toLowerCase().includes(q)
//       )
//     );
//   }, [completedList, search]);

//   /** UI states */
//   if (isLoading) return <div className="py-8 text-center">Loading...</div>;
//   if (isError)
//     return (
//       <div className="py-8 text-center text-red-600">
//         {String(error?.message || "Error fetching data.")}
//       </div>
//     );

//   return (
//     <>
//       <TransactionFilters
//         search={search}
//         setSearch={setSearch}
//         fetching={isFetching}
//       />

//       <div className="mt-5">
//         <TransactionTable
//           data={filteredData}
//           trans="status"
//         />
//       </div>
//     </>
//   );
// }


// "use client";
// import { useMemo, useState } from "react";
// import TransactionFilters from "./TransactionFilters";
// import TransactionTable from "./TransactionTable";
// import TicketDetailsModal from "../ticket/TicketDetailsModal";
// import { useGetPaidServices } from "../../hooks/useService";

// export default function AdminStatusContent() {
//   const [search, setSearch] = useState("");
//   const [selectedTxn, setSelectedTxn] = useState(null);

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     isFetching,
//   } = useGetPaidServices();

//   const list = useMemo(() => {
//     if (Array.isArray(data?.data)) return data.data;
//     return [];
//   }, [data]);

//   const completedList = useMemo(
//     () => list.filter((s) => s.serviceStatus === "Completed"),
//     [list]
//   );

//   const filteredData = useMemo(() => {
//     const q = (search || "").toLowerCase();
//     if (!q) return completedList;

//     return completedList.filter((s) =>
//       Object.values(s).some(
//         (v) =>
//           (typeof v === "string" || typeof v === "number") &&
//           String(v).toLowerCase().includes(q)
//       )
//     );
//   }, [completedList, search]);

//   if (isLoading) return <div className="py-8 text-center">Loading...</div>;
//   if (isError) return <div className="py-8 text-center text-red-600">{String(error?.message || "Error fetching data.")}</div>;

//   return (
//     <>
//       {/* <TransactionFilters search={search} setSearch={setSearch} fetching={isFetching} /> */}

//       <div className="mt-5">
//         <TransactionTable
//           data={filteredData}
//           trans="status"
//           onView={(row) => setSelectedTxn(row)}
//         />
//       </div>

//       <TicketDetailsModal
//         open={!!selectedTxn}
//         service={selectedTxn}
//         editable={false}   // ❌ DISABLE EDIT HERE
//         onClose={() => setSelectedTxn(null)}
//       />
//     </>
//   );
// }



"use client";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import TicketDetailsModal from "../ticket/TicketDetailsModal";
import { useGetPaidServices } from "../../hooks/useService";

export default function AdminStatusContent() {
  const { month, date, search, assigned, status } = useSelector((s) => s.ui);
  const { data, isLoading, isError, error, isFetching } = useGetPaidServices();
  const [selectedTxn, setSelectedTxn] = useState(null);

  const list = Array.isArray(data?.data) ? data.data : [];

  // base = completed only
  const base = useMemo(
    () => list.filter((s) => s.serviceStatus === "Completed"),
    [list]
  );

  const filtered = useMemo(() => {
    let out = [...base];

    // assigned filter
    if (assigned === "Assigned") out = out.filter((s) => !!s.assignedTo);
    else if (assigned === "Unassigned") out = out.filter((s) => !s.assignedTo);
    else if (assigned !== "All") out = out.filter((s) => s.assignedTo?._id === assigned);

    // (status always completed – ignore dropdown)

    // month
    if (month) {
      out = out.filter(
        (s) =>
          new Date(s.createdAt).toLocaleString("en-US", { month: "long" }) === month
      );
    }

    // date
    if (date) {
      const d = new Date(date).toDateString();
      out = out.filter((s) => new Date(s.createdAt).toDateString() === d);
    }

    // global search
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((s) =>
        Object.values(s).some(
          (v) =>
            (typeof v === "string" || typeof v === "number") &&
            String(v).toLowerCase().includes(q)
        )
      );
    }

    return out;
  }, [base, month, date, search, assigned]);

  if (isLoading) return <div className="py-8 text-center">Loading…</div>;
  if (isError)
    return (
      <div className="py-8 text-center text-red-600">
        {String(error?.message || "Error fetching data")}
      </div>
    );

  return (
    <>
      <TransactionFilters fetching={isFetching} />

      <div className="mt-5">
        <TransactionTable
          data={filtered}
          trans="status"
          onView={(row) => setSelectedTxn(row)}
        />
      </div>

      <TicketDetailsModal
        open={!!selectedTxn}
        service={selectedTxn}
        editable={false}
        onClose={() => setSelectedTxn(null)}
      />
    </>
  );
}
