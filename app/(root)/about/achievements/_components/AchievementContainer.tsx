'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Medal, Trophy, Users } from 'lucide-react';
import { useState } from 'react';

type Achievement = {
  id: number;
  title: string;
  description: string;
  year: string;
  category: 'academic' | 'sports' | 'extracurricular';
};

const achievements: Achievement[] = [
  {
    id: 1,
    title: 'জাতীয় বিজ্ঞান অলিম্পিয়াডে স্বর্ণপদক',
    description: 'আমাদের ছাত্র রহিম আহমেদ জাতীয় বিজ্ঞান অলিম্পিয়াডে স্বর্ণপদক অর্জন করেছে।',
    year: '২০২৩',
    category: 'academic',
  },
  {
    id: 2,
    title: 'আন্তঃবিদ্যালয় ফুটবল চ্যাম্পিয়নশিপ জয়',
    description: 'আমাদের স্কুলের ফুটবল দল আন্তঃবিদ্যালয় চ্যাম্পিয়নশিপে প্রথম স্থান অর্জন করেছে।',
    year: '২০২২',
    category: 'sports',
  },
  {
    id: 3,
    title: 'জাতীয় বক্তৃতা প্রতিযোগিতায় সেরা বক্তা',
    description:
      'আমাদের ছাত্রী ফাতেমা খান জাতীয় বক্তৃতা প্রতিযোগিতায় সেরা বক্তার পুরস্কার জিতেছে।',
    year: '২০২৩',
    category: 'extracurricular',
  },
  {
    id: 4,
    title: 'আন্তর্জাতিক গণিত অলিম্পিয়াডে রৌপ্যপদক',
    description: 'আমাদের ছাত্র করিম উদ্দিন আন্তর্জাতিক গণিত অলিম্পিয়াডে রৌপ্যপদক অর্জন করেছে।',
    year: '২০২২',
    category: 'academic',
  },
  {
    id: 5,
    title: 'জাতীয় বাস্কেটবল টুর্নামেন্টে রানার্স-আপ',
    description: 'আমাদের স্কুলের বাস্কেটবল দল জাতীয় টুর্নামেন্টে দ্বিতীয় স্থান অর্জন করেছে।',
    year: '২০২৩',
    category: 'sports',
  },
  {
    id: 6,
    title: 'বিশ্ব পরিবেশ দিবসে সেরা প্রকল্প পুরস্কার',
    description:
      "আমাদের স্কুলের পরিবেশ ক্লাব বিশ্ব পরিবেশ দিবসে তাদের 'সবুজ স্কুল' প্রকল্পের জন্য সেরা প্রকল্প পুরস্কার জিতেছে।",
    year: '২০২৩',
    category: 'extracurricular',
  },
];

export default function AchievementsContainer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">আমাদের অর্জনসমূহ</h1>

      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">সকল</TabsTrigger>
          <TabsTrigger value="academic">একাডেমিক</TabsTrigger>
          <TabsTrigger value="sports">ক্রীড়া</TabsTrigger>
          <TabsTrigger value="extracurricular">সহপাঠ্যক্রম</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <AchievementIcon category={achievement.category} />
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
              <div className="flex justify-between items-center mt-4">
                <Badge variant="secondary">{achievement.year}</Badge>
                <Badge>{getCategoryName(achievement.category)}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AchievementIcon({ category }: { category: Achievement['category'] }) {
  switch (category) {
    case 'academic':
      return <BookOpen className="h-6 w-6 text-blue-500" />;
    case 'sports':
      return <Medal className="h-6 w-6 text-green-500" />;
    case 'extracurricular':
      return <Users className="h-6 w-6 text-purple-500" />;
    default:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
  }
}

function getCategoryName(category: Achievement['category']): string {
  switch (category) {
    case 'academic':
      return 'একাডেমিক';
    case 'sports':
      return 'ক্রীড়া';
    case 'extracurricular':
      return 'সহপাঠ্যক্রম';
    default:
      return 'অন্যান্য';
  }
}
