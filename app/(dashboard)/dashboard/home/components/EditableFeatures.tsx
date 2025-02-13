'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface FeaturesData {
  _id: string;
  description: string;
  image: string;
}

export function EditableFeatures() {
  const { data: featuresData, isLoading } = useGetList<FeaturesData>('/features', 'features');
  const { mutateAsync: updateFeatures, isPending: isUpdating } = useUpdate<FeaturesData>(
    '/features',
    'features',
  );

  const [features, setFeatures] = useState<FeaturesData>({
    _id: '',
    description: '',
    image: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (featuresData && featuresData.length > 0) {
      setFeatures(featuresData[0]);
    }
  }, [featuresData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeatures((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFeatures((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSave = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('description', features.description);
      if (file) {
        formData.append('image', file);
      }

      await updateFeatures({
        id: features._id,
        body: formData as unknown as FeaturesData,
        callbacks: {
          onSuccess: () => {
            toast({
              title: 'Success',
              description: 'Features updated successfully',
            });
            setDialogOpen(false);
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to update features',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update features:', error);
    }
  }, [features, file, updateFeatures]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="editable border border-primary_school">
      <h2 className="heading">Features</h2>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <div className="grid grid-cols-7 p-4 relative">
          <div className="col-span-2">
            <Image
              priority
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${features.image}`}
              alt="Feature Image"
              className="h-40 w-auto object-cover"
              width={200}
              height={200}
            />
          </div>
          <div className="col-span-5">
            <p>{features.description}</p>
          </div>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-black rounded-full"
            >
              <FilePenLine className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Features</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="featureImage">Feature Image</Label>
              <Input
                id="featureImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {features.image && (
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${features.image}`}
                  alt="Feature Image Preview"
                  width={200}
                  height={100}
                  className="mt-2 object-cover rounded-lg"
                />
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={features.description}
                onChange={handleInputChange}
                rows={6}
                className="mt-2 w-full border border-gray-300 rounded-lg p-2"
              ></textarea>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isUpdating} className="w-full">
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditableFeatures;
