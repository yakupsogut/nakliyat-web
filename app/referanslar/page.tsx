import { getReferanslar } from '@/lib/db';
import type { Referans } from '@/lib/types';
import { StarIcon } from '@heroicons/react/20/solid';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default async function ReferanslarPage() {
  const referanslar = await getReferanslar();

  return (
    <main className="min-h-screen bg-gray-50">
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Müşteri Referanslarımız
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Müşterilerimizin memnuniyeti bizim için en önemli başarı göstergesidir. İşte bazı müşterilerimizin deneyimleri...
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {referanslar.map((referans) => (
              <article
                key={referans.id}
                className="flex flex-col bg-white p-8 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          referans.puan > rating ? 'text-yellow-400' : 'text-gray-200',
                          'h-6 w-6 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <time className="text-gray-500">
                    {new Date(referans.created_at || '').toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className="mt-6 flex flex-1 flex-col">
                  <p className="flex-1 text-base leading-7 text-gray-600">
                    {referans.yorum}
                  </p>
                  <div className="mt-8 border-t border-gray-900/5 pt-6">
                    <h3 className="font-semibold text-gray-900">
                      {referans.musteri_adi}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600">
              Siz de memnun kaldığınız hizmetlerimiz hakkında görüşlerinizi bizimle paylaşabilirsiniz.
            </p>
            <a
              href="/iletisim"
              className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Görüş Bildir
            </a>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 