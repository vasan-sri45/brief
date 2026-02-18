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
    staleTime: 5 * 60 * 1000,
  });
