import { getHizmetById } from '@/lib/db';
import type { Hizmet } from '@/lib/types';
import { convertSupabaseImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from "next";
import JsonLd from '@/app/components/JsonLd';
import { createServerClient } from '@/lib/supabase';

// Sayfa seviyesinde önbellekleme süresi (15 dakika)
export const revalidate = 180;

// Dinamik route'lar için önbellekleme davranışı
export const dynamic = 'force-static';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const hizmet = await getHizmetById(Number(id));
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();
  
  if (!hizmet) {
    return {
      title: `Hizmet Bulunamadı | ${siteSettings?.site_title}`,
      description: 'Aradığınız hizmet mevcut değil veya kaldırılmış olabilir.'
    };
  }

  // Açıklamayı 150-160 karakter ile sınırla
  const metaDescription =
    (hizmet.aciklama?.length > 155 ? `${hizmet.aciklama.substring(0, 155)}...` : hizmet.aciklama);

  return {
    title: `${hizmet.baslik} | ${siteSettings?.site_title}`,
    description: metaDescription,
    keywords: hizmet.ozellikler?.join(', ') || '',
    openGraph: {
      title: `${hizmet.baslik} | ${siteSettings?.site_title}`,
      description: metaDescription,
      type: 'website',
      images: hizmet.resim_url ? [{ url: hizmet.resim_url }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hizmet.baslik} | ${siteSettings?.site_title}`,
      description: metaDescription,
      images: hizmet.resim_url ? [hizmet.resim_url] : undefined
    }
  };
}

export default async function HizmetDetay({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hizmet: Hizmet | null = await getHizmetById(Number(id));

  // Site ayarlarını al
  const supabase = createServerClient();
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (!hizmet) {
    return (
      <main className="min-h-screen bg-white">
        <div className="py-5 sm:py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Hizmet bulunamadı
              </h1>
              <p className="mt-4 text-gray-600">
                Aradığınız hizmet mevcut değil veya kaldırılmış olabilir.
              </p>
              <div className="mt-8">
                <Link
                  href="/hizmetler"
                  className="text-blue-500 hover:text-blue-600"
                >
                  ← Hizmetler sayfasına dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: hizmet.baslik,
    description: hizmet.aciklama,
    provider: {
      '@type': 'Organization',
      name: siteSettings?.site_title,
      url: siteSettings?.canonical_url_base,
      logo: siteSettings?.logo_url
    },
    areaServed: 'TR',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Nakliyat Hizmetleri',
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: hizmet.baslik,
          description: hizmet.aciklama
        }
      }]
    }
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <main className="min-h-screen bg-white">
        {/* Hero Section - Grid pattern olmadan */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-24">
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/hizmetler"
                className="inline-flex items-center text-blue-100 hover:text-white mb-8 group"
              >
                <svg 
                  className="mr-2 h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="2" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Hizmetler
              </Link>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {hizmet.baslik}
              </h1>
              
              <p className="mt-6 text-lg text-blue-100 leading-8">
                {hizmet.aciklama}
              </p>
            </div>
          </div>
        </div>

        {/* Resim Section */}
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              {hizmet.resim_url && (
                <div className="-mt-32 relative z-10">
                  <Image
                    src={convertSupabaseImageUrl(hizmet.resim_url, 'hizmet-images')}
                    alt={`${hizmet.baslik} - Detaylı hizmet bilgileri ve özellikleri`}
                    width={1200}
                    height={675}
                    className="w-full rounded-2xl object-cover shadow-xl"
                  />
                </div>
              )}

              {hizmet.ozellikler && (
                <div className="mt-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Hizmet Özellikleri
                  </h2>
                  <p className="text-gray-500 mb-8">
                    Size sunduğumuz profesyonel hizmetin detayları
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hizmet.ozellikler.map((ozellik: string, index: number) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:border-yellow-500 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500 text-gray-900 group-hover:scale-110 transition-transform duration-300">
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-lg font-medium text-gray-700 group-hover:text-yellow-600 transition-colors duration-300">
                              {ozellik}
                            </p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-yellow-500 group-hover:w-full transition-all duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-16 rounded-2xl bg-gray-50 p-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Fiyat Teklifi Alın
                </h2>
                <p className="mt-4 text-gray-600">
                  Bu hizmet hakkında detaylı bilgi ve fiyat teklifi almak için hemen bizimle iletişime geçin.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/teklif-al"
                    className="rounded-lg bg-yellow-500 px-8 py-4 text-base font-semibold text-gray-900 shadow-sm hover:bg-yellow-600 transition-colors duration-200"
                  >
                    Ücretsiz Teklif Al
                  </Link>
                  <Link
                    href="/iletisim"
                    className="rounded-lg bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-yellow-500 hover:bg-yellow-50 transition-colors duration-200"
                  >
                    Bize Ulaşın
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 