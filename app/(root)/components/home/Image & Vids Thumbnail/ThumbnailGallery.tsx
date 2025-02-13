'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ThumbnailGalleryProps {
  images: string[]; // images should always be an array of strings
  maxDisplay?: number;
  category: 'photo' | 'video';
}

export function ThumbnailGallery({ images = [], maxDisplay = 4, category }: ThumbnailGalleryProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayImages = images.slice(0, maxDisplay);
  const remainingCount = Math.max(0, images.length - maxDisplay);

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-2 gap-3 w-full max-w-full mx-auto">
        {displayImages.map((src, index) => (
          <div key={index} className="relative aspect-square overflow-hidden">
            <Image
              priority
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${src}` || '/placeholder.svg'} // Use placeholder if `src` is empty
              alt={`Thumbnail for ${category} ${index + 1}`} // More descriptive alt text
              fill
              className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              sizes="(max-width: 300px) 50vw, 150px"
            />
          </div>
        ))}
      </div>
      {remainingCount > 0 && (
        <Link
          href={`${category === 'photo' ? '/gallery/photo' : '/gallery/video'}`}
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="text-white text-2xl font-bold">+{remainingCount} more</span>
        </Link>
      )}
    </div>
  );
}
