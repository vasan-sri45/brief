import AdminNavbar from "../navbar/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <main>{children}</main>
    </>
  );
}
