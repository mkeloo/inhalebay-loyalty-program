"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  MonitorSmartphone,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/structure/nav-main";
import { NavProjects } from "@/components/structure/nav-projects";
import { NavUser } from "@/components/structure/nav-user";
import { TeamSwitcher } from "@/components/structure/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/dashboard/home",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Member Analytics",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Activity",
          url: "/dashboard/activity",
        },
        {
          title: "Members",
          url: "#",
        },
        {
          title: "Transactions",
          url: "#",
        },
      ],
    },
    {
      title: "Device Management",
      url: "#",
      icon: MonitorSmartphone,
      isActive: true,
      items: [
        {
          title: "Screen Codes",
          url: "/dashboard/device-management/screen-codes",
        },
        {
          title: "Client Device",
          url: "/dashboard/device-management/client-device",
        },
        {
          title: "Handler Device",
          url: "/dashboard/device-management/handler-device",
        },
      ],
    },
    {
      title: "Rewards & Tiers",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "Rewards Management",
          url: "/dashboard/rewards",
        },
        {
          title: "Member Tiers",
          url: "/dashboard/member-tiers",
        },
      ],
    },
    {
      title: "Campaigns",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Active",
          url: "/dashboard/campaigns",
        },
        {
          title: "Completed",
          url: "#",
        },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects p3rojects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
