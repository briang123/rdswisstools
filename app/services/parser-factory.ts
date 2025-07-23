import { ParserGateway } from './parser-gateway';
import { CsvParserService } from './csv-parser.service';
import { MarkdownParserService } from './markdown-parser.service';
import { HtmlTableParserService } from './html-table-parser.service';
import { JsonParserService } from './json-parser.service';
import { ExcelParserService } from './excel-parser.service';

export enum ParserType {
  CSV = 'csv',
  MARKDOWN = 'markdown',
  HTML = 'html',
  JSON = 'json',
  // Add more types as needed
}

export function getParserByFileName(fileName: string): ParserGateway | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'csv':
      return new CsvParserService(',');
    case 'tsv':
    case 'tab':
      return new CsvParserService('\t');
    case 'md':
    case 'markdown':
      return new MarkdownParserService();
    case 'html':
    case 'htm':
      return new HtmlTableParserService();
    case 'json':
      return new JsonParserService();
    case 'xlsx':
    case 'xls':
      return new ExcelParserService();
    // Add more cases for other types
    default:
      return null;
  }
}

// Detect parser by content heuristics
export function getParserByContent(content: string): ParserGateway | null {
  const trimmed = content.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return new JsonParserService();
  }
  if (
    trimmed.startsWith('<!DOCTYPE html') ||
    trimmed.startsWith('<html') ||
    trimmed.includes('<table')
  ) {
    return new HtmlTableParserService();
  }
  if (/^\|.*\|\s*\n\|[-:| ]+\|/m.test(trimmed)) {
    return new MarkdownParserService();
  }
  if (trimmed.includes('\t') && /\n/.test(trimmed)) {
    // crude TSV check: has tabs and newlines
    return new CsvParserService('\t');
  }
  if (trimmed.includes(',') && /\n/.test(trimmed)) {
    // crude CSV check: has commas and newlines
    return new CsvParserService(',');
  }
  // Excel: not supported for pasted text (binary only)
  return null;
}
