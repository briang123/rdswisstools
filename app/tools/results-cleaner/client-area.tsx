'use client';
import { useState } from 'react';
import { FileUploader } from '../file-uploader';
import { DataTable } from '@/components/data-table';
import data from '../../data/sample_5k.json';
import { getParserByFileName } from '../../services/parser-factory';

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
    setTableData(parsed.length > 0 ? parsed : data);
  }

  return (
    <>
      <FileUploader onFile={handleFile} />
      <DataTable data={tableData} />
    </>
  );
}
