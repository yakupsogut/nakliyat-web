import { Metadata } from 'next';
import { SiteAyarlari } from '@/lib/types';

type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

interface SeoMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: TwitterCardType;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  siteSettings: SiteAyarlari;
}

export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
  ogTitle,
  ogDescription,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  noindex,
  siteSettings,
}: SeoMetaProps): Metadata {
  // Varsayılan değerleri site ayarlarından al
  const defaultTitle = siteSettings.site_title;
  const defaultDescription = siteSettings.site_description || '';
  const defaultKeywords = siteSettings.site_keywords || '';
  const defaultOgImage = siteSettings.og_image || '';
  const defaultTwitterCard = (siteSettings.twitter_card_type || 'summary_large_image') as TwitterCardType;

  // Sayfa başlığını oluştur
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  // Metadata objesi
  const metadata: Metadata = {
    title: pageTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    
    // Robots meta
    robots: {
      index: !noindex,
      follow: !noindex,
    },

    // Open Graph
    openGraph: {
      title: ogTitle || title || defaultTitle,
      description: ogDescription || description || defaultDescription,
      images: ogImage ? [{ url: ogImage }] : defaultOgImage ? [{ url: defaultOgImage }] : undefined,
      siteName: defaultTitle,
    },

    // Twitter
    twitter: {
      card: twitterCard || defaultTwitterCard,
      title: twitterTitle || title || defaultTitle,
      description: twitterDescription || description || defaultDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },

    // Diğer meta etiketleri
    alternates: {
      canonical: canonicalUrl,
    },

    // Google Site Verification
    verification: {
      google: siteSettings.google_site_verification || undefined,
    },
  };

  // Eğer canonical_url_base varsa ekle
  if (siteSettings.canonical_url_base) {
    metadata.metadataBase = new URL(siteSettings.canonical_url_base);
  }

  return metadata;
} 