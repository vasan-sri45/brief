// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useLogout } from "../../lib/useLogout";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   const logout = useLogout("/");

//   const handleLogout = async () => {
//     setMenuOpen(false);
//     setProfileOpen(false);
//     await logout();
//   };

//   return (
//     <div className="w-full">
//       <nav className="max-w-7xl bg-white py-4 px-4 shadow md:shadow-none flex items-center justify-between mx-auto relative">
        
//         {/* Logo */}
//         <div className="font-bold text-lg text-[#964B29]">Briefcasse</div>

//         {/* Center Menu (Desktop) */}
//         <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2 mt-1">
//           <Link href="/admin/dashboard" className="text-[#F7631B] font-bold text-sm">DASHBOARD</Link>
//           <Link href="/admin/transaction" className="text-[#F7631B] font-bold text-sm">TRANSACTION</Link>
//           <Link href="/admin/status" className="text-[#F7631B] font-bold text-sm">STATUS</Link>
//           <Link href="/admin/employee" className="text-[#F7631B] font-bold text-sm">EMPLOYEE</Link>
//         </div>

//         {/* Profile Dropdown (Desktop) */}
//         <div className="hidden md:relative md:block">
//           <button
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="text-[#F7631B] font-bold flex items-center gap-1"
//           >
//             PROFILE
//             <span className="text-xs">▼</span>
//           </button>

//           {profileOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
//               <Link
//                 href="/blogs"
//                 className="block px-4 py-2 text-sm text-[#F7631B] hover:bg-gray-100"
//                 onClick={() => setProfileOpen(false)}
//               >
//                 Blogs
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 text-sm text-[#F7631B] hover:bg-gray-100 font-bold"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-[#F7631B]"
//           onClick={() => setMenuOpen(true)}
//         >
//           <svg width={30} height={30} fill="none" stroke="currentColor" strokeWidth={2}>
//             <path d="M5 7h20M5 15h20M5 23h20" strokeLinecap="round" />
//           </svg>
//         </button>

//         {/* Mobile Sidebar */}
//         <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="font-bold text-lg text-[#964B29]">Briefcasse</div>
//             <button onClick={() => setMenuOpen(false)} className="text-[#F7631B]">
//               ✕
//             </button>
//           </div>

//           <ul className="flex flex-col gap-4 p-4">
//             <li><Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className="text-[#F7631B] font-bold text-sm">DASHBOARD</Link></li>
//             <li><Link href="/admin/transaction" onClick={() => setMenuOpen(false)} className="text-[#F7631B] font-bold text-sm">TRANSACTION</Link></li>
//             <li><Link href="/admin/status" onClick={() => setMenuOpen(false)} className="text-[#F7631B] font-bold text-sm">STATUS</Link></li>
//             <li><Link href="/admin/employee" onClick={() => setMenuOpen(false)} className="text-[#F7631B] font-bold text-sm">EMPLOYEE</Link></li>

//             {/* Profile Section */}
//             <li className="border-t pt-3">
//               <p className="text-[#964B29] font-bold text-sm mb-2">PROFILE</p>
//               <Link
//                 href="/admin/blogs"
//                 onClick={() => setMenuOpen(false)}
//                 className="block text-[#F7631B] text-sm mb-2"
//               >
//                 Blogs
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="text-[#F7631B] font-bold text-sm"
//               >
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* Overlay */}
//         {menuOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-40 z-40"
//             onClick={() => setMenuOpen(false)}
//           />
//         )}
//       </nav>
//     </div>
//   );
// }

"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  Menu,
  X,
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Users,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useLogout } from "../../lib/useLogout";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const logout = useLogout("/");
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    setProfileOpen(false);
    await logout();
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Transaction",
      href: "/admin/transaction",
      icon: ReceiptText,
    },
    {
      name: "Status",
      href: "/admin/status",
      icon: BarChart3,
    },
    {
      name: "Employee",
      href: "/admin/employee",
      icon: Users,
    },
  ];

  return (
    <header className="w-full relative z-50 px-3 py-3 sm:px-5">
      <nav className="mx-auto bg-white px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 overflow-visible">

        {/* LOGO */}
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-12 rounded-2xl bg-custom-blue flex items-center justify-center">
            <Image
              src="/assets/brief_white.png"
              alt="logo"
              width={30}
              height={30}
            />
          </div>

          <h1 className="font-anton font-normal text-custom-blue text-[1.1rem] sm:text-[1.7rem] uppercase leading-none">
            Briefcasse
          </h1>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center bg-white rounded-full border border-gray-100 p-2 gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.name}
                className="flex items-center gap-2"
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-semibold transition"
                >
                  <Icon size={20} />
                  {item.name}
                </Link>

                {index !== navItems.length - 1 && (
                  <span className="h-7 w-px bg-gray-200" />
                )}
              </div>
            );
          })}
        </nav>

        {/* PROFILE */}
        <div
          ref={profileRef}
          className="hidden md:flex items-center gap-3 relative"
        >
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 rounded-full px-4 py-2 transition"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center uppercase">
              {user?.name?.charAt(0) || "A"}
            </div>

            <div className="text-left">
              <p className="font-bold text-[#0F172A] leading-tight capitalize">
                {user?.name || "Admin"}
              </p>

              <p className="text-sm text-gray-500 capitalize">
                {user?.role || "Admin"}
              </p>
            </div>

            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute top-[68px] right-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(15,23,42,0.12)] p-2 z-[999]">
              <Link
                href="/admin/blogs"
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                <ReceiptText size={18} />
                Blogs
              </Link>
             

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-white shadow border border-gray-100"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white z-50 shadow-2xl p-6 lg:hidden flex flex-col
          transition-transform duration-300
          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-bold text-custom-blue text-xl">
            Menu
          </span>

          <button onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* MOBILE PROFILE */}
        <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center uppercase">
            {user?.name?.charAt(0) || "A"}
          </div>

          <div>
            <p className="font-bold text-[#0F172A] capitalize">
              {user?.name || "Admin"}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {user?.role || "Admin"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 font-semibold text-gray-700 rounded-xl p-3 hover:bg-blue-50 hover:text-blue-600"
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}

          <Link
            href="/admin/blogs"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 font-semibold text-gray-700 rounded-xl p-3 hover:bg-blue-50 hover:text-blue-600"
          >
            <ReceiptText size={20} />
            Blogs
          </Link>
          
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 font-semibold text-red-500 border-t pt-5"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </header>
  );
}