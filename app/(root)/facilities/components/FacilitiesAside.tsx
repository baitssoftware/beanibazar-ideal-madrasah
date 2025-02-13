import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ImportantLink from '../../components/shared/ImportentLink';

const FacilitiesAside = () => {
  const relatedTopics = [
    {
      name: 'Classrooms',
      link: '/facilities/classroom',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Computer Lab',
      link: '/facilities/computer-lab',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Science Lab',
      link: '/facilities/science-lab',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Canteen',
      link: '/facilities/canteen',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Library',
      link: '/facilities/library',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Club',
      link: '/facilities/club',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
  ];

  return (
    <div className="">
      <div className="border-s p-4 pt-0  sticky top-20">
        <h2 className="heading">Related Topics</h2>
        <ul className="mt-2 space-y-2 px-4 py-5 bg-orange-100 shadow-lg">
          {relatedTopics.map((topic, index) => (
            <li key={index}>
              <Link href={topic.link} passHref>
                {topic.icon}
                <span className="ml-2">{topic.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ImportantLink />
    </div>
  );
};

export default FacilitiesAside;
