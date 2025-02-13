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

interface Video {
  _id: string;
  link: string;
  title: string;
  thumbnail: string;
}

const VideoContainer = () => {
  const pathName = usePathname();

  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const { data: videos, isLoading, refetch } = useGetList<Video>('/video', 'videos');
  const { mutateAsync: createVideo } = useCreate('/video', 'videos');

  const { mutateAsync: deleteVideo, isPending: isDeleting } = useDelete('/video', 'videos');

  const handleAddVideo = useCallback(
    async (file: File, title: string, link: string) => {
      try {
        const formData = new FormData();
        formData.append('thumbnail', file);
        formData.append('title', title);
        formData.append('link', link);

        await createVideo({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Video added successfully',
              });
              refetch();
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to add Video',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to add Video:', error);
      }
    },
    [createVideo, refetch],
  );

  const handleDeleteVideo = useCallback(
    async (id: string) => {
      try {
        await deleteVideo({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Video deleted successfully',
              });
              refetch();
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to delete Video',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete Video:', error);
      }
    },
    [deleteVideo, refetch],
  );

  const handleDeleteMultipleVideos = useCallback(async () => {
    try {
      await Promise.all(selectedVideos.map((id) => deleteVideo({ id })));
      toast({
        title: 'Success',
        description: 'Selected Videos deleted successfully',
      });
      setSelectedVideos([]);
      refetch();
    } catch (error) {
      console.error('Failed to delete multiple Videos:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete selected Videos',
        variant: 'destructive',
      });
    }
  }, [selectedVideos, deleteVideo, refetch]);

  const toggleVideoSelection = (id: string) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((videoId) => videoId !== id) : [...prev, id],
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="">
      <h2 className="heading">Video Gallery</h2>

      <div className="mt-10 w-full flex items-center justify-center lg:px-0 sm:px-6 px-4 gap-8">
        <AddVideoModal onAddVideo={handleAddVideo} />
        <Button
          className="shadow-xl bg-red-600 drop-shadow-xl py-8 px-8 text-lg rounded-sm text-white"
          onClick={handleDeleteMultipleVideos}
          disabled={selectedVideos.length === 0 || isDeleting}
        >
          Delete Selected Videos
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 pt-10 pb-6 px-6">
        {videos?.map((video) => (
          <a key={video._id} href={video.link} target="_blank">
            <div className="shadow-lg overflow-hidden w-full border relative border-primary_school/10">
              <Image
                priority
                width={300}
                height={300}
                className="h-72 w-full object-cover relative"
                src={video?.thumbnail && `${process.env.NEXT_PUBLIC_IMAGE_URL}/${video.thumbnail}`}
                alt={video.title}
              />
              <h4 className="py-3 px-6 font-semibold text-xl">{video.title}</h4>

              {pathName.includes('dashboard') && (
                <div className="mt-10 absolute right-1 -top-8 flex flex-col gap-y-2 bg-white p-3 rounded-lg">
                  <DeleteVideoModal video={video} onDeleteVideo={handleDeleteVideo} />
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video._id)}
                    onChange={() => toggleVideoSelection(video._id)}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* Pagination component (implementation not shown for brevity) */}
    </section>
  );
};

export default VideoContainer;

const AddVideoModal = ({
  onAddVideo,
}: {
  onAddVideo: (file: File, title: string, link: string) => Promise<void>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file && title && link) {
      await onAddVideo(file, title, link);
      setFile(null);
      setTitle('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="shadow-xl drop-shadow-xl bg-blue-700 py-8 px-8 text-lg rounded-sm text-white">
          Add Videos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
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
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="Video">Video</Label>
            <Input
              id="Video"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Video</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteVideoModal = ({
  video,
  onDeleteVideo,
}: {
  video: Video;
  onDeleteVideo: (id: string) => Promise<void>;
}) => {
  const handleDelete = async () => {
    await onDeleteVideo(video._id);
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
          <DialogTitle>Delete Video</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this video?</p>
          <Image
            priority
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${video.thumbnail}`}
            alt={video.title}
            width={200}
            height={200}
            className="mt-2 object-cover rounded-lg"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleDelete} className="bg-[#FF0135] text-white hover:bg-red-700">
            <FaRegTrashAlt className="mr-2" /> Delete Video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
