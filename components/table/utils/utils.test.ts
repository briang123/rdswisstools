jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
  }));
});
jest.mock('jspdf-autotable', () => jest.fn());

import * as utils from './utils';
import type { TableRow } from './utils';
const { exportToCSV, exportToJSON, exportToHTML, exportToMarkdown, handleCopy, handleSave } = utils;

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock');
  global.Blob = jest.fn(() => ({})) as any;
  document.body.appendChild = jest.fn();
  document.body.removeChild = jest.fn();
});

describe('table utils', () => {
  const data: TableRow[] = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ];
  const columns = ['name', 'age'];

  it('exportToCSV returns correct CSV', () => {
    const csv = exportToCSV(data, columns);
    expect(csv).toContain('name,age');
    expect(csv).toContain('Alice,30');
    expect(csv).toContain('Bob,25');
  });

  it('exportToJSON returns correct JSON', () => {
    const json = exportToJSON(data, columns);
    expect(json).toContain('Alice');
    expect(json).toContain('30');
    expect(json).toContain('Bob');
    expect(json).toContain('25');
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('exportToHTML returns correct HTML', () => {
    const html = exportToHTML(data, columns);
    expect(html).toContain('<table');
    expect(html).toContain('<th>name</th>');
    expect(html).toContain('<td>Alice</td>');
    expect(html).toContain('<td>25</td>');
  });

  it('exportToMarkdown returns correct Markdown', () => {
    const md = exportToMarkdown(data, columns);
    expect(md).toContain('| name | age |');
    expect(md).toContain('| Alice | 30 |');
    expect(md).toContain('| Bob | 25 |');
  });

  describe('handleCopy', () => {
    let originalClipboard: typeof navigator.clipboard;
    let writeTextMock: jest.Mock;
    let toast: { success: jest.Mock; error: jest.Mock };

    beforeAll(() => {
      originalClipboard = { ...navigator.clipboard };
      writeTextMock = jest.fn();
      // @ts-expect-error jsdom clipboard is not fully typed in test env
      navigator.clipboard = { writeText: writeTextMock };
    });
    afterAll(() => {
      // @ts-expect-error jsdom clipboard is not fully typed in test env
      navigator.clipboard = originalClipboard;
    });
    beforeEach(() => {
      writeTextMock.mockReset();
      toast = { success: jest.fn(), error: jest.fn() };
    });

    it('calls clipboard.writeText and toast.success for supported format', async () => {
      await handleCopy('csv', data, columns, toast);
      expect(writeTextMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });

    it('calls toast.error if clipboard.writeText throws', async () => {
      writeTextMock.mockRejectedValueOnce(new Error('fail'));
      await handleCopy('csv', data, columns, toast);
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('handleSave', () => {
    let toast: { success: jest.Mock; error: jest.Mock };
    let exportToCSVMock: jest.SpyInstance;
    beforeEach(() => {
      toast = { success: jest.fn(), error: jest.fn() };
      exportToCSVMock = jest.spyOn(utils, 'exportToCSV').mockImplementation(() => 'mocked,csv');
    });
    afterEach(() => {
      exportToCSVMock.mockRestore();
    });
    it('calls toast.success for supported format', () => {
      handleSave('csv', data, columns, toast, 'testfile');
      expect(toast.success).toHaveBeenCalled();
    });
    it('calls toast.error if exporter throws', () => {
      exportToCSVMock.mockImplementation(() => {
        throw new Error('fail');
      });
      handleSave('csv', data, columns, toast, 'testfile');
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
