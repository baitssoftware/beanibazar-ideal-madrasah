'use client';

import ParagraphSkeleton from '@/components/shared/skeleton/ParagraphSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetList } from '@/hooks/APIHooks';
import { Eye, Lightbulb, Target } from 'lucide-react';

interface MissionVisionItem {
  id?: string;
  type: 'mission' | 'vision';
  mainDescription?: string;
  points?: string[];
  icon?: string;
  title?: string;
  description?: string;
}

export default function MissionAndVision() {
  const { data: items, isLoading } = useGetList<MissionVisionItem>(
    '/mission-vision',
    'mission-vision',
  );

  const missionItems = items?.filter((item) => item.type === 'mission') || [];
  const visionItems = items?.filter((item) => item.type === 'vision') || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">আমাদের লক্ষ্য ও উদ্দেশ্য</h1>

      <Tabs defaultValue="mission" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-green-100">
          <TabsTrigger value="mission">লক্ষ্য</TabsTrigger>
          <TabsTrigger value="vision">উদ্দেশ্য</TabsTrigger>
        </TabsList>
        <TabsContent value="mission">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-6 w-6" />
                আমাদের লক্ষ্য
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ParagraphSkeleton line={2} />
              ) : missionItems.length > 0 ? (
                <>
                  <p className="mb-4">{missionItems[0]?.mainDescription}</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {missionItems[0]?.points?.map((point, idx) => <li key={idx}>{point}</li>)}
                  </ul>
                </>
              ) : (
                <p className="text-muted-foreground">কোনো তথ্য পাওয়া যায়নি।</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vision">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-6 w-6" />
                আমাদের উদ্দেশ্য
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  <ParagraphSkeleton line={4} />
                ) : visionItems.length > 0 ? (
                  visionItems.map((item) => (
                    <VisionCard
                      key={item.id}
                      icon={item.icon ? getIconComponent(item.icon) : null}
                      title={item.title || 'শিরোনাম নেই'}
                      description={item.description || 'বিবরণ নেই'}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground">কোনো তথ্য পাওয়া যায়নি।</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VisionCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start p-4">
        <div className="mr-4 mt-1 text-primary">{icon}</div>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getIconComponent(iconName: string): React.ReactNode {
  switch (iconName) {
    case 'lightbulb':
      return <Lightbulb className="h-6 w-6" />;
    case 'eye':
      return <Eye className="h-6 w-6" />;
    case 'target':
      return <Target className="h-6 w-6" />;
    default:
      return null;
  }
}
