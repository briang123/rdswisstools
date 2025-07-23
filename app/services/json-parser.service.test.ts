import { JsonParserService } from './json-parser.service';
import { ParserGateway } from './parser-gateway';

describe('JsonParserService (ParserGateway implementation)', () => {
  let parser: ParserGateway;

  beforeEach(() => {
    parser = new JsonParserService();
  });

  it('should parse a flat JSON object as a single row', async () => {
    const json = '{"name":"Alice","age":30}';
    const result = await parser.parse(json);
    expect(result).toEqual([{ name: 'Alice', age: 30 }]);
  });

  it('should parse an array of flat objects as multiple rows', async () => {
    const json = '[{"name":"Alice","age":30},{"name":"Bob","age":25}]';
    const result = await parser.parse(json);
    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });

  it('should flatten a nested object into a single row', async () => {
    const json = '{"name":"Alice","address":{"city":"NY","zip":10001}}';
    const result = await parser.parse(json);
    expect(result).toEqual([{ name: 'Alice', 'address.city': 'NY', 'address.zip': 10001 }]);
  });

  it('should flatten each object in an array of nested objects', async () => {
    const json =
      '[{"name":"Alice","address":{"city":"NY"}},{"name":"Bob","address":{"city":"LA"}}]';
    const result = await parser.parse(json);
    expect(result).toEqual([
      { name: 'Alice', 'address.city': 'NY' },
      { name: 'Bob', 'address.city': 'LA' },
    ]);
  });

  it('should stringify arrays in objects', async () => {
    const json = '{"name":"Alice","scores":[1,2,3]}';
    const result = await parser.parse(json);
    expect(result).toEqual([{ name: 'Alice', scores: '[1,2,3]' }]);
  });

  it('should return an empty array for invalid JSON', async () => {
    const json = '{name:Alice}';
    const result = await parser.parse(json);
    expect(result).toEqual([]);
  });

  it('should parse a File object (mocked with .text() method) as JSON', async () => {
    const fileLike = {
      text: async () => '[{"a":1},{"a":2}]',
      name: 'test.json',
      type: 'application/json',
    } as unknown as File;
    const result = await parser.parse(fileLike);
    expect(result).toEqual([{ a: 1 }, { a: 2 }]);
  });

  it('should parse a top-level { data: [...] } object as multiple rows', async () => {
    const json = '{"data": [ { "a": 1 }, { "a": 2 } ] }';
    const result = await parser.parse(json);
    expect(result).toEqual([{ a: 1 }, { a: 2 }]);
  });

  it('should use the data array as table data even if there are sibling properties', async () => {
    const json = '{"data": [ { "a": 1 }, { "a": 2 } ], "meta": { "x": 1 } }';
    const result = await parser.parse(json);
    expect(result).toEqual([{ a: 1 }, { a: 2 }]);
  });
});
