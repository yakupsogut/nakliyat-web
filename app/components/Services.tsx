'use client';

import { useEffect, useState } from 'react';
import { getAktifHizmetler } from '@/lib/db';
import type { Hizmet } from '@/lib/types';
import { convertSupabaseImageUrl } from '@/lib/utils';
import Image from 'next/image';

export default function Services() {
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHizmetler = async () => {
      try {
        const data = await getAktifHizmetler();
        setHizmetler(data);
      } catch (error) {
        console.error('Hizmetler yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHizmetler();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 sm:py-32 bg-gray-900" aria-label="Hizmetlerimiz">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Hizmetlerimiz Yükleniyor...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 sm:py-32 bg-gray-900" aria-label="Hizmetlerimiz">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Hizmetlerimiz
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Profesyonel nakliyat hizmetlerimizle eşyalarınız güvende.
          </p>
        </header>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {hizmetler.map((hizmet) => (
              <article key={hizmet.id} className="flex flex-col bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <dt className="text-lg font-semibold leading-7 text-white">
                  <h3>{hizmet.baslik}</h3>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{hizmet.aciklama}</p>
                  {hizmet.resim_url && (
                    <figure className="mt-4">
                      <Image
                        src={convertSupabaseImageUrl(hizmet.resim_url, 'hizmet-images')}
                        alt={`${hizmet.baslik} hizmeti görseli`}
                        width={800}
                        height={400}
                        className="rounded-lg object-cover w-full h-48"
                      />
                    </figure>
                  )}
                </dd>
              </article>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
} 