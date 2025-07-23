import { MarkdownParserService } from './markdown-parser.service';
import { ParserGateway } from './parser-gateway';

describe('MarkdownParserService (ParserGateway implementation)', () => {
  let parser: ParserGateway;

  beforeEach(() => {
    parser = new MarkdownParserService();
  });

  it('should correctly parse a simple markdown table into an array of objects', async () => {
    const md = `
| name | age |
|------|-----|
| Alice | 30 |
| Bob   | 25 |
`;
    const result = await parser.parse(md);
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('should return an empty array if no markdown table is present', async () => {
    const md = 'This is just some text.';
    const result = await parser.parse(md);
    expect(result).toEqual([]);
  });

  it('should handle header/value mismatch by filling with empty strings', async () => {
    const md = `
| name | age | city |
|------|-----|------|
| Alice | 30 |
| Bob   | 25 | New York |
`;
    const result = await parser.parse(md);
    expect(result).toEqual([
      { name: 'Alice', age: '30', city: '' },
      { name: 'Bob', age: '25', city: 'New York' },
    ]);
  });

  it('should trim whitespace from headers and values', async () => {
    const md = `
| name  | age |
|-------|-----|
| Alice | 30  |
`;
    const result = await parser.parse(md);
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('should parse a File object (mocked with .text() method) into an array of objects', async () => {
    const fileLike = {
      text: async () => '| a | b |\n|---|---|\n| 1 | 2 |',
      name: 'test.md',
      type: 'text/markdown',
    } as unknown as File;
    const result = await parser.parse(fileLike);
    expect(result).toEqual([{ a: '1', b: '2' }]);
  });

  it('should fill missing values with empty string and keep all columns', async () => {
    const md = `
| a | b | c |
|---|---|---|
| 1 | 2 |
| 3 | 4 | 5 |
`;
    const parser = new MarkdownParserService();
    const result = await parser.parse(md);
    expect(result).toEqual([
      { a: '1', b: '2', c: '' },
      { a: '3', b: '4', c: '5' },
    ]);
  });
});
