// useLogout.ts
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { clearSession } from "../store/features/auth.slice";
import { logoutApi } from "../api/auth.api";

/**
 * Logout hook:
 * - Calls server logout API
 * - Clears Redux session + React Query cache
 * - Redirects to given path (default "/"), with optional "next"
 */
export function useLogout(redirect = "/") {
  const router = useRouter();
  const dispatch = useDispatch();
  const qc = useQueryClient();

  return useCallback(async () => {
    // Capture current path before clearing any state
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    const next = encodeURIComponent(currentPath || "/");

    try {
      await logoutApi();
    } catch (_) {
      // Ignore API errors: client cleanup is still required
    } finally {
      // 1. Clear Redux auth slice
      dispatch(clearSession());

      // 2. Remove "me" query cache
      qc.removeQueries({ queryKey: ["me"] });

      // 3. Redirect user (replace to avoid going back to protected page)
      router.replace(`${redirect}?next=${next}`);
    }
  }, [dispatch, qc, router, redirect]);
}
