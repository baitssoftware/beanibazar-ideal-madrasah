'use client';

import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import { useGetList } from '@/hooks/APIHooks';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

const fallbackImages = ['/slider/1.jpg', '/slider/2.jpg', '/slider/3.jpg'];

const animations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5, ease: 'easeInOut' },
};

interface SliderData {
  _id: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const AUTO_SLIDE_INTERVAL = 5000;
const INTERACTION_PAUSE_DURATION = 10000;

export default function ImageSlider() {
  const { data: sliderData, isLoading } = useGetList<SliderData>('/slider', 'slider');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeImages = useMemo(() => {
    if (!sliderData) return fallbackImages;
    const activeSlides = sliderData.filter((slide) => (slide.status as string) === 'active');
    return activeSlides.length > 0
      ? activeSlides.map((slide) => slide.image as string)
      : fallbackImages;
  }, [sliderData]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? activeImages.length - 1 : prevIndex - 1));
    setIsPaused(true);
  }, [activeImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === activeImages.length - 1 ? 0 : prevIndex + 1));
    setIsPaused(true);
  }, [activeImages.length]);

  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      if (!isPaused) {
        handleNext();
      }
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(autoSlideInterval);
  }, [isPaused, handleNext]);

  useEffect(() => {
    if (isPaused) {
      const resumeTimer = setTimeout(() => {
        setIsPaused(false);
      }, INTERACTION_PAUSE_DURATION);

      return () => clearTimeout(resumeTimer);
    }
  }, [isPaused]);

  const getCurrentImageUrl = () => {
    return activeImages[currentIndex]
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${activeImages[currentIndex]}`
      : fallbackImages[0];
  };

  return (
    <div className="relative w-full h-[550px] overflow-hidden">
      {/* Static blurred background with smooth transition */}
      <div
        className="absolute inset-0 transition-[background-image] duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${getCurrentImageUrl()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          transform: 'scale(1.1)',
          opacity: 0.7,
        }}
      />

      {/* Main content container with semi-transparent overlay */}
      <div className="relative h-full flex items-center justify-center bg-black/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="relative max-w-full max-h-full w-auto h-auto"
            {...animations}
          >
            {isLoading ? (
              <ImageSkeleton className="max-h-[550px] w-auto h-auto object-contain" />
            ) : (
              <Image
                src={getCurrentImageUrl()}
                alt={`Slide ${currentIndex + 1}`}
                className="max-h-[550px] w-auto h-auto object-contain"
                width={1920}
                height={1080}
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={handlePrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {activeImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
            }}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
