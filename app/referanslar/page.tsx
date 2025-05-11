import { getReferanslar } from '@/lib/db';
import { createServerClient } from '@/lib/supabase';
import JsonLd from '@/app/components/JsonLd';
import { StarIcon } from '@heroicons/react/20/solid';
import { Metadata } from 'next';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: `Referanslarımız | ${siteSettings?.site_title}`,
    description: 'Müşterilerimizin memnuniyeti ve başarılı projelerimiz. Güvenilir nakliyat hizmetlerimiz hakkında müşteri yorumları ve deneyimleri.',
    openGraph: {
      title: `Referanslarımız | ${siteSettings?.site_title}`,
      description: 'Müşterilerimizin memnuniyeti ve başarılı projelerimiz.',
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: `Referanslarımız | ${siteSettings?.site_title}`,
      description: 'Müşterilerimizin memnuniyeti ve başarılı projelerimiz.'
    }
  };
}

export default async function ReferanslarPage() {
  const supabase = createServerClient();
  const referanslar = await getReferanslar();

  // Site ayarlarını al
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  const referenceListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Referanslarımız',
    description: 'Güvenle çalıştığımız kurumsal müşterilerimiz ve başarılı projelerimiz',
    url: `${siteSettings?.canonical_url_base}/referanslar`,
    itemListElement: referanslar?.map((referans, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: referans.musteri_adi,
        description: referans.yorum
      }
    }))
  };

  return (
    <>
      <JsonLd data={referenceListSchema} />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="relative isolate overflow-hidden">
          {/* Dekoratif arka plan deseni */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M0 32V.5H32" fill="none" stroke="currentColor"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"></rect>
            </svg>
          </div>

          <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
                  Müşteri Referanslarımız
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Müşterilerimizin memnuniyeti bizim için en önemli başarı göstergesidir. İşte bazı müşterilerimizin deneyimleri...
                </p>
              </div>

              <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {referanslar.map((referans) => (
                  <article
                    key={referans.id}
                    className="flex flex-col bg-white p-8 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center gap-x-4 text-xs">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              referans.puan > rating ? 'text-yellow-400' : 'text-gray-200',
                              'h-6 w-6 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <time className="text-gray-500">
                        {new Date(referans.created_at || '').toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    <div className="mt-6 flex flex-1 flex-col">
                      <p className="flex-1 text-base leading-7 text-gray-600">
                        {referans.yorum}
                      </p>
                      <div className="mt-8 border-t border-gray-900/5 pt-6">
                        <h3 className="font-semibold text-gray-900">
                          {referans.musteri_adi}
                        </h3>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-16 text-center">
                <p className="text-lg text-gray-600">
                  Siz de memnun kaldığınız hizmetlerimiz hakkında görüşlerinizi bizimle paylaşabilirsiniz.
                </p>
                <Link
                  href="/iletisim"
                  className="mt-6 inline-block rounded-md bg-yellow-500 px-6 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 transition-all duration-300"
                >
                  Görüş Bildir
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 