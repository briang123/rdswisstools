import { AppSidebar } from '@/components/app-sidebar';
import { ToolCards } from './tool-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mt-4 mb-2">Tools</h1>
                <p className="mb-6 text-muted-foreground">
                  Explore and use a variety of tools to help you process, analyze, and improve your
                  data.
                </p>
              </div>
              <ToolCards />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
