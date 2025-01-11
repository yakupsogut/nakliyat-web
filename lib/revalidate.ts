// Sık kullanılan sayfalar için hazır fonksiyonlar
export const COMMON_PAGES = {
  HOME: '/',
  BLOG: '/blog',
  SERVICES: '/hizmetler',
  CONTACT: '/iletisim',
  REFERENCES: '/referanslar',
  ABOUT: '/hakkimizda',
  FAQ: '/sss',
  STATS: '/istatistikler'
} as const;

// Tüm olası sayfa yolları için tip tanımı
type PagePaths = 
  | typeof COMMON_PAGES[keyof typeof COMMON_PAGES] 
  | `${typeof COMMON_PAGES.BLOG}/${string}` 
  | `${typeof COMMON_PAGES.SERVICES}/${string}`
  | `/${string}`; // Dinamik sayfalar için

export async function revalidatePage(path: PagePaths) {
  try {
    const response = await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, {
      method: 'POST',
      headers: {
        'x-revalidate-token': process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Revalidation hatası');
    }

    const result = await response.json();
    console.log('Revalidation sonucu:', result);
    return result;
  } catch (error) {
    console.error('Revalidation hatası:', error);
    throw error;
  }
}

// Çoklu sayfa yenileme
export async function revalidateMultiplePages(paths: PagePaths[]) {
  return Promise.all(paths.map(path => revalidatePage(path)));
}

// Site ayarları güncellendiğinde
export async function revalidateAfterSettingsUpdate() {
  return revalidateMultiplePages([
    COMMON_PAGES.HOME,
    COMMON_PAGES.CONTACT,
    COMMON_PAGES.ABOUT
  ]);
}

// Blog yazısı güncellendiğinde
export async function revalidateAfterBlogUpdate(slug?: string) {
  const paths: PagePaths[] = [COMMON_PAGES.BLOG];
  if (slug) paths.push(`${COMMON_PAGES.BLOG}/${slug}`);
  return revalidateMultiplePages(paths);
}

// Hizmet güncellendiğinde
export async function revalidateAfterServiceUpdate(id?: string) {
  const paths: PagePaths[] = [COMMON_PAGES.SERVICES, COMMON_PAGES.HOME];
  if (id) paths.push(`${COMMON_PAGES.SERVICES}/${id}`);
  return revalidateMultiplePages(paths);
}

// Referans güncellendiğinde
export async function revalidateAfterReferenceUpdate() {
  return revalidateMultiplePages([
    COMMON_PAGES.REFERENCES,
    COMMON_PAGES.HOME
  ]);
}

// İstatistik güncellendiğinde
export async function revalidateAfterStatsUpdate() {
  return revalidateMultiplePages([
    COMMON_PAGES.STATS,
    COMMON_PAGES.HOME
  ]);
}

// Tüm sayfaları yeniden oluştur
export async function revalidateAllPages() {
  try {
    const response = await fetch('/api/revalidate-all', {
      method: 'POST',
      headers: {
        'x-revalidate-token': process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Tüm sayfaları yenileme hatası');
    }

    const result = await response.json();
    console.log('Tüm sayfaları yenileme sonucu:', result);
    return result;
  } catch (error) {
    console.error('Tüm sayfaları yenileme hatası:', error);
    throw error;
  }
} 