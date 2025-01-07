"use client";

import AdminHeader from "@/app/components/admin/AdminHeader";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  email: string;
  ad_soyad: string;
  role: 'admin' | 'editor';
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        router.push('/admin-giris');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError || !userData) {
        await supabase.auth.signOut();
        router.push('/admin-giris');
        return;
      }

      setAdminUser(userData as AdminUser);
    };

    getUser();
  }, [router]);

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminSidebar user={adminUser} />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <AdminHeader user={adminUser} />
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-gray-100 min-h-[calc(100vh-12rem)]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 