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
      return new CsvParserService();
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
