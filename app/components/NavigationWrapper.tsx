'use client';

import { usePathname } from 'next/navigation';
import Topbar from "./Topbar";
import Navbar from "./Navbar";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPanel = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminPanel && (
        <div className="fixed w-full top-0 z-50">
          <Topbar />
          <Navbar />
        </div>
      )}
      <div className={!isAdminPanel ? "pt-[105px]" : ""}>
        {children}
      </div>
    </>
  );
} 