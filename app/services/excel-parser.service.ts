import { ParserGateway } from './parser-gateway';
import * as XLSX from 'xlsx';

export class ExcelParserService implements ParserGateway {
  async parse(input: File | string): Promise<Record<string, unknown>[]> {
    let data: Array<Record<string, unknown>> = [];
    let workbook: XLSX.WorkBook;
    if (typeof input === 'string') {
      // input is a base64 string or binary string
      workbook = XLSX.read(input, { type: 'binary' });
    } else {
      // input is a File
      const arrayBuffer = await input.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      workbook = XLSX.read(uint8Array, { type: 'array' });
    }
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (worksheet) {
      data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    }
    return data;
  }
}
