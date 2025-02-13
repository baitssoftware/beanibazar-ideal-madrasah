import Image from 'next/image';

const Features_Copy = () => {
  return (
    <div className="border border-primary_school my-10">
      <h2 className="heading">Notice </h2>
      <div className="flex my-20 flex-col justify-center items-center">
        <div className=" ">
          <Image
            src={'/f1.jpg'}
            alt="school logo"
            className="w-full"
            width={200}
            height={200}
          ></Image>
        </div>
        <div className="max-w-[800px] my-20">
          <p className="text-lg font-semibold">
            শিক্ষা মানুষের মৌলিক অধিকার। দেশ-জাতিকে গড়ে তোলাই সকল শিক্ষার মূল উদ্দেশ্য। সমাজ ও
            রাষ্ট্র গঠনের জন্য এবং উন্নতজীবন গড়ার জন্য সুশিক্ষার প্রয়োজন। মানবিক মূল্যবোধ, চারিত্রিক
            উৎকর্ষ ও মনুষ্যত্ব বিকাশের জন্য এবং বর্তমান বিশ্বে টিকে থাকার জন্য সুশিক্ষা অতীব
            প্রয়োজন।
          </p>
          <span className="hover:text-blue-600 hover:underline cursor-pointer">Read More...</span>
        </div>
      </div>
    </div>
  );
};

export default Features_Copy;
