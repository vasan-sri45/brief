"use client";
import { useState } from "react";
import Link from "next/link";
import { useLogout } from "../../lib/useLogout";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const logout = useLogout("/");

  const handleLogout = async () => {
    setMenuOpen(false);
    setProfileOpen(false);
    await logout();
  };

  return (
    <div className="w-full">
      <nav className="max-w-7xl bg-white py-4 px-4 shadow md:shadow-none flex items-center justify-between mx-auto relative">
        
        {/* Logo */}
        <div className="font-bold text-lg text-[#964B29]">Briefcasse</div>

        {/* Center Menu (Desktop) */}
        <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2 mt-1">
          <Link href="/admin/dashboard" className="text-[#F7631B] font-bold text-sm">DASHBOARD</Link>
          <Link href="/admin/transaction" className="text-[#F7631B] font-bold text-sm">TRANSACTION</Link>
          <Link href="/admin/status" className="text-[#F7631B] font-bold text-sm">STATUS</Link>
          <Link href="/admin/employee" className="text-[#F7631B] font-bold text-sm">EMPLOYEE</Link>
        </div>

        {/* Profile Dropdown (Desktop) */}
        <div className="hidden md:relative md:block">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="text-[#F7631B] font-bold flex items-center gap-1"
          >
            PROFILE
            <span className="text-xs">▼</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
              <Link
                href="/blogs"
                className="block px-4 py-2 text-sm text-[#F7631B] hover:bg-gray-100"
                onClick={() => setProfileOpen(false)}
              >
                Blogs
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-[#F7631B] hover:bg-gray-100 font-bold"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#F7631B]"
          onClick={() => setMenuOpen(true)}
        >
          <svg width={30} height={30} fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 7h20M5 15h20M5 23h20" strokeLinecap="round" />
          </svg>
        </button>

        {/* Mobile Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-bold text-lg text-[#964B29]">Briefcasse</div>
            <button onClick={() => setMenuOpen(false)} className="text-[#F7631B]">
              ✕
            </button>
          </div>

          <ul className="flex flex-col gap-4 p-4">
            <li><Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className="text-[#F7631B] font-bold text-sm">DASHBOARD</Link></li>
            <li><Link href="/admin/transaction" onClick={() => setMenuOpen(false)} className="text-[#F7631B] font-bold text-sm">TRANSACTION</Link></li>
            <li><Link href="/admin/status" onClick={() => setMenuOpen(false)} className="text-[#F7631B] font-bold text-sm">STATUS</Link></li>
            <li><Link href="/admin/employee" onClick={() => setMenuOpen(false)} className="text-[#F7631B] font-bold text-sm">EMPLOYEE</Link></li>

            {/* Profile Section */}
            <li className="border-t pt-3">
              <p className="text-[#964B29] font-bold text-sm mb-2">PROFILE</p>
              <Link
                href="/admin/blogs"
                onClick={() => setMenuOpen(false)}
                className="block text-[#F7631B] text-sm mb-2"
              >
                Blogs
              </Link>
              <button
                onClick={handleLogout}
                className="text-[#F7631B] font-bold text-sm"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </nav>
    </div>
  );
}
