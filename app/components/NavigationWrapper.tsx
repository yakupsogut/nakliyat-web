'use client';

import Navbar from './Navbar';
import Topbar from './Topbar';
import { MenuItem, SiteAyarlari, FooterMenuGroup } from '@/lib/types';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

interface NavigationWrapperProps {
  children: React.ReactNode;
  siteAyarlari: SiteAyarlari;
  menuItems: MenuItem[];
  footerMenuGroups: FooterMenuGroup[];
}

export default function NavigationWrapper({ children, siteAyarlari, menuItems, footerMenuGroups }: NavigationWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
   
        {siteAyarlari?.favicon_url && (
          <link rel="icon" href={siteAyarlari.favicon_url} />
        )}
      <div className="min-h-screen flex flex-col">
        <Topbar siteAyarlari={siteAyarlari} />
        <Navbar siteAyarlari={siteAyarlari} menuItems={menuItems} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer siteAyarlari={siteAyarlari} footerMenuGroups={footerMenuGroups} />
      </div>
    </>
  );
} 