import {
  BarChart3,
  LayoutDashboard,
  PanelsTopLeft,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Decisions",
    href: "/decision",
    icon: BarChart3,
  },
  {
    label: "Templates",
    href: "/templates",
    icon: PanelsTopLeft,
  },
];