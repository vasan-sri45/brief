// // src/hooks/useServiceList.js
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

const fetchServiceList = async () => {
  const res = await api.get("/services");   // backend already sees auth via cookie/header
  return res.data;                          // { items, page, ... }
};

export const useAllServices = () =>
  useQuery({
    queryKey: ["service-list"],
    queryFn: fetchServiceList,
    staleTime: 30 * 1000,
    refetchOnMount: "always",
  });

export const useMyPurchasedServices = (enabled = true) =>
  useQuery({
    queryKey: ["my-purchased-services"],
    queryFn: async () => {
      const res = await api.get("/payment/my-orders");
      return res.data;
    },
    enabled,
    retry: false,
    staleTime: 60_000,
  });
