'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    content: 'Çok profesyonel bir ekip. Eşyalarımızı büyük bir özenle taşıdılar. Kesinlikle tavsiye ediyorum.',
    author: {
      name: 'Ahmet Yılmaz',
      role: 'İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
    },
    rating: 5,
  },
  {
    content: 'Ofisimizin taşınma sürecini minimum kesinti ile tamamladılar. Çok memnun kaldık.',
    author: {
      name: 'Ayşe Kaya',
      role: 'Firma Sahibi',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces',
    },
    rating: 5,
  },
  {
    content: 'Asansörlü taşıma hizmetleri sayesinde eşyalarımız güvenle yeni evimize ulaştı.',
    author: {
      name: 'Mehmet Demir',
      role: 'Ankara',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces',
    },
    rating: 5,
  },
];

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-950 to-blue-900 py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.800),theme(colors.blue.950))] opacity-30" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.blue.900),theme(colors.blue.800),theme(colors.blue.900))] opacity-20" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center relative z-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-900/80 backdrop-blur-sm py-10 px-6 rounded-3xl shadow-2xl"
          >
            <h2 className="text-xl font-bold leading-8 tracking-tight text-blue-200">
              Müşteri Deneyimleri
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl drop-shadow-lg">
              Müşterilerimizin Yorumları
            </p>
          </motion.div>
        </div>
        
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col justify-between rounded-3xl bg-gradient-to-b from-white to-blue-50 px-8 py-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex gap-x-1 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
                <div className="mt-6 flex items-start">
                  <div className="relative flex-none">
                    <Image
                      className="h-12 w-12 rounded-full bg-gray-50 object-cover ring-2 ring-blue-500/20"
                      src={testimonial.author.imageUrl}
                      alt=""
                      width={48}
                      height={48}
                    />
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-green-400 p-1 ring-2 ring-white">
                      <span className="block h-2 w-2 rounded-full bg-green-500" />
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-semibold leading-7 text-gray-900">
                      {testimonial.author.name}
                    </p>
                    <p className="text-sm leading-6 text-gray-600">
                      {testimonial.author.role}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {testimonial.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 