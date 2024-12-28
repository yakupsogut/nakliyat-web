import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Hakkımızda</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              20 yıllık tecrübemizle Türkiye&apos;nin önde gelen nakliyat şirketlerinden biriyiz.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-16 sm:mt-20 lg:grid-cols-2 lg:gap-24">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
                alt="Nakliyat ekibimiz"
                width={600}
                height={400}
                className="rounded-2xl object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Vizyonumuz</h3>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Türkiye&apos;nin lider nakliyat şirketi olma vizyonuyla, müşterilerimize en kaliteli ve güvenilir hizmeti sunmayı hedefliyoruz. Modern ekipmanlarımız ve uzman kadromuzla sektörde öncü olmaya devam ediyoruz.
              </p>

              <h3 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">Misyonumuz</h3>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Müşterilerimizin eşyalarını kendi eşyalarımız gibi özenle taşımak, güvenli ve zamanında teslimat yapmak temel misyonumuzdur. Her müşterimize özel çözümler üreterek, en iyi hizmeti sunmaya çalışıyoruz.
              </p>

              <div className="mt-12">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Değerlerimiz</h3>
                <ul className="mt-6 space-y-4 text-lg text-gray-600">
                  <li>• Güvenilirlik ve Dürüstlük</li>
                  <li>• Müşteri Memnuniyeti</li>
                  <li>• Profesyonellik</li>
                  <li>• Yenilikçilik</li>
                  <li>• Çevreye Duyarlılık</li>
                </ul>
              </div>

              <div className="mt-12">
                <Link
                  href="/iletisim"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Bizimle İletişime Geçin
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-200 pt-16">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Neden Biz?</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Deneyimli Ekip</h4>
                <p className="mt-2 text-gray-600">
                  20 yıllık tecrübemiz ve uzman kadromuzla profesyonel hizmet sunuyoruz.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Modern Ekipman</h4>
                <p className="mt-2 text-gray-600">
                  En son teknoloji araç ve ekipmanlarla güvenli taşımacılık sağlıyoruz.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Sigortalı Taşımacılık</h4>
                <p className="mt-2 text-gray-600">
                  Tüm eşyalarınız taşıma sigortası kapsamında güvence altındadır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </main>
  );
} 