"use client"

import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  MessageSquare,
  Phone,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NewJobModal } from "@/components/new-job-modal"

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "Workflow Automation",
      icon: ClipboardList,
      path: "/workflow",
    },
    {
      title: "Patient Communication",
      icon: MessageSquare,
      path: "/communication",
    },
    {
      title: "Documentation",
      icon: FileText,
      path: "/documentation",
    },
    {
      title: "Calendar",
      icon: Calendar,
      path: "/calendar",
    },
    {
      title: "Patients",
      icon: Users,
      path: "/patients",
    },
    {
      title: "Call Center",
      icon: Phone,
      path: "/calls",
    },
  ]

  return (
    <Sidebar variant="floating" collapsible="none" className="border-r shadow-sm">
      <SidebarHeader className="flex flex-col items-start px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-xl font-bold">HealthAssist AI</span>
        </div>
        <div className="mt-4 w-full">
          <NewJobModal />
        </div>
      </SidebarHeader>
      <SidebarSeparator className="my-2" />
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={isActive(item.path)}>
                <Link href={item.path} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator className="my-2" />
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Dr. Sarah Johnson</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
