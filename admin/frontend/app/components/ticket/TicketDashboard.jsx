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
  useUpdatePaymentService,
  useSoftDeletePaidService,
  useSoftDeletePaymentService
} from "../../hooks/useService";

import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {

  const { data: onlineData, isLoading: onlineLoading } =
    useGetPaymentServices({ limit: 100 });

  const { data: officeData, isLoading: officeLoading, isError } =
    useGetPaidServices({ limit: 100 });

  const updatePaidMutation = useUpdatePaidService();
  const updatePaymentMutation = useUpdatePaymentService();
  const softDeletePaidMutation = useSoftDeletePaidService();
  const softDeletePaymentMutation = useSoftDeletePaymentService();

  const { user } = useAuth();

  const [filter, setFilter] = useState("ALL");

  /* ================= COMBINE ONLINE + OFFICE ================= */

  const services = useMemo(() => {

    const online = Array.isArray(onlineData?.orders)
      ? onlineData.orders.map((item) => ({
          _id: item._id,
          serviceNo: item.serviceNo || item.razorpayOrderId || "-",
          razorpayPaymentId: item.razorpayPaymentId,

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
          serviceId: item.serviceId?._id || item.serviceId || "",
          serviceName: item.serviceId?.heading || item.serviceId?.title || "-",

          totalPayment: item.amount || 0,
          paymentMode: item.paymentMode || "Online",
          paymentStatus: item.status || "-",
          serviceStatus: item.serviceStatus || "-",

          createdAt: item.createdAt,

          assignedTo:
            item.assignedTo && typeof item.assignedTo === "object"
              ? item.assignedTo._id
              : item.assignedTo || null,
          assignedToName:
            item.assignedTo && typeof item.assignedTo === "object"
              ? item.assignedTo.name
              : "",
          createdBy:
            item.createdBy && typeof item.createdBy === "object"
              ? item.createdBy._id
              : item.createdBy || null,
          progressMessages: item.progressMessages || [],

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

          serviceTitle: item.serviceTitle || item.service?.title || "-",
          service: item.serviceName || item.service?.heading || "-",
          serviceId: item.service?._id || item.service || "",
          serviceName: item.serviceName || item.service?.heading || item.service?.title || "-",

          totalPayment: item.totalPayment || 0,
          paymentMode: item.paymentMode || "-",
          paymentStatus: item.paymentStatus || "-",
          serviceStatus: item.serviceStatus || "-",

          createdAt: item.createdAt,

          assignedTo:
            item.assignedTo && typeof item.assignedTo === "object"
              ? item.assignedTo._id
              : item.assignedTo || null,
          assignedToName:
            item.assignedTo && typeof item.assignedTo === "object"
              ? item.assignedTo.name
              : "",
          createdBy:
            item.createdBy && typeof item.createdBy === "object"
              ? item.createdBy._id
              : item.createdBy || null,
          progressMessages: item.progressMessages || [],

          source: "office",
        }))
      : [];

    return [...online, ...office];

  }, [onlineData, officeData]);

  /* ================= EMPLOYEE SERVICES ================= */

  const employeeServices = useMemo(() => {
    const currentUserId = user?.id || user?._id;
    return services.filter(
      (s) => s.assignedTo === currentUserId || s.createdBy === currentUserId
    );
  }, [services, user]);

  /* ================= STATS ================= */

  const stats = useMemo(() => {

    const total = employeeServices.length;

    const availed = employeeServices.filter(
      (s) => String(s.paymentStatus || "").toLowerCase() === "paid"
    ).length;

    const notAvailed = employeeServices.filter(
      (s) => String(s.paymentStatus || "").toLowerCase() !== "paid"
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
        (s) => String(s.paymentStatus || "").toLowerCase() === "paid"
      );
    }

    if (filter === "NOT_AVAILED") {
      return employeeServices.filter(
        (s) => String(s.paymentStatus || "").toLowerCase() !== "paid"
      );
    }

    if (filter === "CHECKLIST") {
      return employeeServices;
    }

    return employeeServices;

  }, [filter, employeeServices]);

  if (onlineLoading || officeLoading)
    return <div className="text-center py-10">Loading...</div>;

  console.log(user)

  return (
    <section className="mt-2 mb-6">

      {/* <TicketHeader /> */}

      <WelcomeCard
        name={user?.name || "Employee"}
        code={user?.employee_id || ""}
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
        onSoftDelete={async ({ id, source }) => {
          if (source === "online") {
            await softDeletePaymentMutation.mutateAsync(id);
          } else {
            await softDeletePaidMutation.mutateAsync(id);
          }
        }}
      />

    </section>
  );
}


