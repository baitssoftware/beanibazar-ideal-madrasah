"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Dumbbell, FlaskRoundIcon as Flask, Laptop, Music, Trees, Utensils } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

type Facility = {
  id: number
  name: string
  description: string
  imageUrl: string
  icon: React.ReactNode
}

const facilities: Facility[] = [
  {
    id: 1,
    name: "পুস্তকাগার",
    description: "আমাদের বিশাল পুস্তকাগারে ৫০,০০০+ বই রয়েছে, যা ছাত্রদের জ্ঞান আহরণে সাহায্য করে।",
    imageUrl: "/photos/1.jpg?height=300&width=400",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    id: 2,
    name: "বিজ্ঞানাগার",
    description: "আধুনিক যন্ত্রপাতি সমৃদ্ধ আমাদের বিজ্ঞানাগার ছাত্রদের গবেষণা ও পরীক্ষা-নিরীক্ষায় সহায়তা করে।",
    imageUrl: "/photos/2.jpg?height=300&width=400",
    icon: <Flask className="h-6 w-6" />,
  },
  {
    id: 3,
    name: "কম্পিউটার ল্যাব",
    description: "আমাদের কম্পিউটার ল্যাবে রয়েছে ১০০টি আধুনিক কম্পিউটার, যা ছাত্রদের ডিজিটাল দক্ষতা বৃদ্ধিতে সাহায্য করে।",
    imageUrl: "/photos/3.jpg?height=300&width=400",
    icon: <Laptop className="h-6 w-6" />,
  },
  {
    id: 4,
    name: "ক্রীড়াঙ্গন",
    description: "বিশাল ক্রীড়াঙ্গনে রয়েছে ফুটবল মাঠ, ক্রিকেট পিচ, বাস্কেটবল কোর্ট ও ভলিবল কোর্ট।",
    imageUrl: "/photos/4.jpg?height=300&width=400",
    icon: <Dumbbell className="h-6 w-6" />,
  },
  {
    id: 5,
    name: "সঙ্গীত কক্ষ",
    description: "আমাদের সঙ্গীত কক্ষে রয়েছে বিভিন্ন ধরনের বাদ্যযন্ত্র, যা ছাত্রদের সাংস্কৃতিক শিক্ষায় সহায়তা করে।",
    imageUrl: "/photos/5.jpg?height=300&width=400",
    icon: <Music className="h-6 w-6" />,
  },
  {
    id: 6,
    name: "ক্যাফেটেরিয়া",
    description: "আমাদের ক্যাফেটেরিয়ায় স্বাস্থ্যকর ও পুষ্টিকর খাবার পরিবেশন করা হয়।",
    imageUrl: "/photos/6.jpg?height=300&width=400",
    icon: <Utensils className="h-6 w-6" />,
  },
  {
    id: 7,
    name: "সবুজ চত্বর",
    description: "আমাদের সবুজ চত্বরে রয়েছে বিভিন্ন প্রজাতির গাছ ও ফুল, যা পরিবেশ সচেতনতা বৃদ্ধিতে সাহায্য করে।",
    imageUrl: "/photos/7.jpg?height=300&width=400",
    icon: <Trees className="h-6 w-6" />,
  },
]

export const InfrastructureContainer = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">আমাদের অবকাঠামো</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              {facility.icon}
              <CardTitle className="text-lg">{facility.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{facility.description}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedFacility(facility)}>
                    বিস্তারিত দেখুন
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedFacility?.name}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <Image
                      src={selectedFacility?.imageUrl || "/photos/1.jpg"}
                      alt={selectedFacility?.name || "Facility"}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <p className="mt-4 text-sm">{selectedFacility?.description}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

