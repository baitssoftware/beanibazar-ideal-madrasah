'use client';

import { useGetById } from '@/hooks/APIHooks';
import { formatDate } from '@/hooks/formatDate';
import Image from 'next/image';
import { useParams } from 'next/navigation';

type IAchievementData = {
  data: {
    _id: string;
    image: string;
    title: string;
    description: string;
    createdAt: Date | string;
  };
};

const AchievementDetails = () => {
  const { id } = useParams() as { id: string };

  // Using a hypothetical `useGetData` hook for fetching a single object
  const { data, isLoading } = useGetById<IAchievementData>(`/achievements`, `achievements`, id);

  const achievement = data?.data;
  console.log(achievement);
  return (
    <div>
      <h2 className="heading">News & Events</h2>
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
        <div>
          <div className="gap-4">
            <div className="col-span-2">
              <Image
                priority
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${achievement?.image || 'logo/logo.jpg'}`}
                alt="school logo"
                className="h-auto w-full object-cover"
                width={200}
                height={200}
              />
            </div>
            <div className="pt-6 space-y-1.5 p-4">
              <p className="text-xs text-gray-500">
                Event Date: {formatDate(achievement?.createdAt)}
              </p>
              <p className="text-2xl font-medium">{achievement?.title}</p>
              <p className="text-gray-500">{achievement?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementDetails;
