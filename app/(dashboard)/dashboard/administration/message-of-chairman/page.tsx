'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { Facebook, FilePenLine, Instagram, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface IChairmanMessage {
  _id: string;
  message: string;
  image: string;
  name: string;
  facebookURL?: string;
  instagramURL?: string;
  tweeterURL?: string;
  youtubeURL?: string;
}

const EditableChairmanMessage = () => {
  const { data: chairmanData, isLoading } = useGetList<IChairmanMessage>(
    '/chairman-message',
    'chairman-message',
  );
  const { mutateAsync: updateChairmanMessage, isPending: isUpdating } = useUpdate<IChairmanMessage>(
    '/chairman-message',
    'chairman-message',
  );

  const [chairmanMessage, setChairmanMessage] = useState<IChairmanMessage>({
    _id: '',
    name: '',
    message: '',
    image: '',
    facebookURL: '',
    instagramURL: '',
    tweeterURL: '',
    youtubeURL: '',
  });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (chairmanData && chairmanData.length > 0) {
      setChairmanMessage(chairmanData[0]);
    }
  }, [chairmanData]);

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setChairmanMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setChairmanMessage((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSave = useCallback(async () => {
    try {
      const formData = new FormData();
      Object.entries(chairmanMessage).forEach(([key, value]) => {
        if (key !== 'image') {
          formData.append(key, value);
        }
      });
      if (file) {
        formData.append('image', file);
      }

      await updateChairmanMessage({
        id: chairmanMessage._id,
        body: formData as unknown as IChairmanMessage,
        callbacks: {
          onSuccess: () => {
            toast({
              title: 'Success',
              description: 'Chairman message updated successfully',
            });
            setDialogOpen(false);
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to update chairman message',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update chairman message:', error);
    }
  }, [chairmanMessage, file, updateChairmanMessage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="editable pb-10 relative ">
      <h2 className="heading">Message of The Chairman</h2>
      <div className="grid grid-cols-7 border relative">
        <div className="mx-auto border-b pb-4 col-span-2 border-e p-10">
          <Image
            priority
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${chairmanMessage.image}`}
            alt={chairmanMessage.name}
            width={500}
            height={500}
            className="mx-auto h-96 object-cover rounded-t-lg"
          />
          <h2 className="text-xl font-semibold pb-4 text-center pt-2">{chairmanMessage.name}</h2>
          <div className="flex space-x-4 text-white mx-auto items-center justify-center pb-6">
            {chairmanMessage.facebookURL && (
              <Link
                href={chairmanMessage.facebookURL}
                className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
              >
                <Facebook className="w-4 h-4" />
              </Link>
            )}
            {chairmanMessage.tweeterURL && (
              <Link
                href={chairmanMessage.tweeterURL}
                className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
              >
                <Twitter className="w-4 h-4" />
              </Link>
            )}
            {chairmanMessage.instagramURL && (
              <Link
                href={chairmanMessage.instagramURL}
                className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
              >
                <Instagram className="w-4 h-4" />
              </Link>
            )}
            {chairmanMessage.youtubeURL && (
              <Link
                href={chairmanMessage.youtubeURL}
                className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
              >
                <Youtube className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
        <div className="p-6 pt-6 col-span-5 relative">
          <Button
            onClick={handleEdit}
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-black rounded-full"
          >
            <FilePenLine className="w-4 h-4" />
          </Button>
          <h2 className="text-3xl font-semibold pb-4 border-b mb-6">Message of The Chairman</h2>
          <p>{chairmanMessage.message}</p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Chairman&#39;s Message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={chairmanMessage.name}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={chairmanMessage.message}
                onChange={handleInputChange}
                className="mt-2"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="chairmanImage">Image</Label>
              <Input
                id="chairmanImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {chairmanMessage.image && (
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${chairmanMessage.image}`}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="mt-2 object-cover rounded-md"
                />
              )}
            </div>
            <div>
              <Label htmlFor="facebookURL">Facebook URL</Label>
              <Input
                id="facebookURL"
                name="facebookURL"
                value={chairmanMessage.facebookURL || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="instagramURL">Instagram URL</Label>
              <Input
                id="instagramURL"
                name="instagramURL"
                value={chairmanMessage.instagramURL || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="tweeterURL">Twitter URL</Label>
              <Input
                id="tweeterURL"
                name="tweeterURL"
                value={chairmanMessage.tweeterURL || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="youtubeURL">YouTube URL</Label>
              <Input
                id="youtubeURL"
                name="youtubeURL"
                value={chairmanMessage.youtubeURL || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={isUpdating} className="w-full">
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EditableChairmanMessage;
