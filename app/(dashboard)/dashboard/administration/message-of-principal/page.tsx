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

interface IPrincipalMessage {
  _id: string;
  message: string;
  image: string;
  name: string;
  facebookURL?: string;
  instagramURL?: string;
  twitterURL?: string;
  youtubeURL?: string;
}

const PrincipalMessage = () => {
  const { data: principalData, isLoading } = useGetList<IPrincipalMessage>(
    '/principal-message',
    'principal-message',
  );
  const { mutateAsync: updatePrincipalMessage, isPending: isUpdating } =
    useUpdate<IPrincipalMessage>('/principal-message', 'principal-message');

  const [principalMessage, setPrincipalMessage] = useState<IPrincipalMessage>({
    _id: '',
    name: '',
    message: '',
    image: '',
    facebookURL: '',
    instagramURL: '',
    twitterURL: '',
    youtubeURL: '',
  });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (principalData && principalData.length > 0) {
      setPrincipalMessage(principalData[0]);
    }
  }, [principalData]);

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrincipalMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPrincipalMessage((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSave = useCallback(async () => {
    try {
      const formData = new FormData();
      Object.entries(principalMessage).forEach(([key, value]) => {
        if (key !== 'image') {
          formData.append(key, value);
        }
      });
      if (file) {
        formData.append('image', file);
      }

      await updatePrincipalMessage({
        id: principalMessage._id,
        body: formData as unknown as IPrincipalMessage,
        callbacks: {
          onSuccess: () => {
            toast({
              title: 'Success',
              description: 'Principal message updated successfully',
            });
            setDialogOpen(false);
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to update principal message',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update principal message:', error);
    }
  }, [principalMessage, file, updatePrincipalMessage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="pb-10 relative">
      <h2 className="heading">Message of The Principal</h2>
      <div className="grid grid-cols-7 border relative">
        <div className="mx-auto border-b pb-4 col-span-2 border-e p-10">
          <Image
            priority
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${principalMessage.image}`}
            alt={principalMessage.name}
            width={500}
            height={500}
            className="mx-auto h-72 object-cover rounded-t-lg"
          />
          <h2 className="text-xl font-semibold pb-4 text-center pt-2">{principalMessage.name}</h2>
          <div className="flex space-x-4 text-white mx-auto items-center justify-center pb-6">
            {principalMessage.facebookURL && (
              <Link
                href={principalMessage.facebookURL}
                className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
              >
                <Facebook className="w-4 h-4" />
              </Link>
            )}
            {principalMessage.twitterURL && (
              <Link
                href={principalMessage.twitterURL}
                className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
              >
                <Twitter className="w-4 h-4" />
              </Link>
            )}
            {principalMessage.instagramURL && (
              <Link
                href={principalMessage.instagramURL}
                className="rounded-full bg-[#1B365C] p-2 hover:opacity-80"
              >
                <Instagram className="w-4 h-4" />
              </Link>
            )}
            {principalMessage.youtubeURL && (
              <Link
                href={principalMessage.youtubeURL}
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
          <h2 className="text-3xl font-semibold pb-4 border-b mb-6">Message of The Principal</h2>
          <p>{principalMessage.message}</p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Principal&#39;s Message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={principalMessage.name}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={principalMessage.message}
                onChange={handleInputChange}
                className="mt-2"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="principalImage">Image</Label>
              <Input
                id="principalImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {principalMessage.image && (
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${principalMessage.image}`}
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
                value={principalMessage.facebookURL || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="instagramURL">Instagram URL</Label>
              <Input
                id="instagramURL"
                name="instagramURL"
                value={principalMessage.instagramURL || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="twitterURL">Twitter URL</Label>
              <Input
                id="twitterURL"
                name="twitterURL"
                value={principalMessage.twitterURL || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="youtubeURL">YouTube URL</Label>
              <Input
                id="youtubeURL"
                name="youtubeURL"
                value={principalMessage.youtubeURL || ''}
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

export default PrincipalMessage;
