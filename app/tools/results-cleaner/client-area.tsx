'use client';
import { FileUploader } from '../file-uploader';
import { DataTable } from '@/components/data-table';
import data from '../../dashboard/data.json';

export function ResultsCleanerClientArea() {
  return (
    <>
      <FileUploader onFile={(file) => console.log('Uploaded file:', file)} />
      <DataTable data={data} />
    </>
  );
}
