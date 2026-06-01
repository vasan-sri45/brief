"use client";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import LoginFormImage from "./LoginFormImage";

export default function LoginPage() {
  const { user, hydrated } = useSelector((s) => s.auth);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLogin, setIsLogin] = useState(true);
  const toggle = () => setIsLogin((v) => !v);

  useEffect(() => {
    if (!hydrated || !user) return;

    // ⭐ read redirect param
    const redirect = searchParams.get("redirect");

    // If user came from service card → go back there
    if (redirect) {
      router.replace(redirect);
      return;
    }

    // otherwise role based routing
    if (user.role === "admin") router.replace("/admin/dashboard");
    else if (user.role === "employee") router.replace("/employee");
    else router.replace("/");
  }, [hydrated, user, router, searchParams]);

  if (!hydrated || user) return null;

  return (
    <div className="flex gap-4">
      <LoginForm handleClick={toggle} />
    
      <LoginFormImage />
    </div>
  );
}
