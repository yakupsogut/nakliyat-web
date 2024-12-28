'use client';

import { useEffect, useState } from 'react';
import { getReferanslar } from '@/lib/db';
import type { Referans } from '@/lib/types';
import { StarIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Testimonials() {
  const [referanslar, setReferanslar] = useState<Referans[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferanslar = async () => {
      try {
        const data = await getReferanslar();
        setReferanslar(data);
      } catch (error) {
        console.error('Referanslar yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferanslar();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Referanslar Yükleniyor...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Profesyonel hizmet kalitemiz ve müşteri memnuniyetimiz ile fark yaratıyoruz.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {referanslar.map((referans) => (
            <article key={referans.id} className="flex flex-col items-start justify-between bg-white p-6 shadow-lg rounded-lg">
              <div className="flex items-center gap-x-4 text-xs">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        referans.puan > rating ? 'text-yellow-400' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
              <div className="group relative">
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  {referans.yorum}
                </p>
              </div>
              <div className="relative mt-8">
                <div className="flex items-center gap-x-4">
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      {referans.musteri_adi}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 