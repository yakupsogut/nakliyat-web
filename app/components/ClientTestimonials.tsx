'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { StarIcon } from '@heroicons/react/20/solid';
import { FaQuoteRight } from 'react-icons/fa';
import { Referans } from '@/lib/types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ClientTestimonialsProps {
  testimonials: Referans[];
}

export default function ClientTestimonials({ testimonials }: ClientTestimonialsProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white" aria-label="Müşteri Yorumları">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Müşterilerimiz Ne Diyor?
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto my-6 rounded-full" />
          <p className="text-lg leading-8 text-gray-600">
            Profesyonel hizmet kalitemiz ve müşteri memnuniyetimiz ile fark yaratıyoruz.
          </p>
        </header>

        <div className="mx-auto mt-16">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-yellow-500',
              renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="pb-20 testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="px-2 py-1 h-auto">
                <article className="group relative flex flex-col justify-between rounded-2xl p-8  transition-all duration-300">
                  {/* Arka plan gradient efekti */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 group-hover:border-yellow-200 transition-colors" />
                  
                  <div className="absolute top-6 right-8">
                    <FaQuoteRight className="w-8 h-8 text-yellow-200 group-hover:text-yellow-300 transition-colors" />
                  </div>
                  
                  <div className="relative">
                    <blockquote>
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {testimonial.yorum}
                      </p>
                    </blockquote>
                    
                    <div className="flex items-center gap-x-4 text-xs mb-4">
                      <div className="flex items-center" role="img" aria-label={`${testimonial.puan} yıldız puan`}>
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              testimonial.puan > rating ? 'text-yellow-500' : 'text-gray-200',
                              'h-5 w-5 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <footer className="relative mt-6 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold text-lg">
                        {testimonial.musteri_adi.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <cite className="text-base font-semibold text-gray-900 not-italic group-hover:text-yellow-600 transition-colors">
                          {testimonial.musteri_adi}
                        </cite>
                        <span className="text-sm text-gray-500 mt-0.5">
                          {testimonial.hizmet_turu}
                        </span>
                      </div>
                    </div>
                  </footer>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .testimonials-swiper {
          padding-bottom: 4rem !important;
        }
        .testimonials-swiper .swiper-pagination {
          bottom: 12px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }
        .swiper-pagination-bullet {
          background: #e5e7eb !important;
          opacity: 1;
          width: 12px;
          height: 12px;
          margin: 0 !important;
          transition: all 0.3s ease;
          border-radius: 50%;
        }
        .swiper-pagination-bullet-active {
          background: #eab308 !important;
          transform: scale(1.2);
        }
        .swiper-pagination-bullet:hover {
          background: #fde68a !important;
        }
        .swiper-pagination-bullet:focus {
          background: #eab308 !important;
          outline: none;
        }
      `}</style>
    </section>
  );
} 