import { getReferanslar } from '@/lib/db';
import { StarIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default async function Testimonials() {
  const referanslar = await getReferanslar(6);

  return (
    <section className="bg-white py-24 sm:py-32" aria-label="Müşteri Yorumları">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Profesyonel hizmet kalitemiz ve müşteri memnuniyetimiz ile fark yaratıyoruz.
          </p>
        </header>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {referanslar.map((referans) => (
            <article key={referans.id} className="flex flex-col items-start justify-between bg-white p-6 shadow-lg rounded-lg">
              <div className="flex items-center gap-x-4 text-xs">
                <div className="flex items-center" role="img" aria-label={`${referans.puan} yıldız puan`}>
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
              <blockquote className="group relative">
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  {referans.yorum}
                </p>
              </blockquote>
              <footer className="relative mt-8">
                <div className="flex items-center gap-x-4">
                  <cite className="text-sm leading-6 not-italic">
                    <p className="font-semibold text-gray-900">
                      {referans.musteri_adi}
                    </p>
                  </cite>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
} 