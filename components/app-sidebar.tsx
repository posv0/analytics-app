"use client"

import * as React from "react"
import { BarChart3, Home, Settings, Users, RefreshCw, TrendingUp, Building2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

// Menu items
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: Home,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: TrendingUp,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.refresh()
    setIsRefreshing(false)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={`transition-all duration-200 ${state === "collapsed" ? "px-2" : "px-4"}`}>
        <div className={`flex items-center gap-2 ${state === "collapsed" ? "justify-center" : ""}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          {state === "expanded" && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Business Analytics</span>
              <span className="truncate text-xs text-muted-foreground">Dashboard</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`transition-all duration-200 ${state === "collapsed" ? "px-1" : "px-2"}`}>
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={state === "collapsed" ? item.title : undefined}
                    className={`transition-all duration-200 ${
                      state === "collapsed" ? "h-10 w-10 p-0 justify-center" : "h-10 px-3 justify-start"
                    }`}
                  >
                    <Link href={item.url}>
                      <item.icon className={`${state === "collapsed" ? "h-5 w-5" : "h-4 w-4"}`} />
                      {state === "expanded" && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  tooltip={state === "collapsed" ? "Refresh Data" : undefined}
                  className={`transition-all duration-200 ${
                    state === "collapsed" ? "h-10 w-10 p-0 justify-center" : "h-10 px-3 justify-start"
                  }`}
                >
                  <RefreshCw
                    className={`${state === "collapsed" ? "h-5 w-5" : "h-4 w-4"} ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {state === "expanded" && <span>Refresh Data</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`transition-all duration-200 ${state === "collapsed" ? "px-2" : "px-4"}`}>
        {state === "expanded" && (
          <div className="text-xs text-muted-foreground">
            <p>Business Analytics v2.0</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
