"use client"

import { BarChart3, Users, Home, TrendingUp, Moon, Sun, Settings, Bell, ChevronLeft, ChevronRight } from "lucide-react"
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

  const isCollapsed = state === "collapsed"

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <TooltipProvider>
      <Sidebar className="border-r border-border/40" collapsible="icon">
        <SidebarHeader className="p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shrink-0">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="font-bold text-lg truncate">Analytics Pro</h2>
                <p className="text-xs text-muted-foreground truncate">Business Intelligence</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                          className="h-11 rounded-lg transition-all duration-200 hover:bg-accent/50"
                          tooltip={isCollapsed ? item.title : undefined}
                        >
                          <Link href={item.url} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && <span className="font-medium truncate">{item.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" align="center">
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
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Active Staff</span>
                    <Badge variant="secondary">4</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Alerts</span>
                    <Badge variant="destructive">2</Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border/40 space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`${isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start gap-3 h-11"} rounded-lg`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {!isCollapsed && <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center">
                Toggle {theme === "dark" ? "Light" : "Dark"} Mode
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`${isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start gap-3 h-11"} rounded-lg`}
              >
                <Bell className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span>Notifications</span>
                    <Badge variant="destructive" className="ml-auto">
                      2
                    </Badge>
                  </>
                )}
                {isCollapsed && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    2
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center">
                Notifications (2)
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className={`${isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start gap-3 h-11"} rounded-lg`}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {!isCollapsed && <span>Collapse Sidebar</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center">
                Expand Sidebar
              </TooltipContent>
            )}
          </Tooltip>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
