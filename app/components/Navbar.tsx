'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuItem, SiteAyarlari } from '@/lib/types';

interface NavbarProps {
  menuItems: MenuItem[];
  siteAyarlari: SiteAyarlari;
}

export default function Navbar({ menuItems, siteAyarlari }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const LogoElement = () => (
    <div className="flex items-center gap-2">
      {siteAyarlari.logo_url && (
        <Image
          src={siteAyarlari.logo_url}
          alt={`${siteAyarlari.logo_text} logosu`}
          width={150}
          height={40}
          className="h-10 w-auto"
          priority
        />
      )}
      {siteAyarlari.logo_text && (
        <span className="text-2xl font-bold text-blue-600">{siteAyarlari.logo_text}</span>
      )}
    </div>
  );

  return (
    <header className="bg-white shadow-sm w-full z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Ana Navigasyon">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5" aria-label="Ana Sayfaya Git">
            <LogoElement />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Ana menüyü aç"
          >
            <span className="sr-only">Ana menüyü aç</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <ul className="flex gap-x-12" role="list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className={`text-sm font-semibold leading-6 ${
                    pathname === item.link ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
                  }`}
                  aria-current={pathname === item.link ? 'page' : undefined}
                >
                  {item.baslik}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/teklif-al"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label="Ücretsiz Teklif Al"
          >
            Ücretsiz Teklif Al
          </Link>
        </div>
      </nav>
      <Dialog 
        as="div" 
        className="lg:hidden" 
        open={mobileMenuOpen} 
        onClose={setMobileMenuOpen}
        id="mobile-menu"
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" aria-label="Ana Sayfaya Git">
              <LogoElement />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Menüyü kapat"
            >
              <span className="sr-only">Menüyü kapat</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-6 flow-root" aria-label="Mobil Navigasyon">
            <ul className="-my-6 divide-y divide-gray-500/10" role="list">
              <li className="space-y-2 py-6">
                <ul role="list" className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.link}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                          pathname === item.link ? 'text-blue-600 bg-gray-50' : 'text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-current={pathname === item.link ? 'page' : undefined}
                      >
                        {item.baslik}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="py-6">
                <Link
                  href="/teklif-al"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-blue-600 hover:bg-blue-500 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Ücretsiz Teklif Al"
                >
                  Ücretsiz Teklif Al
                </Link>
              </li>
            </ul>
          </nav>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
} 