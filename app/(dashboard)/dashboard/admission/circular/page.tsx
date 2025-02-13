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
import { FaEdit, FaEye, FaRegTrashAlt } from 'react-icons/fa';

interface Circular {
  _id: string;
  title: string;
  pdfUrl: string;
}

const Circular = () => {
  const [editingCircular, setEditingCircular] = useState<Circular | null>(null);

  const {
    data: circulars,
    isLoading,
    refetch,
  } = useGetList<Circular>('/admission-circular', 'circulars');
  const { mutateAsync: createCircular } = useCreate<Circular>('/admission-circular', 'circulars');
  const { mutateAsync: updateCircular } = useUpdate<Circular>('/admission-circular', 'circulars');
  const { mutateAsync: deleteCircular } = useDelete('/admission-circular', 'circulars');

  const handleCreateCircular = async (title: string, pdfFile: File) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('pdf', pdfFile);

      await createCircular({
        body: formData as unknown as Circular,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Circular created successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to create circular',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create circular:', error);
    }
  };

  const handleUpdateCircular = async (id: string, title: string, pdfFile: File | null) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }

      await updateCircular({
        id,
        body: formData as unknown as Circular,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Circular updated successfully' });
            refetch();
            setEditingCircular(null);
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to update circular',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update circular:', error);
    }
  };

  const handleDeleteCircular = async (id: string) => {
    try {
      await deleteCircular({
        id,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Circular deleted successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to delete circular',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to delete circular:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admission Circulars</h1>

      <AddCircularModal onAddCircular={handleCreateCircular} />

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {circulars?.map((circular) => (
            <TableRow key={circular._id}>
              <TableCell>{circular.title}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `${process.env.NEXT_PUBLIC_IMAGE_URL}/${circular?.pdfUrl}`,
                        '_blank',
                      )
                    }
                  >
                    <FaEye className="mr-2" /> View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingCircular(circular)}>
                    <FaEdit className="mr-2" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCircular(circular._id)}
                  >
                    <FaRegTrashAlt className="mr-2" /> Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingCircular && (
        <EditCircularModal
          circular={editingCircular}
          onUpdateCircular={handleUpdateCircular}
          onClose={() => setEditingCircular(null)}
        />
      )}
    </div>
  );
};

const AddCircularModal = ({
  onAddCircular,
}: {
  onAddCircular: (title: string, pdfFile: File) => Promise<void>;
}) => {
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (title && pdfFile) {
      await onAddCircular(title, pdfFile);
      setTitle('');
      setPdfFile(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Circular</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Circular</DialogTitle>
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
            <Label htmlFor="pdf">PDF File</Label>
            <Input
              id="pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Circular</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditCircularModal = ({
  circular,
  onUpdateCircular,
  onClose,
}: {
  circular: Circular;
  onUpdateCircular: (id: string, title: string, pdfFile: File | null) => Promise<void>;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(circular.title);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    await onUpdateCircular(circular._id, title, pdfFile);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Circular</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="edit-pdf">New PDF File (optional)</Label>
            <Input
              id="edit-pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Update Circular</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Circular;
