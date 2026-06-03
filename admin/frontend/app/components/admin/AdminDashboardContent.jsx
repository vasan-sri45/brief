"use client";

import { useMemo, useState } from "react";
import { useAllServices } from "../../hooks/userServiceList";
import { useGetPaymentServices, useGetPaidServices } from "../../hooks/useService";
import SalesByCategories from "./SalesByCategories";
import LineChart from "./LineChart";

const CATEGORY_LABELS = [
  "Startup",
  "Intellectual Property",
  "Tax Filing",
  "MCA Compliance",
  "Registration",
  "Legal Advisory & Agreement",
  "Other Services",
];

const getCategory = (service = {}) =>
  service.category || service.serviceCategory || service.title || "Other Services";

const getPaymentCategory = (item = {}) =>
  item.service?.title || item.serviceId?.title || item.serviceTitle || "Other Services";

const getPaymentServiceName = (item = {}) =>
  item.service?.heading ||
  item.service?.title ||
  item.serviceId?.heading ||
  item.serviceId?.title ||
  item.serviceSlug ||
  "Service";

export default function AdminDashboardContent() {
  const { data, isLoading } = useAllServices();
  const { data: onlineData } = useGetPaymentServices({ limit: 100 });
  const { data: officeData } = useGetPaidServices({ limit: 100 });
  const [selectedCategory, setSelectedCategory] = useState("Startup");
  const [selectedRevenueCategory, setSelectedRevenueCategory] = useState("Startup");

  const services = Array.isArray(data?.items) ? data.items : [];
  const onlineServices = onlineData?.orders || onlineData?.data || [];
  const officeServices = officeData?.orders || officeData?.data || [];
  const allPayments = [...onlineServices, ...officeServices];

  const filteredServices = useMemo(
    () => services.filter((service) => getCategory(service) === selectedCategory),
    [services, selectedCategory]
  );

  const monthlyPayments = useMemo(() => {
    const now = new Date();
    return allPayments.filter((item) => {
      const date = new Date(item.paymentDate || item.createdAt);
      const status = (item.paymentStatus || item.status || "").toLowerCase();
      return (
        status === "paid" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
  }, [allPayments]);

  const categoryRevenue = useMemo(() => {
    const revenue = CATEGORY_LABELS.reduce((acc, label) => {
      acc[label] = 0;
      return acc;
    }, {});

    monthlyPayments.forEach((item) => {
      const category = getPaymentCategory(item);
      const amount = Number(item.amount) || Number(item.totalPayment) || 0;
      revenue[category] = (revenue[category] || 0) + amount;
    });

    return revenue;
  }, [monthlyPayments]);

  const serviceRevenueDetails = useMemo(() => {
    return monthlyPayments
      .filter((item) => getPaymentCategory(item) === selectedRevenueCategory)
      .map((item) => ({
        id: item._id,
        serviceNo: item.serviceNo || item.razorpayOrderId || "-",
        serviceName: getPaymentServiceName(item),
        customer:
          item.customer?.name ||
          item.userId?.name ||
          item.clientName ||
          "-",
        amount: Number(item.amount) || Number(item.totalPayment) || 0,
        status: item.serviceStatus || "Pending",
        date: item.paymentDate || item.createdAt,
      }));
  }, [monthlyPayments, selectedRevenueCategory]);

  if (isLoading) {
    return <p className="mt-10 text-center font-semibold">Loading dashboard...</p>;
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <LineChart
          revenueData={categoryRevenue}
          selectedCategory={selectedRevenueCategory}
          onSelect={setSelectedRevenueCategory}
        />
        <SalesByCategories
          revenueData={categoryRevenue}
          selectedCategory={selectedRevenueCategory}
          onSelect={setSelectedRevenueCategory}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedCategory} Services
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Showing services only for the selected category.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="min-w-[240px] rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                {CATEGORY_LABELS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                {filteredServices.length}
              </span>
            </div>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
            {filteredServices.map((service) => (
              <article
                key={service._id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <h3 className="font-bold text-slate-900">
                  {service.heading || service.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {service.description || service.subTitle || "No description added."}
                </p>
              </article>
            ))}
            {!filteredServices.length && (
              <p className="rounded-2xl bg-slate-50 p-6 text-center font-semibold text-slate-500">
                No services found for this category.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedRevenueCategory} Revenue Details
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Paid services in the current month for this category.
            </p>
          </div>

          <div className="max-h-[420px] overflow-auto rounded-2xl border border-slate-100">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="sticky top-0 bg-slate-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Service No</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {serviceRevenueDetails.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-bold text-blue-700">{item.serviceNo}</td>
                    <td className="px-4 py-3 font-semibold">{item.serviceName}</td>
                    <td className="px-4 py-3">{item.customer}</td>
                    <td className="px-4 py-3 font-bold">Rs. {item.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
                {!serviceRevenueDetails.length && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center font-semibold text-slate-500">
                      No paid revenue found for this service category this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
