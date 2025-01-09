import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import TeklifForm from './components/TeklifForm';

export default function QuoteRequest() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Teklif Al</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Ücretsiz fiyat teklifi almak için formu doldurun, uzmanlarımız en kısa sürede size ulaşsın.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl">
            <TeklifForm />
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 