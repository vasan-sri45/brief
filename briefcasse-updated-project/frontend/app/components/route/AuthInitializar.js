"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setUser,
  clearUser,
  hydrateUser,
  setLoading,
  getStoredUser,
} from "../../store/features/auth.slice";
import { api } from "../../api/api";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const cachedUser = getStoredUser();

    if (cachedUser) {
      dispatch(hydrateUser(cachedUser));
    } else {
      dispatch(setLoading(true));
    }

    const initAuth = async () => {
      try {
        const res = await api.get("/user");
        if (mounted) dispatch(setUser(res.data.user));
      } catch (err) {
        const status = err?.response?.status;

        if (mounted && (status === 401 || status === 403)) {
          dispatch(clearUser());
        } else if (mounted && !cachedUser) {
          dispatch(hydrateUser(null));
        }
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
