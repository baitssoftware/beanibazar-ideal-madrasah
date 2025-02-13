'use client';

import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import ParagraphSkeleton from '@/components/shared/skeleton/ParagraphSkeleton';
import TitleSkeleton from '@/components/shared/skeleton/TitleSkeleton';
import { useGetList } from '@/hooks/APIHooks';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ChairmanMessage {
  _id: string;
  message: string;
  image: string;
  name: string;
  facebookURL?: string;
  instagramURL?: string;
  tweeterURL?: string;
  youtubeURL?: string;
}

const ChairmanMessage = () => {
  const { data: chairmanData, isLoading } = useGetList<ChairmanMessage>(
    '/chairman-message',
    'chairman-message',
  );
  const chairmanMessage = chairmanData?.[0];

  return (
    <section className="pb-10">
      <h2 className="heading">Message of The Chairman</h2>
      {isLoading ? (
        <div className="grid grid-cols-7 border">
          <div className="border-b pb-4 col-span-2 border-e p-10 w-full">
            <ImageSkeleton className="mx-auto h-72 object-cover w-full" />
            <TitleSkeleton className="text-xl font-semibold pb-4 text-center pt-2 mt-3 mx-auto" />
            <TitleSkeleton className="text-xl font-semibold pb-4 text-center pt-2 mt-3 mx-auto w-36" />
          </div>
          <div className="p-6 pt-6 col-span-5">
            <h2 className="text-3xl font-semibold pb-4 border-b mb-6">Message of The Chairman</h2>
            <ParagraphSkeleton line={10} />
          </div>
        </div>
      ) : (
        chairmanMessage && (
          <div className="grid grid-cols-7 border">
            <div className="mx-auto border-b pb-4 col-span-2 border-e p-10">
              <Image
                priority
                src={
                  `${process.env.NEXT_PUBLIC_IMAGE_URL}/${chairmanMessage?.image}` ||
                  '/placeholder.svg'
                }
                alt={`Image of ${chairmanMessage.name}`}
                width={500}
                height={500}
                className="mx-auto h-72 object-cover rounded-t-lg"
              />
              <h2 className="text-xl font-semibold pb-4 text-center pt-2">
                {chairmanMessage.name}
              </h2>
              <div className="flex space-x-4 text-white mx-auto items-center justify-center pb-6">
                {chairmanMessage.facebookURL && (
                  <Link
                    href={chairmanMessage.facebookURL}
                    className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
                  >
                    <span className="sr-only">Facebook</span>
                    <Facebook className="w-4 h-4" />
                  </Link>
                )}
                {chairmanMessage.tweeterURL && (
                  <Link
                    href={chairmanMessage.tweeterURL}
                    className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
                  >
                    <span className="sr-only">Twitter</span>
                    <Twitter className="w-4 h-4" />
                  </Link>
                )}
                {chairmanMessage.instagramURL && (
                  <Link
                    href={chairmanMessage.instagramURL}
                    className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
                  >
                    <span className="sr-only">Instagram</span>
                    <Instagram className="w-4 h-4" />
                  </Link>
                )}
                {chairmanMessage.youtubeURL && (
                  <Link
                    href={chairmanMessage.youtubeURL}
                    className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
                  >
                    <span className="sr-only">YouTube</span>
                    <Youtube className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
            <div className="p-6 pt-6 col-span-5">
              <h2 className="text-3xl font-semibold pb-4 border-b mb-6">Message of The Chairman</h2>
              <p>{chairmanMessage.message}</p>
            </div>
          </div>
        )
      )}
    </section>
  );
};

export default ChairmanMessage;
