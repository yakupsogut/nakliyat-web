'use client';

import { SiteAyarlari } from '@/lib/types';
import { useState, useEffect } from 'react';
import { FaPhone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface PhoneButtonProps {
  siteAyarlari: SiteAyarlari;
}

export default function PhoneButton({ siteAyarlari }: PhoneButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Dalgalanan efekt halkası */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 rounded-full bg-blue-500"
          />
        )}
      </AnimatePresence>
      
      {/* Ana buton */}
      <a
        href={`tel:${temizNumara}`}
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Bizi arayın"
      >
        <motion.div
          className="flex items-center bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          animate={{
            paddingRight: isHovered ? '8rem' : '1rem',
          }}
          transition={{ duration: 0.3 }}
        >
          <FaPhone className="h-6 w-6" />
          <motion.span
            className="absolute right-4 whitespace-nowrap font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -10,
            }}
            transition={{ duration: 0.2 }}
          >
            Bizi Arayın
          </motion.span>
        </motion.div>
      </a>
    </motion.div>
  );
} 