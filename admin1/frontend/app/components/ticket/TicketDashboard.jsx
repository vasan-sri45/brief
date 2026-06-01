// "use client";
// import { useState, useMemo } from "react";
// import TicketsStatus from "./TicketStatus";
// import WelcomeCard from "./WelcomeCard";
// import TicketHeader from "./TicketHeader";
// import TicketTable from "./TicketTable";
// import { useGetPaidServices } from "../../hooks/useService";
// import { useAuth } from "../../hooks/useAuth";

// export default function Dashboard() {
//   const { data, isLoading, isError } = useGetPaidServices();
//   console.log(data);

//   const { user } = useAuth();

//   const services = data?.data || [];

//   const [filter, setFilter] = useState("ALL");

//   console.log(services)

//   /* =========================
//      STATS (SOURCE OF TRUTH)
//   ========================== */
//   const stats = useMemo(() => {
//     const total = services.length;

//     const availed = services.filter(
//       (s) => s.paymentStatus === "Paid"
//     ).length;

//     const notAvailed = services.filter(
//       (s) => s.paymentStatus !== "Paid"
//     ).length;

//     const checklist = services.filter(
//       (s) =>
//         s.assignedTo?._id == user?.id
//     ).length;

//     return [
//       {
//         key: "ALL",
//         title: "Total Ticket Raised",
//         value: total,
//         bg: "bg-[#B7CDB3]",
//       },
//       {
//         key: "AVAILED",
//         title: "Availed",
//         value: availed,
//         bg: "bg-[#FFE8CC]",
//       },
//       {
//         key: "NOT_AVAILED",
//         title: "Not Availed",
//         value: notAvailed,
//         bg: "bg-[#FFDCD8]",
//       },
//       {
//         key: "CHECKLIST",
//         title: "Checklist",
//         value: checklist,
//         bg: "bg-[#C7D0F0]",
//       },
//     ];
//   }, [services]);

//   /* =========================
//      FILTER TABLE DATA
//   ========================== */
//   const filteredServices = useMemo(() => {
//     if (filter === "ALL") return services;

//     if (filter === "AVAILED") {
//       return services.filter(
//         (s) => s.paymentStatus === "Paid"
//       );
//     }

//     if (filter === "NOT_AVAILED") {
//       return services.filter(
//         (s) => s.paymentStatus !== "Paid"
//       );
//     }

//     if (filter === "CHECKLIST") {
//       return services.filter(
//         (s) =>
//           s.assignedTo?._id == user?.id
//       );
//     }

//     return services;
//   }, [filter, services]);

//   return (
//     <section className="mt-2 mb-6">
//       <TicketHeader />

//       <WelcomeCard name="John Doe" code="EMP-1023"/>

//       <TicketsStatus
//         stats={stats}
//         activeKey={filter}
//         onSelect={setFilter}
//       />

//       <TicketTable
//         services={filteredServices}
//         loading={isLoading}
//         error={isError}
//       />
//     </section>
//   );
// }



"use client";

import { useMemo, useState } from "react";
import TicketsStatus from "./TicketStatus";
import WelcomeCard from "./WelcomeCard";
import TicketHeader from "./TicketHeader";
import TicketTable from "./TicketTable";

import {
  useGetPaidServices,
  useGetPaymentServices,
  useUpdatePaidService,
  useUpdatePaymentService
} from "../../hooks/useService";

import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {

  const { data: onlineData, isLoading: onlineLoading } =
    useGetPaymentServices();

  const { data: officeData, isLoading: officeLoading, isError } =
    useGetPaidServices();

  const updatePaidMutation = useUpdatePaidService();
  const updatePaymentMutation = useUpdatePaymentService();

  const { user } = useAuth();

  const [filter, setFilter] = useState("ALL");

  /* ================= COMBINE ONLINE + OFFICE ================= */

  const services = useMemo(() => {

    const online = Array.isArray(onlineData?.orders)
      ? onlineData.orders.map((item) => ({
          _id: item._id,
          serviceNo: item.razorpayOrderId || "-",

          clientName:
            item.customer?.name ||
            item.userId?.name ||
            "-",

          mobile:
            item.customer?.mobile ||
            item.userId?.mobile ||
            "-",

          email:
            item.customer?.email ||
            item.userId?.email ||
            "-",

          serviceTitle: item.serviceId?.title || "-",
          service: item.serviceId?.heading || "-",

          totalPayment: item.amount || 0,
          paymentMode: item.paymentMode || "Online",
          paymentStatus: item.status || "-",
          serviceStatus: item.serviceStatus || "-",

          createdAt: item.createdAt,

          assignedTo:
            item.assignedTo && typeof item.assignedTo === "object"
              ? item.assignedTo._id
              : item.assignedTo || null,

          source: "online",
        }))
      : [];

    const office = Array.isArray(officeData?.data)
      ? officeData.data.map((item) => ({
          _id: item._id,
          serviceNo: item.serviceNo || "-",

          clientName: item.customer?.name || "-",
          mobile: item.customer?.mobile || "-",
          email: item.customer?.email || "-",

          serviceTitle: item.service?.title || "-",
          service: item.service?.heading || "-",

          totalPayment: item.totalPayment || 0,
          paymentMode: item.paymentMode || "-",
          paymentStatus: item.paymentStatus || "-",
          serviceStatus: item.serviceStatus || "-",

          createdAt: item.createdAt,

          assignedTo:
            item.assignedTo && typeof item.assignedTo === "object"
              ? item.assignedTo._id
              : item.assignedTo || null,

          source: "office",
        }))
      : [];

    return [...online, ...office];

  }, [onlineData, officeData]);

  /* ================= EMPLOYEE SERVICES ================= */

  const employeeServices = useMemo(() => {
    return services.filter(
      (s) => s.assignedTo === user?.id
    );
  }, [services, user]);

  /* ================= STATS ================= */

  const stats = useMemo(() => {

    const total = employeeServices.length;

    const availed = employeeServices.filter(
      (s) => s.paymentStatus === "paid"
    ).length;

    const notAvailed = employeeServices.filter(
      (s) => s.paymentStatus !== "paid"
    ).length;

    const checklist = employeeServices.length;

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

  }, [employeeServices]);

  /* ================= FILTER ================= */

  const filteredServices = useMemo(() => {

    if (filter === "ALL") return employeeServices;

    if (filter === "AVAILED") {
      return employeeServices.filter(
        (s) => s.paymentStatus === "paid"
      );
    }

    if (filter === "NOT_AVAILED") {
      return employeeServices.filter(
        (s) => s.paymentStatus !== "paid"
      );
    }

    if (filter === "CHECKLIST") {
      return employeeServices;
    }

    return employeeServices;

  }, [filter, employeeServices]);

  if (onlineLoading || officeLoading)
    return <div className="text-center py-10">Loading...</div>;

  return (
    <section className="mt-2 mb-6">

      <TicketHeader />

      <WelcomeCard
        name={user?.name || "Employee"}
        code={user?.employeeCode || ""}
      />

      <TicketsStatus
        stats={stats}
        activeKey={filter}
        onSelect={setFilter}
      />

      <TicketTable
        services={filteredServices}
        loading={false}
        error={isError}
        userRole={user?.role}
        onUpdate={async ({ id, payload, source }) => {

          if (source === "online") {
            await updatePaymentMutation.mutateAsync({
              id,
              payload
            });
          } else {
            await updatePaidMutation.mutateAsync({
              id,
              payload
            });
          }

        }}
      />

    </section>
  );
}


