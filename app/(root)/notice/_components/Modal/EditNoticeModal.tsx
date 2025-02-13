/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import { EditIcon } from '@/components/shared/icons/EditIcon';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { useGetById, useUpdate } from '@/hooks/APIHooks';
import { useToast } from '@/hooks/use-toast';
import React, { useCallback, useEffect, useState } from 'react';

const EditnoticeModal = (data: any) => {
  const [file, setFile] = useState(data?.pdfUrl || (null as File | null));
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const { data: editableData, isLoading }: { data: any; isLoading: any } = useGetById(
    '/notice',
    'notice',
    data?.id,
  );

  const { mutateAsync: updateNotice } = useUpdate('/notice', 'notice');

  useEffect(() => {
    if (editableData) {
      setTitle(editableData?.data?.title);
      setFile(editableData?.data?.pdfUrl);
    }
  }, [editableData, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError('File size should be less than 5MB');
        setFile(null);
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file || !title.trim()) return;

      setIsUploading(true);
      setError('');

      try {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('title', title.trim());

        await updateNotice({
          id: data._id,
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Institute history updated successfully',
              });
              setIsOpen(false);
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to update institute history',
                variant: 'destructive',
              });
            },
          },
        });


        // Reset form
        setFile(null);
        setTitle('');
        setIsOpen(false);
      } catch (err) {
        setError('Failed to upload notice. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to upload notice',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [file, title, toast, data._id, updateNotice],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 text-white hover:bg-gray-300 hover:text-black px-5 py-1 rounded-md flex justify-center items-center gap-2">
          {' '}
          <EditIcon /> Edit Notice
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-teal-600 text-2xl">Update Notice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="notice_title">Notice Headline</Label>
              <Input
                id="notice_title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5"
                required
                placeholder="Enter Notice Headline"
              />
            </div>

            <div>
              <Label htmlFor="pdf">PDF File</Label>
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mt-1.5"
              />
              {file && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!file || !title.trim() || isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? 'Updating...' : 'Update Notice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditnoticeModal;
