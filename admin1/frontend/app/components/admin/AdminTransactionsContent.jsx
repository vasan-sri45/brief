"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import TicketDetailsModal from "../ticket/TicketDetailsModal";

import {
  useGetPaymentServices,
  useGetPaidServices,
  useUpdatePaidService,
  useUpdatePaymentService,
  useSoftDeletePaidService,
  useSoftDeletePaymentService,
} from "../../hooks/useService";
import { useAuth } from "../../hooks/useAuth";

import { useGetEmployees } from "../../hooks/useEmployeeAuthMutations";

const idString = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }
  return String(value);
};

export default function AdminTransactionsContent() {
  const { month, date, search, status, assigned } = useSelector((s) => s.ui);
  const {user} = useAuth();

  const { data: onlineData, isLoading: onlineLoading } =
    useGetPaymentServices({ limit: 100 });

  const { data: officeData, isLoading: officeLoading } =
    useGetPaidServices({ limit: 100 });

    // console.log(onlineData)
    // console.log(officeData)

  const updatePaidMutation = useUpdatePaidService();
  const updatePaymentMutation = useUpdatePaymentService();
  const softDeletePaidMutation = useSoftDeletePaidService();
  const softDeletePaymentMutation = useSoftDeletePaymentService();

  const { data: empRes } = useGetEmployees();
  const employeeList = Array.isArray(empRes?.users)
    ? empRes.users
    : [];

  const [selectedTxn, setSelectedTxn] = useState(null);

  /* ================= NORMALIZE BOTH ================= */

  const combinedList = useMemo(() => {
    const online = Array.isArray(onlineData?.orders)
      ? onlineData.orders.map((item) => ({
          _id: item._id,
          serviceNo: item.serviceNo || item.razorpayOrderId || "-",
          razorpayPaymentId: item.razorpayPaymentId,
          customer: item.customer || {},

          clientName:
            item.customer?.name ||
            item.userId?.name ||
            "-",

          mobile: item.customer?.mobile || item.userId?.mobile,
          email:
            item.customer?.email ||
            item.userId?.email ||
            "-",
          
          serviceType: item.serviceSlug || "-",
          serviceTitle: item.serviceId?.title||
            "-",
          service:
            item.serviceId?.heading||
            "-",
          serviceId: item.serviceId?._id || item.serviceId || "",
          serviceName: item.serviceId?.heading || item.serviceId?.title || "-",

          totalPayment: item.amount || 0,
          baseAmount: item.baseAmount || item.amount || 0,
          gstRate: item.gstRate ?? 18,
          gstAmount: item.gstAmount || 0,
          paymentMode: item.paymentMode || "Online",
          paymentStatus: item.status || "-",
          serviceStatus: item.serviceStatus || "-",
          transactionStage: item.transactionStage || "",
          transactionStages: item.transactionStages || [],

          createdAt: item.createdAt,

          assignedTo:
            item.assignedTo && typeof item.assignedTo === "object"
              ? idString(item.assignedTo)
              : item.assignedTo || null,
          assignedToName:
            item.assignedTo && typeof item.assignedTo === "object"
              ? item.assignedTo.name
              : "",
          progressMessages: item.progressMessages || [],

          source: "online",
        }))
      : [];

    const office = Array.isArray(officeData?.data)
      ? officeData.data.map((item) => ({
          _id: item._id,
          serviceNo: item.serviceNo || "-",
          customer: item.customer || {},

          clientName: item.customer?.name || "-",
          mobile: item.customer?.mobile || "-",
          email: item.customer?.email || "-",

          serviceType: item.serviceType || "-",
          serviceTitle: item.serviceTitle || item.service?.title||
            "-",
          service: item.serviceName || item.service?.heading || "-",
          serviceId: item.service?._id || item.service || "",
          serviceName: item.serviceName || item.service?.heading || item.service?.title || "-",

          totalPayment: item.totalPayment || 0,
          paymentMode: item.paymentMode || "-",
          paymentStatus: item.paymentStatus || "-",
          serviceStatus: item.serviceStatus || "-",
          transactionStage: item.transactionStage || "",
          transactionStages: item.transactionStages || [],

          createdAt: item.createdAt,

          assignedTo:
            item.assignedTo && typeof item.assignedTo === "object"
              ? idString(item.assignedTo)
              : item.assignedTo || null,
          assignedToName:
            item.assignedTo && typeof item.assignedTo === "object"
              ? item.assignedTo.name
              : "",
          progressMessages: item.progressMessages || [],

          source: "office",
        }))
      : [];

    return [...online, ...office];
  }, [onlineData, officeData]);

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    let out = [...combinedList];

    if (status !== "All") {
      out = out.filter(
        (s) =>
          s.paymentStatus?.toLowerCase() === status.toLowerCase() ||
          s.serviceStatus?.toLowerCase() === status.toLowerCase()
      );
    }

    if (assigned === "Assigned") {
      out = out.filter((s) => !!s.assignedTo);
    } else if (assigned === "Unassigned") {
      out = out.filter((s) => !s.assignedTo);
    } else if (assigned !== "All") {
      out = out.filter((s) => idString(s.assignedTo) === String(assigned));
    }

    if (month) {
      out = out.filter(
        (s) =>
          new Date(s.createdAt).toLocaleString("en-US", {
            month: "long",
          }) === month
      );
    }

    if (date) {
      const target = new Date(date).toDateString();
      out = out.filter(
        (s) => new Date(s.createdAt).toDateString() === target
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (s) =>
          s.serviceNo?.toLowerCase().includes(q) ||
          s.service?.toLowerCase().includes(q) ||
          s.clientName?.toLowerCase().includes(q)
      );
    }

    return out;
  }, [combinedList, month, date, search, status, assigned]);

  if (onlineLoading || officeLoading)
    return <div className="py-8 text-center">Loading…</div>;

  return (
    <>
      <TransactionFilters />

      <div className="mt-5">
        <TransactionTable
          data={filtered}
          onView={(row) => setSelectedTxn(row)}
        />
      </div>

      <TicketDetailsModal
        open={!!selectedTxn}
        service={selectedTxn}
        employees={employeeList}
        userRole={user?.role}
        onClose={() => setSelectedTxn(null)}
        onUpdate={async ({ id, payload }) => {
          if (selectedTxn.source === "online") {
            await updatePaymentMutation.mutateAsync({
              id,
              payload,
            });
          } else {
            await updatePaidMutation.mutateAsync({
              id,
              payload,
            });
          }

          setSelectedTxn(null);
        }}
        onSoftDelete={async (id) => {
          if (selectedTxn.source === "online") {
            await softDeletePaymentMutation.mutateAsync(id);
          } else {
            await softDeletePaidMutation.mutateAsync(id);
          }
          setSelectedTxn(null);
        }}
      />
    </>
  );
}
