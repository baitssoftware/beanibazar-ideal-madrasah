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
import { useCreate, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface HeaderData {
  _id?: string;
  logo: string;
  school_name: string;
  address: string;
  eiin: number;
  school_code: number;
  email: string;
  mobile_no: string;
  website: string;
}

export function EditableHeader() {
  const { data: headerData, isLoading } = useGetList<HeaderData>('/info', 'info');
  const { mutateAsync: createHeader, isPending: isCreating } = useCreate('/info', 'info');
  const { mutateAsync: updateHeader, isPending: isUpdating } = useUpdate<HeaderData>(
    '/info',
    'info',
  );

  const [editData, setEditData] = useState<HeaderData | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setLogoFile(selectedFile);
    }
  };

  const handleSave = useCallback(async () => {
    if (!editData) return;

    const formData = new FormData();

    // Append all text fields
    (Object.keys(editData) as Array<keyof HeaderData>).forEach((key) => {
      if (key !== 'logo' && key !== '_id') {
        formData.append(key, String(editData[key]));
      }
    });

    // Append logo file if exists
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      if (editData._id) {
        await updateHeader({
          id: editData._id,
          body: formData as unknown as HeaderData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Header updated successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to update header',
                variant: 'destructive',
              });
            },
          },
        });
      } else {
        await createHeader({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Header created successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to create header',
                variant: 'destructive',
              });
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to save header:', error);
    }
  }, [editData, logoFile, updateHeader, createHeader]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const header = headerData?.[0];

  return (
    <div className="editable">
      <h2 className="heading mb-2">Header</h2>
      <Dialog>
        <header className="py-6 pb-8 bg-[#20526B] text-white relative">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                priority
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${header?.logo}` || '/placeholder.svg'}
                alt="school logo"
                width={100}
                height={100}
                className="h-28 w-auto"
              />
              <div className="h-full flex flex-col justify-between items-start grow">
                <h1 className="text-3xl font-semibold pb-2">{header?.school_name}</h1>
                <div>
                  <p className="text-md">{header?.address}</p>
                  <p className="text-md">
                    EIIN: {header?.eiin}, School Code: {header?.school_code}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p>{header?.email}</p>
              <p>{header?.mobile_no}</p>
              <p>{header?.website}</p>
            </div>
          </div>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-black rounded-full"
              onClick={() => {
                setEditData(
                  header || {
                    logo: '',
                    school_name: '',
                    address: '',
                    eiin: 0,
                    school_code: 0,
                    email: '',
                    mobile_no: '',
                    website: '',
                  },
                );
                setLogoFile(null);
              }}
            >
              <FilePenLine className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </header>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Header Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="logo">School Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {(logoFile || header?.logo) && (
                <Image
                  priority
                  src={
                    logoFile
                      ? URL.createObjectURL(logoFile)
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${header?.logo}`
                  }
                  alt="School Logo Preview"
                  width={100}
                  height={100}
                  className="mt-2 object-cover rounded-lg"
                />
              )}
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="school_name">School Name</Label>
                <Input
                  id="school_name"
                  name="school_name"
                  value={editData?.school_name || ''}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={editData?.address || ''}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eiin">EIIN</Label>
                  <Input
                    id="eiin"
                    name="eiin"
                    type="number"
                    value={editData?.eiin || ''}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="school_code">School Code</Label>
                  <Input
                    id="school_code"
                    name="school_code"
                    type="number"
                    value={editData?.school_code || ''}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editData?.email || ''}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="mobile_no">Mobile Number</Label>
                <Input
                  id="mobile_no"
                  name="mobile_no"
                  value={editData?.mobile_no || ''}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={editData?.website || ''}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isCreating || isUpdating} className="w-full">
            {isCreating || isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditableHeader;
