'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: number;
  baslik: string;
  ozet: string;
  kapak_resmi: string;
  yazar: string;
  kategori: string;
  created_at: string;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select('*')
          .eq('aktif', true)
          .order('siralama', { ascending: true });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Blog
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Nakliyat ve taşımacılık hakkında faydalı bilgiler, ipuçları ve güncel haberler.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-16 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Yükleniyor...
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="flex flex-col items-start">
                  <div className="relative w-full">
                    <Image
                      src={post.kapak_resmi}
                      alt={post.baslik}
                      width={800}
                      height={600}
                      className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="max-w-xl">
                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                      <time dateTime={post.created_at} className="text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                        {post.kategori}
                      </span>
                    </div>
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <Link href={`/blog/${post.slug}`}>
                          <span className="absolute inset-0" />
                          {post.baslik}
                        </Link>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                        {post.ozet}
                      </p>
                    </div>
                    <div className="relative mt-8 flex items-center gap-x-4">
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">
                          <span className="absolute inset-0" />
                          {post.yazar}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 