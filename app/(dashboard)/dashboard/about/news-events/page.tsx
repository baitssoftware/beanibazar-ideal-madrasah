'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { formatDate } from '@/hooks/formatDate';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface NewsItem {
  _id: string;
  title: string;
  createdAt: string;
  description: string;
  image: string;
  category: 'news' | 'event';
}

export default function NewsAndEventsDashboard() {
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [selectedTab, setSelectedTab] = useState<'news' | 'event'>('news');
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>([]);

  const { data: items, isLoading, refetch } = useGetList<NewsItem>('/news-events', 'news-events');

  const { mutateAsync: createItem } = useCreate<NewsItem>('/news-events', 'news-events');
  const { mutateAsync: updateItem } = useUpdate<NewsItem>('/news-events', 'news-events');
  const { mutateAsync: deleteItem } = useDelete('/news-events', 'news-events');

  useEffect(() => {
    if (items) {
      setFilteredItems(items.filter((item) => item.category === selectedTab));
    }
  }, [items, selectedTab]);

  console.log({ filteredItems });

  const handleCreateItem = async (formData: FormData) => {
    try {
      await createItem({
        body: formData as unknown as NewsItem,

        callbacks: {
          onSuccess: () => {
            toast({ title: 'সফল', description: 'সফলভাবে যোগ করা হয়েছে' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'ত্রুটি',
              description: error.message || 'যোগ করতে ব্যর্থ হয়েছে',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  const handleUpdateItem = async (id: string, formData: FormData) => {
    try {
      await updateItem({
        id,
        body: formData as unknown as NewsItem,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'সফল', description: 'সফলভাবে আপডেট করা হয়েছে' });
            refetch();
            setEditingItem(null);
          },
          onError: (error) => {
            toast({
              title: 'ত্রুটি',
              description: error.message || 'আপডেট করতে ব্যর্থ হয়েছে',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?')) {
      try {
        await deleteItem({
          id,
          callbacks: {
            onSuccess: () => {
              toast({ title: 'সফল', description: 'সফলভাবে মুছে ফেলা হয়েছে' });
              refetch();
            },
            onError: (error) => {
              toast({
                title: 'ত্রুটি',
                description: error.message || 'মুছে ফেলতে ব্যর্থ হয়েছে',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (isLoading) {
    return <div>লোড হচ্ছে...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-800">নিউজ & ইভেন্ট</h1>
        <AddItemModal onAddItem={handleCreateItem} />
      </div>

      <Tabs
        defaultValue="news"
        className="w-full"
        onValueChange={(value: string) => setSelectedTab(value as 'news' | 'event')}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="news">সর্বশেষ নিউজ</TabsTrigger>
          <TabsTrigger value="event">আসন্ন ইভেন্ট</TabsTrigger>
        </TabsList>
        <TabsContent value="news">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems?.map((item) => (
              <NewsEventCard
                key={item._id}
                item={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDeleteItem(item._id)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="event">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems?.map((item) => (
              <NewsEventCard
                key={item._id}
                item={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDeleteItem(item._id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onUpdateItem={handleUpdateItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

const NewsEventCard = ({
  item,
  onEdit,
  onDelete,
}: {
  item: NewsItem;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0 relative">
        <Image
          priority
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item?.image}`}
          alt={item.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button size="sm" variant="secondary" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
        <p className="text-sm text-muted-foreground mb-2">{formatDate(item.createdAt)}</p>
        <p className="text-sm">
          {expanded ? item.description : `${item.description.slice(0, 100)}...`}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="ghost" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'সংক্ষিপ্ত করুন' : 'আরও পড়ুন'}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface ItemFormData {
  title: string;
  description: string;
  category: 'news' | 'event';
  image?: File;
}

const ItemForm = ({
  initialData,
  onSubmit,
  submitText,
}: {
  initialData?: NewsItem;
  onSubmit: (data: FormData) => void;
  submitText: string;
}) => {
  const [formData, setFormData] = useState<ItemFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'news',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('category', formData.category);
    if (selectedFile) {
      formDataToSubmit.append('image', selectedFile);
    }
    onSubmit(formDataToSubmit);
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
        <Label htmlFor="category">ক্যাটাগরি</Label>
        <Select
          value={formData.category}
          onValueChange={(value: 'news' | 'event') => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="news">নিউজ</SelectItem>
            <SelectItem value="event">ইভেন্ট</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="image">ছবি</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          required={!initialData}
        />
      </div>

      <Button type="submit" className="w-full">
        {submitText}
      </Button>
    </form>
  );
};

const AddItemModal = ({ onAddItem }: { onAddItem: (data: FormData) => Promise<void> }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>নতুন যোগ করুন</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>নতুন নিউজ/ইভেন্ট যোগ করুন</DialogTitle>
        </DialogHeader>
        <ItemForm onSubmit={onAddItem} submitText="যোগ করুন" />
      </DialogContent>
    </Dialog>
  );
};

const EditItemModal = ({
  item,
  onUpdateItem,
  onClose,
}: {
  item: NewsItem;
  onUpdateItem: (id: string, data: FormData) => Promise<void>;
  onClose: () => void;
}) => {
  const handleSubmit = (data: FormData) => {
    onUpdateItem(item._id, data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>সম্পাদনা করুন</DialogTitle>
        </DialogHeader>
        <ItemForm initialData={item} onSubmit={handleSubmit} submitText="আপডেট করুন" />
      </DialogContent>
    </Dialog>
  );
};
