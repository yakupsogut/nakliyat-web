import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "./components/NavigationWrapper";
import { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NakliyatPro - Evden Eve Nakliyat",
  description: "Profesyonel evden eve nakliyat hizmetleri",
  icons: {
    icon: {
      url: '/icon.svg',
      type: 'image/svg+xml',
    },
  },};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: siteAyarlari } = await supabase
    .from('site_ayarlari')
    .select('*')
    .single();

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('aktif', true)
    .order('sira', { ascending: true });

  return (
    <html lang="tr">
      <body className={inter.className}>
        <NavigationWrapper siteAyarlari={siteAyarlari} menuItems={menuItems || []}>
          {children}
        </NavigationWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
