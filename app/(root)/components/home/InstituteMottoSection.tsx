import Image from 'next/image';

const InstituteMottoSection = () => {
  return (
    <div className="border border-primary_school">
      <h2 className="heading">Motto of Our Institute</h2>
      <Image
        priority
        src={'/never_stop_learning_because_life.png'}
        alt="never_stop_learning_because_life"
        width={800}
        height={800}
        className="w-full h-[400px] object-cover"
      ></Image>
    </div>
  );
};

export default InstituteMottoSection;
