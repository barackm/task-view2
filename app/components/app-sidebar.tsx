import * as React from "react";
import { BookOpen, Command, Frame, Map, PieChart, Send, Settings2 } from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavProjects } from "~/components/nav-projects";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const data = {
  user: {
    name: "Barack Mukelenga",
    email: "barackmukelenga100@gmail.om",
    avatar: "https://avatars.dicebear.com/api/avataaars/barackmukelenga.svg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: PieChart,
      isActive: true,
      disabled: false,
      items: [
        {
          title: "Overview",
          url: "#",
          disabled: false,
        },
        {
          title: "Analytics",
          url: "#",
          disabled: true, // example of a disabled item
        },
        {
          title: "Reports",
          url: "#",
          disabled: false,
        },
      ],
    },
    {
      title: "Tasks",
      url: "#",
      icon: Command,
      disabled: false,
      items: [
        {
          title: "All Tasks",
          url: "#",
          disabled: false,
        },
        {
          title: "My Tasks",
          url: "#",
          disabled: false,
        },
        {
          title: "Completed",
          url: "#",
          disabled: true, // example of a disabled item
        },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: Frame,
      disabled: false,
      items: [
        {
          title: "All Projects",
          url: "#",
          disabled: false,
        },
        {
          title: "Active Projects",
          url: "#",
          disabled: false,
        },
        {
          title: "Archived Projects",
          url: "#",
          disabled: true, // example of a disabled item
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      disabled: false,
      items: [
        {
          title: "General",
          url: "#",
          disabled: false,
        },
        {
          title: "Team",
          url: "#",
          disabled: false,
        },
        {
          title: "Notifications",
          url: "#",
          disabled: true, // example of a disabled item
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Help & Documentation",
      url: "#",
      icon: BookOpen,
      disabled: false,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
      disabled: false,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
      disabled: false,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
      disabled: false,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
      disabled: true, // example of a disabled project
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='/'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Task View</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
