'use client';

import { use, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import Link from 'next/link';
import Image from 'next/image';

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

// İçindekiler tablosunu oluşturan fonksiyon
function extractTableOfContents(content: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h2, h3'));
  return headings.map((heading, index) => ({
    id: `heading-${index}`,
    text: heading.textContent || '',
    level: parseInt(heading.tagName[1])
  }));
}

export default function BlogDetay({ params }: {
  params: Promise<{ slug: string }>;
}) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  const { slug } = use(params);
  
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const totalHeight = contentRef.current.clientHeight;
        const windowHeight = window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / (totalHeight - windowHeight)) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select('*')
          .eq('slug', slug)
          .eq('aktif', true)
          .single();

        if (error) throw error;
        setPost(data);

        if (data) {
          // İçindekiler tablosunu oluştur
          const toc = extractTableOfContents(data.icerik);
          setTableOfContents(toc);

          // İlgili yazıları getir
          const { data: related } = await supabase
            .from('blog')
            .select('*')
            .eq('aktif', true)
            .eq('kategori', data.kategori)
            .neq('id', data.id)
            .order('created_at', { ascending: false })
            .limit(3);

          if (related) setRelatedPosts(related);

          // Son yazıları getir
          const { data: recent } = await supabase
            .from('blog')
            .select('*')
            .eq('aktif', true)
            .neq('id', data.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (recent) setRecentPosts(recent);
        }
      } catch (error) {
        console.error('Blog yazısı yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const shareOnTwitter = () => {
    const text = `${post?.baslik} - ${window.location.href}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = `${post?.baslik} ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Yükleniyor...
            </span>
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

  const readingTime = getReadingTime(post.icerik);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* İlerleme Çubuğu */}
      <div 
        style={{ transform: `translateX(${scrollProgress - 100}%)` }}
        className="fixed top-0 left-0 w-full h-1 bg-blue-600 transition-transform duration-150 z-[60]"
      />
      
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
                <time className="text-gray-500 text-sm">
                  {new Date(post.created_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="text-gray-500 text-sm">•</span>
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
              {/* İçerik */}
              <div 
                ref={contentRef}
                dangerouslySetInnerHTML={{ __html: post.icerik }}
                className="text-gray-800 leading-relaxed"
              />

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

                {/* Paylaş Butonları */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">Paylaş:</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={shareOnTwitter}
                      className="p-2 rounded-full bg-black/10 text-black hover:bg-black hover:text-white transition-colors group"
                      aria-label="X'te paylaş"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={shareOnFacebook}
                      className="p-2 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors group"
                      aria-label="Facebook'ta paylaş"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={shareOnWhatsApp}
                      className="p-2 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors group"
                      aria-label="WhatsApp'ta paylaş"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kenar Çubuğu */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Son Yazılar */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Son Yazılar
                </h2>
                <div className="space-y-6">
                  {recentPosts.map((recentPost) => (
                    <Link 
                      key={recentPost.id}
                      href={`/blog/${recentPost.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={recentPost.kapak_resmi}
                            alt={recentPost.baslik}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
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
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* İçindekiler */}
              {tableOfContents.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    İçindekiler
                  </h2>
                  <nav className="space-y-2">
                    {tableOfContents.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm hover:text-blue-600 transition-colors ${
                          heading.level === 2 ? 'font-medium' : 'pl-4 text-gray-600'
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* İlgili Yazılar */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    İlgili Yazılar
                  </h2>
                  <div className="space-y-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link 
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="group block"
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
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {relatedPost.baslik}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(relatedPost.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      <WhatsAppButton />
      <Footer />
    </main>
  );
} 