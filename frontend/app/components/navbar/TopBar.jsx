"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, User2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useLogout } from "../../hooks/useAuthMutations";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const logout = useLogout();
  const router = useRouter();
  
  // Get user from Redux state
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="hidden lg:flex items-center justify-between py-3 text-white">
      {/* <div className="text-xl font-anton font-medium tracking-wider">Briefcasse</div> */}

        <div className="flex items-center mb-4">
                    {/* <Image  alt="logo" src="/assets/brief_white.png" className="w-8 h-8 bg-white rounded mr-3" /> */}
                     <Image
                      src="/assets/brief_white.png"
                      alt="logo"
                      width={32}
                      height={32}
                      className=" rounded mr-3"
                    />
                    <h2 className="text-xl font-anton font-semibold tracking-widest">BRIEFCASSE.</h2>
                  </div>
      <input
        className="max-w-md w-full px-4 py-2 rounded-lg text-black"
        disabled
      />

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg"
        >
          {/* User Icon Container */}
          <div className="bg-white p-1 rounded-full">
            <User2 size={18} className="text-[#1E4484]" />
          </div>

          {/* User Info: Name and Email */}
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-lato font-normal leading-tight tracking-wide uppercase">
              {user?.name || "User"}
            </span>
            <span className="text-[11px] opacity-80 leading-tight font-lato font-bold tracking-wider">
              {user?.email || "user@example.com"}
            </span>
          </div>

          <ChevronUp 
            size={16} 
            className={`transition-transform duration-200 ${open ? "" : "rotate-180"}`} 
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-white text-custom-blue rounded shadow w-40 overflow-hidden z-[1002]">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-lato font-bold"
              onClick={() => {
                router.push("/blogs");
                setOpen(false);
              }}
            >
              Blogs
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-lato font-bold"
              onClick={() => {
                router.push("/user/about");
                setOpen(false);
              }}
            >
              About
            </button>

             <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-lato font-bold"
              onClick={() => {
                router.push("/user/contact");
                setOpen(false);
              }}
            >
              Contact
            </button>
            <div className="border-t border-gray-100" />
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm font-lato font-bold"
              onClick={() => {
                logout.mutate();
                setOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;