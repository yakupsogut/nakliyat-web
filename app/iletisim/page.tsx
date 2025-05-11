import { createServerClient } from '@/lib/supabase';
import JsonLd from '@/app/components/JsonLd';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const ContactForm = dynamic(() => import('../components/ContactForm'), {
  loading: () => (
    <div className="animate-pulse bg-gray-100 h-[500px] rounded-lg" />
  )
});

export default async function Contact() {
  const supabase = createServerClient();
  const { data: siteAyarlari } = await supabase
    .from('site_ayarlari')
    .select('*')
    .single();

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
    <main className="min-h-screen bg-gray-50">
      <JsonLd data={localBusinessSchema} />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 py-24">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-extrabold text-white mb-6">Bizimle İletişime Geçin</h1>
            <p className="text-xl text-gray-100">
              Profesyonel nakliyat hizmetlerimiz hakkında bilgi almak için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteAyarlari?.adres && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-8 w-8 text-yellow-600" />
                <h3 className="text-xl font-bold ml-3 text-gray-900">Adres</h3>
              </div>
              <p className="text-gray-800 font-medium text-base">{siteAyarlari.adres}</p>
            </div>
          )}
          
          {siteAyarlari?.telefon && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <PhoneIcon className="h-8 w-8 text-yellow-600" />
                <h3 className="text-xl font-bold ml-3 text-gray-900">Telefon</h3>
              </div>
              <a href={`tel:${siteAyarlari.telefon}`} className="text-gray-800 font-medium text-base hover:text-yellow-600 transition-colors">
                {siteAyarlari.telefon}
              </a>
            </div>
          )}
          
          {siteAyarlari?.email && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <EnvelopeIcon className="h-8 w-8 text-yellow-600" />
                <h3 className="text-xl font-bold ml-3 text-gray-900">E-posta</h3>
              </div>
              <a href={`mailto:${siteAyarlari.email}`} className="text-gray-800 font-medium text-base hover:text-yellow-600 transition-colors">
                {siteAyarlari.email}
              </a>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <h3 className="text-xl font-bold ml-3 text-gray-900">Çalışma Saatleri</h3>
            </div>
            <p className="text-gray-800 font-medium text-base">Hafta içi: 09:00 - 18:00</p>
            <p className="text-gray-800 font-medium text-base">Hafta sonu: 09:00 - 18:00</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <h2 className="text-3xl font-bold mb-6">Bize Ulaşın</h2>
              <p className="mb-8">
                Sorularınız veya talepleriniz için formu doldurun. En kısa sürede size dönüş yapacağız.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPinIcon className="h-6 w-6 mr-3" />
                  <span>Güvenilir ve Profesyonel Hizmet</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-6 w-6 mr-3" />
                  <span>7/24 Müşteri Desteği</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-6 w-6 mr-3" />
                  <span>Hızlı Geri Dönüş</span>
                </div>
              </div>
            </div>
            <div className="p-8">
              <ContactForm />
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