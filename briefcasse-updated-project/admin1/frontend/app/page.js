"use client";

import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";
import LoginForm from "./components/forms/LoginForm";
import { useGetMe } from "./hooks/useEmployeeAuthMutations";

const Page = () => {
  const router = useRouter();
  const { data, isLoading } = useGetMe();

  useEffect(() => {
    if (isLoading || !data?.user) return;

    if (data.user.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (data.user.role === "employee") {
      router.replace("/employee/dashboard");
    }
  }, [data, isLoading, router]);

  return (
    <>
      <LoginForm />
    </>
  )
}

export default Page
