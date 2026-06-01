
"use client";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import TicketDetailsModal from "../ticket/TicketDetailsModal";
import { useGetPaidServices, useUpdatePaidService } from "../../hooks/useService";

export default function AdminEmployeesContent() {
  const { month, date, search, assigned, status } = useSelector((s) => s.ui);
  const { data, isLoading, isError, error, isFetching } = useGetPaidServices();
  const updatePaidService = useUpdatePaidService();
  const [selectedTxn, setSelectedTxn] = useState(null);

  const list = Array.isArray(data?.data) ? data.data : [];

  // only show assigned
  const base = useMemo(() => list.filter((s) => !!s.assignedTo), [list]);

  const filtered = useMemo(() => {
    let out = [...base];

    // assigned filter
    if (assigned === "Unassigned") out = []; // nothing in Employee tab
    else if (assigned !== "All" && assigned !== "Assigned")
      out = out.filter((s) => s.assignedTo?._id === assigned);

    // service status
    if (status !== "All") out = out.filter((s) => s.serviceStatus === status);

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

    // search
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
  }, [base, month, date, search, assigned, status]);

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
          trans="assigned"
          onView={(row) => setSelectedTxn(row)}
        />
      </div>

      <TicketDetailsModal
        open={!!selectedTxn}
        service={selectedTxn}
        editable={true}
        onClose={() => setSelectedTxn(null)}
        onUpdate={async ({ id, payload }) => {
          await updatePaidService.mutateAsync({ id, payload });
          setSelectedTxn(null);
        }}
      />
    </>
  );
}

