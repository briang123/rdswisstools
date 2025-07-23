// ParserGateway interface abstracts file parsing operations for multiple formats
// Now includes ExcelParserService for .xlsx and .xls files
export interface ParserGateway {
  parse(input: File | string): Promise<Record<string, unknown>[]>;
}
