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
} from "../../hooks/useService";

import { useGetEmployees } from "../../hooks/useEmployeeAuthMutations";

export default function AdminTransactionsContent() {
  const { month, date, search, status } = useSelector((s) => s.ui);

  const { data: onlineData, isLoading: onlineLoading } =
    useGetPaymentServices();

  const { data: officeData, isLoading: officeLoading } =
    useGetPaidServices();

    // console.log(onlineData)
    // console.log(officeData)

  const updatePaidMutation = useUpdatePaidService();
  const updatePaymentMutation = useUpdatePaymentService();

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
          serviceNo: item.razorpayOrderId || "-",

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

          serviceType: item.serviceType || "-",
          serviceTitle: item.service?.title||
            "-",
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
  }, [combinedList, month, date, search, status]);

  console.log(combinedList)

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
      />
    </>
  );
}
