'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { convertSupabaseImageUrl } from '@/lib/utils';

interface HeroSlide {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  button_text: string | null;
  button_url: string | null;
  order_no: number;
}

interface Props {
  slides: HeroSlide[];
}

export default function ClientHeroSlider({ slides }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (slides.length > 1 && isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Her 5 saniyede bir değişir

      return () => clearInterval(timer);
    }
  }, [slides.length, isAutoPlaying]);

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <header className="relative isolate overflow-hidden">
      {/* Slider Container */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={convertSupabaseImageUrl(slides[currentSlide].image_url, 'public')}
              alt={slides[currentSlide].title}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1920px"
              quality={75}
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>
        </AnimatePresence>

        {/* Content - Sadece title, description veya button varsa göster */}
        {(slides[currentSlide].title || slides[currentSlide].description || (slides[currentSlide].button_url && slides[currentSlide].button_text)) && (
          <div className="absolute inset-y-0 left-[10%] sm:left-[7%] flex items-center">
            <div className="relative w-[70%] sm:w-full">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-[240px] sm:max-w-lg text-left"
              >
                <div className="bg-black/30 backdrop-blur-sm p-2.5 sm:p-8 rounded-xl">
                  {slides[currentSlide].title && (
                    <motion.h1 
                      className="text-lg sm:text-4xl font-bold tracking-tight text-white lg:text-5xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {slides[currentSlide].title}
                    </motion.h1>
                  )}
                  {slides[currentSlide].description && (
                    <motion.p 
                      className="mt-1 sm:mt-4 text-[10px] sm:text-lg lg:text-xl leading-4 sm:leading-8 text-gray-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {slides[currentSlide].description}
                    </motion.p>
                  )}
                  {slides[currentSlide].button_url && slides[currentSlide].button_text && (
                    <motion.div 
                      className="mt-2 sm:mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Link
                        href={slides[currentSlide].button_url}
                        className="inline-flex items-center rounded-full bg-white px-2.5 sm:px-8 py-1 sm:py-4 text-[10px] sm:text-base font-semibold text-gray-900 shadow-lg hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300"
                      >
                        {slides[currentSlide].button_text}
                        <svg className="ml-1 h-2 w-2 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
              aria-label="Önceki slide"
            >
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
              aria-label="Sonraki slide"
            >
              <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlide(index);
                }}
                className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-300 shadow-lg ${
                  index === currentSlide 
                    ? 'bg-white scale-110 w-4 sm:w-5'
                    : 'bg-white/70 hover:bg-white'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </header>
  );
} 