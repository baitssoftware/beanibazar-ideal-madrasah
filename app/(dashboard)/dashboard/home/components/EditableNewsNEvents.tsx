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

interface EventData {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const EditableNewsNEvents = () => {
  const { data: eventsData, isLoading } = useGetList<EventData>('/news-events', 'news-events');
  const { mutateAsync: createEvent, isPending: isCreating } = useCreate(
    '/news-events',
    'news-events',
  );
  const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdate<EventData>(
    '/news-events',
    'news-events',
  );
  const { mutateAsync: deleteEvent, isPending: isDeleting } = useDelete(
    '/news-events',
    'news-events',
  );

  const [currentEvent, setCurrentEvent] = useState<Partial<EventData> | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleEdit = (event: EventData) => {
    setCurrentEvent(event);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentEvent({ title: '', description: '', image: '' });
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setCurrentEvent((prev) => (prev ? { ...prev, image: previewUrl } : null));
    }
  };

  const handleSave = useCallback(async () => {
    if (!currentEvent) return;

    try {
      const formData = new FormData();
      formData.append('title', currentEvent.title || '');
      formData.append('description', currentEvent.description || '');
      if (file) {
        formData.append('image', file);
      }

      if (currentEvent._id) {
        await updateEvent({
          id: currentEvent._id,
          body: formData as unknown as EventData,
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
        await createEvent({
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
  }, [currentEvent, file, updateEvent, createEvent]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteEvent({
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
    [deleteEvent],
  );

  const columns = [
    {
      title: 'Event Image',
      dataKey: 'image',
      row: (data: EventData) => (
        <div className="flex gap-5 items-center">
          <Image
            priority
            className="w-16 h-12 object-cover"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.image}`}
            alt="Event image"
            width={50}
            height={50}
          />
        </div>
      ),
    },
    {
      title: 'Event Name',
      dataKey: 'title',
      row: (data: EventData) => <span>{data.title}</span>,
    },
    {
      title: 'Description',
      dataKey: 'description',
      row: (data: EventData) => <span>{data.description.substring(0, 50)}...</span>,
    },
    {
      title: 'Actions',
      dataKey: 'actions',
      row: (data: EventData) => (
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
        <h2 className="grow">News & Events</h2>
        <Button className="rounded-none" onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Event
        </Button>
      </div>
      <SharedTable columns={columns} isLoading={isLoading} data={eventsData || []} />

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentEvent?._id ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="title">Event title</Label>
              <Input
                id="title"
                value={currentEvent?.title || ''}
                onChange={(e) =>
                  setCurrentEvent((prev) => prev && { ...prev, title: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="eventDescription">Event Description</Label>
              <Textarea
                id="eventDescription"
                value={currentEvent?.description || ''}
                onChange={(e) =>
                  setCurrentEvent((prev) => prev && { ...prev, description: e.target.value })
                }
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="eventImage">Event Image</Label>
              <Input
                id="eventImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {currentEvent?.image && (
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${currentEvent.image}`}
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

export default EditableNewsNEvents;
