/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname } from 'next/navigation';
import DeleteNoticeModal from './Modal/DeleteNoticeModal';
import EditnoticeModal from './Modal/EditNoticeModal';

const NoticeCard = ({ data }: { data: any }) => {
  // making the date in bangla date format
  // Convert to Date object
  const date = new Date(data?.createdAt);

  // Define options for formatting
  const options: any = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  // Format the date in Bengali locale
  const formattedDate = date.toLocaleDateString('bn-BD', options);

  const openPdfUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.pdfUrl}`;

  const pathName = usePathname();
  return (
    <div className="flex  flex-col gap-5 relative w-full justify-between items-center bg-orange-50 max-w-[900px] p-4 border-2 border-orange-500 rounded-md my-3 ">
      <div className="flex  justify-between items-center w-full">
        <div className="notice-card-left">
          <h2 className="text-3xl mb-2 font-extrabold text-black">
            {data?.title || data?.notice_title}
          </h2>
          <p>
            প্রকাশের তারিখ:{' '}
            <span className="text-red-600">{formattedDate || data?.publish_date}</span>{' '}
          </p>
        </div>
        <div className="notice-card-right">
          <button
            className="bg-red-600 text-white hover:bg-gray-300 hover:text-black px-5 py-2 rounded-md"
            onClick={() => window.open(openPdfUrl, '_blank')}
          >
            বিস্তারিত
          </button>
        </div>
      </div>

      {pathName.includes('dashboard') && (
        <div className=" flex gap-3">
          <EditnoticeModal data={data} />
          <DeleteNoticeModal data={data} />
        </div>
      )}
    </div>
  );
};

export default NoticeCard;
