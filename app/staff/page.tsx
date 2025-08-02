"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  UserCheck,
  UserX,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
} from "lucide-react"
import Link from "next/link"
import { staffData } from "@/lib/mock-data"
import { calculateStaffMetrics, formatCurrency, calculateTenure } from "@/lib/utils"

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [performanceFilter, setPerformanceFilter] = useState("all")
  const [holidayFilter, setHolidayFilter] = useState("all")

  // Process staff data with server-side calculations
  const processedStaffData = useMemo(() => {
    return staffData.map((staff) => {
      const metrics = calculateStaffMetrics(staff)
      return {
        ...staff,
        ...metrics,
        performanceLevel:
          metrics.revenueRatio >= 3
            ? "Excellent"
            : metrics.revenueRatio >= 2
              ? "Good"
              : metrics.revenueRatio >= 1
                ? "Average"
                : "Needs Improvement",
      }
    })
  }, [])

  // Filter staff data
  const filteredStaff = useMemo(() => {
    return processedStaffData.filter((staff) => {
      const matchesSearch =
        staff.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.position.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || staff.department === departmentFilter

      const matchesStatus = statusFilter === "all" || staff.status === statusFilter

      const matchesPerformance =
        performanceFilter === "all" ||
        (performanceFilter === "excellent" && staff.performanceLevel === "Excellent") ||
        (performanceFilter === "good" && staff.performanceLevel === "Good") ||
        (performanceFilter === "average" && staff.performanceLevel === "Average") ||
        (performanceFilter === "needs-improvement" && staff.performanceLevel === "Needs Improvement")

      const matchesHoliday =
        holidayFilter === "all" ||
        (holidayFilter === "taken" && staff.calculatedHolidaysTaken >= 4) ||
        (holidayFilter === "needs" && staff.calculatedHolidaysTaken < 4)

      return matchesSearch && matchesDepartment && matchesStatus && matchesPerformance && matchesHoliday
    })
  }, [processedStaffData, searchTerm, departmentFilter, statusFilter, performanceFilter, holidayFilter])

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(staffData.map((staff) => staff.department))]
    return depts.filter(Boolean)
  }, [])

  // Staff requiring holidays
  const staffNeedingHolidays = useMemo(() => {
    return processedStaffData.filter((staff) => staff.calculatedHolidaysTaken < 4)
  }, [processedStaffData])

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalStaff = processedStaffData.length
    const activeStaff = processedStaffData.filter((s) => s.status === "active").length
    const totalAbsences = processedStaffData.reduce((sum, s) => sum + s.calculatedDaysAbsent, 0)
    const avgRevenueRatio = processedStaffData.reduce((sum, s) => sum + s.revenueRatio, 0) / processedStaffData.length

    return {
      totalStaff,
      activeStaff,
      totalAbsences,
      avgRevenueRatio: Math.round(avgRevenueRatio * 100) / 100,
    }
  }, [processedStaffData])

  const getPerformanceBadgeVariant = (level: string) => {
    switch (level) {
      case "Excellent":
        return "default"
      case "Good":
        return "secondary"
      case "Average":
        return "outline"
      default:
        return "destructive"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">Manage and monitor staff performance</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm px-3 py-1">
              <Users className="h-4 w-4 mr-1" />
              {summaryStats.totalStaff} Total Staff
            </Badge>
            <Badge variant="default" className="text-sm px-3 py-1">
              <UserCheck className="h-4 w-4 mr-1" />
              {summaryStats.activeStaff} Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Holiday Alert Section */}
        {staffNeedingHolidays.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800 dark:text-orange-200">Holiday Allocation Required</AlertTitle>
            <AlertDescription className="text-orange-700 dark:text-orange-300">
              {staffNeedingHolidays.length} staff member(s) need holiday allocation:{" "}
              {staffNeedingHolidays.map((s) => s.staffName).join(", ")}
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summaryStats.totalStaff}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{summaryStats.activeStaff} active members</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Avg Revenue Ratio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {summaryStats.avgRevenueRatio}x
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Revenue per salary rupee</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Total Absences</CardTitle>
              <UserX className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {summaryStats.totalAbsences}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Days this month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Need Holidays</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {staffNeedingHolidays.length}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Staff requiring allocation</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performance</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                </SelectContent>
              </Select>

              <Select value={holidayFilter} onValueChange={setHolidayFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Holiday Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Holiday Status</SelectItem>
                  <SelectItem value="taken">Holidays Taken</SelectItem>
                  <SelectItem value="needs">Needs Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <Card
              key={staff.staffId}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:scale-[1.02]"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarImage src={`/placeholder-user.jpg`} alt={staff.staffName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {staff.staffName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{staff.staffName}</h3>
                      <p className="text-sm text-muted-foreground">{staff.position}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={getStatusBadgeVariant(staff.status)} className="text-xs">
                      {staff.status}
                    </Badge>
                    <Badge variant={getPerformanceBadgeVariant(staff.performanceLevel)} className="text-xs">
                      {staff.performanceLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{staff.email || "N/A"}</span>
                  </div>
                  {staff.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{staff.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{staff.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{calculateTenure(staff.startDate)}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(staff.totalSoldByStaff, "INR")}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Total Sales</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">{staff.revenueRatio}x</div>
                    <div className="text-xs text-green-600 dark:text-green-400">Revenue Ratio</div>
                  </div>
                </div>

                {/* Attendance & Holidays */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Absent</span>
                    <Badge variant={staff.calculatedDaysAbsent > 5 ? "destructive" : "secondary"}>
                      {staff.calculatedDaysAbsent}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Holiday Status</span>
                    <Badge variant={staff.calculatedHolidaysTaken >= 4 ? "default" : "destructive"}>
                      {staff.calculatedHolidaysTaken >= 4 ? "Yes" : "Needs Holiday"}
                    </Badge>
                  </div>
                </div>

                {/* Revenue Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue Target</span>
                    <span className="font-medium">
                      {Math.min(100, Math.round((staff.totalSoldByStaff / 100000) * 100))}%
                    </span>
                  </div>
                  <Progress value={Math.min(100, (staff.totalSoldByStaff / 100000) * 100)} className="h-2" />
                </div>

                {/* Action Button */}
                <Link href={`/staff/${staff.staffId}`}>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    <Award className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredStaff.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No staff found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
