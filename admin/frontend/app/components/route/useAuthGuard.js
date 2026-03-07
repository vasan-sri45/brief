
// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect } from "react";
// import { getMe } from "../../hooks/useEmployeeAuthMutations";

// export function useAuthGuard(requiredRoles = []) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { data, isLoading, isError } = getMe();

//   useEffect(() => {
//     if (isLoading) return;

    
//     if (isError || !data?.user) {
//       if (pathname !== "/") {
//         router.replace("/");
//       }
//       return;
//     }

//     const role = data.user.role;

//     console.log(role)

    
//     if (requiredRoles.length && !requiredRoles.includes(role)) {
//       if (role === "admin") {
//         router.replace("/admin/dashboard");
//       } else if (role === "employee") {
//         router.replace("/employee");
//       } 
//     }
//   }, [isLoading, isError, data, pathname, router, requiredRoles]);

//   return {
//     loading: isLoading,
//     user: data?.user ?? null,
//   };
// }



"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGetMe } from "../../hooks/useEmployeeAuthMutations";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/features/auth.slice";

export function useAuthGuard(requiredRoles = []) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetMe();

  useEffect(() => {
    if (isLoading) return;

    // ❌ NOT LOGGED IN
    if (isError || !data?.user) {
      dispatch(clearUser());
      if (pathname !== "/") router.replace("/");
      return;
    }

    // ✅ SYNC REDUX WITH SERVER
    dispatch(setUser(data.user));

    const role = data.user.role;

    // ❌ WRONG ROLE
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      if (role === "admin") router.replace("/admin/dashboard");
      else router.replace("/employee");
    }
  }, [data, isLoading, isError]);

  return { loading: isLoading, user: data?.user };
}