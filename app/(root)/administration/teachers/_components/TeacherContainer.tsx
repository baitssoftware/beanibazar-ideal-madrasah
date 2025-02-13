'use client';

import SharedTable from '@/components/table/SharedTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import TeacherListForUser from './TeacherListForUser';

interface TeacherData {
  _id: string;
  name: string;
  designation: string;
  experience: string;
  department: string;
  email: string;
  phone: string;
  subject: string;
  address: string;
  education: string;
  image: string;
}

const TeacherContainer = () => {
  const pathName = usePathname();
  const { data: teachersData, isLoading } = useGetList<TeacherData>('/teachers', 'teachers');
  const { mutateAsync: createTeacher, isPending: isCreating } = useCreate('/teachers', 'teachers');
  const { mutateAsync: updateTeacher, isPending: isUpdating } = useUpdate<TeacherData>(
    '/teachers',
    'teachers',
  );
  const { mutateAsync: deleteTeacher, isPending: isDeleting } = useDelete('/teachers', 'teachers');

  const [currentTeacher, setCurrentTeacher] = useState<Partial<TeacherData> | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleEdit = (teacher: TeacherData) => {
    setCurrentTeacher(teacher);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentTeacher({ name: '', designation: '', image: '' });
    setDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTeacher((prev) => (prev ? { ...prev, [name]: value } : null));
  };
  const handleDepartmentChange = (value: string) => {
    setCurrentTeacher((prev) => (prev ? { ...prev, department: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setCurrentTeacher((prev) => (prev ? { ...prev, image: previewUrl } : null));
    }
  };

  const handleSave = useCallback(async () => {
    if (!currentTeacher) return;

    try {
      const formData = new FormData();
      formData.append('name', currentTeacher.name || '');
      formData.append('designation', currentTeacher.designation || '');
      formData.append('experience', currentTeacher.experience || '');
      formData.append('department', currentTeacher.department || '');
      formData.append('email', currentTeacher.email || '');
      formData.append('phone', currentTeacher.phone || '');
      formData.append('subject', currentTeacher.subject || '');
      formData.append('address', currentTeacher.address || '');
      formData.append('education', currentTeacher.education || '');
      if (file) {
        formData.append('image', file);
      }

      if (currentTeacher._id) {
        await updateTeacher({
          id: currentTeacher._id,
          body: formData as unknown as TeacherData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Teacher updated successfully',
              });
              setDialogOpen(false);
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to update teacher',
                variant: 'destructive',
              });
            },
          },
        });
      } else {
        await createTeacher({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Teacher created successfully',
              });
              setDialogOpen(false);
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to create teacher',
                variant: 'destructive',
              });
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to save teacher:', error);
    }
  }, [currentTeacher, file, updateTeacher, createTeacher]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTeacher({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Teacher deleted successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to delete teacher',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    },
    [deleteTeacher],
  );

  const columns = [
    {
      title: 'Image',
      dataKey: 'image',
      row: (data: TeacherData) => (
        <Image
          priority
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.image}`}
          alt={data.name}
          width={50}
          height={50}
          className="rounded-full"
        />
      ),
    },
    { title: 'Name', dataKey: 'name', row: (data: TeacherData) => <span>{data.name}</span> },
    {
      title: 'Designation',
      dataKey: 'designation',
      row: (data: TeacherData) => <span>{data.designation}</span>,
    },
    {
      title: 'Department',
      dataKey: 'department',
      row: (data: TeacherData) => <span>{data.department}</span>,
    },
    { title: 'Email', dataKey: 'email', row: (data: TeacherData) => <span>{data.email}</span> },
    { title: 'Phone', dataKey: 'phone', row: (data: TeacherData) => <span>{data.phone}</span> },
    {
      title: 'Subject',
      dataKey: 'subject',
      row: (data: TeacherData) => <span>{data.subject}</span>,
    },
    {
      title: 'Address',
      dataKey: 'address',
      row: (data: TeacherData) => <span>{data.address}</span>,
    },
    {
      title: 'Actions',
      dataKey: 'actions',
      row: (data: TeacherData) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(data)}
            disabled={isUpdating}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(data._id)}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return pathName.includes('dashboard') ? (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Teachers</h2>
        {pathName.includes('dashboard') && <Button onClick={handleAddNew}>Add New Teacher</Button>}
      </div>

      <SharedTable columns={columns} isLoading={isLoading} data={teachersData || []} />

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentTeacher?._id ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={currentTeacher?.name || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                name="designation"
                value={currentTeacher?.designation || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={currentTeacher?.department || ''}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger id="department" className="mt-2">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Science">বিজ্ঞান (Science)</SelectItem>
                  <SelectItem value="Arts">কলা (Arts)</SelectItem>
                  <SelectItem value="Commerce">বাণিজ্য (Commerce)</SelectItem>
                  <SelectItem value="General">সাধারণ (General)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={currentTeacher?.email || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={currentTeacher?.phone || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={currentTeacher?.subject || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                name="experience"
                value={currentTeacher?.experience || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                name="education"
                value={currentTeacher?.education || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={currentTeacher?.address || ''}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="teacherImage">Image</Label>
              <Input
                id="teacherImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {currentTeacher?.image && (
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${currentTeacher.image}`}
                  alt="Teacher Preview"
                  width={100}
                  height={100}
                  className="mt-2 rounded-full"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  ) : (
    <TeacherListForUser />
  );
};

export default TeacherContainer;
