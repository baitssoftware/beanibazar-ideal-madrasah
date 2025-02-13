import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Book, Users, Globe } from "lucide-react"

export const WhyStudyContainer = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">আমাদের প্রতিষ্ঠানে পড়াশোনা করার কারণ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ReasonCard
          icon={<GraduationCap className="h-8 w-8 text-primary" />}
          title="উচ্চমানের শিক্ষা"
          description="আমরা আধুনিক পাঠ্যক্রম এবং অভিজ্ঞ শিক্ষকদের মাধ্যমে উচ্চমানের শিক্ষা প্রদান করি।"
        />
        <ReasonCard
          icon={<Book className="h-8 w-8 text-primary" />}
          title="বিস্তৃত পাঠ্যক্রম"
          description="আমাদের বিস্তৃত পাঠ্যক্রম ছাত্রদের সামগ্রিক বিকাশে সহায়তা করে।"
        />
        <ReasonCard
          icon={<Users className="h-8 w-8 text-primary" />}
          title="সহযোগী পরিবেশ"
          description="আমাদের প্রতিষ্ঠানে রয়েছে একটি বন্ধুত্বপূর্ণ এবং সহযোগী শিক্ষা পরিবেশ।"
        />
        <ReasonCard
          icon={<Globe className="h-8 w-8 text-primary" />}
          title="আন্তর্জাতিক সুযোগ"
          description="আমরা ছাত্রদের জন্য বিভিন্ন আন্তর্জাতিক সুযোগ-সুবিধা প্রদান করি।"
        />
      </div>

      <div className="text-center">
        <p className="text-lg mb-4">আমাদের প্রতিষ্ঠানে যোগ দিন এবং আপনার ভবিষ্যৎকে উজ্জ্বল করুন!</p>
        <Button size="lg">আবেদন করুন</Button>
      </div>
    </div>
  )
}

function ReasonCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center p-6">
        {icon}
        <h2 className="text-xl font-semibold mt-4 mb-2">{title}</h2>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}

