'use client';

import { motion } from 'framer-motion';
import { TruckIcon, HomeIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const services = [
  {
    name: 'Evden Eve Nakliyat',
    description: 'Profesyonel ekibimizle evinizi güvenle ve özenle yeni adresinize taşıyoruz.',
    icon: HomeIcon,
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    href: '/hizmetler#evden-eve-nakliyat',
  },
  {
    name: 'Kurumsal Nakliyat',
    description: 'Şirketinizin tüm taşınma ihtiyaçlarını minimum iş kaybıyla gerçekleştiriyoruz.',
    icon: TruckIcon,
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    href: '/hizmetler#kurumsal-nakliyat',
  },
  {
    name: 'Asansörlü Taşımacılık',
    description: 'Modern asansör sistemlerimizle yüksek katlara güvenli ve hızlı taşıma hizmeti.',
    icon: ArrowUpIcon,
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    href: '/hizmetler#asansorlu-tasimacilik',
  },
];

export default function Services() {
  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold leading-7 text-blue-600">HİZMETLERİMİZ</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Profesyonel Nakliyat Çözümleri
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Eşyalarınızı güvenle ve özenle taşıyoruz. Her türlü nakliyat ihtiyacınız için yanınızdayız.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative overflow-hidden rounded-3xl ${service.color} px-6 pb-8 pt-24 sm:pt-32 lg:pt-40`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/25 to-transparent" />
                <div className={`absolute top-8 left-8 h-12 w-12 rounded-lg ${service.color} p-2`}>
                  <service.icon className={`h-8 w-8 ${service.iconColor}`} aria-hidden="true" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold leading-7 text-gray-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-700">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className={`mt-6 inline-flex items-center gap-x-2 text-sm font-semibold leading-6 ${service.iconColor} hover:opacity-80`}
                >
                  Detaylı Bilgi
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 