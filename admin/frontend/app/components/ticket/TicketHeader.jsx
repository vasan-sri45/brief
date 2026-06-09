"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Grid2X2,
  LogOut,
  ReceiptText,
  Ticket,
  UserRound,
} from "lucide-react";
import { useLogout } from "../../hooks/useEmployeeAuthMutations";

const employeeNav = [
  { label: "Dashboard", href: "/employee/dashboard", icon: Grid2X2 },
  { label: "Attendance", href: "/employee/attendance", icon: CalendarCheck },
  { label: "Payslip", href: "/employee/payslip", icon: ReceiptText },
  { label: "Ticket", href: "/employee/ticket", icon: Ticket },
  { label: "Profile", href: "/employee/profile", icon: UserRound },
];

const TicketHeader = ({ name, role, code }) => {
  const pathname = usePathname();
  const logout = useLogout("/");

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-blue-100 bg-white md:inset-y-0 md:left-0 md:right-auto md:w-72 md:border-r md:border-t-0">
      <div className="hidden items-center gap-3 border-b border-gray-100 px-6 py-6 md:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-custom-blue">
          <Image src="/assets/brief_white.png" alt="Briefcasse" width={30} height={30} />
        </div>
        <div>
          <h2 className="font-anton text-xl tracking-widest text-custom-blue">BRIEFCASSE</h2>
          <p className="text-xs font-semibold text-gray-500">Employee Portal</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 py-2 md:block md:space-y-1 md:overflow-visible md:p-4">
        {employeeNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[82px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition md:min-w-0 md:flex-row md:gap-3 md:px-4 md:py-3 md:text-sm ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => logout.mutate()}
          className="flex min-w-[82px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 md:hidden"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      <div className="hidden p-4 md:absolute md:bottom-0 md:left-0 md:right-0 md:block">
        <div className="mb-3 rounded-2xl bg-blue-50 p-4">
          <p className="font-bold capitalize text-[#0F172A]">{name || "Employee"}</p>
          <p className="text-xs font-semibold capitalize text-gray-500">
            {role || "Employee"} {code ? `• ${code}` : ""}
          </p>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default TicketHeader;
