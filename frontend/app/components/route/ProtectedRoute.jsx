
// ProtectedRoute.jsx
"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, token, hydrated } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;         // wait until rehydrateFromStorage ran

    if (!token) {
      router.replace("/");
    }
  }, [hydrated, token, router]);

  if (!hydrated) return null;      // or a loader component
  if (!token) return null;

  return <>{children}</>;
}
