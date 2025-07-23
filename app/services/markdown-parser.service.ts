import { ParserGateway } from './parser-gateway';
import { removeEmptyColumns } from '../../lib/table-data-cleaner';

export class MarkdownParserService implements ParserGateway {
  async parse(input: File | string): Promise<Record<string, unknown>[]> {
    let mdText: string;
    if (typeof input === 'string') {
      mdText = input;
    } else {
      mdText = await input.text();
    }
    const data = this.parseMarkdownTable(mdText);
    return removeEmptyColumns(data);
  }

  private parseMarkdownTable(md: string): Record<string, unknown>[] {
    // Find the first markdown table in the text
    const lines = md.split(/\r?\n/).map((l) => l.trim());
    const tableStart = lines.findIndex((line) => line.startsWith('|') && line.endsWith('|'));
    if (tableStart === -1 || tableStart + 2 >= lines.length) return [];
    const headerLine = lines[tableStart];
    const separatorLine = lines[tableStart + 1];
    if (!/^\|([\s:-]+\|)+$/.test(separatorLine)) return [];
    const headers = headerLine
      .split('|')
      .map((h) => h.trim())
      .filter(Boolean);
    const data: Record<string, unknown>[] = [];
    for (let i = tableStart + 2; i < lines.length; i++) {
      const line = lines[i];
      if (!line.startsWith('|') || !line.endsWith('|')) break;
      const values = line
        .split('|')
        .map((v) => v.trim())
        .filter((_, idx) => (idx === 0 ? false : idx === headers.length + 1 ? false : true)); // skip first and last empty
      const row: Record<string, unknown> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] ?? '';
      });
      data.push(row);
    }
    return data;
  }
}
