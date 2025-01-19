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
    <section className="bg-white py-24 sm:py-32" aria-label="Müşteri Yorumları">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Profesyonel hizmet kalitemiz ve müşteri memnuniyetimiz ile fark yaratıyoruz.
          </p>
        </header>

        <div className="mx-auto mt-16">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-indigo-600',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="pb-16 testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="px-2 py-1">
                <article className="relative flex flex-col justify-between bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 h-full border border-gray-100">
                  <div className="absolute top-6 right-8 text-indigo-100">
                    <FaQuoteRight className="w-8 h-8" />
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
                              testimonial.puan > rating ? 'text-yellow-400' : 'text-gray-200',
                              'h-5 w-5 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <footer className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex flex-col">
                      <cite className="text-base font-semibold text-gray-900 not-italic">
                        {testimonial.musteri_adi}
                      </cite>
                      <span className="text-sm text-gray-500 mt-1">
                        {testimonial.hizmet_turu}
                      </span>
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
          padding-bottom: 3rem !important;
        }
        .testimonials-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          background: #e5e7eb;
          opacity: 1;
          width: 10px;
          height: 10px;
          margin: 0 6px !important;
        }
        .swiper-pagination-bullet-active {
          background: #4f46e5 !important;
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
} 