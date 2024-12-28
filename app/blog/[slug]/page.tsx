'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import Link from 'next/link';

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
}

export default function BlogDetay({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select('*')
          .eq('slug', params.slug)
          .eq('aktif', true)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Blog yazısı yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Yükleniyor...
                </span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
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
                <Link href="/blog" className="text-blue-600 hover:text-blue-500">
                  ← Blog'a Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <article>
            {/* Başlık ve Meta Bilgiler */}
            <div className="mx-auto max-w-2xl text-center">
              <div className="mt-8 flex justify-center gap-x-4 text-xs">
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
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                {post.baslik}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {post.ozet}
              </p>
              <div className="mt-8 flex justify-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">
                    {post.yazar}
                  </p>
                </div>
              </div>
            </div>

            {/* Kapak Görseli */}
            <div className="mt-16 relative">
              <img
                src={post.kapak_resmi}
                alt={post.baslik}
                className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover"
              />
            </div>

            {/* İçerik */}
            <div className="prose prose-lg prose-blue mx-auto mt-16 text-gray-600">
              <div dangerouslySetInnerHTML={{ __html: post.icerik }} />
            </div>

            {/* Etiketler */}
            {post.etiketler && post.etiketler.length > 0 && (
              <div className="mx-auto mt-16 max-w-2xl">
                <div className="flex flex-wrap gap-2">
                  {post.etiketler.map((etiket, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                      {etiket}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Blog'a Dön */}
            <div className="mx-auto mt-16 max-w-2xl">
              <Link href="/blog" className="text-blue-600 hover:text-blue-500">
                ← Blog'a Dön
              </Link>
            </div>
          </article>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 