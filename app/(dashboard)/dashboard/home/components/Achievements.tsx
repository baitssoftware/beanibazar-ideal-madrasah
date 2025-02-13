'use client';

import SharedTable from '@/components/table/SharedTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface IAchievementData {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const AchievementsEditable = () => {
  const { data: achievements, isLoading } = useGetList<IAchievementData>(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: updateAchievement, isPending: isUpdating } = useUpdate<IAchievementData>(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: createAchievement, isPending: isCreating } = useCreate(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: deleteAchievement, isPending: isDeleting } = useDelete(
    '/achievements',
    'achievements',
  );

  const [currentAchievement, setCurrentAchievement] = useState<Partial<IAchievementData> | null>(
    null,
  );
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleEdit = (event: IAchievementData) => {
    setCurrentAchievement(event);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentAchievement({ title: '', description: '', image: '' });
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setCurrentAchievement((prev) => (prev ? { ...prev, image: previewUrl } : null));
    }
  };

  const handleSave = useCallback(async () => {
    if (!currentAchievement) return;

    try {
      const formData = new FormData();
      formData.append('title', currentAchievement.title || '');
      formData.append('description', currentAchievement.description || '');
      if (file) {
        formData.append('image', file);
      }

      if (currentAchievement._id) {
        await updateAchievement({
          id: currentAchievement._id,
          body: formData as unknown as IAchievementData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Event updated successfully',
              });
              setDialogOpen(false);
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to update event',
                variant: 'destructive',
              });
            },
          },
        });
      } else {
        await createAchievement({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Event created successfully',
              });
              setDialogOpen(false);
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to create event',
                variant: 'destructive',
              });
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  }, [currentAchievement, file, updateAchievement, createAchievement]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteAchievement({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Event deleted successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to delete event',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    },
    [deleteAchievement],
  );

  const columns = [
    {
      title: 'Achievement Image',
      dataKey: 'image',
      row: (data: IAchievementData) => (
        <div className="flex gap-5 items-center">
          <Image
            priority
            className="w-16 h-12 object-cover"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.image}`}
            alt="Achievement image"
            width={50}
            height={50}
          />
        </div>
      ),
    },
    {
      title: 'Achievement Name',
      dataKey: 'title',
      row: (data: IAchievementData) => <span>{data.title}</span>,
    },
    {
      title: 'Description',
      dataKey: 'description',
      row: (data: IAchievementData) => <span>{data.description.substring(0, 50)}...</span>,
    },
    {
      title: 'Actions',
      dataKey: 'actions',
      row: (data: IAchievementData) => (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(data)}
            disabled={isUpdating}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(data._id)}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="editable border border-primary_school">
      <div className="flex heading items-center justify-between">
        <h2 className="grow">Achievements</h2>
        <Button className="rounded-none" onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Achievements
        </Button>
      </div>
      <SharedTable columns={columns} isLoading={isLoading} data={achievements || []} />

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentAchievement?._id ? 'Edit Event' : 'Add Achievements'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="title">Achievements title</Label>
              <Input
                id="title"
                value={currentAchievement?.title || ''}
                onChange={(e) =>
                  setCurrentAchievement((prev) => prev && { ...prev, title: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="eventDescription">Achievements Description</Label>
              <Textarea
                id="eventDescription"
                value={currentAchievement?.description || ''}
                onChange={(e) =>
                  setCurrentAchievement((prev) => prev && { ...prev, description: e.target.value })
                }
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="eventImage">Achievements Image</Label>
              <Input
                id="eventImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {currentAchievement?.image && (
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${currentAchievement.image}`}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="mt-2 object-cover rounded-md"
                />
              )}
            </div>
          </div>
          <Button onClick={handleSave} disabled={isCreating || isUpdating} className="w-full">
            {isCreating || isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementsEditable;
