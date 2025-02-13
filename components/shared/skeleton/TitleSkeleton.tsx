import { cn } from '@/lib/utils';

interface TitleSkeletonProps {
  className?: string;
}
const TitleSkeleton = ({ className }: TitleSkeletonProps) => {
  return (
    <div
      role="status"
      className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center w-full"
    >
      <div className={cn('h-5 bg-gray-200 rounded-none dark:bg-gray-700 w-60 ', className)}></div>
    </div>
  );
};

export default TitleSkeleton;
