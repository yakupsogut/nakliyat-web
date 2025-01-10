import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "./components/NavigationWrapper";
import { Toaster } from "react-hot-toast";
import { createServerClient } from "@/lib/supabase";
import type { FooterMenuGroup, FooterMenuItem, SiteAyarlari } from "@/lib/types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NakliyatPro - Evden Eve Nakliyat",
  description: "Profesyonel evden eve nakliyat hizmetleri",
  icons: {
    icon: {
      url: '/icon.svg',
      type: 'image/svg+xml',
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const { data: siteAyarlari } = await supabase
    .from('site_ayarlari')
    .select('*')
    .single();

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('aktif', true)
    .order('sira', { ascending: true });

  const { data: footerMenuGroups } = await supabase
    .from('footer_menu_groups')
    .select(`
      *,
      menu_items:footer_menu_items(*)
    `)
    .eq('aktif', true)
    .order('sira', { ascending: true });

  const processedFooterGroups = (footerMenuGroups || []).map((group) => ({
    ...group,
    menu_items: (group.menu_items || [])
      .filter((item: FooterMenuItem) => item.aktif)
      .sort((a: FooterMenuItem, b: FooterMenuItem) => a.sira - b.sira)
  })) as FooterMenuGroup[];

  // Varsayılan site ayarları
  const defaultSiteAyarlari: SiteAyarlari = {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    telefon: '',
    email: '',
    facebook_url: null,
    instagram_url: null,
    twitter_url: null,
    logo_url: null,
    logo_text: 'NakliyatPro',
    whatsapp_numara: null,
    adres: null
  };

  return (
    <html lang="tr">
      <body className={inter.className}>
        <NavigationWrapper 
          siteAyarlari={siteAyarlari || defaultSiteAyarlari} 
          menuItems={menuItems || []}
          footerMenuGroups={processedFooterGroups}
        >
          {children}
        </NavigationWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
