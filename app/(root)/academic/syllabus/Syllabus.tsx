'use client';

import { useGetList } from '@/hooks/APIHooks';
import { Download } from 'lucide-react';

interface TSyllabus {
  title: string;
  pdfUrl: string;
}

const Syllabus = () => {
  const { data: syllabusList, isLoading } = useGetList<TSyllabus>('/syllabus', 'syllabuses');

  return (
    <div className="">
      <h2 className="heading">Syllabus</h2>
      <h2 className="text-xl font-semibold mt-6 mb-4">View and Download Syllabus PDFs</h2>
      {isLoading ? (
        <div className="">Loading...</div>
      ) : (
        <div className="">
          {syllabusList?.map((syllabus, idx) => (
            <div key={idx} className="px-6 py-3.5 mb-2 bg-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{syllabus.title}</h3>
                <a
                  href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${syllabus?.pdfUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline flex items-center h-10 gap-3 pe-3 border border-blue-600"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white">
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

export default Syllabus;
