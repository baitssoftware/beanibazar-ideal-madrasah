import Footer from './(root)/components/shared/Footer';
import Navbar from './(root)/components/shared/Navbar';

const loading = () => {
  return (
    <section className="w-screen h-screen flex flex-col justify-between">
      <Navbar />
      <main className="max-w-7xl mx-auto bg-white px-10 py-8 shadow-md text-3xl">Loading...</main>
      <Footer />
    </section>
  );
};

export default loading;
