'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetList } from '@/hooks/APIHooks';
import { formatDate } from '@/hooks/formatDate';
import Image from 'next/image';
import Link from 'next/link';

type NewsItem = {
  id: number;
  title: string;
  createdAt: string;
  description: string;
  image: string;
  category: 'news' | 'event';
};

const NewsAndEventsContainer = () => {
  const { data: newsNEventData, isLoading } = useGetList<NewsItem>('/news-events', 'news-events');

  const filteredNews = newsNEventData?.filter((item) => item.category === 'news') || [];
  const filteredEvents = newsNEventData?.filter((item) => item.category === 'event') || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-800">নিউজ & ইভেন্ট</h1>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="news">সর্বশেষ নিউজ</TabsTrigger>
          <TabsTrigger value="events">আসন্ন ইভেন্ট</TabsTrigger>
        </TabsList>

        {/* News Tab */}
        <TabsContent value="news">
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <Link key={item.id} href={`/about/news-events/${item.id}`}>
                  <Card className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`}
                        alt={item.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <p className="text-sm text-gray-500 mb-2">{formatDate(item.createdAt)}</p>
                      <p className="text-sm">{item.description.slice(0, 100)}...</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center">No news available.</p>
          )}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((item) => (
                <Link key={item.id} href={`/about/news-events/${item.id}`}>
                  <Card className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`}
                        alt={item.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <p className="text-sm text-gray-500 mb-2">{formatDate(item.createdAt)}</p>
                      <p className="text-sm">{item.description.slice(0, 100)}...</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center">No upcoming events at the moment.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsAndEventsContainer;
