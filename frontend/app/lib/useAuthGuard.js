// useAuthGuard.js
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMe } from "./employee.hooks";

/**
 * Client-side auth guard (JavaScript).
 * @param {string | string[]} [requiredRoles]
 * @param {string} [redirectPath="/"]
 *
 * Usage:
 *   const { loading, role, isAuthorized, isAuthed } = useAuthGuard(["admin"]);
 *   if (loading) return <Spinner />;
 */
export function useAuthGuard(requiredRoles, redirectPath = "/") {
  const router = useRouter();
  const pathname = usePathname();

  // Redux cached user role (fast, available before /me finishes)
  const cachedRole = useSelector((s) => s.auth?.user?.role);

  // Server-side "me" info
  const { data, isLoading, isError } = useMe();

  // Prefer /me -> fallback Redux
  const currentRole =
    (data && data.user && data.user.role) ??
    cachedRole ??
    null;

  // Normalize accepted roles
  const acceptedRoles = useMemo(() => {
    const arr = Array.isArray(requiredRoles)
      ? requiredRoles
      : requiredRoles
      ? [requiredRoles]
      : ["admin", "employee"];

    const set = new Set(
      arr
        .filter(Boolean)
        .map((r) => String(r).toLowerCase()),
    );

    return set.size ? set : new Set(["admin", "employee"]);
  }, [requiredRoles]);

  const isAuthorized = currentRole
    ? acceptedRoles.has(String(currentRole).toLowerCase())
    : false;

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Still loading, don't decide yet
    if (isLoading) return;

    // Not logged in or /me failed -> send to login with "next"
    if (!currentRole || isError) {
      // Avoid using guard on "/" itself to prevent loops
      if (pathname === "/") return;

      setRedirecting(true);
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/?next=${next}`);
      return;
    }

    // Logged in but not allowed by role
    if (!isAuthorized) {
      // Prevent infinite redirect loops if already on redirectPath
      if (pathname === redirectPath) return;

      setRedirecting(true);
      router.replace(redirectPath);
    }
  }, [currentRole, isLoading, isError, isAuthorized, router, redirectPath, pathname]);

  const loading = (isLoading && !currentRole) || redirecting;
  const isAuthed = !!currentRole && isAuthorized;

  return { loading, role: currentRole, isAuthorized, isAuthed };
}
