"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { dailySalesData, staffData, yearlyData } from "@/lib/mock-data"
import {
  calculateAdvancedStats,
  getMonthlySalesData,
  getShopPerformanceData,
  getQuarterlyComparison,
} from "@/lib/utils"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function Dashboard() {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d")

  const advancedStats = calculateAdvancedStats(dailySalesData, staffData, yearlyData)
  const monthlySalesData = getMonthlySalesData(dailySalesData)
  const shopPerformanceData = getShopPerformanceData(dailySalesData)
  const quarterlyData = getQuarterlyComparison(yearlyData)

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates)
    if (newExpanded.has(date)) {
      newExpanded.delete(date)
    } else {
      newExpanded.add(date)
    }
    setExpandedDates(newExpanded)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-1">Real-time business insights and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            {(["7d", "30d", "90d", "1y"] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : period === "90d" ? "90 Days" : "1 Year"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                ${advancedStats.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {advancedStats.revenueGrowth > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <p className={`text-xs ${advancedStats.revenueGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                  {Math.abs(advancedStats.revenueGrowth)}% from last month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Top Performer</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{advancedStats.topPerformer}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ${advancedStats.topPerformerSales.toLocaleString()} in sales
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Active Staff</CardTitle>
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{advancedStats.activeStaff}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {advancedStats.totalAbsences} total absences
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Avg Daily Sales
              </CardTitle>
              <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                ${advancedStats.avgDailySales.toLocaleString()}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Target: ${advancedStats.dailyTarget.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="xl:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Revenue Trend Analysis
              </CardTitle>
              <CardDescription>Monthly performance with growth indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlySalesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`$${value}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Shop Performance Pie */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Shop Distribution
              </CardTitle>
              <CardDescription>Revenue breakdown by location</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={shopPerformanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="sales"
                  >
                    {shopPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {shopPerformanceData.map((shop, index) => (
                  <Badge key={shop.shop} variant="secondary" className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {shop.shop}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quarterly Comparison */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Quarterly Performance Comparison
            </CardTitle>
            <CardDescription>Year-over-year quarterly analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Bar dataKey="currentYear" fill="#3b82f6" name="2025" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previousYear" fill="#94a3b8" name="2024" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Interactive Daily Sales Log */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Daily Sales Breakdown
            </CardTitle>
            <CardDescription>Detailed daily performance with shop-wise analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailySalesData.slice(0, 5).map((dayData) => (
                <div key={dayData.date} className="border border-border/40 rounded-xl overflow-hidden bg-card/50">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto hover:bg-accent/50 transition-all duration-200"
                    onClick={() => toggleDate(dayData.date)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="font-medium">{dayData.date}</span>
                      <Badge variant="outline" className="ml-2">
                        $
                        {Object.values(dayData.salesData)
                          .reduce((sum: number, shop: any) => sum + shop.total, 0)
                          .toLocaleString()}
                      </Badge>
                    </div>
                    {expandedDates.has(dayData.date) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>

                  {expandedDates.has(dayData.date) && (
                    <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/20">
                      {Object.entries(dayData.salesData).map(([shopKey, shopData], index) => (
                        <Card key={shopKey} className="border-0 shadow-sm bg-background/80">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                              {shopKey === "shop1" ? "Shop 1" : shopKey === "shop2" ? "Shop 2" : "Shop 3"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="text-2xl font-bold text-foreground">
                                ${shopData.total.toLocaleString()}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Online:</span>
                                  <span className="font-medium">${shopData.online || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Cash:</span>
                                  <span className="font-medium">${shopData.cash || 0}</span>
                                </div>
                              </div>
                              <div className="mt-4">
                                <ResponsiveContainer width="100%" height={80}>
                                  <BarChart
                                    data={[
                                      { name: "Online", value: shopData.online || 0, fill: "#3b82f6" },
                                      { name: "Cash", value: shopData.cash || 0, fill: "#10b981" },
                                    ]}
                                  >
                                    <Bar dataKey="value" radius={[2, 2, 0, 0]} />
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                      }}
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
