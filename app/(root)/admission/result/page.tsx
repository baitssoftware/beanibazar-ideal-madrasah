'use client';

import { useGetList } from '@/hooks/APIHooks';

interface TAdmissionResult {
  title: string;
  pdfUrl: string;
}

const Result = () => {
  const { data: admissionResults, isLoading } = useGetList<TAdmissionResult>(
    '/admission-result',
    'admission-result',
  );

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">View and Download PDF Files</h2>
      {isLoading ? (
        <div className="">Loading...</div>
      ) : (
        <div className="">
          {admissionResults?.map((result, idx) => (
            <div key={idx} className="p-6 border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{result.title}</h3>
                <a
                  href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${result?.pdfUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Result;
