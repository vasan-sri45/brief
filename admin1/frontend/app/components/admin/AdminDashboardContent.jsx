"use client";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import DashboardCard from "./DashboardCard";
import { useAllServices } from "../../hooks/userServiceList";
import {
  useGetPaymentServices,
  useGetPaidServices,
} from "../../hooks/useService";
import SalesByCategories from "./SalesByCategories";
import LineChart from "./LineChart";

const CATEGORY_LABELS = [
  "Startup",
  "Intellectual Property",
  "Tax Filling",
  "MCA Compliance",
  "Registration",
  "Legal Advisory & Agreement",
  "Other Services",
];

export default function AdminDashboardContent() {
  const { data, isLoading } = useAllServices();
  const { data: onlineData } = useGetPaymentServices();
  const { data: officeData } = useGetPaidServices();

  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  const services = Array.isArray(data?.items) ? data.items : [];

  /* ---------------- DASHBOARD CARDS ---------------- */
  const cards = useMemo(() => {
    const counts = {};

    services.forEach((service) => {
      const category =
        service.category ||
        service.serviceCategory ||
        service.title;

      if (!category) return;

      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts).map(([title, count]) => ({
      title,
      value: count,
      services: "Services",
    }));
  }, [services]);

  /* ---------------- MONTHLY REVENUE ---------------- */
  const categoryRevenue = useMemo(() => {
    const onlineServices = onlineData?.orders || onlineData?.data || [];
    const officeServices = officeData?.orders || officeData?.data || [];

    const allServices = [...onlineServices, ...officeServices];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const revenue = CATEGORY_LABELS.reduce((acc, label) => {
      acc[label] = 0;
      return acc;
    }, {});

    allServices.forEach((item) => {
      const date = new Date(item.createdAt);

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        const paymentStatus =
          (item.paymentStatus || item.status || "").toLowerCase();

        if (paymentStatus !== "paid") return;

        const title =
          item.service?.title ||
          item.serviceId?.title;

        const amount =
          Number(item.amount) ||
          Number(item.totalPayment) ||
          0;

        if (CATEGORY_LABELS.includes(title)) {
          revenue[title] += amount;
        }
      }
    });

    return revenue;
  }, [onlineData, officeData]);

  /* ---------------- GSAP AUTO SCROLL ---------------- */
  useEffect(() => {
    if (!trackRef.current || cards.length === 0) return;

    tweenRef.current?.kill();

    const totalWidth = trackRef.current.scrollWidth / 2;

    tweenRef.current = gsap.to(trackRef.current, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    return () => tweenRef.current?.kill();
  }, [cards]);

  if (isLoading) {
    return (
      <p className="text-center mt-10 font-semibold">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-hidden w-full lg:w-10/12 px-6 lg:px-0 mx-auto">
      <div ref={trackRef} className="flex gap-6 w-max">
        {[...cards, ...cards].map((card, i) => (
          <DashboardCard key={`${card.title}-${i}`} {...card} />
        ))}
      </div>

      <div className="flex gap-5 mt-5 pb-5">
        <LineChart revenueData={categoryRevenue} />
        <SalesByCategories revenueData={categoryRevenue} />
      </div>
    </div>
  );
}