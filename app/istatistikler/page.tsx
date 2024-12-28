'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

interface Istatistik {
  id: number;
  baslik: string;
  deger: string;
  aciklama: string;
  ikon: string;
}

export default function IstatistiklerPage() {
  const [istatistikler, setIstatistikler] = useState<Istatistik[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIstatistikler = async () => {
      try {
        const { data, error } = await supabase
          .from('istatistikler')
          .select('*')
          .eq('aktif', true)
          .order('siralama', { ascending: true });

        if (error) throw error;
        setIstatistikler(data || []);
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIstatistikler();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              İstatistikler
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Yılların deneyimi ve güveniyle hizmet veriyoruz. İşte rakamlarla başarı hikayemiz.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-16 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Yükleniyor...
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {istatistikler.map((istatistik) => (
                  <div key={istatistik.id} className="flex flex-col items-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600">
                      <i className={`fas fa-${istatistik.ikon} text-2xl text-white`}></i>
                    </div>
                    <dt className="text-3xl font-bold leading-7 text-gray-900">
                      {istatistik.deger}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-center">
                      <p className="text-lg font-semibold leading-7 text-gray-900">{istatistik.baslik}</p>
                      <p className="mt-2 text-base leading-7 text-gray-600">{istatistik.aciklama}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600">
              Siz de profesyonel nakliyat hizmetlerimizden faydalanmak ister misiniz?
            </p>
            <div className="mt-6 flex justify-center gap-x-6">
              <a
                href="/iletisim"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Bize Ulaşın
              </a>
              <a
                href="/teklif-al"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-gray-50"
              >
                Teklif Alın
              </a>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 