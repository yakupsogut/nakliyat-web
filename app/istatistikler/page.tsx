import { supabase } from '@/lib/supabase';
import { createServerClient } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';

// Sayfa seviyesinde önbellekleme süresi (15 dakika)
//export const revalidate = 180;

// Dinamik route'lar için önbellekleme davranışı
//export const dynamic = 'force-static';


interface Istatistik {
  id: number;
  baslik: string;
  deger: string;
  aciklama: string;
  ikon: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: `İstatistikler | ${siteSettings?.site_title}`,
    description: 'Yılların deneyimi ve güvenilirliği ile taşımacılık sektöründe öncü firma olarak hizmet veriyoruz. Başarılarımız ve performansımız hakkında detaylı istatistikler.',
    openGraph: {
      title: `İstatistikler | ${siteSettings?.site_title}`,
      description: 'Yılların deneyimi ve güvenilirliği ile taşımacılık sektöründe öncü firma olarak hizmet veriyoruz.',
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: `İstatistikler | ${siteSettings?.site_title}`,
      description: 'Yılların deneyimi ve güvenilirliği ile taşımacılık sektöründe öncü firma olarak hizmet veriyoruz.'
    }
  };
}

export default async function IstatistiklerPage() {
  const { data: istatistikler, error } = await supabase
    .from('istatistikler')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('İstatistikler yüklenirken hata:', error);
    return null;
  }

  return (
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
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                Rakamlarla Biz
              </h1>
              <div className="h-1 w-20 bg-yellow-500 mx-auto rounded-full mb-6"></div>
              <p className="text-lg leading-8 text-gray-600">
                Yılların deneyimi ve güvenilirliği ile taşımacılık sektöründe öncü firma olarak hizmet veriyoruz.
              </p>
            </div>

            <dl className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
              {istatistikler?.map((istatistik: Istatistik) => (
                <div
                  key={istatistik.id}
                  className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <dt className="text-lg font-medium text-gray-600">
                      {istatistik.baslik}
                    </dt>
                    <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                      <span className="sr-only">{istatistik.baslik} ikonu</span>
                      <i className={`${istatistik.ikon} text-xl`}></i>
                    </div>
                  </div>
                  <dd className="flex flex-col gap-2">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {istatistik.deger}
                    </span>
                    <span className="text-sm text-gray-500">
                      {istatistik.aciklama}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-16 text-center">
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-500 px-6 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 transition-all duration-300"
              >
                Detaylı Bilgi İçin İletişime Geçin
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 