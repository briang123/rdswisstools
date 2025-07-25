'use client';
import { useTableStoreFactory } from '@/hooks/use-table-store';
import type { TableFileImportState } from '@/hooks/use-table-store';
import { FileUploader } from '../file-uploader';
import { DataTable } from '@/components/table/core/data-table';
import data from '@/app/data/sample_5k.json';
import { getParserByFileName } from '../../services/parser-factory';
import { cleanTableData } from '@/lib/table-data-cleaner';
import confetti from 'canvas-confetti';
import { PasteDataDrawer } from '@/components/paste-data-drawer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ResultsCleanerClientArea() {
  // Use Zustand store for file import and table data (dynamic table key)
  const useTableStore = useTableStoreFactory('results-cleaner');
  const file = useTableStore((s: TableFileImportState) => s.file);
  const setFile = useTableStore((s: TableFileImportState) => s.setFile);
  const resetFile = useTableStore((s: TableFileImportState) => s.resetFile);
  const tableData = useTableStore((s: TableFileImportState) => s.tableData);
  const setTableData = useTableStore((s: TableFileImportState) => s.setTableData);
  const [debugMsg, setDebugMsg] = useState('');

  async function handleFile(file: File) {
    setDebugMsg('Upload started: ' + file.name);
    setDebugMsg('Upload complete: ' + file.name);
    setTableData([]);
    const parser = getParserByFileName(file.name);
    if (!parser) {
      setTableData(data);
      resetFile();
      return;
    }
    const parsed = await parser.parse(file);
    const cleaned = cleanTableData(parsed.length > 0 ? parsed : data);
    setTableData(cleaned);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
    });
    resetFile();
  }

  return (
    <>
      <FileUploader
        onFile={handleFile}
        setFile={setFile}
        file={file}
        pasteDataButton={
          <PasteDataDrawer
            onParsed={(result) => {
              if (
                result &&
                typeof result === 'object' &&
                Array.isArray((result as { parsed: unknown }).parsed)
              ) {
                setTableData((result as { parsed: unknown[] }).parsed as Record<string, unknown>[]);
              }
            }}
          />
        }
      />
      <DataTable data={tableData} />
    </>
  );
}
