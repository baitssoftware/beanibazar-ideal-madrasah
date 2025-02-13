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

interface AboutData {
  description: string;
  schoolLogoUrl: string;
}

export function EditableAboutSchool() {
  const [aboutData, setAboutData] = useState<AboutData>({
    description:
      'শিক্ষা মানুষের মৌলিক অধিকার। দেশ-জাতিকে গড়ে তোলাই সকল শিক্ষার মূল উদ্দেশ্য। সমাজ ও রাষ্ট্র গঠনের জন্য এবং উন্নতজীবন গড়ার জন্য সুশিক্ষার প্রয়োজন। মানবিক মূল্যবোধ, চারিত্রিক উৎকর্ষ ও মনুষ্যত্ব বিকাশের জন্য এবং বর্তমান বিশ্বে টিকে থাকার জন্য সুশিক্ষা অতীব প্রয়োজন।',
    schoolLogoUrl: '/logo/logo.jpg',
  });

  const {
    imageUrl: schoolImageUrl,
    previewUrl: schoolPreviewUrl,
    isUploading: isSchoolUploading,
    error: schoolError,
    handleFileChange: handleSchoolFileChange,
    handleUpload: handleSchoolUpload,
  } = useImageUpload(aboutData.schoolLogoUrl);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAboutData((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleSave = async () => {
    await handleSchoolUpload();
    setAboutData((prev) => ({
      ...prev,
      schoolLogoUrl: schoolImageUrl || prev.schoolLogoUrl,
    }));
  };

  return (
    <div className="editable  border-primary_school">
      <h2 className="heading">About School-</h2>
      <Dialog>
        <div className="grid grid-cols-7 p-4 relative">
          <div className="col-span-2">
            <Image
              priority
              src={aboutData.schoolLogoUrl}
              alt="school logo"
              className="h-40 w-auto"
              width={200}
              height={200}
            />
          </div>
          <div className="col-span-5">
            <p>{aboutData.description}</p>
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
            <DialogTitle>Edit About School</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="schoolLogo">School Logo</Label>
              <Input
                id="schoolLogo"
                type="file"
                accept="image/*"
                onChange={handleSchoolFileChange}
                className="mt-2"
              />
              {schoolPreviewUrl && (
                <Image
                  priority
                  src={schoolPreviewUrl}
                  alt="School Logo Preview"
                  width={100}
                  height={100}
                  className="mt-2 object-cover rounded-lg"
                />
              )}
              {schoolError && <p className="text-red-500 text-sm mt-1">{schoolError}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={aboutData.description}
                onChange={handleInputChange}
                rows={6}
                className="mt-2 w-full border border-gray-300 rounded-lg p-2"
              ></textarea>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSchoolUploading} className="w-full">
            {isSchoolUploading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditableAboutSchool;
