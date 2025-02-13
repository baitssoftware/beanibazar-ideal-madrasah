'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

interface GlanceItem {
  _id: string;
  image: string;
  title: string;
  description: string;
  createdAt: string;
}

const At_a_glance_container = () => {
  const pathName = usePathname();
  const { data: glanceItems, isLoading } = useGetList<GlanceItem>('/at-a-glance', 'at-a-glance');
  const { mutateAsync: deleteGlanceItem, isPending: isDeleting } = useDelete(
    '/at-a-glance',
    'at-a-glance',
  );

  console.log(glanceItems);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteGlanceItem({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Glance item deleted successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to delete glance item',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete glance item:', error);
      }
    },
    [deleteGlanceItem],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="my-5 flex justify-end">
        {pathName === '/dashboard/about/at-a-glance' && (
          <>
            <EditModal ButtonText="Add New" mode="create" />
          </>
        )}
      </div>
      <h2 className="heading flex justify-between items-center">at a glance</h2>
      <div className="">
        {glanceItems?.map((g) => (
          <div className="py-6 relative" key={g._id}>
            <Image
              priority
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${g.image}`}
              alt={g.title}
              width={500}
              height={500}
              className="h-80 w-full object-cover rounded-t-lg"
            />
            <p className="px-4 py-2 text-xs bg-white absolute top-10 left-4">
              Publish Date: {new Date(g.createdAt).toLocaleDateString()}
            </p>
            <div className="p-6 pt-3">
              <h2 className="text-3xl">{g.title}</h2>
              <p className="">{g.description}</p>
              {pathName.includes('dashboard') && (
                <div className="mt-4 flex justify-end space-x-2">
                  <EditModal ButtonText="Edit" mode="edit" initialData={g} />
                  <Button
                    onClick={() => handleDelete(g._id)}
                    disabled={isDeleting}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default At_a_glance_container;

interface EditModalProps {
  ButtonText: string;
  mode: 'create' | 'edit';
  initialData?: GlanceItem;
}

export function EditModal({ ButtonText, mode, initialData }: EditModalProps) {
  const [editData, setEditData] = useState<Partial<GlanceItem>>(initialData || {});
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: createGlanceItem, isPending: isCreating } = useCreate(
    '/at-a-glance',
    'at-a-glance',
  );
  const { mutateAsync: updateGlanceItem, isPending: isUpdating } = useUpdate<GlanceItem>(
    '/at-a-glance',
    'at-a-glance',
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(selectedFile);
      setEditData((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSave = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('title', editData.title || '');
      formData.append('description', editData.description || '');
      if (file) {
        formData.append('image', file);
      }

      if (mode === 'edit' && editData._id) {
        await updateGlanceItem({
          id: editData._id,
          body: formData as unknown as Partial<GlanceItem>,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Glance item updated successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to update glance item',
                variant: 'destructive',
              });
            },
          },
        });
      } else {
        await createGlanceItem({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Glance item created successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to create glance item',
                variant: 'destructive',
              });
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to save glance item:', error);
    }
  }, [editData, mode, updateGlanceItem, createGlanceItem, file]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#3C9E62] text-xl px-5 py-3 hover:text-white">{ButtonText}</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Glance Item' : 'Edit Glance Item'}
          </DialogTitle>
        </DialogHeader>

        <div>
          <Label htmlFor="glanceImage" className="text-2xl">
            Image
          </Label>
          <Input
            id="glanceImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
          {editData.image && (
            <Image
              priority
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${editData.image}` || '/placeholder.svg'}
              alt="Glance Item Preview"
              width={200}
              height={100}
              className="mt-2 object-cover rounded-lg w-full"
            />
          )}

          <div>
            <Label htmlFor="title" className="text-3xl font-bold">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={editData.title || ''}
              onChange={handleInputChange}
              className="mt-2 w-full border border-gray-300 rounded-lg p-2 font-semibold"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={editData.description || ''}
              onChange={handleInputChange}
              rows={4}
              className="mt-2 w-full border border-gray-300 rounded-lg p-2"
            ></textarea>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
