import { supabase } from '@/lib/supabase';
import JsonLd from '@/app/components/JsonLd';
import { createServerClient } from '@/lib/supabase';
import { Metadata } from 'next';

import Link from 'next/link';
import Image from 'next/image';
import BlogIcerik from './components/BlogIcerik';
import BlogPaylas from './components/BlogPaylas';

// Sayfa seviyesinde önbellekleme süresi (15 dakika)
export const revalidate = 180;

// Dinamik route'lar için önbellekleme davranışı
export const dynamic = 'force-static';

// Okuma süresini hesaplayan yardımcı fonksiyon
function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  
  const { data: post } = await supabase
    .from('blog')
    .select('*')
    .eq('slug', slug)
    .eq('aktif', true)
    .single();

  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (!post) {
    return {
      title: `Yazı Bulunamadı | ${siteSettings?.site_title}`,
      description: 'Aradığınız blog yazısı bulunamadı veya kaldırılmış olabilir.'
    };
  }

  // Özeti 150-160 karakter ile sınırla
  const metaDescription = post.meta_description || 
    (post.ozet?.length > 155 ? `${post.ozet.substring(0, 155)}...` : post.ozet);

  return {
    title: `${post.baslik} | ${siteSettings?.site_title}`,
    description: metaDescription,
    keywords: post.etiketler?.join(', ') || '',
    openGraph: {
      title: `${post.baslik} | ${siteSettings?.site_title}`,
      description: metaDescription,
      type: 'article',
      images: post.kapak_resmi ? [{ url: post.kapak_resmi }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.baslik} | ${siteSettings?.site_title}`,
      description: metaDescription,
      images: post.kapak_resmi ? [post.kapak_resmi] : undefined
    }
  };
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

  // Site ayarlarını al
  const supabaseClient = createServerClient();
  const { data: siteSettings } = await supabaseClient
    .from('site_settings')
    .select('*')
    .single();

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white">
       
        <div className="py-5 sm:py-5">
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
      </main>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.baslik,
    description: post.meta_description || post.ozet,
    image: post.kapak_resmi,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: siteSettings?.site_title,
      url: siteSettings?.canonical_url_base
    },
    publisher: {
      '@type': 'Organization',
      name: siteSettings?.site_title,
      logo: {
        '@type': 'ImageObject',
        url: siteSettings?.logo_url
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteSettings?.canonical_url_base}/blog/${post.slug}`
    }
  };

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
    <>
      <JsonLd data={articleSchema} />
      <main className="bg-gray-50">
        {/* Hero Bölümü */}
        <div className="relative py-16 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Kategori ve Okuma Süresi */}
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-sm font-medium">
                  {post.kategori}
                </span>
                <div className="flex items-center text-gray-600 text-sm">
                  <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readingTime} dakika okuma
                </div>
              </div>

              {/* Başlık ve Özet */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.baslik}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                {post.ozet}
              </p>

              {/* Tarih ve Paylaş */}
              <div className="flex items-center justify-between mt-8">
                <time className="text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <BlogPaylas baslik={post.baslik} />
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sol Kolon - Ana İçerik */}
            <div className="lg:col-span-8">
              {/* Kapak Görseli */}
              <div className="rounded-2xl overflow-hidden mb-12 shadow-xl">
                <Image
                  src={post.kapak_resmi}
                  alt={`${post.baslik} - ${post.kategori} konulu blog yazısının kapak görseli`}
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Blog İçeriği */}
              <div className="prose prose-lg max-w-none">
                <BlogIcerik icerik={post.icerik} />
              </div>

              {/* Etiketler */}
              {post.etiketler && post.etiketler.length > 0 && (
                <div className="mt-12 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.etiketler.map((etiket: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{etiket}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sağ Kolon - İlgili ve Son Yazılar */}
            <div className="lg:col-span-4 space-y-12">
              {/* İlgili Yazılar */}
              {relatedPosts && relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">İlgili Yazılar</h2>
                  <div className="space-y-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link 
                        key={relatedPost.id} 
                        href={`/blog/${relatedPost.slug}`}
                        className="group block"
                      >
                        <div className="aspect-video rounded-xl overflow-hidden mb-3">
                          <Image
                            src={relatedPost.kapak_resmi}
                            alt={relatedPost.baslik}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.baslik}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Son Yazılar */}
              {recentPosts && recentPosts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Son Yazılar</h2>
                  <div className="space-y-6">
                    {recentPosts.map((recentPost) => (
                      <Link 
                        key={recentPost.id} 
                        href={`/blog/${recentPost.slug}`}
                        className="flex items-center gap-4 group"
                      >
                        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                          <Image
                            src={recentPost.kapak_resmi}
                            alt={recentPost.baslik}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
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
        </div>
      </main>
    </>
  );
} 