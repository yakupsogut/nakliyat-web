"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from 'react-icons';
import { FiSettings, FiFileText, FiHelpCircle, FiMessageSquare, FiBarChart2, FiGrid, FiStar, FiSend, FiTruck, FiMenu, FiList, FiHome, FiPackage, FiX, FiLogOut, FiImage, FiLayout } from "react-icons/fi";
import Image from "next/image";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

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
  onClick?: () => void;
}

interface Props {
  user: AdminUser;
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

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
      name: "Özellikler",
      href: "/admin/features",
      icon: FiPackage,
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
      name: "Galeri",
      href: "/admin/galeri",
      icon: FiImage,
      role: ['admin', 'editor']
    },
    {
      name: "Hero Slider",
      href: "/admin/hero",
      icon: FiLayout,
      role: ['admin', 'editor']
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
    },
    {
      type: "divider"
    },
    {
      name: "Çıkış Yap",
      icon: FiLogOut,
      role: ['admin', 'editor'],
      onClick: handleSignOut
    }
  ];

  const renderMenuItems = () => (
    <nav className="flex-1 px-2 pb-4 space-y-1">
      {menuItems
        .filter(item => item.role?.includes(user.role) || item.type === "divider")
        .map((item, index) => {
          if (item.type === "divider") {
            return <div key={`divider-${index}`} className="my-2 border-t border-gray-700" />;
          }

          const isActive = item.href === "/admin" 
            ? pathname === "/admin"
            : item.href ? pathname?.startsWith(item.href) : false;

          const Icon = item.icon!;

          const itemContent = (
            <>
              <Icon
                className={`mr-3 flex-shrink-0 h-6 w-6 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </>
          );

          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  item.onClick?.();
                }}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white`}
              >
                {itemContent}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {itemContent}
            </Link>
          );
        })}
    </nav>
  );

  return (
    <>
      {/* Mobil Menü Butonu */}
      <div className="fixed top-0 left-0 z-40 w-full bg-gray-800 md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 pt-16">
            <div className="h-full flex flex-col">
              {renderMenuItems()}
            </div>
          </div>
        </div>
      )}

      {/* Masaüstü Menü */}
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
            {renderMenuItems()}
          </div>
        </div>
      </div>
    </>
  );
} 