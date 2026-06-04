"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

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
  return useQuery({
    queryKey: ["paid-services", params],
    queryFn: async () => {
      const res = await api.get("/paid", {
        params,
      });
      return res.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
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
    staleTime: 60_000,
    refetchOnWindowFocus: false,
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
      queryClient.invalidateQueries(["payment-services"]);
    },
  });
};