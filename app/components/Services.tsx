import { getAktifHizmetler } from '@/lib/db';
import { convertSupabaseImageUrl } from '@/lib/utils';
import Image from 'next/image';

export default async function Services() {
  const hizmetler = await getAktifHizmetler();

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
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {hizmetler.map((hizmet, index) => (
              <article key={hizmet.id} className="flex flex-col bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <h3 className="text-lg font-semibold leading-7 text-white">
                  {hizmet.baslik}
                </h3>
                <div className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{hizmet.aciklama}</p>
                  {hizmet.resim_url && (
                    <figure className="mt-4">
                      <Image
                        src={convertSupabaseImageUrl(hizmet.resim_url, 'hizmet-images')}
                        alt={`${hizmet.baslik} hizmeti görseli`}
                        width={400}
                        height={225}
                        className="rounded-lg object-cover w-full h-48"
                        loading={index < 3 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={75}
                      />
                    </figure>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 