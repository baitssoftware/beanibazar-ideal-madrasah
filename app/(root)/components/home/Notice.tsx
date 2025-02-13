'use client';

import { useGetList } from '@/hooks/APIHooks';
import { formatDate } from '@/hooks/formatDate';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useEffect, useState } from 'react';

interface Notice {
  title: string;
  createdAt: string;
  id: string; // Assuming notices have an ID for the individual notice page
}

const Notice = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [offset, setOffset] = useState(0);
  const { data: noticeData, isLoading } = useGetList<Notice>('/notice', 'notices');
  const router = useRouter(); // Initialize the router

  // Update notices when noticeData is available
  useEffect(() => {
    if (noticeData) {
      setNotices(noticeData);
    }
  }, [noticeData]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!notices.length) return;

    const intervalId = setInterval(() => {
      setOffset((prevOffset) => (prevOffset + 1) % notices?.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [notices]);

  const handleNoticeClick = () => {
    // router.push(`/notice/${noticeId}`); // Redirect to the individual notice page
    router.push(`/notice`); // Redirect to the individual notice page
  };

  if (isLoading) return <div>Loading...</div>;

  if (!notices.length) return <div>No notices available.</div>;

  return (
    <div className="shadow-sm">
      <div>
        <h2 className="heading">নোটিশ বোর্ড</h2>
      </div>

      <div className="relative min-h-[400px] overflow-hidden">
        <div
          className="absolute w-full transition-transform duration-1000 ease-linear"
          style={{ transform: `translateY(-${offset * 100}px)` }}
        >
          {notices?.map((notice, index) => (
            <div
              key={`${notice.createdAt}_${index}`}
              className="h-[100px] p-4 my-3 bg-orange-100 rounded-lg border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleNoticeClick()} // Attach click handler
            >
              <div className="h-full flex flex-col justify-between ps-6 relative">
                <span className="absolute top-2 -left-1">
                  <ChevronRight className="inline w-5 mb-1 text-yellow-600" />
                </span>
                <p className="text-sm md:text-base text-red-900 line-clamp-2 font-bold">
                  {notice.title}
                </p>
                <p className="text-sm text-gray-500">
                  প্রকাশের তারিখ: {formatDate(notice.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notice;
