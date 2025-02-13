import { cn } from '@/lib/utils';

interface ParagraphSkeletonProps {
  line?: number;
}

const ParagraphSkeleton = ({ line = 4 }: ParagraphSkeletonProps) => {
  return (
    <div role="status" className="animate-pulse rtl:space-x-reverse w-full">
      {Array.from({ length: line }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-3 bg-gray-200 rounded-none dark:bg-gray-700',
            i !== 0 && 'mt-2',
            i === line - 1 ? 'w-8/12' : 'w-full', // Corrected condition
          )}
        ></div>
      ))}
    </div>
  );
};

export default ParagraphSkeleton;
