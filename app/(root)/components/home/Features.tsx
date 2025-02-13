'use client';
import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import ParagraphSkeleton from '@/components/shared/skeleton/ParagraphSkeleton';
import { useGetList } from '@/hooks/APIHooks';
import Image from 'next/image';

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
}

const Features = () => {
  const { data: features, isLoading } = useGetList<Feature>('/features', 'features');

  return (
    <div className="border border-primary_school">
      {isLoading ? (
        <div
          role="status"
          className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
        >
          <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
            <svg
              className="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            ></svg>
          </div>
        </div>
      ) : (
        <div className="">
          <h2 className="heading">Features</h2>
          <div className="grid grid-cols-7 p-4">
            <div className="col-span-2 ">
              {isLoading ? (
                <ImageSkeleton className="h-40 w-auto" />
              ) : (
                // Use ImageSkeleton if `src` is empty
                <Image
                  priority
                  src={
                    features
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${features[0]?.image}`
                      : '/f1.jpg'
                  }
                  alt="school logo"
                  className="h-40 w-auto"
                  width={200}
                  height={200}
                ></Image>
              )}
            </div>
            <div className="col-span-5">
              {isLoading ? (
                <ParagraphSkeleton />
              ) : (
                <p className="">{features && features[0]?.description.slice(0, 300)}...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;
