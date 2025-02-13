'use client';

import { useGetList } from '@/hooks/APIHooks';
import Image from 'next/image';
import Link from 'next/link';

interface TAboutData {
  _id: string;
  image: string;
  description: string;
  title: string;
}

const AboutSchool = () => {
  const { data: aboutData, isLoading } = useGetList<TAboutData>('/history', 'history');

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
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <div className="w-full">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="">
          <h2 className="heading">About School</h2>
          <Link href={'/about/history'}>
            <div className="grid grid-cols-7 p-4">
              <div className="col-span-2 ">
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${aboutData ? aboutData[0]?.image : 'logo/logo.jpg'}`}
                  alt="school logo"
                  width={100}
                  height={100}
                  className="h-40 w-auto"
                />
              </div>
              <div className="col-span-5">
                <p className="">
                  {aboutData
                    ? aboutData[0]?.description.slice(0, 260)
                    : `শিক্ষা মানুষের মৌলিক অধিকার। দেশ-জাতিকে গড়ে তোলাই সকল শিক্ষার মূল উদ্দেশ্য। সমাজ ও রাষ্ট্র গঠনের জন্য এবং উন্নতজীবন গড়ার জন্য সুশিক্ষার প্রয়োজন। মানবিক মূল্যবোধ, চারিত্রিক উৎকর্ষ ও মনুষ্যত্ব বিকাশের জন্য এবং বর্তমান বিশ্বে টিকে থাকার জন্য সুশিক্ষা অতীব প্রয়োজন।`}
                  ...
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AboutSchool;
