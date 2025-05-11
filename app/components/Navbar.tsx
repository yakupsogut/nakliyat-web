'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaTruck } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuItem, SiteAyarlari } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  menuItems: MenuItem[];
  siteAyarlari: SiteAyarlari;
}

export default function Navbar({ menuItems, siteAyarlari }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const LogoElement = () => (
    <div className="flex items-center gap-2">
      {siteAyarlari.logo_url ? (
        <Image
          src={siteAyarlari.logo_url}
          alt={`${siteAyarlari.logo_text} logosu`}
          width={150}
          height={40}
          className="h-10 w-auto"
          priority
        />
      ) : (
        <>
          <div className="bg-yellow-500 p-2 rounded-lg">
            <FaTruck className="h-5 w-5 text-gray-900" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            {siteAyarlari.logo_text || 'NakliyatPro'}
          </span>
        </>
      )}
    </div>
  );

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white'
    }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-6" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link 
            href="/" 
            className="group transition-transform hover:scale-105" 
            aria-label="Ana Sayfaya Git"
          >
            <LogoElement />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Menüyü aç</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-1 items-center">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className={`relative text-sm font-medium leading-6 transition-colors px-2.5 py-2 rounded-lg ${
                pathname === item.link 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-50'
              }`}
            >
              {item.baslik}
              {pathname === item.link && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-full"
                  layoutId="navbar-underline"
                />
              )}
            </Link>
          ))}

          {/* Teklif Al Butonu */}
          <Link
            href="/teklif-al"
            className="flex items-center gap-1.5 ml-3 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 transition-all duration-300 hover:scale-105"
          >
            <span>Ücretsiz Teklif Al</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <Dialog
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
            <Dialog.Panel
              as={motion.div}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <LogoElement />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-lg p-2.5 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Menüyü kapat</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-200">
                  <div className="space-y-1 py-6">
                    {menuItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.link}
                        className={`block rounded-lg px-3 py-2 text-base font-medium leading-7 ${
                          pathname === item.link
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.baslik}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <Link
                      href="/teklif-al"
                      className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-base font-medium text-gray-900 shadow-sm hover:bg-yellow-600 hover:scale-105 transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Ücretsiz Teklif Al</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        )}
      </AnimatePresence>
    </header>
  );
} 