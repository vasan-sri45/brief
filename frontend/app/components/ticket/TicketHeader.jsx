"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { gsap } from "gsap";
import { useLogout } from "../../hooks/useAuthMutations";

const TicketHeader = () => {
  const logout = useLogout("/");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const openMenu = () => {
    setOpen(true);
  };

  const closeMenu = () => {
    gsap.to(menuRef.current, {
      x: "100%",
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => setOpen(false),
    });
  };

  const handleLogout = () => {
    logout.mutate();
    closeMenu();
  };

  useEffect(() => {
    if (open) {
      gsap.fromTo(
        menuRef.current,
        { x: "100%", opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [open]);

  return (
    <header className="w-full bg-white relative z-50">
      <div className="mx-auto p-3 md:p-4 lg:p-8 lg:w-10/12 flex items-center justify-between">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-white shadow-inner" />
          <span className="font-poppins font-bold text-custom-blue text-lg">
            Brief case
          </span>
        </div>

        {/* CENTER: Desktop Menu */}
        <div className="hidden md:flex items-center bg-white rounded-full shadow-[0_6px_14px_rgba(0,0,0,0.2)] px-6 py-2 gap-4">
          <Link href="/employee" className="font-semibold text-custom-blue">
            DASHBOARD
          </Link>

          <span className="h-5 w-[2.5px] bg-custom-blue" />

          <Link href="/employee/ticket" className="font-semibold text-lightYelow">
            Ticket
          </Link>
        </div>

        {/* RIGHT: Desktop Logout */}
        <div className="hidden md:block bg-white shadow-[0_6px_14px_rgba(0,0,0,0.25)] p-2 rounded-xl">
          <button onClick={handleLogout} className="font-medium">
            Logout
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={openMenu}
          className="md:hidden p-2 rounded-lg shadow"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* OFF-CANVAS MENU */}
     
{open && (
  <div
    ref={menuRef}
    className="fixed top-0 right-0 h-full w-[75%] max-w-xs bg-white z-50 shadow-2xl p-6 md:hidden
               flex flex-col"
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <span className="font-bold text-custom-blue text-lg">Menu</span>
      <button onClick={closeMenu}>
        <X size={24} />
      </button>
    </div>

    {/* NAV LINKS (takes remaining space) */}
    <nav className="flex-1 space-y-6">
      <Link
        href="/employee"
        onClick={closeMenu}
        className="block font-semibold text-custom-blue text-lg"
      >
        DASHBOARD
      </Link>

      <Link
        href="/employee/ticket"
        onClick={closeMenu}
        className="block font-semibold text-lightYelow text-lg"
      >
        Ticket
      </Link>
    </nav>

    {/* LOGOUT – pinned bottom */}
    <div className="pt-4">
      {/* Divider */}
      <div className="h-px w-full bg-gray-200 mb-4" />

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 font-semibold text-red-500 text-lg hover:opacity-80 transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  </div>
)}

    </header>
  );
};

export default TicketHeader;
