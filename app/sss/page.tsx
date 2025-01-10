import { supabase } from '@/lib/supabase';
import SSSKategoriListesi from './components/SSSKategoriListesi';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { Metadata } from 'next';

export default async function SSSPage() {
  const { data: sorular, error } = await supabase
    .from('sss')
    .select('*')
    .eq('aktif', true)
    .order('siralama', { ascending: true });

  if (error) {
    console.error('SSS yüklenirken hata:', error);
    return null;
  }

  // Benzersiz kategorileri çıkar
  const kategoriler = [...new Set(sorular?.map(soru => soru.kategori))];

  return (
    <main className="min-h-screen bg-white">
      
      <div className="py-10 sm:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Sıkça Sorulan Sorular
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Nakliyat hizmetlerimiz hakkında sık sorulan soruların cevaplarını burada bulabilirsiniz.
            </p>
          </div>

          <SSSKategoriListesi sorular={sorular || []} kategoriler={kategoriler} />

          {/* İletişim CTA */}
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600">
              Başka sorularınız mı var?
            </p>
            <div className="mt-6 flex justify-center gap-x-6">
              <Link
                href="/iletisim"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Bize Ulaşın
              </Link>
              <Link
                href="/teklif-al"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-gray-50"
              >
                Teklif Alın
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: `Sıkça Sorulan Sorular | ${siteSettings?.site_title}`,
    description: 'Nakliyat hizmetlerimiz hakkında sık sorulan soruların cevaplarını bulabilirsiniz. Evden eve nakliyat, ofis taşıma ve diğer hizmetlerimiz hakkında merak edilenler.',
    openGraph: {
      title: `Sıkça Sorulan Sorular | ${siteSettings?.site_title}`,
      description: 'Nakliyat hizmetlerimiz hakkında sık sorulan soruların cevaplarını bulabilirsiniz.',
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: `SSS | ${siteSettings?.site_title}`,
      description: 'Nakliyat hizmetlerimiz hakkında sık sorulan soruların cevaplarını bulabilirsiniz.'
    }
  };
} 