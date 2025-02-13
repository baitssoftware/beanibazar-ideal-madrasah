import Image from 'next/image';

const Library = () => {
  const glance = [
    {
      name: 'National Robotics Championship ',
      description: 'Secured first place in the National Robotics Championship.',
      date: '2024-11-15',
      link: 'https://schoolwebsite.com/achievements/robotics-championship-2024',
      image: '/achievements.jpg',
    },
    {
      name: 'Annual Inter-School Sports Day and Cultural Fest',
      date: '2025-02-15',
      description: 'Secured first place in the National Robotics Championship.',
      link: 'https://schoolwebsite.com/events/annual-sports-day-cultural-fest',
      image: '/School-Event-Planning.jpg',
    },
  ];
  return (
    <div>
      <div className="">
        {glance.map((g, idx) => (
          <div className="py-6 relative" key={idx}>
            <Image
              priority
              src={g.image}
              alt={`${g.name}, g`}
              width={500}
              height={500}
              className="h-80 w-full object-cover "
            ></Image>
            <p className="px-4 py-2 text-xs bg-white absolute top-10 left-4">
              Publish Date: {g.date}
            </p>
            <div className="p-6 pt-3">
              <h2 className="text-lg font-semibold">{g.name}</h2>
              <p className="text-sm">{g.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
