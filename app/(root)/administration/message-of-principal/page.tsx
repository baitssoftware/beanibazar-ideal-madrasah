'use client';

import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import ParagraphSkeleton from '@/components/shared/skeleton/ParagraphSkeleton';
import TitleSkeleton from '@/components/shared/skeleton/TitleSkeleton';
import { useGetList } from '@/hooks/APIHooks';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PrincipalMessage {
  _id: string;
  message: string;
  image: string;
  name: string;
  facebookURL?: string;
  instagramURL?: string;
  tweeterURL?: string;
  youtubeURL?: string;
}

const PrincipalMessage = () => {
  const { data: principalData, isLoading } = useGetList<PrincipalMessage>(
    '/principal-message',
    'principal-message',
  );
  const principalMessage = principalData?.[0];

  return (
    <section className="pb-10">
      <h2 className="heading">Message of The Principal</h2>
      {isLoading ? (
        <div className="">
          <div className="grid grid-cols-7 border">
            <div className="border-b pb-4 col-span-2 border-e p-10 w-full">
              <ImageSkeleton className="mx-auto h-72 object-cover w-full" />
              <TitleSkeleton className="text-xl font-semibold pb-4 text-center pt-2 mt-3 mx-auto" />
              <TitleSkeleton className="text-xl font-semibold pb-4 text-center pt-2 mt-3 mx-auto w-36" />
            </div>
            <div className="p-6 pt-6 col-span-5">
              <h2 className="text-3xl font-semibold pb-4 border-b mb-6">
                Message of The Principal
              </h2>
              <ParagraphSkeleton line={10} />
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="grid grid-cols-7 border">
            <div className="mx-auto border-b pb-4 col-span-2 border-e p-10">
              <Image
                priority
                src={
                  `${process.env.NEXT_PUBLIC_IMAGE_URL}/${principalMessage?.image}` ||
                  '/placeholder.svg'
                }
                alt={principalMessage?.name || 'Principal'}
                width={500}
                height={500}
                className="mx-auto h-72 object-cover rounded-t-lg"
              />
              <h2 className="text-xl font-semibold pb-4 text-center pt-2">
                {principalMessage?.name}
              </h2>
              <div className="flex space-x-4 text-white mx-auto items-center justify-center pb-6">
                {principalMessage?.facebookURL && (
                  <Link
                    href={principalMessage.facebookURL}
                    className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
                  >
                    <span className="sr-only">Facebook</span>
                    <Facebook className="w-4 h-4" />
                  </Link>
                )}
                {principalMessage?.tweeterURL && (
                  <Link
                    href={principalMessage.tweeterURL}
                    className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
                  >
                    <span className="sr-only">Twitter</span>
                    <Twitter className="w-4 h-4" />
                  </Link>
                )}
                {principalMessage?.instagramURL && (
                  <Link
                    href={principalMessage.instagramURL}
                    className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
                  >
                    <span className="sr-only">Instagram</span>
                    <Instagram className="w-4 h-4" />
                  </Link>
                )}
                {principalMessage?.youtubeURL && (
                  <Link
                    href={principalMessage.youtubeURL}
                    className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
                  >
                    <span className="sr-only">YouTube</span>
                    <Youtube className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
            <div className="p-6 pt-6 col-span-5">
              <h2 className="text-3xl font-semibold pb-4 border-b mb-6">
                Message of The Principal
              </h2>
              <p>{principalMessage?.message}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PrincipalMessage;
