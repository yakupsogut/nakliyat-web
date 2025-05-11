import { createServerClient } from '@/lib/supabase';
import { convertSupabaseImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '@/app/components/JsonLd';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: `Blog | ${siteSettings?.site_title}`,
    description: 'Nakliyat ve taşımacılık sektörü hakkında güncel bilgiler, öneriler ve profesyonel taşıma ipuçları.',
    openGraph: {
      title: `Blog | ${siteSettings?.site_title}`,
      description: 'Nakliyat ve taşımacılık sektörü hakkında güncel bilgiler ve öneriler.',
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: `Blog | ${siteSettings?.site_title}`,
      description: 'Nakliyat ve taşımacılık sektörü hakkında güncel bilgiler ve öneriler.'
    }
  };
}

export default async function BlogPage() {
  const supabase = createServerClient();
  
  const { data: posts } = await supabase
    .from('blog')
    .select('*')
    .eq('aktif', true)
    .order('siralama', { ascending: true });

  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    headline: 'Blog Yazıları',
    description: 'Nakliyat ve taşımacılık sektörü hakkında güncel bilgiler ve öneriler',
    url: `${siteSettings?.canonical_url_base}/blog`,
    publisher: {
      '@type': 'Organization',
      name: siteSettings?.site_title,
      logo: {
        '@type': 'ImageObject',
        url: siteSettings?.logo_url
      }
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts?.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.baslik,
          description: post.meta_description || post.ozet,
          image: post.kapak_resmi,
          url: `${siteSettings?.canonical_url_base}/blog/${post.slug}`,
          datePublished: post.created_at,
          dateModified: post.updated_at,
          author: {
            '@type': 'Organization',
            name: siteSettings?.site_title
          }
        }
      }))
    }
  };

  return (
    <>
      <JsonLd data={blogListSchema} />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Bölümü */}
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),white)] opacity-20" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
          <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Blog
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Nakliyat ve taşımacılık dünyasından en güncel haberler, uzman önerileri ve sektör bilgileri
              </p>
            </div>
          </div>
        </div>

        {/* Blog Yazıları Grid */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post, index) => (
              <article 
                key={post.id} 
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Link 
                  href={`/blog/${post.slug}`}
                  className="block"
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <Image
                      src={convertSupabaseImageUrl(post.kapak_resmi)}
                      alt={post.baslik}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={index < 3 ? "eager" : "lazy"}
                      quality={index < 3 ? 100 : 75}
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-flex items-center px-4 py-1.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-blue-700 rounded-full shadow-sm">
                        {post.kategori}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <time dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3 line-clamp-2">
                      {post.baslik}
                    </h3>

                    <p className="text-gray-600 line-clamp-2 mb-6 text-sm leading-relaxed">
                      {post.ozet}
                    </p>

                    <div className="inline-flex items-center text-sm font-semibold text-blue-600 group/link">
                      <span className="relative">
                        Devamını Oku
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100" />
                      </span>
                      <svg 
                        className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover/link:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
} 