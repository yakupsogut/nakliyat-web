import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import Image from 'next/image';

const testimonials = [
  {
    content: 'Çok profesyonel bir ekip. Eşyalarımızı büyük bir özenle taşıdılar. Kesinlikle tavsiye ediyorum.',
    author: {
      name: 'Ahmet Yılmaz',
      role: 'İstanbul',
      company: 'Ev Taşıma',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces',
    },
  },
  {
    content: 'Ofisimizin taşınma sürecini minimum kesinti ile tamamladılar. Çok memnun kaldık.',
    author: {
      name: 'Ayşe Kaya',
      role: 'Firma Sahibi',
      company: 'Teknoloji Şirketi',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces',
    },
  },
  {
    content: 'Asansörlü taşıma hizmetleri sayesinde eşyalarımız güvenle yeni evimize ulaştı.',
    author: {
      name: 'Mehmet Demir',
      role: 'Ankara',
      company: 'Ev Taşıma',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces',
    },
  },
  {
    content: 'Şirketimizin şehirler arası taşınma sürecini sorunsuz bir şekilde tamamladılar.',
    author: {
      name: 'Can Özkan',
      role: 'Genel Müdür',
      company: 'Üretim Firması',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
    },
  },
  {
    content: 'Hassas laboratuvar ekipmanlarımızı büyük bir dikkatle taşıdılar. Profesyonel hizmet.',
    author: {
      name: 'Dr. Zeynep Aydın',
      role: 'Laboratuvar Müdürü',
      company: 'Araştırma Merkezi',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces',
    },
  },
  {
    content: 'Otel ekipmanlarımızın taşınmasında gösterdikleri özen ve profesyonellik takdire şayan.',
    author: {
      name: 'Ali Yıldırım',
      role: 'Otel Müdürü',
      company: 'Lüks Otel',
      imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=96&h=96&fit=crop&crop=faces',
    },
  },
];

const companies = [
  { 
    name: 'ABC Teknoloji', 
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=158&h=48&fit=crop&q=80' 
  },
  { 
    name: 'XYZ Holding', 
    logo: 'https://images.unsplash.com/photo-1554200876-56c2f25224fa?w=158&h=48&fit=crop&q=80' 
  },
  { 
    name: 'Mega Otel', 
    logo: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=158&h=48&fit=crop&q=80' 
  },
  { 
    name: 'Star Hastanesi', 
    logo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=158&h=48&fit=crop&q=80' 
  },
  { 
    name: 'Global Şirket', 
    logo: 'https://images.unsplash.com/photo-1561489413-985b06da5bee?w=158&h=48&fit=crop&q=80' 
  },
  { 
    name: 'Tech Corp', 
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=158&h=48&fit=crop&q=80' 
  },
];

export default function References() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Referanslarımız
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Binlerce mutlu müşterimizden bazılarının yorumları ve çalıştığımız kurumsal firmalar.
            </p>
          </div>

          {/* Müşteri Yorumları */}
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.author.name} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                    <blockquote className="text-gray-900">
                      <p>{`"${testimonial.content}"`}</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <Image
                        className="h-10 w-10 rounded-full bg-gray-50"
                        src={testimonial.author.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                        <div className="text-gray-600">{testimonial.author.role}</div>
                        <div className="text-gray-600">{testimonial.author.company}</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          {/* Kurumsal Müşteriler */}
          <div className="mt-32">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center">
              Kurumsal Müşterilerimiz
            </h2>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
              {companies.map((company) => (
                <Image
                  key={company.name}
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 grayscale hover:grayscale-0 transition-all"
                  src={company.logo}
                  alt={company.name}
                  width={158}
                  height={48}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </main>
  );
} 