"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Home,
  Trophy,
  Users,
  User,
  Settings,
  MessageSquare,
  Target,
  Calendar,
  Brain,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Learn",
    icon: BookOpen,
    href: "/learn",
    color: "text-violet-500",
  },
  {
    label: "Progress",
    icon: Trophy,
    href: "/progress",
    color: "text-yellow-500",
  },
  {
    label: "Social",
    icon: Users,
    href: "/social",
    color: "text-pink-500",
    badge: "3", // Example notification count
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
    color: "text-green-500",
  },
];

const toolRoutes = [
  {
    label: "Study Groups",
    icon: Users,
    href: "/study-groups",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
  },
  {
    label: "Goals",
    icon: Target,
    href: "/goals",
  },
  {
    label: "AI Tutor",
    icon: Brain,
    href: "/ai-tutor",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4 flex flex-col h-full bg-card">
        <div className="px-3 py-2">
          <Link href="/dashboard" className="flex items-center pl-3 mb-8">
            <Brain className="h-8 w-8 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">EduLearn</h1>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition",
                  pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
                {route.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {route.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
        <Separator />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Tools
          </h2>
          <div className="space-y-1">
            {toolRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition",
                  pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        <Separator />
        <div className="px-3 py-2 mt-auto">
          <Link
            href="/settings"
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition",
              pathname === "/settings"
                ? "bg-accent text-accent-foreground"
                : "transparent"
            )}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
          <div className="flex items-center p-3 mt-4">
            <UserButton afterSignOutUrl="/" />
            <span className="ml-3 text-sm font-medium">My Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
