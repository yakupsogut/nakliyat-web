"use client";

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string;
  email: string;
  ad_soyad: string;
  role: 'admin' | 'editor';
}

interface AdminHeaderProps {
  user: AdminUser;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin-giris');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-gray-800 border-b border-gray-700">
      <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          <Menu as="div" className="relative ml-3">
            <Menu.Button className="flex items-center text-gray-300 hover:text-white">
              <span className="hidden md:block mr-2 text-gray-300">{user.ad_soyad}</span>
              <UserCircleIcon className="h-8 w-8" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-gray-600' : ''
                      } block w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white`}
                    >
                      Çıkış Yap
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
} 