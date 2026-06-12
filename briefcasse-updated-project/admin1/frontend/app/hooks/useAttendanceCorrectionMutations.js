import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

// EMPLOYEE APPLY CORRECTION
export const useRequestAttendanceCorrection = () =>
  useMutation({
    mutationFn: async (data) => {
      const res = await api.post(
        "/attendance/correction-request",
        data
      );

      return res.data;
    },
  });

// ADMIN GET PENDING CORRECTIONS
export const useAdminAttendanceCorrections = () =>
  useQuery({
    queryKey: ["attendanceCorrections"],

    queryFn: async () => {
      const res = await api.get(
        "/admin/attendance/corrections"
      );

      return res.data;
    },
  });

// ADMIN APPROVE / REJECT
export const useAdminCorrectionAction = () =>
  useMutation({
    mutationFn: async (data) => {
      const res = await api.put(
        "/admin/attendance/correction-action",
        data
      );

      return res.data;
    },
  });