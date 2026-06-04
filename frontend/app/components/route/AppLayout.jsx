
"use client";

import Navbar from "../navbar/Navbar";
import Footer from "../navbar/Footer";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }) {
  const pathname = usePathname();

  // pages where navbar should NOT show
  const hideLayout =
    pathname.startsWith("/login") 

  return (
    <>
       {!hideLayout && <Navbar />}
        {children}
       {!hideLayout && <Footer />}
    </>
  );
}

