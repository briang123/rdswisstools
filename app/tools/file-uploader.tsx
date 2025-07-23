'use client';
import React, { useRef, useState } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { Button } from '@/components/ui/button';

const ACCEPTED_TYPES = ['.csv', '.json', '.md', '.html', '.xls', '.xlsx', 'image/*'];

export function FileUploader({
  onFile,
  children,
}: {
  onFile: (file: File) => void;
  children?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploading, uploadFile } = useFileUpload();
  const { dragActive, handleDrag, handleDrop } = useDragAndDrop((file) => setSelectedFile(file));
  const [debugMsg, setDebugMsg] = useState<string>('');

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setDebugMsg('Upload started: ' + selectedFile.name);
    await uploadFile(selectedFile, () => {
      setDebugMsg('Upload complete: ' + selectedFile.name);
      onFile(selectedFile);
      setSelectedFile(null);
    });
  };

  return (
    <div className="mb-6">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={handleChange}
        data-testid="file-input"
      />
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-muted'}`}
        onClick={(e) => {
          // Only open file dialog if not clicking on a button or interactive child
          const tag = (e.target as HTMLElement).tagName.toLowerCase();
          if (
            e.target === e.currentTarget ||
            (tag === 'span' && (e.target as HTMLElement).dataset.fileSelect === 'true')
          ) {
            inputRef.current?.click();
          }
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{ cursor: 'pointer' }}
        data-testid="file-drop-area"
      >
        <p className="mb-2 text-muted-foreground">
          Drag and drop a file here, or{' '}
          <span
            className="text-primary underline cursor-pointer"
            data-file-select="true"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              inputRef.current?.click();
            }}
          >
            click to select
          </span>{' '}
          a file
        </p>
        <p className="text-xs text-muted-foreground">Accepted: CSV, Excel, JSON, Markdown, HTML</p>
        <div
          className={`mt-4 flex flex-col items-center gap-2${selectedFile ? '' : ' justify-center'}`}
        >
          {selectedFile && (
            <>
              <div>
                <strong>Selected file:</strong> {selectedFile.name}
              </div>
              <div className="flex flex-row items-center gap-2">
                <Button
                  size="default"
                  variant="default"
                  onClick={(e) => {
                    setDebugMsg('Import File button clicked: ' + selectedFile.name);
                    e.stopPropagation();
                    handleImport();
                  }}
                  disabled={!selectedFile || uploading}
                  type="button"
                  data-testid="import-file-button"
                >
                  {uploading ? 'Uploading...' : 'Import File'}
                </Button>
                {children &&
                  React.cloneElement(children as React.ReactElement, {
                    onClick: (e: React.MouseEvent) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (children.props.onClick) children.props.onClick(e);
                    },
                  })}
              </div>
            </>
          )}
          {!selectedFile &&
            children &&
            React.cloneElement(children as React.ReactElement, {
              onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                if (children.props.onClick) children.props.onClick(e);
              },
            })}
        </div>
        {debugMsg && (
          <div data-testid="debug-msg" className="mt-4 text-xs text-red-500">
            {debugMsg}
          </div>
        )}
      </div>
    </div>
  );
}
