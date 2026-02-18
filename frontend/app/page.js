"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "./components/forms/LoginForm";
import RegisterForm from "./components/forms/RegisterForm";
import LoginFormImage from "./components/forms/LoginFormImage";

export default function LoginPage() {
  const { user, hydrated } = useSelector((s) => s.auth);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const toggle = () => setIsLogin((v) => !v);

  useEffect(() => {
    if (!hydrated) return;
    if (user) router.replace("/serviced");
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
