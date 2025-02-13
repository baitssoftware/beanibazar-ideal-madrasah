'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Edit, Medal, Trash, Trophy, Users } from 'lucide-react';
import { useState } from 'react';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  year: string;
  category: 'academic' | 'sports' | 'extracurricular';
}

export default function AchievementsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const {
    data: achievements,
    isLoading,
    refetch,
  } = useGetList<Achievement>('/achievements', 'achievements');

  const { mutateAsync: createAchievement } = useCreate<Achievement>(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: updateAchievement } = useUpdate<Achievement>(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: deleteAchievement } = useDelete('/achievements', 'achievements');

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : achievements?.filter((a) => a.category === selectedCategory);

  const handleCreateAchievement = async (achievementData: Omit<Achievement, '_id'>) => {
    try {
      await createAchievement({
        body: achievementData as Achievement,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'সফল', description: 'অর্জন সফলভাবে যোগ করা হয়েছে' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'ত্রুটি',
              description: error.message || 'অর্জন যোগ করতে ব্যর্থ হয়েছে',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create achievement:', error);
    }
  };

  const handleUpdateAchievement = async (id: string, achievementData: Omit<Achievement, '_id'>) => {
    try {
      await updateAchievement({
        id,
        body: achievementData,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'সফল', description: 'অর্জন সফলভাবে আপডেট করা হয়েছে' });
            refetch();
            setEditingAchievement(null);
          },
          onError: (error) => {
            toast({
              title: 'ত্রুটি',
              description: error.message || 'অর্জন আপডেট করতে ব্যর্থ হয়েছে',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update achievement:', error);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই অর্জন মুছে ফেলতে চান?')) {
      try {
        await deleteAchievement({
          id,
          callbacks: {
            onSuccess: () => {
              toast({ title: 'সফল', description: 'অর্জন সফলভাবে মুছে ফেলা হয়েছে' });
              refetch();
            },
            onError: (error) => {
              toast({
                title: 'ত্রুটি',
                description: error.message || 'অর্জন মুছে ফেলতে ব্যর্থ হয়েছে',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete achievement:', error);
      }
    }
  };

  if (isLoading) {
    return <div>লোড হচ্ছে...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">অর্জনসমূহ</h1>
        <AddAchievementModal onAddAchievement={handleCreateAchievement} />
      </div>

      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">সকল</TabsTrigger>
          <TabsTrigger value="academic">একাডেমিক</TabsTrigger>
          <TabsTrigger value="sports">ক্রীড়া</TabsTrigger>
          <TabsTrigger value="extracurricular">সহপাঠ্যক্রম</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements?.map((achievement) => (
          <Card key={achievement._id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-4">
                <AchievementIcon category={achievement.category} />
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingAchievement(achievement)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAchievement(achievement._id)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
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

      {editingAchievement && (
        <EditAchievementModal
          achievement={editingAchievement}
          onUpdateAchievement={handleUpdateAchievement}
          onClose={() => setEditingAchievement(null)}
        />
      )}
    </div>
  );
}

interface AchievementFormData {
  title: string;
  description: string;
  year: string;
  category: 'academic' | 'sports' | 'extracurricular';
}

const AchievementForm = ({
  initialData,
  onSubmit,
  submitText,
}: {
  initialData?: Achievement;
  onSubmit: (data: Omit<Achievement, '_id'>) => void;
  submitText: string;
}) => {
  const [formData, setFormData] = useState<AchievementFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    year: initialData?.year || '',
    category: initialData?.category || 'academic',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">শিরোনাম</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">বিবরণ</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="year">বছর</Label>
        <Input
          id="year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">ক্যাটাগরি</Label>
        <Select
          value={formData.category}
          onValueChange={(value: 'academic' | 'sports' | 'extracurricular') =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="academic">একাডেমিক</SelectItem>
            <SelectItem value="sports">ক্রীড়া</SelectItem>
            <SelectItem value="extracurricular">সহপাঠ্যক্রম</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {submitText}
      </Button>
    </form>
  );
};

const AddAchievementModal = ({
  onAddAchievement,
}: {
  onAddAchievement: (data: Omit<Achievement, '_id'>) => Promise<void>;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>নতুন অর্জন যোগ করুন</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>নতুন অর্জন যোগ করুন</DialogTitle>
        </DialogHeader>
        <AchievementForm onSubmit={onAddAchievement} submitText="যোগ করুন" />
      </DialogContent>
    </Dialog>
  );
};

const EditAchievementModal = ({
  achievement,
  onUpdateAchievement,
  onClose,
}: {
  achievement: Achievement;
  onUpdateAchievement: (id: string, data: Omit<Achievement, '_id'>) => Promise<void>;
  onClose: () => void;
}) => {
  const handleSubmit = (data: Omit<Achievement, '_id'>) => {
    onUpdateAchievement(achievement._id, data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>অর্জন সম্পাদনা করুন</DialogTitle>
        </DialogHeader>
        <AchievementForm
          initialData={achievement}
          onSubmit={handleSubmit}
          submitText="আপডেট করুন"
        />
      </DialogContent>
    </Dialog>
  );
};

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
