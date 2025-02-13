'use client';

import { useGetList } from '@/hooks/APIHooks';
import { Download } from 'lucide-react';

interface TAdmissionCircular {
  title: string;
  pdfUrl: string;
}

const Circular = () => {
  const { data: admissionCirculars, isLoading } = useGetList<TAdmissionCircular>(
    '/admission-circular',
    'admission-circular',
  );

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">View and Download PDF Files</h2>
      {isLoading ? (
        <div className="">Loading...</div>
      ) : (
        <div className="">
          {admissionCirculars?.map((circular, idx) => (
            <div key={idx} className="px-6 py-3.5 mb-2 bg-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{circular.title}</h3>
                <a
                  href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${circular?.pdfUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline flex items-center   h-10 gap-3 pe-3 border border-blue-600"
                >
                  <div className="w-10 h-10 flex items-center justify-center  bg-blue-500 text-white">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="">Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Circular;
