'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Topbar from './Topbar';
import { MenuItem, SiteAyarlari } from '@/lib/types';

interface NavigationWrapperProps {
  children: React.ReactNode;
  siteAyarlari: SiteAyarlari;
  menuItems: MenuItem[];
}

export default function NavigationWrapper({ children, siteAyarlari, menuItems }: NavigationWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Topbar siteAyarlari={siteAyarlari} />
      <Navbar menuItems={menuItems} siteAyarlari={siteAyarlari} />
      {children}
    </>
  );
} 