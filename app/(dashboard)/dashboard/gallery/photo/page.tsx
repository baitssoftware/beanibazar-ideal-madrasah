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
import { useCreate, useDelete, useGetList } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

interface Photo {
  _id: string;
  title: string;
  image: string;
}

const PhotoContainer = () => {
  const pathName = usePathname();

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const { data: photos, isLoading, refetch } = useGetList<Photo>('/photo', 'photos');
  const { mutateAsync: createPhoto } = useCreate('/photo', 'photos');

  const { mutateAsync: deletePhoto, isPending: isDeleting } = useDelete('/photo', 'photos');

  const handleAddPhoto = useCallback(
    async (file: File, title: string) => {
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);

        await createPhoto({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Photo added successfully',
              });
              refetch();
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to add photo',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to add photo:', error);
      }
    },
    [createPhoto, refetch],
  );

  const handleDeletePhoto = useCallback(
    async (id: string) => {
      try {
        await deletePhoto({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Photo deleted successfully',
              });
              refetch();
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to delete photo',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete photo:', error);
      }
    },
    [deletePhoto, refetch],
  );

  const handleDeleteMultiplePhotos = useCallback(async () => {
    try {
      await Promise.all(selectedPhotos.map((id) => deletePhoto({ id })));
      toast({
        title: 'Success',
        description: 'Selected photos deleted successfully',
      });
      setSelectedPhotos([]);
      refetch();
    } catch (error) {
      console.error('Failed to delete multiple photos:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete selected photos',
        variant: 'destructive',
      });
    }
  }, [selectedPhotos, deletePhoto, refetch]);

  const togglePhotoSelection = (id: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(id) ? prev.filter((photoId) => photoId !== id) : [...prev, id],
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="">
      <h2 className="heading">Photo Gallery</h2>

      <div className="mt-10 w-full flex items-center justify-center lg:px-0 sm:px-6 px-4 gap-8">
        <AddPhotoModal onAddPhoto={handleAddPhoto} />
        <Button
          className="shadow-xl bg-red-600 drop-shadow-xl py-8 px-8 text-lg rounded-sm text-white"
          onClick={handleDeleteMultiplePhotos}
          disabled={selectedPhotos.length === 0 || isDeleting}
        >
          Delete Selected Photos
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 pt-10 pb-6 px-6">
        {photos?.map((photo) => (
          <div
            className="shadow-lg overflow-hidden w-full border relative border-primary_school/10"
            key={photo._id}
          >
            <Image
              priority
              width={300}
              height={300}
              className="h-72 w-full object-cover relative"
              src={photo?.image && `${process.env.NEXT_PUBLIC_IMAGE_URL}/${photo.image}`}
              alt={photo.title}
            />
            <h4 className="py-3 px-6 font-semibold text-xl">{photo.title}</h4>

            {pathName.includes('dashboard') && (
              <div className="mt-10 absolute right-1 -top-8 flex flex-col gap-y-2 bg-white p-3 rounded-lg">
                <DeletePhotoModal photo={photo} onDeletePhoto={handleDeletePhoto} />
                <input
                  type="checkbox"
                  checked={selectedPhotos.includes(photo._id)}
                  onChange={() => togglePhotoSelection(photo._id)}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination component (implementation not shown for brevity) */}
    </section>
  );
};

export default PhotoContainer;

const AddPhotoModal = ({
  onAddPhoto,
}: {
  onAddPhoto: (file: File, title: string) => Promise<void>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file && title) {
      await onAddPhoto(file, title);
      setFile(null);
      setTitle('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="shadow-xl drop-shadow-xl bg-blue-700 py-8 px-8 text-lg rounded-sm text-white">
          Add Photos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Photo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Photo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeletePhotoModal = ({
  photo,
  onDeletePhoto,
}: {
  photo: Photo;
  onDeletePhoto: (id: string) => Promise<void>;
}) => {
  const handleDelete = async () => {
    await onDeletePhoto(photo._id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#FF0135] shadow-xl drop-shadow-xl px-5 py-3 rounded-sm text-white">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Photo</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this photo?</p>
          <Image
            priority
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${photo.image}`}
            alt={photo.title}
            width={200}
            height={200}
            className="mt-2 object-cover rounded-lg"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleDelete} className="bg-[#FF0135] text-white hover:bg-red-700">
            <FaRegTrashAlt className="mr-2" /> Delete Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
