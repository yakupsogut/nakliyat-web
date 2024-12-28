import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    id: 'evden-eve-nakliyat',
    title: 'Evden Eve Nakliyat',
    description: 'Profesyonel ekibimiz ve modern ekipmanlarımızla evinizi güvenle yeni adresinize taşıyoruz.',
    features: [
      'Profesyonel paketleme hizmeti',
      'Demontaj ve montaj hizmeti',
      'Sigortalı taşımacılık',
      'Özel eşya taşıma',
      'Eşya depolama imkanı',
      'Ücretsiz ekspertiz',
    ],
    image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80',
  },
  {
    id: 'kurumsal-nakliyat',
    title: 'Kurumsal Nakliyat',
    description: 'Ofis ve şirket taşımacılığında uzman kadromuzla kesintisiz hizmet sunuyoruz.',
    features: [
      'Ofis ekipmanları taşıma',
      'Arşiv ve döküman taşıma',
      'Hafta sonu taşıma seçeneği',
      'IT ekipmanları taşıma',
      'Proje yönetimi',
      'Sigortalı taşımacılık',
    ],
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80',
  },
  {
    id: 'asansorlu-tasimacilik',
    title: 'Asansörlü Taşımacılık',
    description: 'Modern asansör sistemlerimizle yüksek katlara güvenli ve hızlı taşıma hizmeti sağlıyoruz.',
    features: [
      '30 kata kadar ulaşım',
      'Geniş platform',
      'Hızlı kurulum',
      'Güvenlik sistemleri',
      'Deneyimli operatör',
      'Sigortalı hizmet',
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
  },
];

export default function Services() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Hizmetlerimiz
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Profesyonel nakliyat hizmetlerimizle eşyalarınızı güvenle taşıyoruz.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            {services.map((service) => (
              <div key={service.id} id={service.id} className="mt-16 first:mt-0">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
                  <div className="relative">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={600}
                      height={400}
                      className="rounded-2xl object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                      {service.title}
                    </h3>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      {service.description}
                    </p>
                    <ul className="mt-8 grid grid-cols-1 gap-4 text-gray-600 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <svg
                            className="h-5 w-5 flex-none text-blue-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-3">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link
                        href="/teklif-al"
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Teklif Al
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </main>
  );
} 