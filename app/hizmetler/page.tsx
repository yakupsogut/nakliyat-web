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
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 py-24">
        {/* <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/grid.png')] opacity-10"></div>
        </div> */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Profesyonel Nakliyat Hizmetlerimiz
            </h1>
            <p className="mt-6 text-lg text-blue-50">
              Güvenilir, hızlı ve profesyonel nakliyat çözümleriyle eşyalarınızı özenle taşıyoruz. 
              20 yılı aşkın tecrübemizle hizmetinizdeyiz.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="relative -mt-20 px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hizmetler.map((hizmet, index) => (
              <Link 
                key={hizmet.id} 
                href={`/hizmetler/${hizmet.id}`}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                  {hizmet.resim_url && (
                    <div className="relative h-64">
                      <Image
                        src={convertSupabaseImageUrl(hizmet.resim_url, 'hizmet-images')}
                        alt={`${hizmet.baslik} - Profesyonel nakliyat ve taşımacılık hizmeti`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading={index < 3 ? "eager" : "lazy"}
                        quality={index < 3 ? 100 : 75}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="relative p-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-700 group-hover:text-blue-500">
                        {hizmet.baslik}
                      </h3>
                      <span className="rounded-full bg-blue-50 p-2 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 line-clamp-3">
                      {hizmet.aciklama}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

     
    </>
  );
} 