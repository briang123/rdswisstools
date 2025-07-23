import { ParserGateway } from './parser-gateway';

export class JsonParserService implements ParserGateway {
  async parse(input: File | string): Promise<Record<string, unknown>[]> {
    let jsonText: string;
    if (typeof input === 'string') {
      jsonText = input;
    } else {
      jsonText = await input.text();
    }
    let data: unknown;
    try {
      data = JSON.parse(jsonText);
    } catch {
      return [];
    }
    if (Array.isArray(data)) {
      return this.parseComplexArray(data);
    } else if (typeof data === 'object' && data !== null) {
      // Always use 'data' array as table data if present
      if (
        Object.prototype.hasOwnProperty.call(data, 'data') &&
        Array.isArray((data as Record<string, unknown>).data)
      ) {
        return this.parseComplexArray((data as Record<string, unknown>).data as unknown[]);
      }
      return this.isSimpleObject(data)
        ? this.parseSimpleObject(data as Record<string, unknown>)
        : this.parseComplexObject(data as Record<string, unknown>);
    }
    return [];
  }

  private isSimpleObject(obj: unknown): boolean {
    if (typeof obj !== 'object' || obj === null) return false;
    return Object.values(obj).every((v) => typeof v !== 'object' || v === null);
  }

  private parseSimpleObject(obj: Record<string, unknown>): Record<string, unknown>[] {
    return [obj];
  }

  private parseComplexArray(arr: unknown[]): Record<string, unknown>[] {
    // If array of objects, flatten each
    return arr.map((item) => this.flattenObject(item));
  }

  private parseComplexObject(obj: Record<string, unknown>): Record<string, unknown>[] {
    // Flatten the object and wrap in array
    return [this.flattenObject(obj)];
  }

  private flattenObject(obj: unknown, prefix = ''): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (typeof obj !== 'object' || obj === null) return result;
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, this.flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        result[newKey] = JSON.stringify(value);
      } else {
        result[newKey] = value;
      }
    }
    return result;
  }
}
