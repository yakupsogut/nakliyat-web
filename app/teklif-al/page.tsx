import { createServerClient } from '@/lib/supabase';
import JsonLd from '@/app/components/JsonLd';
import TeklifForm from './components/TeklifForm';
import { Metadata } from 'next';

// Sayfa seviyesinde önbellekleme süresi (15 dakika)
export const revalidate = 180;

// Dinamik route'lar için önbellekleme davranışı
export const dynamic = 'force-static';


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
      <main className="min-h-screen bg-white">
        
        <div className="py-10 sm:py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Teklif Al</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Ücretsiz fiyat teklifi almak için formu doldurun, uzmanlarımız en kısa sürede size ulaşsın.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl">
              <TeklifForm />
            </div>
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