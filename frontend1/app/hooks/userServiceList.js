// // src/hooks/useServiceList.js
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { SERVICES } from "../config/services";

const fetchServiceList = async () => {
  try {
    const res = await api.get("/services");   // backend already sees auth via cookie/header
    return res.data;                          // { items, page, ... }
  } catch {
    return { items: SERVICES };
  }
};

export const useAllServices = (options = {}) =>
  useQuery({
    queryKey: ["service-list"],
    queryFn: fetchServiceList,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
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
