


"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setLoading } from "../../store/features/auth.slice";
import { api } from "../../api/api";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      dispatch(setLoading(true));

      try {
        // 1️⃣ wait backend ready (important for Render cold start)
        await fetch("/api/health", { cache: "no-store" });

        // 2️⃣ get logged user
        const res = await api.get("/user");

        if (mounted) dispatch(setUser(res.data.user));
      } catch (err) {
        if (mounted) dispatch(clearUser());
      } finally {
        if (mounted) dispatch(setLoading(false));
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return null;
}
