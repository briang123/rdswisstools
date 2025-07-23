import { CsvParserService } from './csv-parser.service';
import { ParserGateway } from './parser-gateway';

describe('CsvParserService (ParserGateway implementation)', () => {
  let parser: ParserGateway;

  beforeEach(() => {
    parser = new CsvParserService();
  });

  it('should correctly parse a simple CSV string into an array of objects', async () => {
    const csv = 'name,age\nAlice,30\nBob,25';
    const result = await parser.parse(csv);
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('should return an empty array when given an empty string', async () => {
    const result = await parser.parse('');
    expect(result).toEqual([]);
  });

  it('should handle rows with missing values by filling with empty strings', async () => {
    const csv = 'name,age,city\nAlice,30\nBob,25,New York';
    const result = await parser.parse(csv);
    expect(result).toEqual([
      { name: 'Alice', age: '30', city: '' },
      { name: 'Bob', age: '25', city: 'New York' },
    ]);
  });

  it('should trim whitespace from headers and values', async () => {
    const csv = ' name , age \n Alice , 30 ';
    const result = await parser.parse(csv);
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('should parse a File object (mocked with .text() method) into an array of objects', async () => {
    // Mock a File object with a .text() method
    const fileLike = {
      text: async () => 'a,b\n1,2',
      name: 'test.csv',
      type: 'text/csv',
    } as unknown as File;
    const result = await parser.parse(fileLike);
    expect(result).toEqual([{ a: '1', b: '2' }]);
  });

  it('should correctly parse a simple TSV string into an array of objects', async () => {
    const tsv = 'name\tage\nAlice\t30\nBob\t25';
    const tsvParser = new CsvParserService('\t');
    const result = await tsvParser.parse(tsv);
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('should handle rows with missing values in TSV by filling with empty strings', async () => {
    const tsv = 'name\tage\tcity\nAlice\t30\nBob\t25\tNew York';
    const tsvParser = new CsvParserService('\t');
    const result = await tsvParser.parse(tsv);
    expect(result).toEqual([
      { name: 'Alice', age: '30', city: '' },
      { name: 'Bob', age: '25', city: 'New York' },
    ]);
  });

  it('should trim whitespace from headers and values in TSV', async () => {
    const tsv = ' name \t age \n Alice \t 30 ';
    const tsvParser = new CsvParserService('\t');
    const result = await tsvParser.parse(tsv);
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });
});
