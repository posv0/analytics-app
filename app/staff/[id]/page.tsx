"use client"
// StaffDetailPage.tsx
import { parse, getDay } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Calendar, TrendingUp, UserX, Target, ArrowLeft, Activity, TrendingDown } from "lucide-react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import Link from "next/link"
import { staffData } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { getStaffTrends, getStaffGoals, calculateStaffMetrics, formatCurrency } from "@/lib/utils"
import { useTheme } from "next-themes"

interface StaffDetailPageProps {
  params: {
    id: string
  }
}

export default function StaffDetailPage({ params }: StaffDetailPageProps) {
  // Optional: get current theme for dynamic color classes
  const { theme } = useTheme?.() || { theme: "light" }

  const staff = staffData.find((s) => s.staffId === params.id)

  if (!staff) {
    notFound()
  }

  // Calculations
  const metrics = calculateStaffMetrics(staff)
  const trends = getStaffTrends(staff, [])
  const goals = getStaffGoals(staff)
  const monthlyTarget = (staff.salaryAmount) * 4

  // Chart data
  const chartData = staff.monthlySalesOnDailyBasis.map((day) => ({
    date: day.date.split(" ")[0],
    amount: day.amount,
    target: 3000,
  }))

  // Improved zero sales status logic
  const getStatusForZeroSales = (date: string, amount: number) => {
    if (amount > 0) return null
    const jsDate = parse(date, "yyyy-MM-dd", new Date())
    const dayOfWeek = getDay(jsDate) // 0 = Sunday, 6 = Saturday
    return (dayOfWeek === 0 || dayOfWeek === 6) ? "Day Off" : "Absent"
  }

  // Configurable performance levels
  const performanceLevels = [
    { min: 3, label: "Excellent", variant: "default" },
    { min: 2, label: "Good", variant: "secondary" },
    { min: 1, label: "Average", variant: "outline" },
    { min: 0, label: "Needs Improvement", variant: "destructive" },
  ]
  const performanceLevelObj = performanceLevels.find(l => metrics.revenueRatio >= l.min) || performanceLevels[3]
  const performanceLevel = performanceLevelObj.label || "default"

  // Theme-aware color classes
  const cardColors = {
    sales: "from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-800",
    revenue: "from-green-100 to-green-300 dark:from-green-900 dark:to-green-800",
    holidays: "from-purple-100 to-purple-300 dark:from-purple-900 dark:to-purple-800",
    absent: "from-orange-100 to-orange-300 dark:from-orange-900 dark:to-orange-800",
  }

  // Badge color helper
  const badgeClass = (variant: string) => {
    switch (variant) {
      case "destructive": return "bg-red-600 text-white"
      case "secondary": return "bg-gray-600 text-white"
      case "default": return "bg-green-600 text-white"
      case "outline": return "bg-yellow-600 text-white"
      default: return "secondary"
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/40 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/staff">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Staff
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{staff.staffName}</h1>
            <p className="text-muted-foreground">
              Staff ID: {staff.staffId} • Performance Level: {performanceLevel}
            </p>
          </div>
          <Badge
            variant={performanceLevelObj.variant}
            className={`text-sm px-3 py-1 ${badgeClass(performanceLevelObj.variant)}`}
          >
            {performanceLevel}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`border-0 shadow-lg bg-gradient-to-br ${cardColors.sales}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-200">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-700 dark:text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(staff.totalSoldByStaff, "INR")}
              </div>
              <div className="mt-2">
                <Progress value={Math.min(100, (staff.totalSoldByStaff / monthlyTarget) * 100)} className="h-2" />
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Target: {formatCurrency(monthlyTarget, "INR")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg bg-gradient-to-br ${cardColors.revenue}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900 dark:text-green-200">Revenue Ratio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-700 dark:text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{metrics.revenueRatio}x</div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">Revenue per salary rupee</p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg bg-gradient-to-br ${cardColors.holidays}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-200">Holidays Taken</CardTitle>
              <Calendar className="h-4 w-4 text-purple-700 dark:text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {metrics.calculatedHolidaysTaken}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Days this month</p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg bg-gradient-to-br ${cardColors.absent}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-200">Days Absent</CardTitle>
              <UserX className="h-4 w-4 text-orange-700 dark:text-orange-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {metrics.calculatedDaysAbsent}
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Daily Sales Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Daily Sales Performance
              </CardTitle>
              <CardDescription>Sales trend with daily targets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e2e8f0"} />
                  <XAxis dataKey="date" stroke={theme === "dark" ? "#cbd5e1" : "#64748b"} fontSize={12} />
                  <YAxis stroke={theme === "dark" ? "#cbd5e1" : "#64748b"} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#18181b" : "#fff",
                      border: "1px solid #64748b",
                      borderRadius: "8px",
                      color: theme === "dark" ? "#f4f4f5" : "#222",
                    }}
                    formatter={(value, name) => [`₹${value}`, name === "amount" ? "Sales" : "Target"]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSales)" />
                  <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Performance Trends
              </CardTitle>
              <CardDescription>Monthly performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e2e8f0"} />
                  <XAxis dataKey="month" stroke={theme === "dark" ? "#cbd5e1" : "#64748b"} fontSize={12} />
                  <YAxis stroke={theme === "dark" ? "#cbd5e1" : "#64748b"} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#18181b" : "#fff",
                      border: "1px solid #64748b",
                      borderRadius: "8px",
                      color: theme === "dark" ? "#f4f4f5" : "#222",
                    }}
                    formatter={(value) => [`₹${value}`, "Sales"]}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Goals and Achievements */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Goals & Achievements
            </CardTitle>
            <CardDescription>Current goals and progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{goal.title}</h4>
                    <Badge
                      variant={
                        goal.status === "completed"
                          ? "default"
                          : goal.status === "on-track"
                            ? "secondary"
                            : "destructive"
                      }
                      className={badgeClass(
                        goal.status === "completed"
                          ? "default"
                          : goal.status === "on-track"
                            ? "secondary"
                            : "destructive"
                      )}
                    >
                      {goal.status === "completed" ? "Completed" : goal.status === "on-track" ? "On Track" : "Behind"}
                    </Badge>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {typeof goal.current === "number" && goal.title.includes("Sales")
                        ? formatCurrency(goal.current, "INR")
                        : goal.current}{" "}
                      /{" "}
                      {typeof goal.target === "number" && goal.title.includes("Sales")
                        ? formatCurrency(goal.target, "INR")
                        : goal.target}
                    </span>
                    <span>{Math.round(goal.progress)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity Log */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Daily Activity Log
            </CardTitle>
            <CardDescription>Detailed daily sales record with status indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Sales Amount</TableHead>
                    <TableHead>vs Target</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.monthlySalesOnDailyBasis.slice(0, 30).map((day) => {
                    const status = getStatusForZeroSales(day.date, day.amount)
                    const target = Math.round(staff?.salaryAmount / 30);
                    const performance = day.amount / target

                    return (
                      <TableRow key={day.date} className="hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        <TableCell className="font-medium">{day.date}</TableCell>
                        <TableCell>
                          {day.amount > 0 ? (
                            <span className="font-semibold">{formatCurrency(day.amount, "INR")}</span>
                          ) : (
                            <span className="text-muted-foreground">₹0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {day.amount > 0 && (
                            <div className="flex items-center gap-2">
                              {performance >= 1 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span className={performance >= 1 ? "text-green-600" : "text-red-600"}>
                                {Math.round(performance * 100)}%
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {status ? (
                            <Badge
                              variant={status === "Absent" ? "destructive" : "secondary"}
                              className={badgeClass(status === "Absent" ? "destructive" : "secondary")}
                            >
                              {status}
                            </Badge>
                          ) : day.amount > target ? (
                            <Badge variant="default" className={badgeClass("default")}>Exceeded</Badge>
                          ) : day.amount > 0 ? (
                            <Badge variant="secondary" className={badgeClass("secondary")}>Active</Badge>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
