
// // ProtectedRoute.jsx
// "use client";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function ProtectedRoute({ children }) {
//   const { user, token, hydrated } = useSelector((state) => state.auth);

//   const router = useRouter();

//   useEffect(() => {
//     if (!hydrated) return;         // wait until rehydrateFromStorage ran

//     if (!token) {
//       router.replace("/");
//     }
//   }, [hydrated, token, router]);

//   if (!hydrated) return null;      // or a loader component
//   if (!token) return null;

//   return <>{children}</>;
// }


"use client";

import { useAuthGuard } from "./useAuthGuard";

export default function ProtectedRoute({ children, roles = [] }) {
  const { loading, user } = useAuthGuard(roles);

  // While checking session → prevent flicker
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">
          Checking authentication...
        </p>
      </div>
    );
  }

  // Not logged in → guard already redirected
  if (!user) return null;

  return <>{children}</>;
}