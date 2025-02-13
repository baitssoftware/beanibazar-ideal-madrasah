import React, { useCallback, useState } from 'react';
import { FaRegClipboard } from 'react-icons/fa';
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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreate } from '@/hooks/APIHooks';

const NoticeUploadModal = () => {
  const [file, setFile] = useState(null as File | null);
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const { mutateAsync: createNotice } = useCreate('/notice', 'notice');

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

        await createNotice({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Notice created successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to create Notice',
                variant: 'destructive',
              });
            },
          },
        });


        // if (!response?.ok) {
        //   throw new Error("Upload failed");
        // }

        // toast({
        //   title: "Success",
        //   description: "Notice uploaded successfully",
        // });

        // Reset form
        setFile(null);
        setTitle('');
        setIsOpen(false);
      } finally {
        setIsUploading(false);
      }
    },
    [file, title, toast, createNotice],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="bg-teal-600 hover:bg-teal-700 text-2xl text-white p-8"
        >
          <FaRegClipboard className="mr-2 h-5 w-5" />
          Upload New Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-teal-600 text-2xl">Upload Notice</DialogTitle>
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
                required
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
              {isUploading ? 'Uploading...' : 'Upload Notice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeUploadModal;
