import React from 'react';
import type { ExportFormat } from '../utils/utils';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';
import {
  IconCopy,
  IconFileCode,
  IconFileText,
  IconFileTypeCsv,
  IconMarkdown,
  IconDownload,
  IconFileSpreadsheet,
  IconFile,
} from '@tabler/icons-react';

export interface ExportUIProps {
  onCopy: (format: ExportFormat) => void;
  onSave: (format: ExportFormat) => void;
}

export function ExportUI({ onCopy, onSave }: ExportUIProps) {
  return (
    <Menubar className="bg-muted border rounded-md shadow-sm" data-testid="data-table-menubar">
      <MenubarMenu>
        <MenubarTrigger>
          <IconCopy className="mr-2" />
          Copy
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => onCopy('json' as ExportFormat)}>
            <IconFileCode className="mr-2" />
            JSON
          </MenubarItem>
          <MenubarItem onClick={() => onCopy('html' as ExportFormat)}>
            <IconFileText className="mr-2" />
            HTML
          </MenubarItem>
          <MenubarItem onClick={() => onCopy('csv' as ExportFormat)}>
            <IconFileTypeCsv className="mr-2" />
            CSV
          </MenubarItem>
          <MenubarItem onClick={() => onCopy('markdown' as ExportFormat)}>
            <IconMarkdown className="mr-2" />
            Markdown
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <IconDownload className="mr-2" />
          Save
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => onSave('json' as ExportFormat)}>
            <IconFileCode className="mr-2" />
            JSON
          </MenubarItem>
          <MenubarItem onClick={() => onSave('html' as ExportFormat)}>
            <IconFileText className="mr-2" />
            HTML
          </MenubarItem>
          <MenubarItem onClick={() => onSave('csv' as ExportFormat)}>
            <IconFileTypeCsv className="mr-2" />
            CSV
          </MenubarItem>
          <MenubarItem onClick={() => onSave('markdown' as ExportFormat)}>
            <IconMarkdown className="mr-2" />
            Markdown
          </MenubarItem>
          <MenubarItem onClick={() => onSave('excel' as ExportFormat)}>
            <IconFileSpreadsheet className="mr-2" />
            Excel
          </MenubarItem>
          <MenubarItem onClick={() => onSave('pdf' as ExportFormat)}>
            <IconFile className="mr-2" />
            PDF
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
