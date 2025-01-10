import { getHizmetById } from '@/lib/db';
import type { Hizmet } from '@/lib/types';
import { convertSupabaseImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from "next";
import JsonLd from '@/app/components/JsonLd';
import { createServerClient } from '@/lib/supabase';

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
                  className="text-blue-600 hover:text-blue-500"
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

        <div className="py-5 sm:py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/hizmetler"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-8"
              >
                ← Hizmetler
              </Link>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {hizmet.baslik}
              </h1>

              {hizmet.resim_url && (
                <div className="mt-8">
                  <Image
                    src={convertSupabaseImageUrl(hizmet.resim_url, 'hizmet-images')}
                    alt={`${hizmet.baslik} - Detaylı hizmet bilgileri ve özellikleri`}
                    width={1200}
                    height={675}
                    className="w-full rounded-2xl object-cover shadow-lg"
                  />
                </div>
              )}

              <div className="mt-8 prose prose-lg prose-blue max-w-none">
                <p className="text-xl text-gray-600 leading-8">
                  {hizmet.aciklama}
                </p>

                {hizmet.ozellikler && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Hizmet Özellikleri
                    </h2>
                    <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {hizmet.ozellikler.map((ozellik: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <svg
                            className="h-5 w-5 flex-none text-blue-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-3">{ozellik}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Fiyat Teklifi Alın
                  </h2>
                  <p className="mt-4 text-gray-600">
                    Bu hizmet hakkında detaylı bilgi ve fiyat teklifi almak için hemen bizimle iletişime geçin.
                  </p>
                  <div className="mt-8 flex gap-x-6">
                    <Link
                      href="/teklif-al"
                      className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Ücretsiz Teklif Al
                    </Link>
                    <Link
                      href="/iletisim"
                      className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-gray-50"
                    >
                      Bize Ulaşın
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
} 