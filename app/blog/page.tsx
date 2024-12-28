import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';

const posts = [
  {
    id: 1,
    title: 'Evden Eve Nakliyatta Dikkat Edilmesi Gerekenler',
    description: 'Ev taşıma sürecinde eşyalarınızın güvenliği için almanız gereken önlemler ve püf noktalar.',
    date: '15 Aralık 2023',
    category: 'Evden Eve Nakliyat',
    author: {
      name: 'Mehmet Yılmaz',
      role: 'Nakliyat Uzmanı',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1590074072786-a66914d668f1?auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Ofis Taşıma Rehberi',
    description: 'Şirketinizi minimum iş kaybıyla nasıl taşıyabilirsiniz? Detaylı ofis taşıma planlaması.',
    date: '10 Aralık 2023',
    category: 'Kurumsal Nakliyat',
    author: {
      name: 'Ayşe Kaya',
      role: 'Proje Yöneticisi',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Asansörlü Taşımacılığın Avantajları',
    description: 'Modern asansör sistemleri ile yüksek katlara taşınmanın kolaylıkları ve güvenlik önlemleri.',
    date: '5 Aralık 2023',
    category: 'Asansörlü Taşımacılık',
    author: {
      name: 'Ali Demir',
      role: 'Operasyon Müdürü',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Şehirler Arası Nakliyat İpuçları',
    description: 'Uzun mesafe taşımacılıkta eşyalarınızın güvenliği için almanız gereken önlemler.',
    date: '1 Aralık 2023',
    category: 'Şehirler Arası Nakliyat',
    author: {
      name: 'Zeynep Yıldız',
      role: 'Lojistik Uzmanı',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Eşya Depolama Hizmeti Nasıl Çalışır?',
    description: 'Güvenli depolama hizmetleri ve eşyalarınızın korunması için önemli bilgiler.',
    date: '25 Kasım 2023',
    category: 'Depolama',
    author: {
      name: 'Can Özkan',
      role: 'Depo Yöneticisi',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop&crop=faces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Nakliyat Sigortası Nedir?',
    description: 'Taşıma sigortasının önemi ve eşyalarınızın güvence altına alınması.',
    date: '20 Kasım 2023',
    category: 'Sigorta',
    author: {
      name: 'Deniz Aydın',
      role: 'Sigorta Uzmanı',
      imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=96&h=96&fit=crop&crop=faces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    title: 'Paketleme İpuçları',
    description: 'Eşyalarınızı güvenli bir şekilde paketlemek için profesyonel öneriler ve teknikler.',
    date: '15 Kasım 2023',
    category: 'Paketleme',
    author: {
      name: 'Selin Yalçın',
      role: 'Paketleme Uzmanı',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&crop=faces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80',
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blog</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Nakliyat ve taşımacılık hakkında faydalı bilgiler, ipuçları ve sektörel haberler.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col items-start">
                <div className="relative w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime={post.date} className="text-gray-500">
                      {post.date}
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                      {post.category}
                    </span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={`/blog/${post.id}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <Image
                      src={post.author.imageUrl}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full bg-gray-100"
                    />
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        <span className="absolute inset-0" />
                        {post.author.name}
                      </p>
                      <p className="text-gray-600">{post.author.role}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </main>
  );
} 