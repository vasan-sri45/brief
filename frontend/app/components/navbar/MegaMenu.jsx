"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { ChevronDown, Menu, X, LogOut, BookOpen, User2 } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogout } from "../../hooks/useAuthMutations";
import { useAllServices } from "../../hooks/userServiceList";

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

  // --- DESKTOP MEGA MENU COMPONENT ---
  const DesktopMegaMenu = ({ item }) => {
    const entry = menuData[norm(item)];
    if (!entry) return null;

    return (
      <div
        className="
          fixed left-1/2 -translate-x-1/2 top-[150px] 
          bg-white shadow-2xl rounded-xl z-[100]
          border border-gray-200 w-[95vw] max-w-[1400px]
          animate-in fade-in zoom-in-95 duration-200
        "
        onMouseEnter={() => openMenu(item)}
        onMouseLeave={closeMenu}
      >
        <div className="p-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 max-h-[70vh] overflow-y-auto">
          {Object.entries(entry.sections).map(([title, items]) => (
            <div key={title} className="flex flex-col">
              <h4 className="text-starttext font-bold text-sm mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((s, i) => (
                  <li key={i}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-[14px] text-custom-blue font-lato font-bold hover:text-starttext transition-colors block leading-tight"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className="relative w-full">
      {/* ================= MOBILE/MEDIUM HEADER ================= */}
      {/* Changed xl:hidden to lg:hidden so desktop menu starts at 1024px */}
      <div className="lg:hidden flex justify-between items-center px-4 py-4 bg-custom-blue rounded-t-xl">
        <span className="text-white font-bold text-lg">Briefcasse</span>
        <button onClick={() => setMobileOpen(true)} className="p-2">
          <Menu className="text-white" size={28} />
        </button>
      </div>

      {/* ================= DESKTOP NAV ================= */}
      {/* Changed xl:flex to lg:flex to ensure medium devices see the navbar */}
      <ul className="hidden lg:flex justify-center lg:gap-12 xl:gap-32 py-4 text-white font-medium border-b-2">
        {CATEGORY_LABELS.map((item) => (
          <li
            key={item}
            className="relative"
            onMouseEnter={() => openMenu(item)}
            onMouseLeave={closeMenu}
          >
            <button className="font-lato font-bold flex items-center gap-1 hover:text-yellow-400 py-2">
              {item}
              <ChevronDown size={16} className={`transition-transform duration-200 ${activeMenu === item ? "rotate-180" : ""}`} />
            </button>
            
            {activeMenu === item && <DesktopMegaMenu item={item} />}
          </li>
        ))}
      </ul>

      {/* ================= OFF CANVAS (MOBILE DRAWER) ================= */}
      <div
        className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300
          ${mobileOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

        <aside
          className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px]
          bg-custom-blue text-white shadow-2xl transform transition-transform duration-300 flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* TOP HEADER */}
          <div className="flex justify-between items-center px-5 py-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <User2 size={20} className="text-white" />
              <span className="font-lato font-bold text-lg tracking-wider">{user?.name || "User"}</span>
            </div>
            <button onClick={() => setMobileOpen(false)}><X size={28} /></button>
          </div>

          {/* MIDDLE SCROLLABLE CONTENT */}
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            {CATEGORY_LABELS.map((item) => (
              <div key={item} className="mb-2">
                <button
                  className="w-full flex justify-between items-center py-3 px-2"
                  onClick={() => setMobileSub(mobileSub === item ? null : item)}
                >
                  <span className="text-base font-medium">{item}</span>
                  <ChevronDown size={20} className={mobileSub === item ? "rotate-180" : ""} />
                </button>

                {mobileSub === item && (
                  <div className="bg-white text-custom-blue rounded-xl p-4 mt-2 space-y-4">
                     {Object.entries(menuData[norm(item)]?.sections || {}).map(([title, items]) => (
                      <div key={title}>
                        <p className="font-lato font-bold text-starttext text-xs uppercase mb-2 tracking-widest">
                          {title}
                        </p>
                        <div className="flex flex-col gap-2">
                          {items.map((s, i) => (
                            <Link
                              key={i}
                              href={`/services/${s.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-sm font-lato font-bold py-1 hover:text-starttext transition-colors pl-1"
                            >
                               {s.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="mt-auto border-t border-white/10 bg-custom-blue p-4 space-y-2">
            <button
              onClick={() => {
                router.push("/blogs");
                setMobileOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="font-lato font-bold">Blogs</span>
            </button>

            <button
              onClick={() => {
                router.push("/user/about");
                setMobileOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="font-lato font-bold">About</span>
            </button>

            <button
              onClick={() => {
                router.push("/user/contact");
                setMobileOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="font-lato font-bold">Contact</span>
            </button>
            
            <button
              onClick={() => {
                logout.mutate();
                setMobileOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-1 rounded-lg text-red-300 hover:bg-red-500/10 transition-colors"
            >
              
              <span className="font-lato font-bold">Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </nav>
  );
};

export default MegaMenuNavbar;

