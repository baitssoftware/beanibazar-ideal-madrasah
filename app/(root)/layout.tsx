import { Toaster } from '@/components/ui/toaster';
import Head from 'next/head';
import Footer from './components/shared/Footer';
import Navbar from './components/shared/Navbar';

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const schoolName = 'Beanibazar Ideal Madrasah';
  return (
    <>
      <Head>
        <title>{schoolName}</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <Navbar />
      <main className="max-w-7xl mx-auto min-h-[50vh] bg-white px-4 shadow-md">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
};

export default layout;
