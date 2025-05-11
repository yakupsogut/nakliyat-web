import { getAktifHizmetler } from '@/lib/db';
import { convertSupabaseImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
export default async function Services() {
  const hizmetler = await getAktifHizmetler();

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-900 to-gray-800" aria-label="Hizmetlerimiz">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Hizmetlerimiz
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto my-6 rounded-full" />
          <p className="text-lg leading-8 text-gray-300">
            Profesyonel nakliyat hizmetlerimizle eşyalarınız güvende.
          </p>
        </header>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {hizmetler.map((hizmet, index) => (
              <article 
                key={hizmet.id} 
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-gray-800/50 ring-1 ring-gray-700/50 backdrop-blur-sm hover:bg-gray-800 transition-all duration-300"
              >
                {hizmet.resim_url && (
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={convertSupabaseImageUrl(hizmet.resim_url, 'hizmet-images')}
                      alt={`${hizmet.baslik} hizmeti görseli`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading={index < 3 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between p-6 pt-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold leading-7 text-white mb-4 group-hover:text-yellow-500 transition-colors">
                      {hizmet.baslik}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-gray-300">
                      {hizmet.aciklama}
                    </p>
                  </div>
                  <Link 
                    href={`/hizmetler/${hizmet.id}`}
                    className="group relative mt-8 inline-flex items-center gap-x-2"
                  >
                    <span className="text-sm font-medium text-yellow-500">Detaylı Bilgi</span>
                    <svg 
                      className="h-5 w-5 text-yellow-500 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="2" 
                      stroke="currentColor" 
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 