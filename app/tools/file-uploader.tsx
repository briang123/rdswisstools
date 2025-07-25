'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { Button } from '@/components/ui/button';

const ACCEPTED_TYPES = ['.csv', '.json', '.md', '.html', '.xls', '.xlsx', 'image/*'];

export function FileUploader({
  onFile,
  setFile,
  pasteDataButton,
  file,
  children,
}: {
  onFile: (file: File) => void;
  setFile?: (file: File | null) => void;
  pasteDataButton?: React.ReactNode;
  file?: File | null;
  children?: React.ReactElement<React.ComponentPropsWithoutRef<'button'>>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [localSelectedFile, setLocalSelectedFile] = useState<File | null>(null);
  const { uploading, uploadFile } = useFileUpload();
  const { dragActive, handleDrag, handleDrop } = useDragAndDrop((file) => {
    if (setFile) setFile(file);
    else setLocalSelectedFile(file);
  });
  // Use Zustand file if setFile is provided, otherwise use local state
  const selectedFile = setFile ? file : localSelectedFile;
  if (!mounted) return null;

  const handleFile = (file: File) => {
    if (setFile) setFile(file);
    else setLocalSelectedFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    const fileToUpload = setFile ? undefined : localSelectedFile;
    if (!fileToUpload) return;
    await uploadFile(fileToUpload, () => {
      onFile(fileToUpload);
      if (!setFile) setLocalSelectedFile(null);
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
        style={{ cursor: 'pointer', position: 'relative' }}
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
        {/* Button row container, always visible */}
        <div
          style={{
            width: '100%',
            marginTop: 16,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            // background: 'var(--card-bg, #181c24)',
            // border: '1px solid var(--border-color, #23283a)',
            // borderRadius: 8,
            // padding: 16,
          }}
        >
          {/* Import/Remove buttons, only visible if file is selected */}
          <span style={{ display: selectedFile ? 'flex' : 'none', gap: 12, alignItems: 'center' }}>
            <Button
              size="default"
              variant="default"
              onClick={async (e) => {
                e.stopPropagation();
                onFile(selectedFile!);
                await handleImport();
              }}
              type="button"
              data-testid="import-file-button"
              disabled={!selectedFile}
            >
              Import File
            </Button>
            <Button
              size="default"
              variant="destructive"
              onClick={() => setFile && setFile(null)}
              disabled={!selectedFile}
              style={{ minWidth: 80 }}
            >
              Remove
            </Button>
          </span>
          {/* Paste Data button, always visible */}
          <span style={{ display: 'flex', alignItems: 'center' }}>{pasteDataButton}</span>
        </div>
        {/* Selected file label, centered above buttons if file is selected */}
        {setFile && !!(typeof window !== 'undefined' && window.document) && selectedFile && (
          <div
            style={{
              width: '100%',
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 0, textAlign: 'center' }}>
              Selected file: {selectedFile.name}
            </div>
          </div>
        )}
        {/* Paste Data button always visible, but now included in the row above */}
        <div
          className={`mt-4 flex flex-col items-center gap-2${(setFile ? false : localSelectedFile) ? '' : ' justify-center'}`}
        >
          {(setFile ? false : localSelectedFile) && (
            <>
              <div>
                <strong>Selected file:</strong> {localSelectedFile?.name}
              </div>
              <div className="flex flex-row items-center gap-2">
                <Button
                  size="default"
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImport();
                  }}
                  disabled={!localSelectedFile || uploading}
                  type="button"
                  data-testid="import-file-button"
                >
                  {uploading ? 'Uploading...' : 'Import File'}
                </Button>
                {children &&
                  React.cloneElement(
                    children as React.ReactElement<React.ComponentPropsWithoutRef<'button'>>,
                    {
                      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (children.props.onClick) children.props.onClick(e);
                      },
                    } as React.ComponentPropsWithoutRef<'button'>,
                  )}
              </div>
            </>
          )}
          {!localSelectedFile &&
            children &&
            React.cloneElement(
              children as React.ReactElement<React.ComponentPropsWithoutRef<'button'>>,
              {
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (children.props.onClick) children.props.onClick(e);
                },
              } as React.ComponentPropsWithoutRef<'button'>,
            )}
        </div>
      </div>
    </div>
  );
}
