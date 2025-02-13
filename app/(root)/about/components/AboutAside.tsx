import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ImportantLink from '../../components/shared/ImportentLink';

const AboutAside = () => {
  const relatedTopics = [
    {
      name: 'At A Glance',
      link: '/about/at-a-glance',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'History',
      link: '/about/history',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Why Study at Our Institute',
      link: '/about/why-study-at-mcpsc',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Mission and Vision',
      link: '/about/mission-and-vision',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Infrastructure',
      link: '/about/infrastructure',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'Achievements',
      link: '/about/achievement',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
    {
      name: 'News & Events',
      link: '/about/news-events',
      icon: <ChevronRight className="inline w-5 mb-1 text-yellow-400" />,
    },
  ];

  return (
    <div className="">
      <div className="border-s p-4 pt-0  sticky top-20">
        <h2 className="heading">Related Topics</h2>
        <ul className="mt-2  space-y-2 px-4 py-5 bg-orange-100 shadow-lg">
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

export default AboutAside;
