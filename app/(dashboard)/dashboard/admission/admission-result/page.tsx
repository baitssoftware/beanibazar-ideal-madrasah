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

interface AdmissionResult {
  _id: string;
  title: string;
  pdfUrl: string;
}

const AdmissionResult = () => {
  const [editingResult, setEditingResult] = useState<AdmissionResult | null>(null);

  const {
    data: results,
    isLoading,
    refetch,
  } = useGetList<AdmissionResult>('/admission-result', 'admissionResults');
  const { mutateAsync: createResult } = useCreate<AdmissionResult>(
    '/admission-result',
    'admissionResults',
  );
  const { mutateAsync: updateResult } = useUpdate<AdmissionResult>(
    '/admission-result',
    'admissionResults',
  );
  const { mutateAsync: deleteResult } = useDelete('/admission-result', 'admissionResults');

  const handleCreateResult = async (title: string, pdfFile: File) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('pdf', pdfFile);

      await createResult({
        body: formData as unknown as AdmissionResult,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Admission result created successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to create admission result',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create admission result:', error);
    }
  };

  const handleUpdateResult = async (id: string, title: string, pdfFile: File | null) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }

      await updateResult({
        id,
        body: formData as unknown as AdmissionResult,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Admission result updated successfully' });
            refetch();
            setEditingResult(null);
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to update admission result',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update admission result:', error);
    }
  };

  const handleDeleteResult = async (id: string) => {
    try {
      await deleteResult({
        id,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Admission result deleted successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to delete admission result',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to delete admission result:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admission Results</h1>

      <AddResultModal onAddResult={handleCreateResult} />

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results?.map((result) => (
            <TableRow key={result._id}>
              <TableCell>{result.title}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `${process.env.NEXT_PUBLIC_IMAGE_URL}/${result?.pdfUrl}`,
                        '_blank',
                      )
                    }
                  >
                    <FaEye className="mr-2" /> View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingResult(result)}>
                    <FaEdit className="mr-2" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteResult(result._id)}
                  >
                    <FaRegTrashAlt className="mr-2" /> Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingResult && (
        <EditResultModal
          result={editingResult}
          onUpdateResult={handleUpdateResult}
          onClose={() => setEditingResult(null)}
        />
      )}
    </div>
  );
};

const AddResultModal = ({
  onAddResult,
}: {
  onAddResult: (title: string, pdfFile: File) => Promise<void>;
}) => {
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (title && pdfFile) {
      await onAddResult(title, pdfFile);
      setTitle('');
      setPdfFile(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Result</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Admission Result</DialogTitle>
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
          <Button onClick={handleSubmit}>Add Result</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditResultModal = ({
  result,
  onUpdateResult,
  onClose,
}: {
  result: AdmissionResult;
  onUpdateResult: (id: string, title: string, pdfFile: File | null) => Promise<void>;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(result.title);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    await onUpdateResult(result._id, title, pdfFile);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Admission Result</DialogTitle>
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
          <Button onClick={handleSubmit}>Update Result</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdmissionResult;
