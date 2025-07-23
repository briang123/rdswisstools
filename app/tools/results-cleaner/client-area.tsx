'use client';
import { useState } from 'react';
import { FileUploader } from '../file-uploader';
import { DataTable } from '@/components/data-table';
import data from '../../data/sample_5k.json';
import { getParserByFileName } from '../../services/parser-factory';
import { cleanTableData } from '@/lib/table-data-cleaner';
import confetti from 'canvas-confetti';

export function ResultsCleanerClientArea() {
  const [tableData, setTableData] = useState<Record<string, unknown>[]>(data);

  async function handleFile(file: File) {
    setTableData([]);
    const parser = getParserByFileName(file.name);
    if (!parser) {
      setTableData(data);
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
  }

  return (
    <>
      <FileUploader onFile={handleFile} />
      <DataTable data={tableData} />
    </>
  );
}
