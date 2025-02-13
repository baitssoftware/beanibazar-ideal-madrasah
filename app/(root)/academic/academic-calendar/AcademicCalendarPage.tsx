import Image from 'next/image';
import ImportantLink from '../../components/shared/ImportentLink';
import Notice from '../../notice/page';

const AcademicCalendarPage = () => {
  return (
    <section className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Academic Calendar</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Image
            priority
            src="/acd.jpg"
            alt="Academic Calendar"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div>
          <Notice />
          <ImportantLink />
        </div>
      </div>
    </section>
  );
};

export default AcademicCalendarPage;
