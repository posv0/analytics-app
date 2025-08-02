import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe value getter with null handling
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const keys = path.split(".")
    let result = obj

    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue
      }
      result = result[key]
    }

    return result !== null && result !== undefined ? result : defaultValue
  } catch {
    return defaultValue
  }
}

// Safe number conversion
export function safeNumber(value: any, defaultValue = 0): number {
  if (value === null || value === undefined || value === "") {
    return defaultValue
  }

  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

// Safe string conversion
export function safeString(value: any, defaultValue = ""): string {
  if (value === null || value === undefined) {
    return defaultValue
  }
  return String(value)
}

// Format currency with null handling
export function formatCurrency(value: any, currency = "USD"): string {
  const num = safeNumber(value, 0)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(num)
}

// Format date with null handling
export function formatDate(value: any, options?: Intl.DateTimeFormatOptions): string {
  if (!value) return "N/A"

  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) return "Invalid Date"

    return new Intl.DateTimeFormat(
      "en-US",
      options || {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    ).format(date)
  } catch {
    return "Invalid Date"
  }
}

// Calculate days since start date
export function calculateTenure(startDate: any): string {
  if (!startDate) return "N/A"

  try {
    const start = new Date(startDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? "s" : ""}`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingMonths = Math.floor((diffDays % 365) / 30)
      return `${years} year${years > 1 ? "s" : ""}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : ""}`
    }
  } catch {
    return "N/A"
  }
}

// Enhanced utility functions for advanced analytics with null handling
export function calculateAdvancedStats(dailySalesData: any[], staffData: any[], yearlyData: any[]) {
  // Calculate total sales from daily data with null handling
  const totalRevenue = dailySalesData.reduce((total, day) => {
    if (!day?.salesData) return total

    const dayTotal = Object.values(day.salesData).reduce((daySum: number, shop: any) => {
      return daySum + safeNumber(shop?.total, 0)
    }, 0)
    return total + dayTotal
  }, 0)

  // Calculate revenue growth with null handling
  const currentMonth = safeNumber(yearlyData[yearlyData.length - 1]?.sales, 0)
  const previousMonth = safeNumber(yearlyData[yearlyData.length - 2]?.sales, 0)
  const revenueGrowth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0

  // Find top performer with null handling
  const activeStaffData = staffData.filter((staff) => staff?.status === "active")
  const topPerformer = activeStaffData.reduce((top, staff) => {
    const currentSales = safeNumber(staff?.totalSoldByStaff, 0)
    const topSales = safeNumber(top?.totalSoldByStaff, 0)
    return currentSales > topSales ? staff : top
  }, activeStaffData[0] || {})

  // Calculate total absences and active staff
  const totalAbsences = activeStaffData.reduce((total, staff) => total + safeNumber(staff?.daysAbsent, 0), 0)
  const activeStaff = activeStaffData.length

  // Calculate average daily sales
  const avgDailySales = dailySalesData.length > 0 ? Math.round(totalRevenue / dailySalesData.length) : 0
  const dailyTarget = 20000 // Mock target

  return {
    totalRevenue,
    revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    topPerformer: safeString(topPerformer?.staffName, "N/A"),
    topPerformerSales: safeNumber(topPerformer?.totalSoldByStaff, 0),
    totalAbsences,
    activeStaff,
    avgDailySales,
    dailyTarget,
  }
}

export function getMonthlySalesData(dailySalesData: any[]) {
  return dailySalesData.map((day) => {
    if (!day?.salesData) {
      return {
        date: safeString(day?.date, "").split(" ")[0] || "N/A",
        total: 0,
      }
    }

    const total = Object.values(day.salesData).reduce((sum: number, shop: any) => {
      return sum + safeNumber(shop?.total, 0)
    }, 0)

    return {
      date: safeString(day.date, "").split(" ")[0] || "N/A",
      total,
    }
  })
}

export function getShopPerformanceData(dailySalesData: any[]) {
  const shopTotals = {
    shop1: 0,
    shop2: 0,
    shop3: 0,
  }

  dailySalesData.forEach((day) => {
    if (!day?.salesData) return

    Object.entries(day.salesData).forEach(([shopKey, shopData]: [string, any]) => {
      if (shopKey in shopTotals) {
        shopTotals[shopKey as keyof typeof shopTotals] += safeNumber(shopData?.total, 0)
      }
    })
  })

  return [
    { shop: "Shop 1", sales: shopTotals.shop1 },
    { shop: "Shop 2", sales: shopTotals.shop2 },
    { shop: "Shop 3", sales: shopTotals.shop3 },
  ]
}

export function getQuarterlyComparison(yearlyData: any[]) {
  // Mock quarterly data for comparison with null handling
  return [
    { quarter: "Q1 2024", currentYear: 445000, previousYear: 380000 },
    { quarter: "Q2 2024", currentYear: 505000, previousYear: 420000 },
    { quarter: "Q3 2024", currentYear: 535000, previousYear: 465000 },
    { quarter: "Q4 2024", currentYear: 575000, previousYear: 495000 },
    { quarter: "Q1 2025", currentYear: 635000, previousYear: 445000 },
    { quarter: "Q2 2025", currentYear: 685000, previousYear: 505000 },
  ]
}

export function getSeasonalTrends(seasonalData: any[]) {
  return seasonalData.filter((item) => item && typeof item === "object")
}

export function getPerformanceMetrics(yearlyData: any[], staffData: any[]) {
  const scores = [
    { name: "Sales Performance", score: 87 },
    { name: "Team Efficiency", score: 92 },
    { name: "Customer Satisfaction", score: 89 },
    { name: "Growth Rate", score: 78 },
    { name: "Market Share", score: 85 },
  ]

  const trends = [
    { metric: "Revenue Growth", change: 24.5, period: "YoY" },
    { metric: "Staff Productivity", change: 12.3, period: "QoQ" },
    { metric: "Customer Retention", change: -2.1, period: "MoM" },
    { metric: "Market Expansion", change: 18.7, period: "YoY" },
  ]

  return { scores, trends }
}

export function getForecastData(forecastData: any[]) {
  return forecastData.filter((item) => item && typeof item === "object")
}

export function getCorrelationData(yearlyData: any[], staffData: any[]) {
  // Mock correlation data between staff performance and sales with null handling
  return staffData
    .filter((staff) => staff?.status === "active")
    .map((staff, index) => ({
      staffPerformance: (safeNumber(staff?.totalSoldByStaff, 0) / safeNumber(staff?.salaryAmount, 1)) * 100,
      sales: safeNumber(staff?.totalSoldByStaff, 0),
      name: safeString(staff?.staffName, "Unknown"),
    }))
}

export function getStaffPerformanceRadar(staffData: any[], performanceData: any) {
  return [
    { metric: "Sales", value: 85 },
    { metric: "Efficiency", value: 92 },
    { metric: "Consistency", value: 78 },
    { metric: "Growth", value: 88 },
    { metric: "Teamwork", value: 90 },
    { metric: "Innovation", value: 75 },
  ]
}

export function getStaffTrends(staff: any, performanceHistory: any[]) {
  if (!staff) return []

  return performanceHistory.length > 0
    ? performanceHistory.filter((item) => item && typeof item === "object")
    : [
        { month: "Jan", sales: safeNumber(staff.totalSoldByStaff, 0) * 0.9 },
        { month: "Feb", sales: safeNumber(staff.totalSoldByStaff, 0) * 0.95 },
        { month: "Mar", sales: safeNumber(staff.totalSoldByStaff, 0) * 0.92 },
        { month: "Apr", sales: safeNumber(staff.totalSoldByStaff, 0) * 0.98 },
        { month: "May", sales: safeNumber(staff.totalSoldByStaff, 0) * 1.02 },
        { month: "Jun", sales: safeNumber(staff.totalSoldByStaff, 0) * 0.97 },
        { month: "Jul", sales: safeNumber(staff.totalSoldByStaff, 0) },
      ]
}

export function getStaffGoals(staff: any) {
  if (!staff) return []

  const totalSales = safeNumber(staff.totalSoldByStaff, 0)
  const daysAbsent = safeNumber(staff.daysAbsent, 0)

  return [
    {
      title: "Monthly Sales Target",
      current: totalSales,
      target: 80000,
      progress: Math.min(100, (totalSales / 80000) * 100),
      status: totalSales >= 80000 ? "completed" : totalSales >= 60000 ? "on-track" : "behind",
    },
    {
      title: "Attendance Goal",
      current: 31 - daysAbsent,
      target: 30,
      progress: Math.min(100, ((31 - daysAbsent) / 30) * 100),
      status: daysAbsent <= 1 ? "completed" : daysAbsent <= 3 ? "on-track" : "behind",
    },
    {
      title: "Customer Satisfaction",
      current: 4.2,
      target: 4.5,
      progress: (4.2 / 4.5) * 100,
      status: "on-track",
    },
    {
      title: "Training Completion",
      current: 8,
      target: 10,
      progress: 80,
      status: "on-track",
    },
  ]
}

// Validation functions
export function validateStaffData(staff: any): boolean {
  return !!(staff?.staffId && staff?.staffName && staff?.startDate)
}

export function validateSalesData(salesData: any): boolean {
  return !!(salesData?.date && salesData?.salesData && typeof salesData.salesData === "object")
}

// Data transformation helpers
export function transformStaffForTable(staffData: any[]) {
  return staffData.filter(validateStaffData).map((staff) => ({
    id: staff.staffId,
    name: safeString(staff.staffName, "Unknown"),
    email: safeString(staff.email, "N/A"),
    phone: safeString(staff.phone, "N/A"),
    startDate: formatDate(staff.startDate),
    tenure: calculateTenure(staff.startDate),
    position: safeString(staff.position, "N/A"),
    department: safeString(staff.department, "N/A"),
    manager: safeString(staff.manager, "N/A"),
    status: safeString(staff.status, "unknown"),
    salary: formatCurrency(staff.salaryAmount),
    totalSales: formatCurrency(staff.totalSoldByStaff),
    efficiency: Math.round((safeNumber(staff.totalSoldByStaff, 0) / safeNumber(staff.salaryAmount, 1)) * 100),
    daysAbsent: safeNumber(staff.daysAbsent, 0),
    holidaysTaken: safeNumber(staff.holidaysTaken, 0),
    performanceRating: staff.performanceRating ? staff.performanceRating.toFixed(1) : "N/A",
    lastReview: formatDate(staff.lastReview),
    nextReview: formatDate(staff.nextReview),
  }))
}
