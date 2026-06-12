"use client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { api } from "../api/api";
import { setUser, clearUser } from "../store/features/auth.slice";

export const useRegisterEmployee = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/employee", formData);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.patch(`/employee/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["payroll"] });
    },
  });
};

export const useEmployeeLogin = () => {
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await api.post("/employee/login", {
        email,
        password,
      });
      return res.data; // { user }
    },

    onSuccess: (data) => {
      const user = data?.user;
      if (!user) return;

      // ✅ SAME redux flow as OTP login
      dispatch(setUser(user));
      

      qc.invalidateQueries({ queryKey: ["me"] });

      // ✅ ROLE BASED REDIRECT
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/employee/dashboard");
      }
    },
  });
};

export const useGetEmployees = (filters = {}) => {
  const user = useSelector((state) => state.auth.user);

  return useQuery({
    queryKey: ["employees", filters],
    enabled: user?.role === "admin",

    queryFn: async () => {
      const res = await api.get("/employee/get", {
        params: filters,
      });
      return res.data; // { success, users }
    },

    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};


// export const getMe = async () => {
 
//     const res = await api.get("/employee");
//     return { user: res.data.user };
  
// };

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/employee");
      return res.data; // { user }
    },
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};



export const useSendForgotOtp = () => {
  return useMutation({
    mutationFn: async (email) => {
      const res = await api.post("/forgot-password", { email });
      return res.data;
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async ({ email, otp }) => {
      const res = await api.post("/verify-forgot-otp", {
        email,
        otp,
      });
      return res.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ email, otp, newPassword }) => {
      const res = await api.post("/reset-password", {
        email,
        otp,
        newPassword,
      });
      return res.data;
    },
  });
};


export const useUploadProfileImage = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.put("/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data; // { profileImage }
    },

    onSuccess: (data) => {
      // ✅ 1. Update React Query cache instantly
      qc.setQueryData(["me"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          user: {
            ...oldData.user,
            profileImage: data.profileImage,
          },
        };
      });

      dispatch(setUser({
  ...qc.getQueryData(["me"])?.user,
  profileImage: data.profileImage,
}));
    },
  });
};



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
