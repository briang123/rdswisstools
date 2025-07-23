import { ParserGateway } from './parser-gateway';

export class HtmlTableParserService implements ParserGateway {
  async parse(input: File | string): Promise<Record<string, unknown>[]> {
    let html: string;
    if (typeof input === 'string') {
      html = input;
    } else {
      html = await input.text();
    }
    // Only use DOMParser in the browser
    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const doc = new window.DOMParser().parseFromString(html, 'text/html');
      return this.parseAllTableTypes(doc);
    }
    // Fallback: only parse <table> with regex (very limited, for SSR)
    return this.parseTableTagRegex(html);
  }

  private parseAllTableTypes(doc: Document): Record<string, unknown>[] {
    // Try <table> first
    const tableRows = this.parseTableTag(doc);
    if (tableRows.length > 0) return tableRows;
    // Try <ul>/<ol> lists
    const listRows = this.parseListTag(doc);
    if (listRows.length > 0) return listRows;
    // Try <div> grids (e.g., class="row"/"cell")
    const divRows = this.parseDivGrid(doc);
    if (divRows.length > 0) return divRows;
    return [];
  }

  private parseTableTag(doc: Document): Record<string, unknown>[] {
    const table = doc.querySelector('table');
    if (!table) return [];
    const headers = Array.from(table.querySelectorAll('thead th')).map(
      (th) => th.textContent?.trim() || '',
    );
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    if (headers.length === 0 && rows.length > 0) {
      // Try first row as header
      const firstRow = rows[0];
      const ths = Array.from(firstRow.querySelectorAll('td,th'));
      headers.push(...ths.map((th) => th.textContent?.trim() || ''));
      rows.shift();
    }
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td,th'));
      const obj: Record<string, unknown> = {};
      headers.forEach((header, i) => {
        obj[header] = cells[i]?.textContent?.trim() || '';
      });
      return obj;
    });
  }

  private parseListTag(doc: Document): Record<string, unknown>[] {
    // Look for <ul> or <ol> with children that look like rows
    const list = doc.querySelector('ul,ol');
    if (!list) return [];
    const items = Array.from(list.querySelectorAll('li'));
    if (items.length === 0) return [];
    // Try to split by colon or dash for key-value
    return items.map((item) => {
      const text = item.textContent?.trim() || '';
      const [key, ...rest] = text.split(/:|-/);
      return { [key.trim()]: rest.join(':').trim() };
    });
  }

  private parseDivGrid(doc: Document): Record<string, unknown>[] {
    // Look for .row > .cell or similar patterns
    const rows = Array.from(doc.querySelectorAll('.row'));
    if (rows.length === 0) return [];
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('.cell'));
      const obj: Record<string, unknown> = {};
      cells.forEach((cell, i) => {
        obj[`col${i + 1}`] = cell.textContent?.trim() || '';
      });
      return obj;
    });
  }

  private parseTableTagRegex(html: string): Record<string, unknown>[] {
    // Very basic: extract <tr><td>...</td></tr> blocks
    const rowMatches = html.match(/<tr>([\s\S]*?)<\/tr>/gi) || [];
    if (rowMatches.length === 0) return [];
    const cellRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/gi;
    const rows = rowMatches.map((row) => {
      const cells = Array.from(row.matchAll(cellRegex)).map((m) => m[1].trim());
      return cells;
    });
    if (rows.length < 2) return [];
    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || '';
      });
      return obj;
    });
  }
}
