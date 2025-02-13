'use client';
import { usePathname } from 'next/navigation';
import AdmissionAside from './components/AdmissionAside';

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pathname = usePathname();
  const currentPath = pathname?.split('-')?.join(' ')?.slice(1, pathname?.length);
  return (
    <>
      <div className="grid grid-cols-9 gap-4 py-4">
        <div className="col-span-6">
          <h2 className="heading">{currentPath}</h2>
          {children}
        </div>
        <div className="col-span-3">
          <AdmissionAside />
        </div>
      </div>
    </>
  );
};

export default layout;
