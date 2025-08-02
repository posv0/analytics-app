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

// Format currency with INR as default
export function formatCurrency(value: any, currency = "INR"): string {
  const num = safeNumber(value, 0)

  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

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
      "en-IN",
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

// Server-side calculation for staff metrics
export function calculateStaffMetrics(staff: any) {
  if (!staff || !staff.monthlySalesOnDailyBasis) {
    return {
      calculatedDaysAbsent: 0,
      calculatedHolidaysTaken: 0,
      revenueRatio: 0,
    }
  }

  // Calculate days absent (count days with 0 sales)
  const calculatedDaysAbsent = staff.monthlySalesOnDailyBasis.filter(
    (day: any) => safeNumber(day?.amount, 0) === 0,
  ).length

  // Calculate holidays taken (simplified logic - could be enhanced)
  // For now, we'll use a portion of absent days as holidays
  const calculatedHolidaysTaken = Math.min(calculatedDaysAbsent, 6)

  // Calculate revenue ratio (revenue generated per salary rupee)
  const totalRevenue = safeNumber(staff.totalSoldByStaff, 0)
  const salary = safeNumber(staff.salaryAmount, 1)
  const revenueRatio = totalRevenue / salary

  return {
    calculatedDaysAbsent,
    calculatedHolidaysTaken,
    revenueRatio: Math.round(revenueRatio * 100) / 100, // Round to 2 decimal places
  }
}

// Filter data by time period
export function filterDataByPeriod(data: any[], period: "7d" | "30d" | "90d" | "1y"): any[] {
  if (!data || data.length === 0) return []

  const now = new Date()
  const cutoffDate = new Date()

  switch (period) {
    case "7d":
      cutoffDate.setDate(now.getDate() - 7)
      break
    case "30d":
      cutoffDate.setDate(now.getDate() - 30)
      break
    case "90d":
      cutoffDate.setDate(now.getDate() - 90)
      break
    case "1y":
      cutoffDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      return data
  }

  return data.filter((item) => {
    if (!item.date) return false

    try {
      // Parse date format "1 July 2025"
      const itemDate = new Date(item.date)
      return itemDate >= cutoffDate
    } catch {
      return false
    }
  })
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

  // Calculate total absences and active staff using server-side calculations
  const totalAbsences = activeStaffData.reduce((total, staff) => {
    const metrics = calculateStaffMetrics(staff)
    return total + metrics.calculatedDaysAbsent
  }, 0)
  const activeStaff = activeStaffData.length

  // Calculate average daily sales
  const avgDailySales = dailySalesData.length > 0 ? Math.round(totalRevenue / dailySalesData.length) : 0
  const dailyTarget = 25000 // Updated target in INR

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
    .map((staff, index) => {
      const metrics = calculateStaffMetrics(staff)
      return {
        staffPerformance: metrics.revenueRatio,
        sales: safeNumber(staff?.totalSoldByStaff, 0),
        name: safeString(staff?.staffName, "Unknown"),
      }
    })
}

// Advanced analytics functions
export function getAdvancedAnalytics(dailySalesData: any[], staffData: any[], timeRange: string) {
  const filteredData = filterDataByPeriod(dailySalesData, timeRange as any)

  const totalRevenue = filteredData.reduce((sum, day) => {
    if (!day?.salesData) return sum
    return (
      sum + Object.values(day.salesData).reduce((daySum: number, shop: any) => daySum + safeNumber(shop?.total, 0), 0)
    )
  }, 0)

  const previousPeriodData = dailySalesData.slice(0, Math.max(0, dailySalesData.length - filteredData.length))
  const previousRevenue = previousPeriodData.reduce((sum, day) => {
    if (!day?.salesData) return sum
    return (
      sum + Object.values(day.salesData).reduce((daySum: number, shop: any) => daySum + safeNumber(shop?.total, 0), 0)
    )
  }, 0)

  const growthRate = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

  return {
    growthRate: Math.round(growthRate * 10) / 10,
    efficiencyScore: Math.min(100, Math.round((totalRevenue / (filteredData.length * 30000)) * 100)),
    marketShare: 32.1,
    forecastAccuracy: 94.2,
    customerRetention: 78.5,
  }
}

export function getShopComparison(dailySalesData: any[], timeRange: string) {
  const filteredData = filterDataByPeriod(dailySalesData, timeRange as any)

  const shopStats = {
    shop1: { revenue: 0, transactions: 0, avgOrderValue: 0 },
    shop2: { revenue: 0, transactions: 0, avgOrderValue: 0 },
    shop3: { revenue: 0, transactions: 0, avgOrderValue: 0 },
  }

  filteredData.forEach((day) => {
    if (!day?.salesData) return

    Object.entries(day.salesData).forEach(([shopKey, shopData]: [string, any]) => {
      if (shopKey in shopStats) {
        const shop = shopStats[shopKey as keyof typeof shopStats]
        shop.revenue += safeNumber(shopData?.total, 0)
        shop.transactions += safeNumber(shopData?.transactions, 1)
      }
    })
  })

  // Calculate average order values and performance scores
  return Object.entries(shopStats).map(([key, stats]) => ({
    shop: key === "shop1" ? "Shop 1" : key === "shop2" ? "Shop 2" : "Shop 3",
    revenue: stats.revenue,
    transactions: stats.transactions,
    avgOrderValue: stats.transactions > 0 ? Math.round(stats.revenue / stats.transactions) : 0,
    performanceScore: Math.min(100, Math.round((stats.revenue / 150000) * 100)),
  }))
}

export function getTimeSeriesAnalysis(dailySalesData: any[], timeRange: string) {
  const filteredData = filterDataByPeriod(dailySalesData, timeRange as any)

  return filteredData.map((day, index) => {
    const revenue = Object.values(day.salesData || {}).reduce(
      (sum: number, shop: any) => sum + safeNumber(shop?.total, 0),
      0,
    )
    const transactions = Object.values(day.salesData || {}).reduce(
      (sum: number, shop: any) => sum + safeNumber(shop?.transactions, 1),
      0,
    )
    const previousRevenue =
      index > 0
        ? Object.values(filteredData[index - 1]?.salesData || {}).reduce(
            (sum: number, shop: any) => sum + safeNumber(shop?.total, 0),
            0,
          )
        : revenue
    const growth = previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0

    return {
      period: day.date?.split(" ")[0] || `Day ${index + 1}`,
      revenue,
      transactions,
      growth: Math.round(growth * 10) / 10,
    }
  })
}

export function getCustomerSegmentation(dailySalesData: any[]) {
  // Mock customer segmentation data
  return [
    { name: "Premium", value: 25, description: "High-value customers", clv: 125000 },
    { name: "Regular", value: 45, description: "Frequent buyers", clv: 60000 },
    { name: "Occasional", value: 20, description: "Infrequent buyers", clv: 30000 },
    { name: "New", value: 10, description: "First-time customers", clv: 15000 },
  ]
}

export function getProfitabilityAnalysis(dailySalesData: any[], staffData: any[]) {
  const recentData = dailySalesData.slice(-12) // Last 12 periods

  return recentData.map((day, index) => {
    const revenue = Object.values(day.salesData || {}).reduce(
      (sum: number, shop: any) => sum + safeNumber(shop?.total, 0),
      0,
    )
    const costs = revenue * 0.65 // Assume 65% cost ratio
    const profitMargin = revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0

    return {
      period: day.date?.split(" ")[0] || `Period ${index + 1}`,
      revenue,
      costs,
      profit: revenue - costs,
      profitMargin: Math.round(profitMargin * 10) / 10,
    }
  })
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
  const metrics = calculateStaffMetrics(staff)

  return [
    {
      title: "Monthly Sales Target",
      current: totalSales,
      target: 100000,
      progress: Math.min(100, (totalSales / 100000) * 100),
      status: totalSales >= 100000 ? "completed" : totalSales >= 75000 ? "on-track" : "behind",
    },
    {
      title: "Attendance Goal",
      current: 31 - metrics.calculatedDaysAbsent,
      target: 28,
      progress: Math.min(100, ((31 - metrics.calculatedDaysAbsent) / 28) * 100),
      status:
        metrics.calculatedDaysAbsent <= 3 ? "completed" : metrics.calculatedDaysAbsent <= 5 ? "on-track" : "behind",
    },
    {
      title: "Revenue Efficiency",
      current: metrics.revenueRatio,
      target: 3.0,
      progress: Math.min(100, (metrics.revenueRatio / 3.0) * 100),
      status: metrics.revenueRatio >= 3.0 ? "completed" : metrics.revenueRatio >= 2.0 ? "on-track" : "behind",
    },
    {
      title: "Holiday Balance",
      current: metrics.calculatedHolidaysTaken,
      target: 4,
      progress: (metrics.calculatedHolidaysTaken / 4) * 100,
      status: metrics.calculatedHolidaysTaken >= 4 ? "completed" : "on-track",
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
  return staffData.filter(validateStaffData).map((staff) => {
    const metrics = calculateStaffMetrics(staff)

    return {
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
      salary: formatCurrency(staff.salaryAmount, "INR"),
      totalSales: formatCurrency(staff.totalSoldByStaff, "INR"),
      revenueRatio: metrics.revenueRatio,
      daysAbsent: metrics.calculatedDaysAbsent,
      holidaysTaken: metrics.calculatedHolidaysTaken,
    }
  })
}
