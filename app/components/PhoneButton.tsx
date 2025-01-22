'use client';

import { SiteAyarlari } from '@/lib/types';
import { useState, useEffect } from 'react';
import { FaPhone } from 'react-icons/fa';

interface PhoneButtonProps {
  siteAyarlari: SiteAyarlari;
}

export default function PhoneButton({ siteAyarlari }: PhoneButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Her 3 saniyede bir animasyonu tetikle
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!siteAyarlari?.telefon) return null;

  // Numarayı temizle (sadece rakamları al)
  const temizNumara = siteAyarlari.telefon.replace(/\D/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Dalgalanan efekt halkası */}
      <div className={`absolute inset-0 rounded-full bg-blue-500 opacity-30 transition-transform duration-1000 ${
        isAnimating ? 'scale-150 opacity-0' : 'scale-100'
      }`} />
      
      {/* Ana buton */}
      <a
        href={`tel:${temizNumara}`}
        className="relative flex items-center group"
        aria-label="Bizi arayın"
      >
        {/* Telefon ikonu ve metin */}
        <div className="flex items-center bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 group-hover:pr-32">
          <FaPhone className="h-6 w-6" />
          <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap font-medium">
            Bizi Arayın
          </span>
        </div>
      </a>
    </div>
  );
} 