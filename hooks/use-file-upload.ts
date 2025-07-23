import { useState } from 'react';
import { toast } from 'sonner';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, onSuccess?: () => void) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      // eslint-disable-next-line no-console
      console.log('USING FETCH FOR UPLOAD');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      // eslint-disable-next-line no-console
      console.log('UPLOAD API RESPONSE', { ok: res.ok, data });
      if (res.ok && data.success) {
        // eslint-disable-next-line no-console
        console.log('TRIGGERING TOAST', data.message || 'File uploaded successfully!');
        toast.success(data.message || 'File uploaded successfully!', { duration: 5000 });
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
