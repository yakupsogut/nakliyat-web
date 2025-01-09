import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavigationWrapper from "./components/NavigationWrapper";

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
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
      </body>
    </html>
  );
}
