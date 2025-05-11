import { createServerClient } from '@/lib/supabase';
import JsonLd from '@/app/components/JsonLd';
import TeklifForm from './components/TeklifForm';
import { Metadata } from 'next';

// Sayfa seviyesinde önbellekleme süresi (15 dakika)
//export const revalidate = 180;

// Dinamik route'lar için önbellekleme davranışı
//export const dynamic = 'force-static';


export default async function TeklifAlPage() {
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

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Teklif Al',
    description: 'Nakliyat hizmetlerimiz için ücretsiz teklif alın',
    url: `${siteSettings?.canonical_url_base}/teklif-al`,
    provider: {
      '@type': 'Organization',
      name: siteSettings?.site_title,
      url: siteSettings?.canonical_url_base,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: generalSettings?.telefon,
        contactType: 'customer service',
        areaServed: 'TR',
        availableLanguage: 'Turkish'
      }
    }
  };

  return (
    <>
      <JsonLd data={contactPageSchema} />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative isolate">
          {/* Dekoratif arka plan elementleri */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>

          <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-3xl">
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Ücretsiz Teklif Alın
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Profesyonel nakliyat hizmetlerimiz için hemen teklif alın. Size özel en uygun fiyatları sunalım.
                  </p>
                </div>

                {/* Özellikler */}
                <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-20">
                  {[
                    {
                      title: 'Hızlı Yanıt',
                      description: '24 saat içinde dönüş',
                      icon: '⚡'
                    },
                    {
                      title: 'Ücretsiz Keşif',
                      description: 'Yerinde inceleme',
                      icon: '🏠'
                    },
                    {
                      title: 'Güvenli Taşıma',
                      description: 'Sigortalı hizmet',
                      icon: '🛡️'
                    }
                  ].map((feature) => (
                    <div key={feature.title} className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                      <div className="text-3xl mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <div className="mt-16 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                  <TeklifForm />
                </div>
              </div>
            </div>
          </div>

          {/* Alt dekoratif element */}
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
          </div>
        </div>
      </main>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: `Ücretsiz Teklif Al | ${siteSettings?.site_title}`,
    description: 'Nakliyat hizmetlerimiz için hemen ücretsiz teklif alın. Evden eve nakliyat, ofis taşıma ve diğer hizmetlerimiz için en uygun fiyatları sunuyoruz.',
    openGraph: {
      title: `Ücretsiz Teklif Al | ${siteSettings?.site_title}`,
      description: 'Nakliyat hizmetlerimiz için hemen ücretsiz teklif alın.',
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: `Ücretsiz Teklif Al | ${siteSettings?.site_title}`,
      description: 'Nakliyat hizmetlerimiz için hemen ücretsiz teklif alın.'
    }
  };
} 