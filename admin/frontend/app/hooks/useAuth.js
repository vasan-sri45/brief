"use client";

import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, isLoading, hydrated } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isLoading,
    hydrated,
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee",
  };
};
