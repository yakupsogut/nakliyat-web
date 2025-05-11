"use client";

import { FaPhone, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { SiteAyarlari } from "@/lib/types";

interface TopbarProps {
  siteAyarlari: SiteAyarlari;
}

export default function Topbar({ siteAyarlari }: TopbarProps) {
  return (
    <div className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex flex-row flex-wrap justify-between items-center gap-2">
          {/* İletişim Bilgileri */}
          <div className="flex items-center gap-2.5 sm:gap-3 order-1">
            {siteAyarlari.telefon && (
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 rounded-full transition-all hover:bg-white/20">
                <FaPhone className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                <a href={`tel:${siteAyarlari.telefon}`} className="text-xs sm:text-sm hover:text-yellow-500 font-medium whitespace-nowrap" aria-label={`Bizi arayın: ${siteAyarlari.telefon}`}>
                  {siteAyarlari.telefon}
                </a>
              </div>
            )}
            {siteAyarlari.telefon_2 && (
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 rounded-full transition-all hover:bg-white/20">
                <FaPhone className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                <a href={`tel:${siteAyarlari.telefon_2}`} className="text-xs sm:text-sm hover:text-yellow-500 font-medium whitespace-nowrap" aria-label={`Alternatif telefon: ${siteAyarlari.telefon_2}`}>
                  {siteAyarlari.telefon_2}
                </a>
              </div>
            )}
          </div>

          {/* Sosyal Medya */}
          <div className="flex items-center gap-2 sm:gap-2.5 order-2">
            {siteAyarlari.facebook_url && (
              <Link
                href={siteAyarlari.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 hover:text-yellow-500 transition-all"
                aria-label="Facebook sayfamızı ziyaret edin"
              >
                <FaFacebook className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                <span className="sr-only">Facebook</span>
              </Link>
            )}
            {siteAyarlari.instagram_url && (
              <Link
                href={siteAyarlari.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 hover:text-yellow-500 transition-all"
                aria-label="Instagram sayfamızı ziyaret edin"
              >
                <FaInstagram className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                <span className="sr-only">Instagram</span>
              </Link>
            )}
            {siteAyarlari.twitter_url && (
              <Link
                href={siteAyarlari.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 hover:text-yellow-500 transition-all"
                aria-label="Twitter sayfamızı ziyaret edin"
              >
                <FaTwitter className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                <span className="sr-only">Twitter</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 