'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const pathname = usePathname();
  // Simple route-to-title mapping
  const routeTitles: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/tools': 'Tools',
    '/tools/results-cleaner': 'Results Cleaner',
    '/upload': 'Upload',
  };
  // Fallback: use last segment, capitalized
  function getTitle(path: string) {
    if (routeTitles[path]) return routeTitles[path];
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Home';
    return segments[segments.length - 1]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  const title = getTitle(pathname);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button> */}
        </div>
      </div>
    </header>
  );
}
