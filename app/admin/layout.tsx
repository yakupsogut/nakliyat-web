import { Metadata } from "next";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "Admin Panel - Nakliyat",
  description: "Nakliyat Admin Paneli",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-gray-100">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 