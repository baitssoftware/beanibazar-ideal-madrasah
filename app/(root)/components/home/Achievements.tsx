'use client';

import { useGetList } from '@/hooks/APIHooks';
import { formatDate } from '@/hooks/formatDate';
import { cn } from '@/lib/utils';
import { BookOpen, Medal, Trophy, Users } from 'lucide-react';

import Link from 'next/link';

interface IAchievementData {
  _id: string;
  image: string;
  title: string;
  description: string;
  category: 'academic' | 'sports' | 'extracurricular';

  createdAt: string;
}

const Achievements = () => {
  const { data: achievements, isLoading } = useGetList<IAchievementData>(
    '/achievements',
    'achievements',
  );

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
          <h2 className="heading">Achievements</h2>
          <Link href={'/about/achievements'}>
            {achievements?.slice(0, 2).map((achievement, idx) => (
              <div
                className={cn(
                  'grid grid-cols-8 p-4 gap-4',
                  idx !== achievements?.length && 'border-b',
                )}
                key={idx}
              >
                <div className="col-span-2 flex items-center justify-center ">
                  <AchievementIcon category={achievement.category} />
                </div>
                <div className="col-span-5 space-y-1.5">
                  <p className="text-xs text-gray-500">
                    Event Date: {formatDate(achievement?.createdAt)}
                  </p>
                  <p className="text-2xl font-medium">{achievement?.title}</p>
                  <p className="text- text-gray-500">
                    Event Date: {achievement?.description.slice(0, 80)}...
                  </p>
                </div>
              </div>
            ))}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Achievements;

type Achievement = {
  id: number;
  title: string;
  description: string;
  year: string;
  category: 'academic' | 'sports' | 'extracurricular';
};

function AchievementIcon({ category }: { category: Achievement['category'] }) {
  switch (category) {
    case 'academic':
      return <BookOpen className="h-16 w-16 text-blue-500" />;
    case 'sports':
      return <Medal className="h-16 w-16 text-green-500" />;
    case 'extracurricular':
      return <Users className="h-16 w-16 text-purple-500" />;
    default:
      return <Trophy className="h-16 w-16 text-yellow-500" />;
  }
}
