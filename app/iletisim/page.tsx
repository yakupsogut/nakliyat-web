import { createServerClient } from '@/lib/supabase';
import JsonLd from '@/app/components/JsonLd';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ContactForm = dynamic(() => import('../components/ContactForm'), {
  loading: () => (
    <div className="animate-pulse bg-gray-100 h-[500px] rounded-lg" />
  )
});

export default async function Contact() {
  // Site ayarlarını al
  const supabase = createServerClient();
  const { data: siteAyarlari } = await supabase
    .from('site_ayarlari')
    .select('*')
    .single();

  // Genel ayarları al
  const { data: generalSettings } = await supabase
    .from('site_ayarlari')
    .select('*')
    .single();

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteAyarlari?.site_title,
    image: siteAyarlari?.logo_url,
    '@id': siteAyarlari?.canonical_url_base,
    url: siteAyarlari?.canonical_url_base,
    telephone: generalSettings?.telefon,
    address: {
      '@type': 'PostalAddress',
      streetAddress: generalSettings?.adres,
      addressCountry: 'TR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: generalSettings?.latitude,
      longitude: generalSettings?.longitude
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '09:00',
      closes: '18:00'
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={localBusinessSchema} />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">İletişim</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Bizimle iletişime geçmek için aşağıdaki formu doldurabilir veya iletişim bilgilerimizi kullanabilirsiniz.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">İletişim Bilgileri</h3>
              <dl className="mt-6 space-y-4 text-base leading-7 text-gray-600">
                {siteAyarlari?.adres && (
                  <div>
                    <dt className="font-semibold">Adres</dt>
                    <dd>{siteAyarlari.adres}</dd>
                  </div>
                )}
                {siteAyarlari?.telefon && (
                  <div>
                    <dt className="font-semibold">Telefon</dt>
                    <dd>
                      <a href={`tel:${siteAyarlari.telefon}`} className="hover:text-blue-600">
                        {siteAyarlari.telefon}
                      </a>
                    </dd>
                  </div>
                )}
                {siteAyarlari?.email && (
                  <div>
                    <dt className="font-semibold">E-posta</dt>
                    <dd>
                      <a href={`mailto:${siteAyarlari.email}`} className="hover:text-blue-600">
                        {siteAyarlari.email}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">İletişim Formu</h3>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: `İletişim | ${siteSettings?.site_title}`,
    description: 'Nakliyat hizmetlerimiz için bizimle iletişime geçin. Adres bilgilerimiz, telefon numaralarımız ve iletişim formumuz ile size yardımcı olmaktan memnuniyet duyarız.',
    openGraph: {
      title: `İletişim | ${siteSettings?.site_title}`,
      description: 'Nakliyat hizmetlerimiz için bizimle iletişime geçin.',
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: `İletişim | ${siteSettings?.site_title}`,
      description: 'Nakliyat hizmetlerimiz için bizimle iletişime geçin.'
    }
  };
} 