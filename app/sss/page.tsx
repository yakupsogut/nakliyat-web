'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

interface SSS {
  id: number;
  soru: string;
  cevap: string;
  kategori: string;
}

export default function SSSPage() {
  const [sorular, setSorular] = useState<SSS[]>([]);
  const [kategoriler, setKategoriler] = useState<string[]>([]);
  const [seciliKategori, setSeciliKategori] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSSS = async () => {
      try {
        const { data, error } = await supabase
          .from('sss')
          .select('*')
          .eq('aktif', true)
          .order('siralama', { ascending: true });

        if (error) throw error;

        setSorular(data || []);
        
        // Benzersiz kategorileri çıkar
        const uniqueKategoriler = [...new Set(data?.map(soru => soru.kategori))];
        setKategoriler(uniqueKategoriler);
        
        // İlk kategoriyi seç
        if (uniqueKategoriler.length > 0) {
          setSeciliKategori(uniqueKategoriler[0]);
        }
      } catch (error) {
        console.error('SSS yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSSS();
  }, []);

  const filtrelenmisSSS = seciliKategori
    ? sorular.filter(soru => soru.kategori === seciliKategori)
    : sorular;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Sıkça Sorulan Sorular
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Nakliyat hizmetlerimiz hakkında sık sorulan soruların cevaplarını burada bulabilirsiniz.
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
            <>
              {/* Kategori Seçimi */}
              <div className="mt-16 flex justify-center space-x-4">
                {kategoriler.map((kategori) => (
                  <button
                    key={kategori}
                    onClick={() => setSeciliKategori(kategori)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold ${
                      seciliKategori === kategori
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {kategori}
                  </button>
                ))}
              </div>

              {/* SSS Listesi */}
              <div className="mt-16 max-w-3xl mx-auto divide-y divide-gray-200">
                {filtrelenmisSSS.map((soru) => (
                  <div key={soru.id} className="py-8">
                    <h3 className="text-xl font-bold text-gray-900">
                      {soru.soru}
                    </h3>
                    <p className="mt-4 text-base text-gray-600">
                      {soru.cevap}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* İletişim CTA */}
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600">
              Başka sorularınız mı var?
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