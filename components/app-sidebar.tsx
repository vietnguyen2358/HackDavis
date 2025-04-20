"use client"

import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  MessageSquare,
  PanelLeft,
  Phone,
  Settings,
  Users,
  ChevronLeft,
  LogOut,
  X,
  Menu
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NewJobModal } from "@/components/new-job-modal"
import { SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, openMobile, setOpenMobile, isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  
  const isLandingPage = pathname === "/"

  // Only run after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Initialize sidebar visibility based on page
    setSidebarVisible(!isLandingPage)
  }, [pathname, isLandingPage])

  const isActive = (path: string) => {
    if (pathname === "/" && path !== "/") {
      return false
    }
    return pathname === path
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
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
  ]

  // Toggle sidebar button
  const ToggleSidebarButton = () => {
    if (!mounted || !isLandingPage) return null; // Prevent hydration errors and only show on landing page
    
    // For closed sidebar - show at top left of screen
    if (!((isMobile && openMobile) || (!isMobile && sidebarVisible))) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4 z-50 bg-background shadow-md rounded-full flex items-center justify-center" 
              onClick={() => {
                if (isMobile) {
                  toggleSidebar()
                } else {
                  setSidebarVisible(true)
                }
              }}
              aria-label="Open menu"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Toggle sidebar
          </TooltipContent>
        </Tooltip>
      );
    }
    
    // Don't render anything here for open sidebar - it will be rendered inside sidebar
    return null;
  };

  // Mobile menu toggle button
  const MobileMenuButton = () => {
    if (!mounted) return null;

    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50 bg-background shadow-md rounded-full" 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    );
  };

  const sidebarContent = (
    <>
      <SidebarHeader className="flex flex-col items-start px-4 py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary shadow-sm">
            <span className="text-lg font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-xl font-bold">HealthAssist AI</span>
        </Link>
        <div className="mt-6 w-full">
          <NewJobModal />
        </div>
      </SidebarHeader>

      <SidebarSeparator className="my-2" />

      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive(item.path)}
                className="transition-all duration-200"
              >
                <Link 
                  href={item.path} 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-sidebar-accent group"
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <div className={`flex items-center justify-center h-8 w-8 rounded-md ${isActive(item.path) ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground group-hover:text-primary'}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="my-2" />

      <SidebarFooter className="p-4 mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors duration-200">
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              <AvatarImage asChild alt="User">
                <Image 
                  src="/placeholder.svg" 
                  alt="User" 
                  width={40} 
                  height={40}
                  priority={false}
                />
              </AvatarImage>
              <AvatarFallback className="bg-primary/10 text-primary">DR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Dr. Sarah Johnson</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Toggle button at bottom right of sidebar when open */}
        {isLandingPage && ((isMobile && openMobile) || (!isMobile && sidebarVisible)) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-4 right-4 rounded-full bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors"
                onClick={() => {
                  if (isMobile) {
                    setOpenMobile(false);
                  } else {
                    setSidebarVisible(false);
                  }
                }}
                aria-label="Close sidebar"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              Toggle sidebar
            </TooltipContent>
          </Tooltip>
        )}
      </SidebarFooter>
    </>
  );

  return (
    <>
      <ToggleSidebarButton />
      <MobileMenuButton />
      
      <Sidebar 
        variant="floating" 
        collapsible={isMobile ? "offcanvas" : isLandingPage ? (sidebarVisible ? "none" : "icon") : "none"} 
        className={`border-r shadow-md transition-all duration-300 ${
          isLandingPage && !sidebarVisible && !isMobile ? 'md:w-0 md:min-w-0 md:p-0 md:m-0 md:border-0 md:opacity-0' : 'md:block'
        }`}
      >
        {isMobile && <SheetTitle className="sr-only">Navigation Menu</SheetTitle>}
        {sidebarContent}
      </Sidebar>
    </>
  )
}
