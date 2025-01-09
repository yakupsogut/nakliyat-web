import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import Link from 'next/link';
import Image from 'next/image';
import BlogIcerik from './components/BlogIcerik';
import BlogPaylas from './components/BlogPaylas';

interface BlogPost {
  id: number;
  baslik: string;
  ozet: string;
  icerik: string;
  kapak_resmi: string;
  yazar: string;
  kategori: string;
  created_at: string;
  etiketler: string[];
  slug: string;
}

// Okuma süresini hesaplayan yardımcı fonksiyon
function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default async function BlogDetay({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const { data: post, error } = await supabase
    .from('blog')
    .select('*')
    .eq('slug', slug)
    .eq('aktif', true)
    .single();

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Yazı Bulunamadı
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Aradığınız blog yazısı bulunamadı veya kaldırılmış olabilir.
              </p>
              <div className="mt-10">
                <Link href="/blog" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                  &larr; Blog&apos;a Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // İlgili yazıları getir
  const { data: relatedPosts } = await supabase
    .from('blog')
    .select('*')
    .eq('aktif', true)
    .eq('kategori', post.kategori)
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // Son yazıları getir
  const { data: recentPosts } = await supabase
    .from('blog')
    .select('*')
    .eq('aktif', true)
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const readingTime = getReadingTime(post.icerik);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Ana İçerik */}
          <div className="lg:col-span-8">
            {/* Meta Bilgiler */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  {post.kategori}
                </span>
                <span className="text-gray-500 text-sm">{readingTime} dk okuma</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
                {post.baslik}
              </h1>
              
              <p className="text-xl text-gray-600">
                {post.ozet}
              </p>
            </div>

            {/* Kapak Görseli */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={post.kapak_resmi}
                alt={post.baslik}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <BlogIcerik icerik={post.icerik} />

              {/* Etiketler ve Paylaş Butonları */}
              <div className="mt-12 not-prose flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Etiketler */}
                {post.etiketler && post.etiketler.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.etiketler.map((etiket, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{etiket}
                      </span>
                    ))}
                  </div>
                )}

                <BlogPaylas baslik={post.baslik} />
              </div>
            </div>
          </div>

          {/* Yan Panel */}
          <div className="lg:col-span-4">
            {/* İlgili Yazılar */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">İlgili Yazılar</h2>
                <div className="space-y-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.id} 
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3">
                        <Image
                          src={relatedPost.kapak_resmi}
                          alt={relatedPost.baslik}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {relatedPost.baslik}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Son Yazılar */}
            {recentPosts && recentPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Son Yazılar</h2>
                <div className="space-y-6">
                  {recentPosts.map((recentPost) => (
                    <Link 
                      key={recentPost.id} 
                      href={`/blog/${recentPost.slug}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={recentPost.kapak_resmi}
                          alt={recentPost.baslik}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {recentPost.baslik}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(recentPost.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 