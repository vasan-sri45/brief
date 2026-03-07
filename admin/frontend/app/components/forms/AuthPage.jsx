"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import LoginFormImage from "./LoginFormImage";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggle = () => setIsLogin((v) => !v);

  return (
    <div className="flex gap-4">
      {/* Left side: Login / Register form */}
      {isLogin ? (
        <LoginForm handleClick={toggle} />
      ) : (
        <RegisterForm handleClick={toggle} />
      )}

      {/* Right side: Image */}
      <LoginFormImage />
    </div>
  );
};

export default AuthPage;
