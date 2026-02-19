// "use client";

// import { useSelector } from "react-redux";
// import Navbar from "../navbar/Navbar";
// import Footer from "../navbar/Footer";
// import { usePathname } from "next/navigation";

// export default function AppLayout({ children }) {
//   const { user, hydrated } = useSelector((s) => s.auth);
//   const pathname = usePathname();

//   const isAuthPage = user != null||"";

//   // wait for hydration to avoid flicker
//   if (!hydrated) return null;

//   return (
//     <>
//       {isAuthPage && user && <Navbar />}
//       {children}
//       {isAuthPage && user && <Footer />}
//     </>
//   );
// }

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
  // const hideLayout =
  //   pathname.startsWith("/login") ||
  //   pathname.startsWith("/register");

  // wait auth check
  if (!hydrated) return null;

  return (
    <>
       {isAuthPage && user && <Navbar />}
        {children}
       {isAuthPage && user && <Footer />}
    </>
  );
}

