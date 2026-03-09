
"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { ChevronDown, Menu, X, User2 } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogout } from "../../hooks/useAuthMutations";
import { useAllServices } from "../../hooks/userServiceList";
import Image from "next/image";
import StartUpCard from "./StartUpCard";

const CATEGORY_LABELS = [
  "Startup",
  "Intellectual Property",
  "Tax Filling",
  "MCA Compliance",
  "Registration",
  "Legal Advisory & Agreement",
  "Other Services",
];

const MegaMenuNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const timerRef = useRef(null);

  const router = useRouter();
  const logout = useLogout();
  const user = useSelector((state) => state.auth.user);
  const { data } = useAllServices();
  const services = data?.items || [];

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  const norm = (v) =>
    v?.toLowerCase().trim().replace(/\s+/g, " ").replace(/s$/, "");

  const menuData = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      const title = s.title?.trim() || "Other Services";
      const sub = s.subTitle?.trim() || "General";
      const key = norm(title);

      if (!map[key]) map[key] = { title, sections: {} };
      if (!map[key].sections[sub]) map[key].sections[sub] = [];

      map[key].sections[sub].push({
        label: s.heading || s.title,
        slug: s.slug,
      });
    });
    return map;
  }, [services]);

  const openMenu = (item) => {
    clearTimeout(timerRef.current);
    setActiveMenu(item);
  };

  const closeMenu = () => {
    timerRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  /* ================= DESKTOP MEGA MENU ================= */
  const DesktopMegaMenu = ({ item }) => {
    const entry = menuData[norm(item)];
    if (!entry) return null;

    return (
      <div
        className="fixed left-1/2 -translate-x-1/2 top-[150px] bg-white shadow-2xl rounded-xl z-[100]
        border-3 border-gray-200 w-[95vw] max-w-[1400px]"
        onMouseEnter={() => openMenu(item)}
        onMouseLeave={closeMenu}
      >
        <div className="flex">

          {/* SERVICES GRID */}
          <div className="flex-1 p-10 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 max-h-[70vh] overflow-y-auto">
            {Object.entries(entry.sections).map(([title, items]) => (
              <div key={title}>
                <h4 className="bg-custom-blue text-white rounded-full px-4 py-2 text-sm font-bold mb-4 uppercase text-center">
                  {title}
                </h4>

                <ul className="space-y-3">
                  {items.map((s, i) => (
                    <li key={i}>
                      <Link
                        href={`/services/${s.slug}`}
                        onClick={() => setActiveMenu(null)}
                        className="text-[14px] text-custom-blue font-bold hover:text-starttext"
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA CARD ONLY FOR STARTUP */}
       {item === "Startup" && (
  <StartUpCard
    title="Startup Packages"
    description="Register your company quickly with expert legal support."
    buttonText="Custom Startup Package"
    navigatePath="/startup"
    onClose={() => setActiveMenu(null)}
  />
)}

{item === "Legal Advisory & Agreement" && (
  <StartUpCard
    title="Custom Agreement"
    description="Create legally valid agreements with expert legal guidance."
    buttonText="Custom Agreement"
    navigatePath="/"
    onClose={() => setActiveMenu(null)}
  />
)}
        </div>
      </div>
    );
  };

  return (
    <nav className="relative w-full">

      {/* MOBILE HEADER */}
      <div className="lg:hidden flex justify-between items-center px-4 py-4 bg-custom-blue">
        <Link href="/serviced" className="flex items-center">
          <Image
            src="/assets/brief_white.png"
            alt="logo"
            width={32}
            height={32}
          />
          <span className="text-white font-anton ml-2">BRIEFCASSE</span>
        </Link>

        <button onClick={() => setMobileOpen(true)}>
          <Menu className="text-white" size={28} />
        </button>
      </div>

      {/* DESKTOP NAV */}
      <ul className="hidden lg:flex justify-center gap-12 py-4 bg-custom-blue text-white font-bold border-b-2 border-white">
        {CATEGORY_LABELS.map((item) => (
          <li
            key={item}
            onMouseEnter={() => openMenu(item)}
            onMouseLeave={closeMenu}
            className="relative"
          >
            <button className="flex items-center gap-1">
              {item}
              <ChevronDown
                size={16}
                className={activeMenu === item ? "rotate-180" : ""}
              />
            </button>

            {activeMenu === item && <DesktopMegaMenu item={item} />}
          </li>
        ))}
      </ul>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[9999] lg:hidden ${mobileOpen ? "visible" : "invisible"}`}>
        <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />

        <aside className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-custom-blue text-white transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>

          <div className="flex justify-between items-center px-5 py-5 border-b border-white/10">
            <span className="font-bold">{user?.name || "User"}</span>
            <button onClick={() => setMobileOpen(false)}>
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 px-4 py-4 overflow-y-auto">
            {CATEGORY_LABELS.map((item) => (
              <div key={item} className="mb-2">
                <button
                  className="w-full flex justify-between items-center py-3"
                  onClick={() => setMobileSub(mobileSub === item ? null : item)}
                >
                  {item}
                  <ChevronDown size={20} />
                </button>

                {mobileSub === item && (
                  <div className="bg-white text-custom-blue rounded-xl p-4 space-y-3">

                    {Object.values(menuData[norm(item)]?.sections || {}).flat().map((s, i) => (
                      <Link
                        key={i}
                        href={`/services/${s.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block font-bold"
                      >
                        {s.label}
                      </Link>
                    ))}

                    {/* MOBILE CTA ONLY STARTUP */}
                    {item === "Startup" && (
                      <div className="mt-4 bg-gradient-to-br from-custom-blue to-blue-900 text-white rounded-xl p-5 text-center">
                        <h3 className="font-bold mb-2">
                          Start Your Business
                        </h3>
                        <button
                          onClick={() => {
                            setMobileOpen(false);
                            router.push("/serviced");
                          }}
                          className="bg-white text-custom-blue px-4 py-2 rounded-full font-bold text-sm"
                        >
                          Get Started →
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>

           <div className="border-t border-white/10 p-4 space-y-2">
             <Link href="/blogs" onClick={() => setMobileOpen(false)} className="block font-bold">Blogs</Link>
             <Link href="/user/about" onClick={() => setMobileOpen(false)} className="block font-bold">About</Link>
             <Link href="/user/contact" onClick={() => setMobileOpen(false)} className="block font-bold">Contact</Link>

             {user ? (
              <button
                onClick={() => {
                  logout.mutate();
                  setMobileOpen(false);
                }}
                className="block text-red-300 font-bold"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block font-bold text-green-300">
                Login
              </Link>
            )}
           </div>

          {/* <div className="border-t border-white/10 p-4">
            <button
              onClick={() => {
                logout.mutate();
                setMobileOpen(false);
              }}
              className="text-red-300 font-bold"
            >
              Logout
            </button>
          </div> */}
        </aside>
      </div>
    </nav>
  );
};

export default MegaMenuNavbar;