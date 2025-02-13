import Footer from '../(root)/components/shared/Footer';
import Navbar from '../(root)/components/shared/Navbar';

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto min-h-[50vh] bg-white shadow-md">{children}</main>
      <Footer />
    </>
  );
};

export default layout;
