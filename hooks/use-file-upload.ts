import { useState } from 'react';
import { toast } from 'sonner';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, onSuccess?: () => void) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'File uploaded successfully!');
        onSuccess?.();
      } else {
        toast.error(data.message || 'Failed to upload file.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred while uploading. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadFile };
}
