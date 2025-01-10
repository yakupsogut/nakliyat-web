import { createServerClient } from '@/lib/supabase'
import { Sayfa } from '@/lib/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WhatsAppButton from '../components/WhatsAppButton'
import { convertSupabaseImageUrl } from '@/lib/utils'


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

  if (!sayfa) {
    return {
      title: 'Sayfa Bulunamadı',
      description: 'Aradığınız sayfa bulunamadı.'
    }
  }

  const sayfaData = sayfa as Sayfa

  return {
    title: sayfaData.meta_title || sayfaData.baslik,
    description: sayfaData.meta_description
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

  return (
    <main className="min-h-screen bg-white text-gray-900">
     
      <div className="relative isolate overflow-hidden bg-white py-5 sm:py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {sayfaData.baslik}
            </h1>
          </div>
          
          <div className="prose prose-lg mt-10 max-w-none">
            <div dangerouslySetInnerHTML={{ __html: processedContent }} />
          </div>
          
        </div>
      </div>
      <WhatsAppButton />
    </main>
  )
} 