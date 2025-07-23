'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { getParserByContent } from '@/app/services/parser-factory';

// Auto-detect and parse pasted data
async function autoDetectAndParseData(data: string) {
  const parser = getParserByContent(data);
  if (!parser) {
    return { type: 'unknown', parsed: [] };
  }
  const parsed = await parser.parse(data);
  return { type: parser.constructor.name, parsed };
}

// Custom hook to manage paste data drawer state and logic
function usePasteDataDrawer(onParsed?: (result: unknown) => void) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = async (value: string) => {
    // Clean input: trim and remove empty lines and leading spaces from each line
    const cleaned = value
      .trim()
      .split('\n')
      .map((line) => line.trimStart())
      .filter((line) => line !== '')
      .join('\n');
    setData(cleaned);
    setLoading(true);
    setError(null);
    try {
      const result = await autoDetectAndParseData(cleaned);
      onParsed?.(result);
      setOpen(false); // Close drawer after successful parse and load
      setData(''); // Clear textarea after loading
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to parse data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await handleChange(data);
  };

  const handleCancel = () => {
    setOpen(false);
    setData('');
    setError(null);
  };

  return {
    open,
    setOpen,
    data,
    setData,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleCancel,
  };
}

export function isMacPlatform(): boolean {
  return typeof window !== 'undefined' && window.navigator.platform.toLowerCase().includes('mac');
}

export function PasteDataDrawer({ onParsed }: { onParsed?: (result: unknown) => void }) {
  // Detect platform for shortcut hint
  const shortcut = isMacPlatform() ? 'Cmd' : 'Ctrl';

  const { open, setOpen, data, loading, error, handleChange, handleSubmit, handleCancel } =
    usePasteDataDrawer(onParsed);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" data-testid="paste-data-open-btn">
          Paste Data
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-[98vw]">
        <DrawerHeader>
          <div className="flex flex-row items-center justify-center w-full gap-2">
            <DrawerTitle>Paste Data</DrawerTitle>
            <span className="text-xs text-muted-foreground">({shortcut} + V)</span>
          </div>
          <DrawerDescription>
            Paste or import your data here. Supported formats: CSV, Markdown, HTML, JSON, Excel.
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-0">
          <textarea
            className="block min-h-[200px] w-full border rounded p-2 text-sm font-mono resize-vertical"
            placeholder="Paste CSV, Markdown, HTML, JSON, or Excel data here..."
            value={data}
            onChange={(e) => handleChange(e.target.value)}
            data-testid="paste-data-textarea"
            autoFocus
          />
          {error && (
            <div className="text-red-500 mt-2" data-testid="paste-data-error">
              {error}
            </div>
          )}
        </div>
        <DrawerFooter className="flex flex-row gap-2 justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading || !data.trim()}
            data-testid="paste-data-submit-btn"
          >
            {loading ? 'Parsing...' : 'Submit'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleCancel} data-testid="paste-data-cancel-btn">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
