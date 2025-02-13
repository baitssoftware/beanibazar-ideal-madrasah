import AboutSchool from './components/home/AboutSchool';
import Achievements from './components/home/Achievements';
import Features from './components/home/Features';
import ImageNVideoGallery from './components/home/ImageNVideoGallery';
import InstituteMottoSection from './components/home/InstituteMottoSection';
import NewsNEvents from './components/home/NewsNEvents';
import Notice from './components/home/Notice';
import NoticeSection from './components/notice/NoticeSection';
import ImageSlider from './components/slider/ImageSlider';

const Home = () => {
  return (
    <section>
      <NoticeSection />
      <ImageSlider />
      <div className="grid grid-cols-9 gap-4 py-4">
        <div className="col-span-6">
          <InstituteMottoSection />
        </div>
        <div className="col-span-3">
          <Notice />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="col-span-1">
          <AboutSchool />
        </div>
        <div className="col-span-1">
          <Features />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="col-span-1">
          <NewsNEvents />
        </div>
        <div className="col-span-1">
          <Achievements />
        </div>
      </div>
      <ImageNVideoGallery />
    </section>
  );
};

export default Home;
