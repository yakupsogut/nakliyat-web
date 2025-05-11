'use client';

import { SiteAyarlari } from '@/lib/types';
import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppButtonProps {
  siteAyarlari: SiteAyarlari;
}

export default function WhatsAppButton({ siteAyarlari }: WhatsAppButtonProps) {
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

  if (!siteAyarlari?.whatsapp_numara) return null;

  // Numarayı temizle (sadece rakamları al)
  const temizNumara = siteAyarlari.whatsapp_numara.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${temizNumara}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 left-6 z-50"
    >
      {/* Dalgalanan efekt halkası */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 rounded-full bg-green-500"
          />
        )}
      </AnimatePresence>
      
      {/* Ana buton */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="WhatsApp ile iletişime geç"
      >
        <motion.div
          className="flex items-center bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          animate={{
            paddingRight: isHovered ? '8rem' : '1rem',
          }}
          transition={{ duration: 0.3 }}
        >
          <FaWhatsapp className="h-6 w-6" />
          <motion.span
            className="absolute right-4 whitespace-nowrap font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -10,
            }}
            transition={{ duration: 0.2 }}
          >
            Bize Yazın
          </motion.span>
        </motion.div>
      </a>
    </motion.div>
  );
} 