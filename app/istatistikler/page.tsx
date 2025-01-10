import { supabase } from '@/lib/supabase';
import IstatistikKart from './components/IstatistikKart';
import { createServerClient } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';

// Sayfa seviyesinde önbellekleme süresi (15 dakika)
export const revalidate = 180;

// Dinamik route'lar için önbellekleme davranışı
export const dynamic = 'force-static';


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
    <main className="min-h-screen bg-gray-50">
   
      
      <div className="py-10 sm:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Rakamlarla Biz
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Yılların deneyimi ve güvenilirliği ile taşımacılık sektöründe öncü firma olarak hizmet veriyoruz.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
            {istatistikler?.map((istatistik: Istatistik) => (
              <IstatistikKart key={istatistik.id} {...istatistik} />
            ))}
          </dl>
          <div className="mt-16 text-center">
            <Link
              href="/iletisim"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Detaylı Bilgi İçin İletişime Geçin
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
} 