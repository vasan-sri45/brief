"use client";

import ProtectedRoute from "../components/route/ProtectedRoute";
import AdminNavbar from "../components/navbar/AdminNavbar";

export default function AdminLayout({ children }) {

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="pt-6 px-6">
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
}
