'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { convertSupabaseImageUrl } from '@/lib/utils';
import { FaTruck } from 'react-icons/fa';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (slides.length > 1 && isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 7000);

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
    <header className="relative isolate">
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
            
            <Image
              src={convertSupabaseImageUrl(slides[currentSlide].image_url, 'public')}
              alt={slides[currentSlide].title || ''}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              quality={85}
              onLoad={() => setIsLoaded(true)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPENDODM4QkVFRUBBRUVGRklJRkVHT01PS01QUFBQUFBQUFBQUFz/2wBDAR0XFxodGh0gICBcQjZCXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20">
          <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              {slides[currentSlide].title && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    {slides[currentSlide].title}
                  </h1>
                </motion.div>
              )}
              
              {slides[currentSlide].description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <p className="text-sm sm:text-lg lg:text-xl text-gray-100 mb-6 drop-shadow-lg">
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              )}

              {slides[currentSlide].button_url && slides[currentSlide].button_text && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  <Link
                    href={slides[currentSlide].button_url}
                    className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-lg group"
                  >
                    <FaTruck className="h-5 w-5" />
                    <span>{slides[currentSlide].button_text}</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 backdrop-blur-sm shadow-lg group z-20"
              aria-label="Önceki slide"
            >
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-x-1" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 backdrop-blur-sm shadow-lg group z-20"
              aria-label="Sonraki slide"
            >
              <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
            </button>
          </>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlide(index);
                }}
                className={`transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 h-2 bg-yellow-500'
                    : 'w-2 h-2 bg-white/70 hover:bg-white'
                } rounded-full`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </header>
  );
} 