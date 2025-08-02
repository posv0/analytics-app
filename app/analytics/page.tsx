"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Users,
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Scatter,
  ScatterChart,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  Pie,
} from "recharts"
import { yearlyData, staffData, seasonalData, forecastData, dailySalesData } from "@/lib/mock-data"
import {
  getSeasonalTrends,
  getPerformanceMetrics,
  getForecastData,
  getCorrelationData,
  getAdvancedAnalytics,
  getShopComparison,
  getTimeSeriesAnalysis,
  getCustomerSegmentation,
  getProfitabilityAnalysis,
} from "@/lib/utils"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"]

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "growth" | "efficiency">("revenue")
  const [timeRange, setTimeRange] = useState<"3m" | "6m" | "1y" | "2y">("1y")
  const [selectedShop, setSelectedShop] = useState<"all" | "shop1" | "shop2" | "shop3">("all")

  const seasonalTrends = getSeasonalTrends(seasonalData)
  const performanceMetrics = getPerformanceMetrics(yearlyData, staffData)
  const forecast = getForecastData(forecastData)
  const correlationData = getCorrelationData(yearlyData, staffData)

  // Advanced analytics data
  const advancedAnalytics = useMemo(() => getAdvancedAnalytics(dailySalesData, staffData, timeRange), [timeRange])
  const shopComparison = useMemo(() => getShopComparison(dailySalesData, timeRange), [timeRange])
  const timeSeriesAnalysis = useMemo(() => getTimeSeriesAnalysis(dailySalesData, timeRange), [timeRange])
  const customerSegmentation = useMemo(() => getCustomerSegmentation(dailySalesData), [])
  const profitabilityAnalysis = useMemo(() => getProfitabilityAnalysis(dailySalesData, staffData), [])

  const handleExportAnalytics = () => {
    const analyticsData = {
      timeRange,
      selectedMetric,
      advancedAnalytics,
      shopComparison,
      timeSeriesAnalysis,
      customerSegmentation,
      profitabilityAnalysis,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-report-${timeRange}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Advanced Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Deep insights and predictive analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="efficiency">Efficiency</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="2y">2 Years</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedShop} onValueChange={(value: any) => setSelectedShop(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shops</SelectItem>
                <SelectItem value="shop1">Shop 1</SelectItem>
                <SelectItem value="shop2">Shop 2</SelectItem>
                <SelectItem value="shop3">Shop 3</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExportAnalytics} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Advanced KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                +{advancedAnalytics.growthRate}%
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                {timeRange === "3m"
                  ? "Last 3 months"
                  : timeRange === "6m"
                    ? "Last 6 months"
                    : timeRange === "1y"
                      ? "Year over year"
                      : "2 year trend"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Efficiency Score
              </CardTitle>
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {advancedAnalytics.efficiencyScore}%
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {advancedAnalytics.efficiencyScore > 85
                  ? "Excellent"
                  : advancedAnalytics.efficiencyScore > 70
                    ? "Good"
                    : "Needs improvement"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/50 dark:to-rose-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-300">Market Share</CardTitle>
              <PieChart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                {advancedAnalytics.marketShare}%
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Local market</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Forecast Accuracy
              </CardTitle>
              <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {advancedAnalytics.forecastAccuracy}%
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Last 6 months</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/50 dark:to-violet-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-violet-700 dark:text-violet-300">
                Customer Retention
              </CardTitle>
              <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-900 dark:text-violet-100">
                {advancedAnalytics.customerRetention}%
              </div>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">Returning customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="shops">Shop Analysis</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Seasonal Trends & Forecast */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Seasonal Trends Analysis
                  </CardTitle>
                  <CardDescription>Monthly patterns and seasonal variations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={seasonalTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                      <Line type="monotone" dataKey="trend" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Revenue Forecast
                  </CardTitle>
                  <CardDescription>Predictive analysis for next 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={forecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value, name) => [
                          `$${value}`,
                          name === "actual" ? "Actual" : name === "forecast" ? "Forecast" : "Confidence",
                        ]}
                      />
                      <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="actual" />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        strokeDasharray="8 8"
                        name="forecast"
                      />
                      <Area type="monotone" dataKey="upperBound" fill="#8b5cf6" fillOpacity={0.1} stroke="none" />
                      <Area type="monotone" dataKey="lowerBound" fill="#8b5cf6" fillOpacity={0.1} stroke="none" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Performance Metrics Dashboard
                </CardTitle>
                <CardDescription>Comprehensive performance analysis across all metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Performance Score */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Performance Scores
                    </h4>
                    {performanceMetrics.scores.map((metric, index) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <Badge
                            variant={metric.score > 80 ? "default" : metric.score > 60 ? "secondary" : "destructive"}
                          >
                            {metric.score}%
                          </Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              metric.score > 80 ? "bg-green-500" : metric.score > 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trends */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Trend Analysis
                    </h4>
                    {performanceMetrics.trends.map((trend, index) => (
                      <div key={trend.metric} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">{trend.metric}</p>
                          <p className="text-xs text-muted-foreground">{trend.period}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {trend.change > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${trend.change > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {Math.abs(trend.change)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Correlation Analysis */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Correlation Matrix
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <ScatterChart data={correlationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="staffPerformance" stroke="#64748b" fontSize={10} />
                        <YAxis dataKey="sales" stroke="#64748b" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Scatter dataKey="sales" fill="#3b82f6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Time Series Analysis
                </CardTitle>
                <CardDescription>Detailed trend analysis over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={timeSeriesAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={3} />
                    <Bar yAxisId="left" dataKey="transactions" fill="#f59e0b" opacity={0.7} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shops" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    Shop Performance Comparison
                  </CardTitle>
                  <CardDescription>Comparative analysis across all locations</CardDescription>
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
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      <Bar dataKey="transactions" fill="#10b981" name="Transactions" />
                      <Bar dataKey="avgOrderValue" fill="#f59e0b" name="Avg Order Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Shop Performance Radar
                  </CardTitle>
                  <CardDescription>Multi-dimensional performance view</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={shopComparison}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="shop" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="performanceScore"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Customer Segmentation
                  </CardTitle>
                  <CardDescription>Customer behavior analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={customerSegmentation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {customerSegmentation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {customerSegmentation.map((segment, index) => (
                      <Badge key={segment.name} variant="secondary" className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        {segment.name}: {segment.value}%
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Customer Lifetime Value
                  </CardTitle>
                  <CardDescription>CLV analysis by segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSegmentation.map((segment, index) => (
                      <div key={segment.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div>
                            <p className="font-medium text-sm">{segment.name}</p>
                            <p className="text-xs text-muted-foreground">{segment.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${segment.clv}</p>
                          <p className="text-xs text-muted-foreground">Avg CLV</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Profitability Analysis
                </CardTitle>
                <CardDescription>Detailed profit margin and cost analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={profitabilityAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      <Bar dataKey="costs" fill="#ef4444" name="Costs" />
                      <Line
                        type="monotone"
                        dataKey="profitMargin"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Profit Margin %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Key Profitability Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Gross Margin</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">68.5%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Net Margin</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">24.3%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Break-even</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-600">$15.2K</p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">ROI</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">156%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Advanced Forecasting Models
                </CardTitle>
                <CardDescription>AI-powered predictions and scenario analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={forecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Historical" />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        strokeDasharray="8 8"
                        name="Forecast"
                      />
                      <Line
                        type="monotone"
                        dataKey="optimistic"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        name="Optimistic"
                      />
                      <Line
                        type="monotone"
                        dataKey="pessimistic"
                        stroke="#ef4444"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        name="Pessimistic"
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Forecast Scenarios
                    </h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-800 dark:text-green-200">Optimistic Scenario</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            +35%
                          </Badge>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Strong market conditions, successful marketing campaigns, seasonal boost
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-800 dark:text-blue-200">Base Scenario</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            +18%
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Current trends continue, moderate growth, stable market conditions
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-red-800 dark:text-red-200">Pessimistic Scenario</span>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            +5%
                          </Badge>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Economic downturn, increased competition, supply chain issues
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
