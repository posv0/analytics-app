"use client"

import {
  BarChart3,
  Users,
  Home,
  TrendingUp,
  Moon,
  Sun,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
  },
  {
    title: "Staff Overview",
    url: "/staff",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { state, toggleSidebar } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const isCollapsed = state === "collapsed"

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <TooltipProvider>
      <Sidebar className="border-r border-border/40" collapsible="icon">
        <SidebarHeader
          className={`${isCollapsed ? "p-2" : "p-4"} border-b border-border/40 transition-all duration-200`}
        >
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
            <div
              className={`flex ${isCollapsed ? "h-9 w-9" : "h-10 w-10"} items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shrink-0 transition-all duration-200`}
            >
              <BarChart3 className={`${isCollapsed ? "h-4 w-4" : "h-5 w-5"} text-white`} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="font-bold text-lg truncate">Analytics Pro</h2>
                <p className="text-xs text-muted-foreground truncate">Business Intelligence</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className={`${isCollapsed ? "px-1" : "px-3"} py-2 transition-all duration-200`}>
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Navigation
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                          className={`${isCollapsed
                              ? "h-9 w-9 p-0 justify-center mx-auto"
                              : "h-10 px-3 justify-start gap-3"
                            } rounded-lg transition-all duration-200 hover:bg-accent/50`}
                        >
                          <Link
                            href={item.url}
                            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} w-full`}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && <span className="font-medium truncate">{item.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" align="center" className="ml-1">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {!isCollapsed && (
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-0">
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between p-2.5 mx-1 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Active Staff</span>
                    <Badge variant="secondary" className="h-5 px-2">12</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 mx-1 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Alerts</span>
                    <Badge variant="destructive" className="h-5 px-2">3</Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter
          className={`${isCollapsed ? "p-1" : "p-3"} border-t border-border/40 space-y-1 transition-all duration-200`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`${isCollapsed
                    ? "w-9 h-9 p-0 mx-auto"
                    : "w-full px-3 justify-start gap-3 h-10"
                  } rounded-lg transition-all duration-200`}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {!isCollapsed && <span>Refresh Data</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center" className="ml-1">
                Refresh Data
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`${isCollapsed
                    ? "w-9 h-9 p-0 mx-auto"
                    : "w-full px-3 justify-start gap-3 h-10"
                  } rounded-lg transition-all duration-200`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {!isCollapsed && <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center" className="ml-1">
                Toggle {theme === "dark" ? "Light" : "Dark"} Mode
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`${isCollapsed
                    ? "w-9 h-9 p-0 mx-auto relative"
                    : "w-full px-3 justify-start gap-3 h-10"
                  } rounded-lg transition-all duration-200`}
              >
                <Bell className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span>Notifications</span>
                    <Badge variant="destructive" className="ml-auto h-5 px-2">
                      3
                    </Badge>
                  </>
                )}
                {isCollapsed && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                  >
                    3
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center" className="ml-1">
                Notifications (3)
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className={`${isCollapsed
                    ? "w-9 h-9 p-0 mx-auto"
                    : "w-full px-3 justify-start gap-3 h-10"
                  } rounded-lg transition-all duration-200`}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {!isCollapsed && <span>Collapse Sidebar</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center" className="ml-1">
                Expand Sidebar
              </TooltipContent>
            )}
          </Tooltip>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}