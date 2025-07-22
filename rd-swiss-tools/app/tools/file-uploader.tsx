'use client';
import React, { useRef, useState } from 'react';

const ACCEPTED_TYPES = ['.csv', '.json', '.md', '.html', '.xls', '.xlsx', 'image/*'];

export function FileUploader({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onFile(selectedFile);
    }
  };

  return (
    <div className="mb-6">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={handleChange}
      />
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-muted'}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{ cursor: 'pointer' }}
      >
        <p className="mb-2 text-muted-foreground">
          Drag and drop a file here, or{' '}
          <span className="text-primary underline">click to select</span> a file
        </p>
        <p className="text-xs text-muted-foreground">
          Accepted: CSV, Excel, JSON, Markdown, HTML, Images
        </p>
        {selectedFile && (
          <div className="mt-4 text-sm text-foreground flex flex-col items-center gap-2">
            <div>
              <strong>Selected file:</strong> {selectedFile.name}
            </div>
            <button
              className="bg-primary text-primary-foreground rounded px-4 py-1 text-sm font-medium hover:bg-primary/90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                handleImport();
              }}
              disabled={!selectedFile}
              type="button"
            >
              Import File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
