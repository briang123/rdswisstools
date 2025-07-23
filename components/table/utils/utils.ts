import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type TableRow = Record<string, unknown>;
export type ExportFormat = 'csv' | 'json' | 'html' | 'markdown' | 'excel' | 'pdf';

/**
 * Returns the header row and data rows for a table export.
 * @param data - Array of table row objects
 * @param columns - Array of column keys
 * @returns Tuple of header row and data rows
 */
function getTableRows(data: TableRow[], columns: string[]): [string[], string[][]] {
  const headerRow = columns;
  const dataRows = data.map((row) => columns.map((col) => String(row[col] ?? '')));
  return [headerRow, dataRows];
}

/**
 * Exports table data to CSV format.
 * @param data - Array of table row objects
 * @param columns - Array of column keys
 * @returns CSV string
 */
export function exportToCSV(data: TableRow[], columns: string[]): string {
  const [headerRow, dataRows] = getTableRows(data, columns);
  return Papa.unparse([headerRow, ...dataRows]);
}

/**
 * Exports table data to JSON format.
 * @param data - Array of table row objects
 * @param columns - Array of column keys
 * @returns JSON string
 */
export function exportToJSON(data: TableRow[], columns: string[]): string {
  const jsonData = data.map((row) => {
    const obj: TableRow = {};
    columns.forEach((col) => {
      obj[col] = row[col] ?? '';
    });
    return obj;
  });
  return JSON.stringify(jsonData, null, 2);
}

/**
 * Exports table data to HTML table format.
 * @param data - Array of table row objects
 * @param columns - Array of column keys
 * @returns HTML string
 */
export function exportToHTML(data: TableRow[], columns: string[]): string {
  const [headerRow, dataRows] = getTableRows(data, columns);
  let html = '<table border="1" cellpadding="5" cellspacing="0">\n';
  html += '  <thead>\n    <tr>\n';
  headerRow.forEach((col) => {
    html += `      <th>${col}</th>\n`;
  });
  html += '    </tr>\n  </thead>\n';
  html += '  <tbody>\n';
  dataRows.forEach((row) => {
    html += '    <tr>\n';
    row.forEach((cell) => {
      html += `      <td>${cell}</td>\n`;
    });
    html += '    </tr>\n';
  });
  html += '  </tbody>\n</table>';
  return html;
}

/**
 * Exports table data to Markdown table format.
 * @param data - Array of table row objects
 * @param columns - Array of column keys
 * @returns Markdown string
 */
export function exportToMarkdown(data: TableRow[], columns: string[]): string {
  const [headerRow, dataRows] = getTableRows(data, columns);
  let md = '| ' + headerRow.join(' | ') + ' |\n';
  md += '| ' + headerRow.map(() => '---').join(' | ') + ' |\n';
  dataRows.forEach((row) => {
    md += '| ' + row.join(' | ') + ' |\n';
  });
  return md;
}

/**
 * Exports table data to an Excel (XLSX) file and triggers download.
 * @param data - Array of table row objects
 * @param columns - Array of column keys
 * @param filename - Name of the file to save
 */
export function exportToXLSX(data: TableRow[], columns: string[], filename: string): void {
  const [headerRow, dataRows] = getTableRows(data, columns);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
  XLSX.writeFile(wb, filename);
}

/**
 * Exports table data to a PDF file and triggers download.
 * @param data - Array of table row objects
 * @param columns - Array of column keys
 * @param filename - Name of the file to save
 */
export function exportToPDF(data: TableRow[], columns: string[], filename: string): void {
  const [headerRow, dataRows] = getTableRows(data, columns);
  const doc = new jsPDF();
  autoTable(doc, {
    head: [headerRow],
    body: dataRows,
    startY: 20,
    margin: { top: 20 },
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229] },
  });
  doc.setFontSize(16);
  doc.text('Table Data', 14, 15);
  doc.save(filename);
}

/**
 * Triggers a download of a file with the given content and type.
 * @param content - File content as string
 * @param filename - Name of the file to save
 * @param contentType - MIME type of the file
 */
export function downloadBlob(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const copyExporters: Record<
  ExportFormat,
  ((data: TableRow[], columns: string[]) => string) | undefined
> = {
  csv: exportToCSV,
  json: exportToJSON,
  html: exportToHTML,
  markdown: exportToMarkdown,
  excel: undefined, // Not supported for copy
  pdf: undefined, // Not supported for copy
};

/**
 * Copies table data in the specified format to the clipboard.
 * @param format - Export format (csv, json, html, markdown)
 * @param data - Array of table row objects
 * @param visibleColumns - Array of column keys to include
 * @param toast - Toast object with success and error methods
 */
export async function handleCopy(
  format: ExportFormat,
  data: TableRow[],
  visibleColumns: string[],
  toast: { success: (msg: string) => void; error: (msg: string) => void },
): Promise<void> {
  const exporter = copyExporters[format];
  if (!exporter) return;
  try {
    const content = exporter(data, visibleColumns);
    await navigator.clipboard.writeText(content);
    toast.success(`Copied table data as ${format.toUpperCase()} to clipboard`);
  } catch (err) {
    toast.error('Failed to copy to clipboard');
  }
}

/**
 * Returns a mapping of export formats to their corresponding exporter functions, mime types, and file extensions.
 * Used by handleSave to dynamically resolve the correct exporter, supporting test mocking and extensibility.
 * @returns An object mapping ExportFormat to exporter config (function, mime, ext)
 */
function getSaveExporters() {
  return {
    csv: { exporter: exportToCSV, mime: 'text/csv', ext: '.csv' },
    json: { exporter: exportToJSON, mime: 'application/json', ext: '.json' },
    html: { exporter: exportToHTML, mime: 'text/html', ext: '.html' },
    markdown: { exporter: exportToMarkdown, mime: 'text/markdown', ext: '.md' },
    excel: { exporter: exportToXLSX, ext: '.xlsx' },
    pdf: { exporter: exportToPDF, ext: '.pdf' },
  } as const;
}

/**
 * Saves table data in the specified format to a file and triggers download.
 * @param format - Export format (csv, json, html, markdown, excel, pdf)
 * @param data - Array of table row objects
 * @param visibleColumns - Array of column keys to include
 * @param toast - Toast object with success and error methods
 * @param baseFilename - Optional base filename (default: 'table')
 */
export function handleSave(
  format: ExportFormat,
  data: TableRow[],
  visibleColumns: string[],
  toast: { success: (msg: string) => void; error: (msg: string) => void },
  baseFilename?: string,
): void {
  const config = getSaveExporters()[format];
  if (!config) {
    return;
  }
  const filename = (baseFilename || 'table') + config.ext;
  try {
    if ('mime' in config && config.mime) {
      const content = (config.exporter as (data: TableRow[], columns: string[]) => string)(
        data,
        visibleColumns,
      );
      toast.success(`Saved table data as ${format.toUpperCase()}`);
      try {
        downloadBlob(content, filename, config.mime);
      } catch (err) {
        toast.error('Failed to save file');
        return;
      }
    } else {
      (config.exporter as (data: TableRow[], columns: string[], filename: string) => void)(
        data,
        visibleColumns,
        filename,
      );
      toast.success(`Saved table data as ${format.toUpperCase()}`);
    }
  } catch (err) {
    toast.error('Failed to save file');
  }
}
