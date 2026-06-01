"use client";
import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import LoginFormImage from "../components/forms/LoginFormImage";

export default function LoginPage() {
  const { user, hydrated } = useSelector((s) => s.auth);
    const router = useRouter();
    const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);

  const toggle = () => setIsLogin((v) => !v);

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (!hydrated) return;
    // if (user) router.replace("/");
    if (user) router.replace(redirect);
  }, [hydrated, user, router]);

  if (!hydrated || user) return null;

  return (
    <div className="flex gap-4">
      {isLogin ? (
        <LoginForm handleClick={toggle} />
      ) : (
        <RegisterForm handleClick={toggle} />
      )}
      <LoginFormImage />
    </div>
  );
}
