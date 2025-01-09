import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NakliyatPro - Profesyonel Nakliyat Yönetimi',
  description: 'Profesyonel nakliyat hizmetleri ve yönetim sistemi',
  icons: {
    icon: {
      url: '/icon.svg',
      type: 'image/svg+xml',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <div className="fixed w-full top-0 z-50">
          <Topbar />
          <Navbar />
        </div>
        <div className="pt-[105px]">
          {children}
        </div>
      </body>
    </html>
  );
}
