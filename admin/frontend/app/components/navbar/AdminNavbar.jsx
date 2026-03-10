"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useLogout } from "../../hooks/useEmployeeAuthMutations";
import gsap from "gsap";
import Image from "next/image";
import {Menu, X} from "lucide-react";

export default function AdminNavbar() {
  /* ================= STATE & HOOKS ================= */
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, hydrated } = useSelector((state) => state.auth);
  const logout = useLogout("/login");

  const menuRefs = useRef([]);

  /* ================= GSAP HOVER ================= */
  useEffect(() => {
    menuRefs.current.forEach((el) => {
      if (!el) return;

      const enter = () =>
        gsap.to(el, { scale: 1.1, y: -2, duration: 0.2 });
      const leave = () =>
        gsap.to(el, { scale: 1, y: 0, duration: 0.2 });

      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);

      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    });
  }, []);

  /* ================= ROLE CHECK ================= */
  const isAllowed =
    hydrated && user && user.role === "admin";

  /* ================= ACTIONS ================= */
  const handleLogout = () => {
    setMenuOpen(false);
    setProfileOpen(false);
    logout.mutate();
  };

  if (!isAllowed) return null; // ✅ SAFE: after all hooks

  const menuItems = [
    { label: "DASHBOARD", href: "/admin/dashboard" },
    { label: "TRANSACTION", href: "/admin/transaction" },
    { label: "BLOGS", href: "/admin/status" },
    { label: "TICKET", href: "/admin/employee" },
  ];

  return (
    <nav className="w-full bg-custom-blue py-4 px-4 flex items-center justify-between md:shadow-[0_8px_24px_rgba(0,0,0,0.25)]">

      {/* LOGO */}
       <div className="flex items-center mb-4 justify-center">
               
                     <Image
                      src="/assets/brief_blue.png"
                      alt="logo"
                      width={32}
                      height={32}
                      className=" rounded mr-1"
                    />
                    <h2 className="text-xl text-white font-anton font-normal tracking-widest mt-1">BRIEFCASSE</h2>
          </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
        {menuItems.map((item, i) => (
          <Link key={item.href} href={item.href}>
            <span
              ref={(el) => (menuRefs.current[i] = el)}
              className="text-white font-lato font-bold text-sm cursor-pointer inline-block tracking-wide"
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* PROFILE */}
      <div className="hidden md:block relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="text-white font-bold flex items-center gap-1"
        >
          {user.name || "ADMIN"} <span className="text-xs">▼</span>
        </button>

        {profileOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
            <Link
              href="/admin/blog/create"
              className="block px-4 py-2 text-sm hover:bg-gray-100 text-custom-blue font-lato font-bold"
              onClick={() => setProfileOpen(false)}
            >
              Create
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm font-lato font-bold text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* MOBILE BUTTON */}
      <button
        className="md:hidden text-white text-xl mt-[-14px]"
        onClick={() => setMenuOpen(true)}
      >
       <Menu size={28}/>
      </button>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-custom-blue z-50 transform transition-transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between p-4 border-b border-blue-700">
          <span className="text-white font-bold">Admin</span>
          <button onClick={() => setMenuOpen(false)} className="text-white">
            <X />
          </button>
        </div>

        <ul className="p-4 space-y-4 text-white">
          {menuItems.map((item) => (
            <li key={item.href} className="text-white text-[0.8rem] font-lato font-bold tracking-wide">
              <Link href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}

          <li className="border-t border-blue-700 pt-4 font-lato font-bold text-[0.8rem] tracking-wide">
            <Link href="/admin/blogs">Blogs</Link>
            <button
              onClick={handleLogout}
              className="block mt-3 text-red-400 font-bold"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
