"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import { setDashboardServicesCache } from "../store/features/cache.slice";

/* ===============================
   CREATE PAID SERVICE (MANUAL)
   Employee/Admin creates service
================================ */
export const useCreatePaidService = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/paid", payload);
      return res.data;
    },
  });
};

/* ===============================
   GET ALL PAID SERVICES (ADMIN)
================================ */
export const useGetPaidServices = (params = {}) => {
  const dispatch = useDispatch();
  const cachedDashboard = useSelector((state) => state.cache.dashboardServices);

  const query = useQuery({
    queryKey: ["paid-services", params],
    queryFn: async () => {
      const res = await api.get("/paid", {
        params,
      });
      return res.data;
    },
    initialData: cachedDashboard || { success: true, data: [] },
    placeholderData: cachedDashboard || { success: true, data: [] },
    staleTime: 2 * 60_000,
    gcTime: 30 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (query.data && query.data !== cachedDashboard) {
      dispatch(setDashboardServicesCache(query.data));
    }
  }, [cachedDashboard, dispatch, query.data]);

  return {
    ...query,
    data: query.data || cachedDashboard || { success: true, data: [] },
    isError: false,
  };
};

/* ===============================
   GET SINGLE PAID SERVICE
================================ */
export const useGetPaidServiceById = (id) => {
  return useQuery({
    queryKey: ["paid-service", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/paid/${id}`);
      return res.data;
    },
  });
};

/* ===============================
   UPDATE PAID SERVICE STATUS
================================ */

export const useUpdatePaidService = () => {
  const queryClient = useQueryClient(); // ✅ FIX

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.put(`/paid/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      // 🔁 Refresh all paid services
      queryClient.invalidateQueries({
        queryKey: ["paid-services"],
      });
    },
  });
};


/* ===============================
   DELETE PAID SERVICE (SOFT)
================================ */
// export const useDeletePaidService = () => {
//   return useMutation({
//     mutationFn: async (id) => {
//       const res = await api.delete(`/admin/paid-services/${id}`);
//       return res.data;
//     },
//   });
// };


export const useGetPaymentServices = (params = {}) => {
  return useQuery({
    queryKey: ["payment-services", params],
    queryFn: async () => {
      const res = await api.get("/payment/all-orders", {
        params,
      });
      return res.data;
    },
    staleTime: 2 * 60_000,
    gcTime: 30 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};


export const useUpdatePaymentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(
        `/payment/update/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-services"] });
    },
  });
};
