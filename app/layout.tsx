import './globals.css';
import { createServerClient } from '@/lib/supabase';
import { generateMetadata as generateSeoMetadata } from './components/SeoMeta';
import NavigationWrapper from './components/NavigationWrapper';
import { Analytics } from '@/app/components/Analytics';
import type { FooterMenuGroup, FooterMenuItem, SiteAyarlari } from '@/lib/types';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter',
});

// Tüm sayfalar için önbellekleme süresi (3 saat)
export const revalidate = 10800;

// Tüm sayfalar için önbellekleme davranışı
export const dynamic = 'force-static';

export async function generateMetadata() {
  const supabase = createServerClient();
  
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (!settings) {
    return {};
  }

  return generateSeoMetadata({ siteSettings: settings });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  
  // Site ayarlarını al
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  // Genel ayarları al
  const { data: generalSettings } = await supabase
    .from('site_ayarlari')
    .select('*')
    .single();

  // Menü öğelerini al
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('aktif', true)
    .order('sira', { ascending: true });

  // Footer menü gruplarını al
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
  const defaultSettings: Partial<SiteAyarlari> = {
    logo_text: 'Site Başlığı',
    site_title: 'Site Başlığı',
    robots_content: 'User-agent: *\nAllow: /',
    sitemap_auto_update: true,
    sitemap_default_priority: 0.5,
    sitemap_default_changefreq: 'weekly',
    twitter_card_type: 'summary_large_image',
  };

  // Tüm ayarları birleştir
  const combinedSettings: SiteAyarlari = {
    ...defaultSettings,
    ...generalSettings,
    ...siteSettings,
  } as SiteAyarlari;

  return (
    <html lang="tr" className={inter.variable}>
      
      <body>
        <NavigationWrapper
          siteAyarlari={combinedSettings}
          menuItems={menuItems || []}
          footerMenuGroups={processedFooterGroups}
        >
          {children}
        </NavigationWrapper>
        {combinedSettings?.google_analytics_id && (
          <Analytics measurementId={combinedSettings.google_analytics_id} />
        )}
      </body>
    </html>
  );
}
