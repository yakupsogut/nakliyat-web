"use client";

import { FaPhone, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { SiteAyarlari } from "@/lib/types";

interface TopbarProps {
  siteAyarlari: SiteAyarlari;
}

export default function Topbar({ siteAyarlari }: TopbarProps) {
  return (
    <div className="bg-blue-600 text-white py-1.5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Sol taraf - Telefon */}
          <div className="flex items-center space-x-2">
            <FaPhone className="h-3.5 w-3.5" />
            <a href={`tel:${siteAyarlari.telefon}`} className="text-xs hover:text-gray-200 font-medium">
              {siteAyarlari.telefon}
            </a>
          </div>

          {/* Sağ taraf - Sosyal Medya */}
          <div className="flex items-center space-x-4">
            {siteAyarlari.facebook_url && (
              <Link
                href={siteAyarlari.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors"
              >
                <FaFacebook className="h-3.5 w-3.5" />
              </Link>
            )}
            {siteAyarlari.instagram_url && (
              <Link
                href={siteAyarlari.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors"
              >
                <FaInstagram className="h-3.5 w-3.5" />
              </Link>
            )}
            {siteAyarlari.twitter_url && (
              <Link
                href={siteAyarlari.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors"
              >
                <FaTwitter className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 