"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  CalendarCheck,
  FilePlus2,
  LogOut,
  ReceiptText,
  Ticket,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { useLogout } from "../../hooks/useEmployeeAuthMutations";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { label: "Transactions", href: "/admin/transaction", icon: ReceiptText },
  { label: "Ticket", href: "/admin/ticket", icon: Ticket },
  { label: "Employees", href: "/admin/employee", icon: UsersRound },
  { label: "New Employee", href: "/admin/new_emp", icon: UserPlus },
  { label: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { label: "Payroll", href: "/admin/payroll", icon: BriefcaseBusiness },
  { label: "Blogs", href: "/admin/status", icon: BookOpenText },
  { label: "Create Blog", href: "/admin/blog/create", icon: FilePlus2 },
  { label: "Services", href: "/admin/srv_form", icon: BriefcaseBusiness },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const { user, hydrated } = useSelector((state) => state.auth);
  const logout = useLogout("/");

  if (!hydrated || user?.role !== "admin") return null;

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-blue-900/20 bg-custom-blue text-white md:inset-y-0 md:left-0 md:right-auto md:w-72 md:border-r md:border-t-0">
      <div className="hidden items-center gap-3 border-b border-white/10 px-6 py-6 md:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <Image src="/assets/brief_white.png" alt="Briefcasse" width={30} height={30} />
        </div>
        <div>
          <h2 className="font-anton text-xl tracking-widest">BRIEFCASSE</h2>
          <p className="text-xs font-semibold text-white/60">Admin Console</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 py-2 md:block md:space-y-1 md:overflow-visible md:p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[84px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition md:min-w-0 md:flex-row md:gap-3 md:px-4 md:py-3 md:text-sm ${
                active
                  ? "bg-white text-custom-blue"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden p-4 md:absolute md:bottom-0 md:left-0 md:right-0 md:block">
        <div className="mb-3 rounded-2xl bg-white/10 p-4">
          <p className="text-sm font-bold">{user?.name || "Admin"}</p>
          <p className="text-xs text-white/60">{user?.email || "Admin"}</p>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
