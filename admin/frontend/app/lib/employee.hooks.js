// employee.hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, loginEmployee, signupEmployee } from "../api/auth.api";
import { useDispatch } from "react-redux";
import { setSession } from "../store/features/auth.slice";

/**
 * Login mutation:
 * - Calls loginEmployee
 * - On success: sets Redux session and invalidates "me"
 */
export function useEmployeeLogin() {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginEmployee,
    onSuccess: (data) => {
      const user = data?.user ?? null;
      const token = data?.token ?? null;

      // For login, both user + token must exist
      if (!user || !token) return;

      dispatch(setSession({ user, token }));
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    // onError: (err) => { /* optional extra logging */ },
  });
}

/**
 * Signup mutation:
 * - Calls signupEmployee
 * - If backend returns token, same as login: set session + invalidate "me"
 *   Otherwise, just let UI redirect to login screen.
 */
export function useEmployeeSignup() {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: signupEmployee,
    onSuccess: (data) => {
      const user = data?.user ?? null;
      const token = data?.token ?? null;

      if (user && token) {
        dispatch(setSession({ user, token }));
        qc.invalidateQueries({ queryKey: ["me"] });
      }
      // No else: UI side can still do router navigation to login page.
    },
  });
}

/**
 * "Me" query:
 * - Fetch current user from backend (cookie/JWT based)
 * - Used by guards + global auth state
 */
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: 0,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
