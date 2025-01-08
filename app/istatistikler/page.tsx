'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { ChartBarIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Istatistik {
  id: number;
  baslik: string;
  deger: string;
  aciklama: string;
  ikon: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

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

  const getIcon = (ikonAdi: string) => {
    switch (ikonAdi) {
      case 'truck':
        return <TruckIcon className="h-8 w-8 text-white" />;
      case 'users':
        return <UserGroupIcon className="h-8 w-8 text-white" />;
      default:
        return <ChartBarIcon className="h-8 w-8 text-white" />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <motion.div 
        initial="hidden"
        animate="show"
        variants={container}
        className="py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              İstatistiklerle Biz
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Yılların deneyimi ve güveniyle hizmet veriyoruz. İşte rakamlarla başarı hikayemiz.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="mt-16 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Yükleniyor...
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <motion.dl 
                variants={container}
                className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
              >
                {istatistikler.map((istatistik) => (
                  <motion.div
                    key={istatistik.id}
                    variants={fadeInUp}
                    className="group relative flex flex-col items-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 transform transition-transform group-hover:scale-110">
                      {getIcon(istatistik.ikon)}
                    </div>
                    <dt className="text-4xl font-bold text-blue-600 tracking-tight">
                      {istatistik.deger}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-center">
                      <p className="text-xl font-semibold text-gray-900">{istatistik.baslik}</p>
                      <p className="mt-2 text-base leading-7 text-gray-600">{istatistik.aciklama}</p>
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          )}

          <motion.div 
            variants={fadeInUp}
            className="mt-20 text-center bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profesyonel Nakliyat Hizmetleri
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Güvenilir ve profesyonel nakliyat hizmetlerimizle yanınızdayız.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/iletisim"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Bize Ulaşın
              </a>
              <a
                href="/teklif-al"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm ring-1 ring-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                Teklif Alın
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 