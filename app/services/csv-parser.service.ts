import { ParserGateway } from './parser-gateway';
import { removeEmptyColumns } from '../../lib/table-data-cleaner';

export class CsvParserService implements ParserGateway {
  constructor(private delimiter: string = ',') {}

  async parse(input: File | string): Promise<Record<string, unknown>[]> {
    let csvText: string;
    if (typeof input === 'string') {
      csvText = input;
    } else {
      csvText = await input.text();
    }
    const rows = this.parseCsv(csvText);
    return removeEmptyColumns(rows);
  }

  private parseCsv(csv: string): Record<string, unknown>[] {
    const lines = csv
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter(Boolean);
    if (lines.length === 0) return [];
    // Split headers and trim trailing empty headers
    let headers = lines[0].split(this.delimiter).map((h) => h.trim());
    let lastHeaderIdx = headers.length - 1;
    while (lastHeaderIdx >= 0 && !headers[lastHeaderIdx]) lastHeaderIdx--;
    headers = headers.slice(0, lastHeaderIdx + 1);
    // Build data rows, trimming trailing empty values and skipping empty rows
    return lines
      .slice(1)
      .map((line) => {
        const values = line.split(this.delimiter).map((v) => v.trim());
        // Trim trailing empty values
        let lastValueIdx = values.length - 1;
        while (lastValueIdx >= 0 && !values[lastValueIdx]) lastValueIdx--;
        const trimmedValues = values.slice(0, lastValueIdx + 1);
        const obj: Record<string, unknown> = {};
        headers.forEach((header, i) => {
          obj[header] = trimmedValues[i] ?? '';
        });
        return obj;
      })
      .filter((row) => Object.values(row).some((v) => v !== ''));
  }
}
