"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMe } from "../../hooks/useAuthMutations";

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (isLoading) return;

    // ❌ Not logged in → go to login page
    if (isError || !data?.user) {
      if (pathname !== "/") {
        router.replace("/serviced");
      }
    }
  }, [isLoading, isError, data, pathname, router]);

  return {
    loading: isLoading,
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
  };
}
