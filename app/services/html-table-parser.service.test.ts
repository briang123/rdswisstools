import { HtmlTableParserService } from './html-table-parser.service';
import { ParserGateway } from './parser-gateway';

describe('HtmlTableParserService (ParserGateway implementation)', () => {
  let parser: ParserGateway;

  beforeEach(() => {
    parser = new HtmlTableParserService();
  });

  it('should correctly parse a simple HTML <table> into an array of objects', async () => {
    const html = `
      <table>
        <thead><tr><th>name</th><th>age</th></tr></thead>
        <tbody>
          <tr><td>Alice</td><td>30</td></tr>
          <tr><td>Bob</td><td>25</td></tr>
        </tbody>
      </table>
    `;
    const result = await parser.parse(html);
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('should parse a <table> without <thead> using the first row as header', async () => {
    const html = `
      <table>
        <tbody>
          <tr><td>name</td><td>age</td></tr>
          <tr><td>Alice</td><td>30</td></tr>
        </tbody>
      </table>
    `;
    const result = await parser.parse(html);
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('should handle header/value mismatch in <table> by filling with empty strings', async () => {
    const html = `
      <table>
        <thead><tr><th>name</th><th>age</th><th>city</th></tr></thead>
        <tbody>
          <tr><td>Alice</td><td>30</td></tr>
          <tr><td>Bob</td><td>25</td><td>New York</td></tr>
        </tbody>
      </table>
    `;
    const result = await parser.parse(html);
    expect(result).toEqual([
      { name: 'Alice', age: '30', city: '' },
      { name: 'Bob', age: '25', city: 'New York' },
    ]);
  });

  it('should trim whitespace from headers and values in <table>', async () => {
    const html = `
      <table>
        <thead><tr><th> name </th><th> age </th></tr></thead>
        <tbody>
          <tr><td> Alice </td><td> 30 </td></tr>
        </tbody>
      </table>
    `;
    const result = await parser.parse(html);
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('should parse a <ul> list as key-value pairs', async () => {
    const html = `
      <ul>
        <li>name: Alice</li>
        <li>age: 30</li>
      </ul>
    `;
    const result = await parser.parse(html);
    expect(result).toEqual([{ name: 'Alice' }, { age: '30' }]);
  });

  it('should parse a <div class="row"><div class="cell">...</div></div> grid', async () => {
    const html = `
      <div class="row"><div class="cell">Alice</div><div class="cell">30</div></div>
      <div class="row"><div class="cell">Bob</div><div class="cell">25</div></div>
    `;
    const result = await parser.parse(html);
    expect(result).toEqual([
      { col1: 'Alice', col2: '30' },
      { col1: 'Bob', col2: '25' },
    ]);
  });

  it('should return an empty array if no table-like structure is present', async () => {
    const html = '<div>No table here</div>';
    const result = await parser.parse(html);
    expect(result).toEqual([]);
  });

  it('should parse a File object (mocked with .text() method) as HTML table', async () => {
    const fileLike = {
      text: async () =>
        '<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>',
      name: 'test.html',
      type: 'text/html',
    } as unknown as File;
    const result = await parser.parse(fileLike);
    expect(result).toEqual([{ a: '1', b: '2' }]);
  });
});
