import { createServerClient } from '@/lib/supabase'
import { Sayfa } from '@/lib/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { convertSupabaseImageUrl } from '@/lib/utils'
import JsonLd from '@/app/components/JsonLd'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient()
  
  const { data: sayfa } = await supabase
    .from('sayfalar')
    .select('*')
    .eq('slug', slug)
    .single()

  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (!sayfa) {
    return {
      title: `Sayfa Bulunamadı | ${siteSettings?.site_title}`,
      description: 'Aradığınız sayfa bulunamadı.'
    }
  }

  const sayfaData = sayfa as Sayfa

  return {
    title: `${sayfaData.meta_title || sayfaData.baslik} | ${siteSettings?.site_title}`,
    description: sayfaData.meta_description || '',
    openGraph: {
      title: `${sayfaData.meta_title || sayfaData.baslik} | ${siteSettings?.site_title}`,
      description: sayfaData.meta_description || '',
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: `${sayfaData.meta_title || sayfaData.baslik} | ${siteSettings?.site_title}`,
      description: sayfaData.meta_description || ''
    }
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient()
  
  const { data: sayfa } = await supabase
    .from('sayfalar')
    .select('*')
    .eq('slug', slug)
    .single()

  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (!sayfa) {
    notFound()
  }

  const sayfaData = sayfa as Sayfa

  // İçerikteki Supabase resim URL'lerini dönüştür
  let processedContent = sayfaData.icerik;
  if (processedContent) {
    // Supabase URL'sini al
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      // content-images bucket'ındaki resimleri bul ve dönüştür
      const contentImagesRegex = new RegExp(`${supabaseUrl}/storage/v1/object/public/content-images/[^"'\\s)]+`, 'g');
      processedContent = processedContent.replace(contentImagesRegex, (match) => {
        return convertSupabaseImageUrl(match, 'content-images');
      });
    }
  }

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: sayfaData.meta_title || sayfaData.baslik,
    description: sayfaData.meta_description || '',
    url: `${siteSettings?.canonical_url_base}/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: siteSettings?.site_title,
      logo: siteSettings?.logo_url
    }
  };

  return (
    <>
      <JsonLd data={pageSchema} />
      <main className="min-h-screen bg-white text-gray-900">
        <div className="relative isolate overflow-hidden bg-white py-5 sm:py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                {sayfaData.baslik}
              </h1>
            </div>
            
            <div className="prose prose-lg mt-10 max-w-none">
              <div dangerouslySetInnerHTML={{ __html: processedContent || '' }} />
            </div>
            
          </div>
        </div>
      </main>
    </>
  )
} 