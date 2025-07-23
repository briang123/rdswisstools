import { ParserGateway } from './parser-gateway';

export class CsvParserService implements ParserGateway {
  async parse(input: File | string): Promise<Record<string, unknown>[]> {
    let csvText: string;
    if (typeof input === 'string') {
      csvText = input;
    } else {
      csvText = await input.text();
    }
    return this.parseCsv(csvText);
  }

  private parseCsv(csv: string): Record<string, unknown>[] {
    const lines = csv.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(',');
      const obj: Record<string, unknown> = {};
      headers.forEach((header, i) => {
        obj[header] = values[i]?.trim() ?? '';
      });
      return obj;
    });
  }
}
