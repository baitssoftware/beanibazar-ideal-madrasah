import { useCallback, useState } from 'react';

interface UseImageUploadResult {
  imageUrl: string;
  previewUrl: string;
  isUploading: boolean;
  error: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<void>;
}

export function useImageUpload(initialUrl: string = ''): UseImageUploadResult {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImageUrl(data.url);
      setIsUploading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Upload failed. Please try again.');
      setIsUploading(false);
    }
  }, [file]);

  return {
    imageUrl,
    previewUrl,
    isUploading,
    error,
    handleFileChange,
    handleUpload,
  };
}
