import { supabase } from '@/lib/supabase';
import { convertSupabaseImageUrl } from '@/lib/utils';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Link from 'next/link';
import Image from 'next/image';

export default async function BlogPage() {
  const { data: posts, error } = await supabase
    .from('blog')
    .select('*')
    .eq('aktif', true)
    .order('siralama', { ascending: true });

  if (error) {
    console.error('Blog yazıları yüklenirken hata:', error);
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Bölümü */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white pt-20 sm:pt-28 pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Blog
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              Nakliyat ve taşımacılık hakkında faydalı bilgiler, ipuçları ve güncel haberler.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Yazıları */}
      <div className="py-6 sm:py-8 -mt-6 sm:-mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {posts?.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group block h-full"
              >
                <article className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={convertSupabaseImageUrl(post.kapak_resmi)}
                      alt={post.baslik}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {post.kategori}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-0 line-clamp-2">
                      {post.baslik}
                    </h2>
                    <p className="mt-1 text-sm sm:text-base text-gray-600 line-clamp-3 mb-3 sm:mb-4">
                      {post.ozet}
                    </p>
                    <div className="mt-auto flex items-center text-blue-600 font-medium text-sm sm:text-base">
                      Devamını Oku
                      <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 