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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { FaDownload, FaEdit, FaRegTrashAlt } from 'react-icons/fa';

interface Syllabus {
  _id: string;
  title: string;
  pdfUrl: string;
}

const SyllabusDashboard = () => {
  const [editingSyllabus, setEditingSyllabus] = useState<Syllabus | null>(null);

  const { data: syllabuses, isLoading, refetch } = useGetList<Syllabus>('/syllabus', 'syllabuses');
  const { mutateAsync: createSyllabus } = useCreate<Syllabus>('/syllabus', 'syllabuses');
  const { mutateAsync: updateSyllabus } = useUpdate<Syllabus>('/syllabus', 'syllabuses');
  const { mutateAsync: deleteSyllabus } = useDelete('/syllabus', 'syllabuses');

  const handleCreateSyllabus = async (syllabusData: FormData) => {
    try {
      await createSyllabus({
        body: syllabusData as unknown as Syllabus,

        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Syllabus created successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to create syllabus',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create syllabus:', error);
    }
  };

  const handleUpdateSyllabus = async (id: string, syllabusData: FormData) => {
    try {
      await updateSyllabus({
        id,
        body: syllabusData as unknown as Syllabus,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Syllabus updated successfully' });
            refetch();
            setEditingSyllabus(null);
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to update syllabus',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update syllabus:', error);
    }
  };

  const handleDeleteSyllabus = async (id: string) => {
    try {
      await deleteSyllabus({
        id,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Syllabus deleted successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to delete syllabus',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to delete syllabus:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Syllabus Dashboard</h1>

      <AddSyllabusModal onAddSyllabus={handleCreateSyllabus} />

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>PDF</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {syllabuses?.map((syllabus) => (
            <TableRow key={syllabus._id}>
              <TableCell>{syllabus.title}</TableCell>
              <TableCell>
                <button
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_IMAGE_URL}/${syllabus?.pdfUrl}`,
                      '_blank',
                    )
                  }
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaDownload className="mr-2" /> Download PDF
                </button>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingSyllabus(syllabus)}>
                    <FaEdit className="mr-2" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSyllabus(syllabus._id)}
                  >
                    <FaRegTrashAlt className="mr-2" /> Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingSyllabus && (
        <EditSyllabusModal
          syllabus={editingSyllabus}
          onUpdateSyllabus={handleUpdateSyllabus}
          onClose={() => setEditingSyllabus(null)}
        />
      )}
    </div>
  );
};

interface SyllabusFormData {
  title: string;
  pdfFile?: File;
}

const SyllabusForm = ({
  initialData,
  onSubmit,
  submitText,
}: {
  initialData?: Syllabus;
  onSubmit: (data: FormData) => void;
  submitText: string;
}) => {
  const [formData, setFormData] = useState<SyllabusFormData>({
    title: initialData?.title || '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'pdfFile' && files && files[0]) {
      setSelectedFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    console.log(selectedFile);

    formDataToSubmit.append('title', formData.title);
    if (selectedFile) {
      formDataToSubmit.append('pdf', selectedFile);
    }
    onSubmit(formDataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="pdfFile">PDF File</Label>
        <Input
          id="pdfFile"
          name="pdfFile"
          type="file"
          accept=".pdf"
          onChange={handleChange}
          required={!initialData}
        />
      </div>
      <Button type="submit">{submitText}</Button>
    </form>
  );
};

const AddSyllabusModal = ({
  onAddSyllabus,
}: {
  onAddSyllabus: (syllabusData: FormData) => Promise<void>;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Syllabus</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Syllabus</DialogTitle>
        </DialogHeader>
        <SyllabusForm onSubmit={onAddSyllabus} submitText="Add Syllabus" />
      </DialogContent>
    </Dialog>
  );
};

const EditSyllabusModal = ({
  syllabus,
  onUpdateSyllabus,
  onClose,
}: {
  syllabus: Syllabus;
  onUpdateSyllabus: (id: string, syllabusData: FormData) => Promise<void>;
  onClose: () => void;
}) => {
  const handleSubmit = (data: FormData) => {
    onUpdateSyllabus(syllabus._id, data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Syllabus</DialogTitle>
        </DialogHeader>
        <SyllabusForm initialData={syllabus} onSubmit={handleSubmit} submitText="Update Syllabus" />
      </DialogContent>
    </Dialog>
  );
};

export default SyllabusDashboard;
