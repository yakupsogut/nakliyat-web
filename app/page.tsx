
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import WhatsAppButton from './components/WhatsAppButton';

export default function Home() {
  return (
    <main className="min-h-screen">
 
      <Hero />
      <Services />
      <Testimonials />
      <WhatsAppButton />
    </main>
  );
}
