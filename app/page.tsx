import { createServerClient } from '@/lib/supabase';
import JsonLd from './components/JsonLd';
import { Metadata } from 'next';
import { default as dynamicImport } from 'next/dynamic';

// Sayfa seviyesinde önbellekleme süresi (15 dakika)
export const revalidate = 180;

// Dinamik route'lar için önbellekleme davranışı
export const dynamic = 'force-static';

/*const Hero = dynamicImport(() => import('./components/Hero'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-[600px]" />
  )
});*/

const Services = dynamicImport(() => import('./components/Services'), {
  loading: () => (
    <div className="animate-pulse bg-gray-100 h-[800px]" />
  )
});

const Testimonials = dynamicImport(() => import('./components/Testimonials'), {
  loading: () => (
    <div className="animate-pulse bg-gray-50 h-[600px]" />
  )
});

const HomeGallery = dynamicImport(() => import('./components/HomeGallery'), {
  loading: () => (
    <div className="animate-pulse bg-gray-100 h-[600px]" />
  )
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient();
  
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return {
    title: siteSettings?.site_title,
    description: siteSettings?.site_description,
    openGraph: {
      title: siteSettings?.site_title,
      description: siteSettings?.site_description,
      type: 'website',
      images: siteSettings?.og_image ? [{ url: siteSettings.og_image }] : undefined
    },
    twitter: {
      card: 'summary',
      title: siteSettings?.site_title,
      description: siteSettings?.site_description
    }
  };
}

export default async function Home() {
  const supabase = createServerClient();
  
  // Site ayarlarını al
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  // Site ayarlarını al
  const { data: generalSettings } = await supabase
    .from('site_ayarlari')
    .select('*')
    .single();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings?.site_title,
    url: siteSettings?.canonical_url_base,
    logo: siteSettings?.logo_url,
    description: siteSettings?.site_description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: generalSettings?.adres,
      addressCountry: 'TR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: generalSettings?.telefon,
      contactType: 'customer service'
    },
    sameAs: [
      generalSettings?.facebook_url,
      generalSettings?.twitter_url,
      generalSettings?.instagram_url
    ].filter(Boolean)
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSettings?.site_title,
    url: siteSettings?.canonical_url_base,
    description: siteSettings?.site_description,
    publisher: {
      '@type': 'Organization',
      name: siteSettings?.site_title,
      logo: siteSettings?.logo_url
    }
  };

  return (
    <main className="min-h-screen">
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
    
      <Services />
      <HomeGallery />
      <Testimonials />
    </main>
  );
}
