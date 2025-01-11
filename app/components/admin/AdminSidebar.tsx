"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from 'react-icons';
import { FiSettings, FiFileText, FiHelpCircle, FiMessageSquare, FiBarChart2, FiGrid, FiStar, FiSend, FiTruck, FiMenu, FiList, FiHome } from "react-icons/fi";
import Image from "next/image";

interface AdminUser {
  id: string;
  email: string;
  ad_soyad: string;
  role: 'admin' | 'editor';
}

interface MenuItem {
  name?: string;
  href?: string;
  icon?: IconType;
  role?: ('admin' | 'editor')[];
  type?: 'divider';
}

interface Props {
  user: AdminUser;
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: FiHome,
      role: ['admin', 'editor']
    },
    {
      name: "Hizmetler",
      href: "/admin/hizmetler",
      icon: FiTruck,
      role: ['admin', 'editor']
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
      name: "Referanslar",
      href: "/admin/referanslar",
      icon: FiStar,
      role: ['admin', 'editor']
    },
    {
      name: "İletişim Mesajları",
      href: "/admin/iletisim",
      icon: FiMessageSquare,
      role: ['admin', 'editor']
    },
    {
      name: "Teklifler",
      href: "/admin/teklifler",
      icon: FiSend,
      role: ['admin']
    },
    {
      name: "İstatistikler",
      href: "/admin/istatistikler",
      icon: FiBarChart2,
      role: ['admin']
    },
    {
      type: "divider"
    },
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
      name: "Footer Menü",
      href: "/admin/footer-menu",
      icon: FiList,
      role: ['admin']
    },
    {
      name: "Telegram Ayarları",
      href: "/admin/telegram-ayarlari",
      icon: FiSettings,
      role: ['admin']
    }
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-gray-800 overflow-y-auto">
        <div className="flex items-center justify-center flex-shrink-0 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/icon.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold text-white">NakliyatPro</span>
          </Link>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {menuItems
              .filter(item => item.role?.includes(user.role) || item.type === "divider")
              .map((item, index) => {
                if (item.type === "divider") {
                  return <div key={`divider-${index}`} className="my-2 border-t border-gray-700" />;
                }

                const isActive = pathname?.startsWith(item.href!);
                const Icon = item.icon!;

                return (
                  <Link
                    key={item.name}
                    href={item.href!}
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