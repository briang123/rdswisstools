'use client';

import * as React from 'react';
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconTools,
  IconTrophy,
  IconCirclePlusFilled,
  type Icon,
} from '@tabler/icons-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

type NavMainItem = {
  title: string;
  url?: string;
  icon?: Icon;
  submenu?: { title: string; url: string; icon?: Icon }[];
};
type NavCloudItem = {
  title: string;
  icon: Icon;
  isActive?: boolean;
  url: string;
  items: { title: string; url: string }[];
};
type NavSecondaryItem = {
  title: string;
  url: string;
  icon: Icon;
};
type DocumentItem = {
  name: string;
  url: string;
  icon: Icon;
};

const data: {
  user: { name: string; email: string; avatar: string };
  navMain: NavMainItem[];
  navClouds: NavCloudItem[];
  navSecondary: NavSecondaryItem[];
  documents: DocumentItem[];
} = {
  user: {
    name: 'Your Name',
    email: 'm@example.com',
    avatar: '/avatars/app-profile.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      icon: IconDashboard,
      url: '#',
    },
    {
      title: 'Tools',
      url: '/tools',
      icon: IconTools,
      submenu: [
        { title: 'Results Cleaner', url: '/tools/results-cleaner', icon: IconFileDescription },
        // Add more submenu items here if needed
      ],
    },
    // {
    //   title: 'Lifecycle',
    //   url: '#',
    //   icon: IconListDetails,
    // },
    // {
    //   title: 'Analytics',
    //   url: '#',
    //   icon: IconChartBar,
    // },
    // {
    //   title: 'Projects',
    //   url: '#',
    //   icon: IconFolder,
    // },
    // {
    //   title: 'Team',
    //   url: '#',
    //   icon: IconUsers,
    // },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Track open state for each collapsible menu (by title for now)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              data-testid="sidebar-menu-home"
            >
              <a href="#" data-testid="sidebar-link-home">
                <IconTrophy className="!size-5" />
                <span className="text-base font-semibold">RD Event Tools</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {/* Create Event button */}
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Create Event"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-not-allowed"
                  data-testid="sidebar-menu-create-event"
                >
                  <IconCirclePlusFilled />
                  <span>Create Event</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Main nav with dropdown for Tools */}
              {data.navMain.map((item) => (
                <React.Fragment key={item.title}>
                  {item.submenu ? (
                    <Collapsible
                      open={openMenu === item.title}
                      onOpenChange={(open) => setOpenMenu(open ? item.title : null)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <div className="flex items-center w-full">
                          <a
                            href={item.url}
                            className="flex flex-1 items-center gap-2 px-2 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                            data-testid={`sidebar-link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </a>
                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              className="ml-1 p-1 rounded hover:bg-sidebar-accent"
                              tabIndex={-1}
                              aria-label={`Toggle ${item.title} submenu`}
                            >
                              <ChevronRight className="chevron-rotate" />
                            </button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  data-testid={`sidebar-submenu-link-${sub.title.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  <a href={sub.url}>
                                    {sub.icon && <sub.icon />}
                                    <span>{sub.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : item.url ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={item.url === '#' ? 'cursor-not-allowed' : ''}
                      >
                        <a href="#">
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
