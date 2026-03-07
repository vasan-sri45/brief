"use client";
import { useState, useMemo } from "react";
import TicketsStatus from "./TicketStatus";
import WelcomeCard from "./WelcomeCard";
import TicketHeader from "./TicketHeader";
import TicketTable from "./TicketTable";
import { useGetPaidServices } from "../../hooks/useService";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { data, isLoading, isError } = useGetPaidServices();
  console.log(data);

  const { user } = useAuth();

  const services = data?.data || [];

  const [filter, setFilter] = useState("ALL");

  console.log(services)

  /* =========================
     STATS (SOURCE OF TRUTH)
  ========================== */
  const stats = useMemo(() => {
    const total = services.length;

    const availed = services.filter(
      (s) => s.paymentStatus === "Paid"
    ).length;

    const notAvailed = services.filter(
      (s) => s.paymentStatus !== "Paid"
    ).length;

    const checklist = services.filter(
      (s) =>
        s.assignedTo?._id == user?.id
    ).length;

    return [
      {
        key: "ALL",
        title: "Total Ticket Raised",
        value: total,
        bg: "bg-[#B7CDB3]",
      },
      {
        key: "AVAILED",
        title: "Availed",
        value: availed,
        bg: "bg-[#FFE8CC]",
      },
      {
        key: "NOT_AVAILED",
        title: "Not Availed",
        value: notAvailed,
        bg: "bg-[#FFDCD8]",
      },
      {
        key: "CHECKLIST",
        title: "Checklist",
        value: checklist,
        bg: "bg-[#C7D0F0]",
      },
    ];
  }, [services]);

  /* =========================
     FILTER TABLE DATA
  ========================== */
  const filteredServices = useMemo(() => {
    if (filter === "ALL") return services;

    if (filter === "AVAILED") {
      return services.filter(
        (s) => s.paymentStatus === "Paid"
      );
    }

    if (filter === "NOT_AVAILED") {
      return services.filter(
        (s) => s.paymentStatus !== "Paid"
      );
    }

    if (filter === "CHECKLIST") {
      return services.filter(
        (s) =>
          s.assignedTo?._id == user?.id
      );
    }

    return services;
  }, [filter, services]);

  return (
    <section className="mt-2 mb-6">
      <TicketHeader />

      <WelcomeCard name="John Doe" code="EMP-1023"/>

      <TicketsStatus
        stats={stats}
        activeKey={filter}
        onSelect={setFilter}
      />

      <TicketTable
        services={filteredServices}
        loading={isLoading}
        error={isError}
      />
    </section>
  );
}



