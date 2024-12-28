import { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'NakliyatPro - Profesyonel Nakliyat ve Taşımacılık Hizmetleri',
    template: '%s | NakliyatPro',
  },
  description: 'Evden eve nakliyat, ofis taşıma ve asansörlü taşımacılık hizmetleri. 20 yıllık tecrübe ile güvenilir ve profesyonel hizmet.',
  keywords: [
    'nakliyat',
    'evden eve nakliyat',
    'ofis taşıma',
    'asansörlü taşımacılık',
    'şehirler arası nakliyat',
    'eşya depolama',
    'İstanbul nakliyat',
    'profesyonel taşımacılık',
  ],
  authors: [{ name: 'NakliyatPro' }],
  creator: 'NakliyatPro',
  publisher: 'NakliyatPro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://www.nakliyatpro.com',
  },
  icons: {
    icon: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=32&h=32&fit=crop&q=80',
    apple: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=180&h=180&fit=crop&q=80',
  },
};

export default defaultMetadata; 