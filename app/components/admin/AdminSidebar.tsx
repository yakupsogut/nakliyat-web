"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import Image from 'next/image';

interface AdminUser {
  id: string;
  email: string;
  ad_soyad: string;
  role: 'admin' | 'editor';
}

interface AdminSidebarProps {
  user: AdminUser;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Teklifler", href: "/admin/teklifler", icon: DocumentTextIcon },
  { name: "Blog Yazıları", href: "/admin/blog", icon: ChatBubbleLeftIcon },
  { name: "SSS", href: "/admin/sss", icon: QuestionMarkCircleIcon },
  { name: "Referanslar", href: "/admin/referanslar", icon: UserGroupIcon },
  { name: "İstatistikler", href: "/admin/istatistikler", icon: ChartBarIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  // Admin olmayan kullanıcılar için kısıtlı menü
  const filteredNavigation = navigation.filter(item => {
    if (user.role === 'admin') return true;
    return !['referanslar', 'istatistikler'].some(
      restricted => item.href.includes(restricted)
    );
  });

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Image
              className="h-8 w-auto"
              src="/logo.png"
              alt="Nakliyat Pro"
              width={32}
              height={32}
            />
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
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