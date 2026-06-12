
// "use client";

// import ProtectedRoute from "../components/route/ProtectedRoute";
// import TicketHeader from "../components/ticket/TicketHeader";

// export default function AdminLayout({ children }) {

//   return (
//     <ProtectedRoute roles={["employee"]}>
//       <div className="min-h-screen">
//       <TicketHeader />

//       <main className="">
//         {children}
//       </main>
//     </div>
//     </ProtectedRoute>
//   );
// }


"use client";

import ProtectedRoute from "../components/route/ProtectedRoute";
import TicketHeader from "../components/ticket/TicketHeader";

import { useAuth } from "../hooks/useAuth";

export default function AdminLayout({
  children,
}) {

  const { user } = useAuth();

  return (
    <ProtectedRoute roles={["employee"]}>
      <div className="min-h-screen bg-[#F8FBFF] md:pl-72 pb-20 md:pb-0">

        <TicketHeader
          name={
            user?.name || "Employee"
          }
          role={
            user?.role || "Employee"
          }
          code={
            user?.employee_id || ""
          }
        />

        <main>
          {children}
        </main>

      </div>
    </ProtectedRoute>
  );
}
