"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  AlertTriangle,
  Filter,
  UserPlus,
  Download,
  Phone,
  Mail,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import Link from "next/link"
import { staffData, performanceData } from "@/lib/mock-data"
import {
  getStaffPerformanceRadar,
  safeNumber,
  safeString,
  formatCurrency,
  calculateTenure,
  transformStaffForTable,
} from "@/lib/utils"

type SortOption = "sales" | "salary" | "absences" | "performance" | "tenure" | "rating"

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("sales")
  const [filterBy, setFilterBy] = useState<"all" | "active" | "inactive" | "probation">("all")
  const [loading, setLoading] = useState(false)

  const radarData = getStaffPerformanceRadar(staffData, performanceData)

  const filteredAndSortedStaff = useMemo(() => {
    const filtered = staffData.filter((staff) => {
      const matchesSearch =
        safeString(staff?.staffName, "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeString(staff?.email, "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeString(staff?.position, "").toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filterBy === "all" || safeString(staff?.status, "unknown") === filterBy

      return matchesSearch && matchesFilter
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "sales":
          return safeNumber(b?.totalSoldByStaff, 0) - safeNumber(a?.totalSoldByStaff, 0)
        case "salary":
          return safeNumber(b?.salaryAmount, 0) - safeNumber(a?.salaryAmount, 0)
        case "absences":
          return safeNumber(b?.daysAbsent, 0) - safeNumber(a?.daysAbsent, 0)
        case "performance":
          const aPerf = safeNumber(a?.totalSoldByStaff, 0) / safeNumber(a?.salaryAmount, 1)
          const bPerf = safeNumber(b?.totalSoldByStaff, 0) / safeNumber(b?.salaryAmount, 1)
          return bPerf - aPerf
        case "tenure":
          const aStart = new Date(safeString(a?.startDate, "0")).getTime()
          const bStart = new Date(safeString(b?.startDate, "0")).getTime()
          return aStart - bStart
        case "rating":
          return safeNumber(b?.performanceRating, 0) - safeNumber(a?.performanceRating, 0)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, sortBy, filterBy])

  const chartData = staffData
    .filter((staff) => staff?.status === "active")
    .map((staff) => ({
      name: safeString(staff?.staffName, "Unknown"),
      sales: safeNumber(staff?.totalSoldByStaff, 0),
      efficiency: Math.round((safeNumber(staff?.totalSoldByStaff, 0) / safeNumber(staff?.salaryAmount, 1)) * 100),
    }))
    .sort((a, b) => b.sales - a.sales)

  const getPerformanceLevel = (sales: number) => {
    if (sales > 60000) return { level: "High", color: "bg-green-500", textColor: "text-green-700" }
    if (sales > 40000) return { level: "Medium", color: "bg-yellow-500", textColor: "text-yellow-700" }
    return { level: "Low", color: "bg-red-500", textColor: "text-red-700" }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      case "probation":
        return <Badge variant="secondary">Probation</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Table columns for detailed staff view
  const tableColumns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: string, row: any) => (
        <Link href={`/staff/${row.id}`} className="font-medium hover:underline text-blue-600">
          {value}
        </Link>
      ),
    },
    {
      key: "position",
      label: "Position",
      sortable: true,
    },
    {
      key: "tenure",
      label: "Tenure",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "totalSales",
      label: "Total Sales",
      sortable: true,
    },
    {
      key: "efficiency",
      label: "Efficiency",
      sortable: true,
      render: (value: number) => `${value}%`,
    },
    {
      key: "performanceRating",
      label: "Rating",
      sortable: true,
      render: (value: string) => (value !== "N/A" ? `⭐ ${value}` : "N/A"),
    },
    {
      key: "daysAbsent",
      label: "Absences",
      sortable: true,
      render: (value: number) => <span className={value > 3 ? "text-red-600 font-medium" : ""}>{value}</span>,
    },
  ]

  const transformedStaffData = transformStaffForTable(filteredAndSortedStaff)

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Staff Management
              </h1>
              <p className="text-muted-foreground mt-1">Comprehensive staff performance analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Staff
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Search and Filter Controls */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff by name, email, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-full lg:w-[200px] h-11">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Total Sales</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="absences">Days Absent</SelectItem>
                    <SelectItem value="performance">Performance Ratio</SelectItem>
                    <SelectItem value="tenure">Tenure</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                  <SelectTrigger className="w-full lg:w-[180px] h-11">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="probation">On Probation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Staff Performance Chart */}
            <Card className="xl:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Staff Performance Comparison
                </CardTitle>
                <CardDescription>Sales performance and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [
                        name === "sales" ? formatCurrency(value) : `${value}%`,
                        name === "sales" ? "Total Sales" : "Efficiency",
                      ]}
                    />
                    <Bar dataKey="sales" fill="#3b82f6" name="sales" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="efficiency" fill="#10b981" name="efficiency" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Radar */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Team Performance Radar
                </CardTitle>
                <CardDescription>Multi-dimensional performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis tick={{ fontSize: 10 }} />
                    <Radar
                      name="Team Average"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedStaff.map((staff) => {
              if (!staff) return null

              const performance = getPerformanceLevel(safeNumber(staff.totalSoldByStaff, 0))
              const efficiency = Math.round(
                (safeNumber(staff.totalSoldByStaff, 0) / safeNumber(staff.salaryAmount, 1)) * 100,
              )

              return (
                <Link key={staff.staffId} href={`/staff/${staff.staffId}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:scale-[1.02] bg-gradient-to-br from-card to-card/80">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold">{safeString(staff.staffName, "Unknown")}</CardTitle>
                          <CardDescription className="text-sm">
                            {safeString(staff.position, "N/A")} • {calculateTenure(staff.startDate)}
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            {staff.email && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{staff.email}</span>
                              </div>
                            )}
                            {staff.phone && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>{staff.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary" className={`${performance.color} text-white border-0`}>
                            {performance.level}
                          </Badge>
                          {getStatusBadge(safeString(staff.status, "unknown"))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Total Sales</p>
                          <p className="text-lg font-bold text-foreground">{formatCurrency(staff.totalSoldByStaff)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Efficiency</p>
                          <div className="flex items-center gap-1">
                            <p className="text-lg font-bold text-foreground">{efficiency}%</p>
                            {efficiency > 150 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : efficiency < 100 ? (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Salary</span>
                          <span className="text-sm font-semibold">{formatCurrency(staff.salaryAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Absences</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold">{safeNumber(staff.daysAbsent, 0)}</span>
                            {safeNumber(staff.daysAbsent, 0) > 3 && (
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      {staff.performanceRating && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                          <span className="text-xs text-muted-foreground">Performance Rating</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold">⭐ {staff.performanceRating.toFixed(1)}</span>
                          </div>
                        </div>
                      )}

                      {/* Performance Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Performance Score</span>
                          <span className="text-xs font-medium">{Math.min(100, Math.round(efficiency))}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              efficiency > 150
                                ? "bg-green-500"
                                : efficiency > 100
                                  ? "bg-blue-500"
                                  : efficiency > 75
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(100, efficiency)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Detailed Staff Table */}
          <DataTable
            data={transformedStaffData}
            columns={tableColumns}
            title="Detailed Staff Information"
            description="Complete staff directory with performance metrics"
            loading={loading}
          />

          {filteredAndSortedStaff.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No staff members found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
