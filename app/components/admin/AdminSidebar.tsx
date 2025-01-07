"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftIcon,
  CogIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Teklifler", href: "/admin/teklifler", icon: DocumentTextIcon },
  { name: "Mesajlar", href: "/admin/mesajlar", icon: ChatBubbleLeftIcon },
  { name: "Blog", href: "/admin/blog", icon: NewspaperIcon },
  { name: "SSS", href: "/admin/sss", icon: QuestionMarkCircleIcon },
  { name: "Referanslar", href: "/admin/referanslar", icon: PhotoIcon },
  { name: "Kullanıcılar", href: "/admin/kullanicilar", icon: UserGroupIcon },
  { name: "Ayarlar", href: "/admin/ayarlar", icon: CogIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-col md:w-72 bg-gray-900">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-5">
          <h1 className="text-2xl font-bold text-white">Nakliyat Admin</h1>
        </div>
        <nav className="mt-5 flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? "bg-gray-800 text-white border-blue-500"
                    : "border-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-all duration-200`}
              >
                <item.icon
                  className={`${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  } mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-gray-400">admin@nakliyat.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 