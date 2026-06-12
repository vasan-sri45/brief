"use client";

import ProtectedRoute from "../components/route/ProtectedRoute";
import AdminNavbar from "../components/navbar/AdminNavbar";

export default function AdminLayout({ children }) {

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="min-h-screen bg-gray-50 md:pl-72 pb-20 md:pb-0">
      <AdminNavbar />

      <main className="px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
}
