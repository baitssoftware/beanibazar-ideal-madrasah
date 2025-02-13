'use client';
import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import ParagraphSkeleton from '@/components/shared/skeleton/ParagraphSkeleton';
import { useGetList } from '@/hooks/APIHooks';
import Image from 'next/image';

interface HistoryData {
  _id: string;
  title: string;
  image: string;
  description: string;
}

const InstituteHistory = () => {
  const { data: historyData, isLoading } = useGetList<HistoryData>('/history', 'history');
  const history = historyData && historyData[0];
  return (
    <div>
      <h2 className="heading">History of Our Institute</h2>
      <div className="">
        <div className="py-6">
          <div className="mx-auto border-b pb-4">
            {isLoading ? (
              <ImageSkeleton className="h-40 w-11/12 mx-auto" />
            ) : (
              <div className="">
                {history?.image && (
                  <Image
                    priority
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${history.image}`}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="mt-2 object-cover rounded-md mx-auto max-h-60 w-auto"
                  />
                )}
              </div>
            )}
          </div>
          <div className="p-6 pt-6">
            <h2 className="text-3xl font-semibold pb-4">History of Our Institute</h2>
            {isLoading ? (
              <p className="text-md">
                <ParagraphSkeleton line={6} />
              </p>
            ) : (
              <p className="text-md">{history?.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteHistory;
