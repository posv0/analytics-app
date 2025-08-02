"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ErrorBoundary } from "@/components/error-boundary"
import { TrendingUp, BarChart3, PieChart, Activity, Target, Download, RefreshCw, Users, DollarSign } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"
import { dailySalesData, staffData, seasonalData } from "@/lib/mock-data"
import {
  getAdvancedAnalytics,
  getShopComparison,
  getTimeSeriesAnalysis,
  getCustomerSegmentation,
  getProfitabilityAnalysis,
  filterDataByPeriod,
  formatCurrency,
} from "@/lib/utils"

type TimePeriod = "7d" | "30d" | "90d" | "1y"

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const filteredData = useMemo(() => {
    return filterDataByPeriod(dailySalesData, timePeriod)
  }, [timePeriod])

  const advancedAnalytics = useMemo(() => {
    return getAdvancedAnalytics(filteredData, staffData, timePeriod)
  }, [filteredData, timePeriod])

  const shopComparison = useMemo(() => {
    return getShopComparison(filteredData, timePeriod)
  }, [filteredData, timePeriod])

  const timeSeriesData = useMemo(() => {
    return getTimeSeriesAnalysis(filteredData, timePeriod)
  }, [filteredData, timePeriod])

  const customerSegmentation = useMemo(() => {
    return getCustomerSegmentation(filteredData)
  }, [filteredData])

  const profitabilityData = useMemo(() => {
    return getProfitabilityAnalysis(filteredData, staffData)
  }, [filteredData])

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Advanced Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive business intelligence and insights • {filteredData.length} records
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Advanced KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {advancedAnalytics.growthRate >= 0 ? "+" : ""}
                  {advancedAnalytics.growthRate}%
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">vs previous period</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  Efficiency Score
                </CardTitle>
                <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {advancedAnalytics.efficiencyScore}%
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">operational efficiency</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Market Share</CardTitle>
                <PieChart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {advancedAnalytics.marketShare}%
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">local market</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Forecast Accuracy
                </CardTitle>
                <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {advancedAnalytics.forecastAccuracy}%
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">prediction accuracy</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-pink-700 dark:text-pink-300">
                  Customer Retention
                </CardTitle>
                <Users className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                  {advancedAnalytics.customerRetention}%
                </div>
                <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">retention rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Time Series Analysis */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Time Series Analysis
              </CardTitle>
              <CardDescription>Revenue trends with growth indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [
                      name === "revenue" ? formatCurrency(value, "INR") : `${value}%`,
                      name === "revenue" ? "Revenue" : "Growth",
                    ]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                  <Line type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Shop Performance Comparison */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Shop Performance Metrics
                </CardTitle>
                <CardDescription>Comprehensive shop comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={shopComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="shop" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [
                        name === "revenue" ? formatCurrency(value, "INR") : value,
                        name === "revenue"
                          ? "Revenue"
                          : name === "performanceScore"
                            ? "Performance Score"
                            : "Transactions",
                      ]}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="performanceScore" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Profitability Analysis
                </CardTitle>
                <CardDescription>Revenue vs costs breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={profitabilityData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [
                        name === "profitMargin" ? `${value}%` : formatCurrency(value, "INR"),
                        name === "revenue" ? "Revenue" : name === "profit" ? "Profit" : "Profit Margin",
                      ]}
                    />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Customer Segmentation */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Customer Segmentation Analysis
              </CardTitle>
              <CardDescription>Customer distribution and lifetime value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {customerSegmentation.map((segment, index) => (
                  <div key={segment.name} className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary mb-2">{segment.value}%</div>
                    <div className="font-semibold mb-1">{segment.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{segment.description}</div>
                    <Badge variant="secondary">CLV: {formatCurrency(segment.clv, "INR")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Trends */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Seasonal Trends & Forecasting
              </CardTitle>
              <CardDescription>Historical trends with future predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [formatCurrency(value, "INR"), "Sales"]}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
                  <Line type="monotone" dataKey="trend" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
