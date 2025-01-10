import { getAktifHizmetler } from '@/lib/db';
import { convertSupabaseImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase';
import JsonLd from '@/app/components/JsonLd';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: `Hizmetlerimiz | ${siteSettings?.site_title}`,
    description: 'Profesyonel nakliyat ve taşımacılık hizmetlerimiz: Evden eve nakliyat, ofis taşıma, şehirler arası nakliyat, depolama ve paketleme hizmetleri.',
    openGraph: {
      title: `Hizmetlerimiz | ${siteSettings?.site_title}`,
      description: 'Profesyonel nakliyat ve taşımacılık hizmetlerimiz hakkında detaylı bilgi alın.',
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: `Hizmetlerimiz | ${siteSettings?.site_title}`,
      description: 'Profesyonel nakliyat ve taşımacılık hizmetlerimiz hakkında detaylı bilgi alın.'
    }
  };
}

export default async function HizmetlerPage() {
  const hizmetler = await getAktifHizmetler();
  const supabase = createServerClient();
  
  // Site ayarlarını al
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: hizmetler.map((hizmet, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: hizmet.baslik,
        description: hizmet.aciklama,
        url: `${siteSettings?.canonical_url_base}/hizmetler/${hizmet.id}`,
        provider: {
          '@type': 'Organization',
          name: siteSettings?.site_title
        }
      }
    }))
  };

  return (
    <>
      <JsonLd data={servicesSchema} />
      <main className="min-h-screen bg-white">
        <div className="py-16 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Hizmetlerimiz
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Profesyonel nakliyat çözümlerimizle eşyalarınız güvende. Her türlü taşıma ihtiyacınız için yanınızdayız.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {hizmetler.map((hizmet, index) => (
                <article
                  key={hizmet.id}
                  className="flex flex-col items-start justify-between bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={`/hizmetler/${hizmet.id}`} className="w-full">
                    {hizmet.resim_url && (
                      <div className="relative w-full">
                        <Image
                          src={convertSupabaseImageUrl(hizmet.resim_url, 'hizmet-images')}
                          alt={`${hizmet.baslik} - Profesyonel nakliyat ve taşımacılık hizmeti`}
                          width={1200}
                          height={675}
                          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                          loading={index < 3 ? "eager" : "lazy"}
                          quality={index < 3 ? 100 : 75}
                        />
                      </div>
                    )}
                    <div className="max-w-xl mt-8">
                      <div className="group relative">
                        <h3 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                          {hizmet.baslik}
                        </h3>
                        <p className="mt-5 text-base leading-7 text-gray-600 line-clamp-3">
                          {hizmet.aciklama}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 w-full">
                      <span className="inline-flex items-center text-blue-600 group-hover:text-blue-500">
                        Detayları Görüntüle
                        <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 