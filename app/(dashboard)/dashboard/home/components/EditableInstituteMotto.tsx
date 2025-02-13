'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MottoData {
  _id: string;
  image: string;
}

export function EditableInstituteMotto() {
  const { data: mottoData, isLoading } = useGetList<MottoData>(
    '/institute-motto',
    'institute-motto',
  );
  const { mutateAsync: updateMotto, isPending: isUpdating } = useUpdate<MottoData>(
    '/institute-motto',
    'institute-motto',
  );

  const [motto, setMotto] = useState<MottoData>({
    _id: '',
    image: '/never_stop_learning_because_life.png',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (mottoData && mottoData.length > 0) {
      setMotto(mottoData[0]);
    }
  }, [mottoData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setMotto((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      }

      await updateMotto({
        id: motto._id,
        body: formData as unknown as MottoData,
        callbacks: {
          onSuccess: () => {
            toast({
              title: 'Success',
              description: 'Institute motto updated successfully',
            });
            setDialogOpen(false);
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to update institute motto',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update institute motto:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="editable py-8 bg-white">
      <div className="pb-4">
        <h2 className="heading w-full">Institute Motto</h2>
      </div>
      <div className="relative">
        <Image
          priority
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${motto.image}`}
          alt="Institute Motto"
          width={280}
          height={280}
          className="w-auto h-52 object-cover shadow-md"
        />
        <Button
          onClick={() => setDialogOpen(true)}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-black rounded-full"
        >
          <FilePenLine className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Institute Motto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="mottoImage">Motto Image</Label>
              <Input
                id="mottoImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {motto.image && (
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${motto.image}`}
                  alt="Motto Preview"
                  width={200}
                  height={200}
                  className="mt-2 object-cover rounded-md"
                />
              )}
            </div>
          </div>
          <Button onClick={handleSave} disabled={isUpdating} className="w-full">
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
