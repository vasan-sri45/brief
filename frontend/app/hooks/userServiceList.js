"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { SERVICES } from "../config/services";
import {
  setPurchasedServicesCache,
  setServicesCache,
} from "../store/features/cache.slice";

const serviceFallback = { items: SERVICES };
const STALE_TIME = 10 * 60 * 1000;
const GC_TIME = 60 * 60 * 1000;

const normalizeService = (service) => ({
  ...service,
  _id: service._id || service.id || service.slug,
  heading: service.heading || service.title,
  subTitle: service.subTitle || service.category,
  shortDescription:
    service.shortDescription || service.summary || service.description || "",
  description: service.description || service.summary || "",
});

const normalizeServiceList = (data) => ({
  ...data,
  items: Array.isArray(data?.items)
    ? data.items.map(normalizeService)
    : SERVICES.map(normalizeService),
});

const fetchServiceList = async () => {
  const res = await api.get("/services");
  return normalizeServiceList(res.data);
};

export const useAllServices = (options = {}) => {
  const dispatch = useDispatch();
  const cachedServices = useSelector((state) => state.cache.services);
  const initialData = cachedServices || normalizeServiceList(serviceFallback);

  const query = useQuery({
    queryKey: ["service-list"],
    queryFn: fetchServiceList,
    initialData,
    placeholderData: initialData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    ...options,
  });

  useEffect(() => {
    if (query.data && query.data !== cachedServices) {
      dispatch(setServicesCache(query.data));
    }
  }, [cachedServices, dispatch, query.data]);

  return {
    ...query,
    data: query.data || cachedServices || serviceFallback,
    isError: false,
  };
};

export const useMyPurchasedServices = (enabled = true) => {
  const dispatch = useDispatch();
  const cachedPurchased = useSelector((state) => state.cache.purchasedServices);
  const initialData = useMemo(
    () => cachedPurchased || { success: true, orders: [] },
    [cachedPurchased]
  );

  const query = useQuery({
    queryKey: ["my-purchased-services"],
    queryFn: async () => {
      const res = await api.get("/payment/my-orders");
      return res.data;
    },
    enabled,
    initialData,
    placeholderData: initialData,
    retry: 1,
    staleTime: 2 * 60 * 1000,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data && query.data !== cachedPurchased) {
      dispatch(setPurchasedServicesCache(query.data));
    }
  }, [cachedPurchased, dispatch, query.data]);

  return {
    ...query,
    data: query.data || cachedPurchased || initialData,
    isError: false,
  };
};
