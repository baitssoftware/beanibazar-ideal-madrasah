/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useGetList } from '@/hooks/APIHooks';
import { usePathname } from 'next/navigation';
import NoticeCard from './NoticeCard';
import NoticeUploadModal from './Modal/AddNoticeModal';

const NoticeContainer = () => {
  const { data: noticeDataFromDatabase, isLoading }: { data: any; isLoading: boolean } = useGetList(
    '/notice',
    'notice',
  );
  const pathName = usePathname();
  let content = null;
  if (isLoading) {
    content = <div className="flex justify-center items-center">Loading...</div>;
  }
  if (noticeDataFromDatabase?.length > 0) {
    content = noticeDataFromDatabase?.map((notice: any, idx: number) => (
      <NoticeCard key={idx} data={notice} />
    ));
  }

  if (!isLoading && !noticeDataFromDatabase) {
    content = <div className="flex justify-center items-center">No Notice Found</div>;
  }

  return (
    <div className="flex flex-col gap-4  justify-center items-center py-10 ">
      {/* --- Admin Button --- */}
      {pathName.includes('dashboard') && <NoticeUploadModal />}

      {content}
    </div>
  );
};

export default NoticeContainer;
