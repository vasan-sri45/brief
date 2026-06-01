// hooks/useAttendance.js
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

export const usePunchIn = () =>
  useMutation({
    mutationFn: () => api.post("/attendance/punch-in"),
  });

export const usePunchOut = () =>
  useMutation({
    mutationFn: () => api.post("/attendance/punch-out"),
  });

export const useTodayAttendance = () =>
  useQuery({
    queryKey: ["today-attendance"],
    queryFn: async () => {
      const res = await api.get("/attendance/today");
      return res.data;
    },
  });

export const useAttendanceHistory = (view = "monthly") =>
  useQuery({
    queryKey: ["attendance-history", view],
    queryFn: async () => {
      const res = await api.get("/attendance/history", {
        params: { view },
      });
      return res.data;
    },
  });


export const useRequestLeave = () =>
  useMutation({
    mutationFn: async (data) => {

      console.log(
        "Leave Request Data:",
        data
      );

      const res = await api.post(
        "/attendance/request-leave",
        {
          leaveType: data.leaveType,

          startDate: data.startDate,

          endDate: data.endDate,

          remarks: data.remarks,
        }
      );

      console.log(
        "Leave Response:",
        res.data
      );

      return res.data;
    },
  });

export const useAdminTodayAttendance = () => {
  return useQuery({
    queryKey: ["adminTodayAttendance"],

    queryFn: async () => {
      const res = await api.get(
        "/admin/attendance/today"
      );

      return res.data;
    },
  });
};

export const useAdminMonthlyAttendance = (month, year) =>
  useQuery({
    queryKey: ["adminMonthlyAttendance", month, year],
    queryFn: async () => {
      const res = await api.get("/admin/attendance/monthly", {
        params: { month, year, limit: 100 },
      });
      return res.data;
    },
  });

export const useAdminAlterAttendance =
  () => {
    return useMutation({
      mutationFn: async (data) => {

        const res = await api.put(
          "/admin/attendance/alter",
          {
            attendanceId:
              data.attendanceId,

            newStatus:
              data.newStatus,

            remarks:
              data.remarks,
          }
        );

        return res.data;
      },
    });
  };


  export const useMyLeaveRequests = () =>
  useQuery({
    queryKey: ["myLeaveRequests"],

    queryFn: async () => {
      const res = await api.get(
        "/attendance/my-leaves"
      );

      return res.data;
    },
  });

  export const useAdminPendingLeaves = () =>
  useQuery({
    queryKey: ["adminPendingLeaves"],
    queryFn: async () => {
      const res = await api.get("/admin/leave/pending");
      return res.data;
    },
  });

export const useAdminLeaveAction = () =>
  useMutation({
    mutationFn: async (data) => {
      const res = await api.put("/admin/leave/action", data);
      return res.data;
    },
  });

  export const useAttendanceByDateRange = (
  startDate,
  endDate
) =>
  useQuery({
    queryKey: [
      "attendanceByDateRange",
      startDate,
      endDate,
    ],

    enabled: !!startDate && !!endDate,

    queryFn: async () => {
      const res = await api.get(
        "/admin/attendance/range",
        {
          params: {
            startDate,
            endDate,
          },
        }
      );

      return res.data;
    },
  });

  export const useMonthlyPayroll = (
  month,
  year
  ) =>
    useQuery({
      queryKey: [
        "monthlyPayroll",
        month,
        year,
      ],

      queryFn: async () => {

        const res = await api.get(
          "/payroll/monthly",
          {
            params: {
              month,
              year,
            },
          }
        );

        return res.data;
      },
    });

export const useMyPayroll = (month, year) =>
  useQuery({
    queryKey: ["myPayroll", month, year],
    queryFn: async () => {
      const res = await api.get("/payroll/me", {
        params: { month, year },
      });
      return res.data;
    },
  });

export const useRequestLopRecovery = () =>
  useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/payroll/lop-recovery", payload);
      return res.data;
    },
  });

export const usePendingLopRecoveries = () =>
  useQuery({
    queryKey: ["pendingLopRecoveries"],
    queryFn: async () => {
      const res = await api.get("/payroll/lop-recovery/pending");
      return res.data;
    },
  });

export const useLopRecoveryAction = () =>
  useMutation({
    mutationFn: async (payload) => {
      const res = await api.put("/payroll/lop-recovery/action", payload);
      return res.data;
    },
  });
