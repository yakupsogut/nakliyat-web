"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSettings, FiUsers, FiFileText, FiHelpCircle, FiImage, FiMenu, FiMessageSquare, FiBarChart2, FiGrid } from "react-icons/fi";

interface AdminUser {
  id: string;
  email: string;
  ad_soyad: string;
  role: 'admin' | 'editor';
}

interface Props {
  user: AdminUser;
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Site Ayarları",
      href: "/admin/site-ayarlari",
      icon: FiSettings,
      role: ['admin']
    },
    {
      name: "Menü Yönetimi",
      href: "/admin/menu",
      icon: FiMenu,
      role: ['admin']
    },
    {
      name: "Blog Yazıları",
      href: "/admin/blog",
      icon: FiFileText,
      role: ['admin', 'editor']
    },
    {
      name: "Sayfalar",
      href: "/admin/sayfalar",
      icon: FiGrid,
      role: ['admin', 'editor']
    },
    {
      name: "SSS",
      href: "/admin/sss",
      icon: FiHelpCircle,
      role: ['admin', 'editor']
    },
    {
      name: "Medya",
      href: "/admin/medya",
      icon: FiImage,
      role: ['admin', 'editor']
    },
    {
      name: "İletişim Mesajları",
      href: "/admin/iletisim",
      icon: FiMessageSquare,
      role: ['admin', 'editor']
    },
    {
      name: "İstatistikler",
      href: "/admin/istatistikler",
      icon: FiBarChart2,
      role: ['admin']
    },
    {
      name: "Kullanıcılar",
      href: "/admin/kullanicilar",
      icon: FiUsers,
      role: ['admin']
    }
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-gray-800 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {menuItems
              .filter(item => item.role.includes(user.role))
              .map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
          </nav>
        </div>
      </div>
    </div>
  );
} 