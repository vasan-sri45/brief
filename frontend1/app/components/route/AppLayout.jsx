
"use client";

import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import Footer from "../navbar/Footer";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }) {
  const { user, hydrated } = useSelector((s) => s.auth);
  const pathname = usePathname();

  const isAuthPage = !!user;

  // pages where navbar should NOT show
  const hideLayout =
    pathname.startsWith("/login") 

  // wait auth check
  if (!hydrated) return null;

  return (
    <>
       {!hideLayout && <Navbar />}
        {children}
       {!hideLayout && <Footer />}
    </>
  );
}

