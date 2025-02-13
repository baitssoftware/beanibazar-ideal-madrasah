'use client';

import { useImageUpload } from '@/app/(dashboard)/hooks/useImageUpload';
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
import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface EditableImageProps {
  initialSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onImageChange: (newSrc: string) => void;
}

export function EditableImage({
  initialSrc,
  alt,
  width,
  height,
  className,
  onImageChange,
}: EditableImageProps) {
  const { imageUrl, previewUrl, isUploading, error, handleFileChange, handleUpload } =
    useImageUpload(initialSrc);
  const [isPlaceholder, setIsPlaceholder] = useState(initialSrc.includes('placeholder.svg'));

  const handleSave = async () => {
    await handleUpload();
    if (imageUrl) {
      onImageChange(imageUrl);
      setIsPlaceholder(false);
    }
  };

  return (
    <div className="relative group">
      <Image
        priority
        src={isPlaceholder ? initialSrc : previewUrl || initialSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isPlaceholder ? 'bg-gray-200' : ''}`}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FilePenLine className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isPlaceholder ? 'Add Image' : 'Edit Image'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="imageUpload">
              Upload {isPlaceholder ? 'New' : 'Replacement'} Image
            </Label>
            <Input id="imageUpload" type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <Image
                priority
                src={previewUrl}
                alt="Preview"
                width={width}
                height={height}
                className="mt-2 object-cover rounded-lg"
              />
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <Button onClick={handleSave} disabled={isUploading}>
            {isUploading ? 'Uploading...' : isPlaceholder ? 'Add' : 'Save'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
