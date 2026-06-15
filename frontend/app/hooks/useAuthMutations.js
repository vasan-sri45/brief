"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { api } from "../api/api";
import { getMe } from "../api/auth.api";
import { setUser, clearUser } from "../store/features/auth.slice";

/* =====================================================
   REGISTER USER (CREATE ACCOUNT + SEND OTP)
===================================================== */
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/create", payload);
      return res.data;
    },
  });
};

/* =====================================================
   SEND OTP (LOGIN / REGISTER)
===================================================== */
export const useSendOtp = () => {
  return useMutation({
    mutationFn: async ({ email }) => {
      const res = await api.post("/send-otp", { email });
      return res.data;
    },
  });
};

/* =====================================================
   VERIFY OTP + LOGIN
===================================================== */
export const useVerifyOtp = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, otp }) => {
      const res = await api.post("/verify-otp", { email, otp });
      return res.data; // { success, user }
    },

    onSuccess: (data) => {
      if (!data?.user) return;

      // Save user in Redux + localStorage
      dispatch(setUser(data.user));

      // Redirect to app
      router.replace("/serviced");
    },
  });
};

// alias
export const useOtpLogin = useVerifyOtp;

/* =====================================================
   LOGOUT
===================================================== */
export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/logout");
    },

    onSuccess: () => {
      // Clear react-query cache
      queryClient.clear();

      // Clear redux + localStorage
      dispatch(clearUser());

      // Go to login
      router.replace("/");
    },
  });
};

/* =====================================================
   GET CURRENT USER (SESSION RESTORE)
   Safe version → NEVER force logout on failure
===================================================== */
export const useMe = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,

    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,

    onSuccess: (data) => {
      if (data?.user) {
        dispatch(setUser(data.user));
      }
    },

    // IMPORTANT:
    // Do NOT clear user on error
    // backend may be sleeping or cookie refreshing
    onError: () => {
      console.log("Session check failed — keeping local session");
    },
  });
};
