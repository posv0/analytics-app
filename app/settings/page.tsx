"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Bell,
  Database,
  Users,
  Shield,
  Save,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Palette,
  Globe,
  DollarSign,
  BarChart3,
  Mail,
  Smartphone,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    lowPerformance: true,
    dailyReports: false,
    weeklyReports: true,
    monthlyReports: true,
    salesAlerts: true,
    staffAlerts: false,
    systemAlerts: true,
  })

  const [businessSettings, setBusinessSettings] = useState({
    businessName: "Analytics Pro",
    businessEmail: "admin@analyticspro.com",
    businessPhone: "+1 (555) 123-4567",
    businessAddress: "123 Business St, City, State 12345",
    currency: "USD",
    timezone: "UTC",
    fiscalYearStart: "January",
    workingDays: 5,
    dailyTarget: 20000,
    monthlyTarget: 600000,
    taxRate: 8.5,
    language: "en",
    dateFormat: "mm/dd/yyyy",
    numberFormat: "1,234.56",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: "",
    auditLogging: true,
    dataEncryption: true,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    googleAnalytics: "",
    facebookPixel: "",
    slackWebhook: "",
    emailProvider: "smtp",
    smsProvider: "twilio",
    backupFrequency: "daily",
    exportFormat: "json",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = async () => {
    setSaveStatus("saving")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Save settings logic here
      const settingsData = {
        notifications,
        businessSettings,
        securitySettings,
        integrationSettings,
        theme,
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem("analytics-pro-settings", JSON.stringify(settingsData))

      setSaveStatus("saved")
      toast.success("Settings saved successfully!")

      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      toast.error("Failed to save settings. Please try again.")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleExportSettings = () => {
    const settingsData = {
      notifications,
      businessSettings,
      securitySettings,
      integrationSettings,
      theme,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-pro-settings-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Settings exported successfully!")
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)

        if (importedSettings.notifications) setNotifications(importedSettings.notifications)
        if (importedSettings.businessSettings) setBusinessSettings(importedSettings.businessSettings)
        if (importedSettings.securitySettings) setSecuritySettings(importedSettings.securitySettings)
        if (importedSettings.integrationSettings) setIntegrationSettings(importedSettings.integrationSettings)
        if (importedSettings.theme) setTheme(importedSettings.theme)

        toast.success("Settings imported successfully!")
      } catch (error) {
        toast.error("Invalid settings file. Please check the format.")
      }
    }
    reader.readAsText(file)
  }

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default? This action cannot be undone.")) {
      // Reset to default values
      setNotifications({
        email: true,
        push: false,
        sms: true,
        lowPerformance: true,
        dailyReports: false,
        weeklyReports: true,
        monthlyReports: true,
        salesAlerts: true,
        staffAlerts: false,
        systemAlerts: true,
      })

      setBusinessSettings({
        businessName: "Analytics Pro",
        businessEmail: "admin@analyticspro.com",
        businessPhone: "+1 (555) 123-4567",
        businessAddress: "123 Business St, City, State 12345",
        currency: "USD",
        timezone: "UTC",
        fiscalYearStart: "January",
        workingDays: 5,
        dailyTarget: 20000,
        monthlyTarget: 600000,
        taxRate: 8.5,
        language: "en",
        dateFormat: "mm/dd/yyyy",
        numberFormat: "1,234.56",
      })

      setSecuritySettings({
        twoFactorEnabled: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAttempts: 5,
        ipWhitelist: "",
        auditLogging: true,
        dataEncryption: true,
      })

      setIntegrationSettings({
        googleAnalytics: "",
        facebookPixel: "",
        slackWebhook: "",
        emailProvider: "smtp",
        smsProvider: "twilio",
        backupFrequency: "daily",
        exportFormat: "json",
      })

      toast.success("Settings reset to default values!")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage your application preferences and configurations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExportSettings} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
            <Button onClick={handleSave} disabled={saveStatus === "saving"} className="gap-2">
              {saveStatus === "saving" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {saveStatus === "error" && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Failed to save settings. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2">
              <Database className="h-4 w-4" />
              Business
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sidebar-style">Sidebar Style</Label>
                    <Select defaultValue="default">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="chart-style">Chart Style</Label>
                    <Select defaultValue="modern">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language & Region
                </CardTitle>
                <CardDescription>Set your language and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={businessSettings.language}
                      onValueChange={(value) => setBusinessSettings((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={businessSettings.dateFormat}
                      onValueChange={(value) => setBusinessSettings((prev) => ({ ...prev, dateFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numberFormat">Number Format</Label>
                    <Select
                      value={businessSettings.numberFormat}
                      onValueChange={(value) => setBusinessSettings((prev) => ({ ...prev, numberFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1,234.56">1,234.56</SelectItem>
                        <SelectItem value="1.234,56">1.234,56</SelectItem>
                        <SelectItem value="1 234.56">1 234.56</SelectItem>
                        <SelectItem value="1234.56">1234.56</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={businessSettings.timezone}
                      onValueChange={(value) => setBusinessSettings((prev) => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">EST (Eastern)</SelectItem>
                        <SelectItem value="CST">CST (Central)</SelectItem>
                        <SelectItem value="MST">MST (Mountain)</SelectItem>
                        <SelectItem value="PST">PST (Pacific)</SelectItem>
                        <SelectItem value="GMT">GMT (London)</SelectItem>
                        <SelectItem value="CET">CET (Central Europe)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Business Information
                </CardTitle>
                <CardDescription>Configure your business details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input
                      id="business-name"
                      value={businessSettings.businessName}
                      onChange={(e) => setBusinessSettings((prev) => ({ ...prev, businessName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="business-email">Business Email</Label>
                    <Input
                      id="business-email"
                      type="email"
                      value={businessSettings.businessEmail}
                      onChange={(e) => setBusinessSettings((prev) => ({ ...prev, businessEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-phone">Business Phone</Label>
                    <Input
                      id="business-phone"
                      value={businessSettings.businessPhone}
                      onChange={(e) => setBusinessSettings((prev) => ({ ...prev, businessPhone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={businessSettings.currency}
                      onValueChange={(value) => setBusinessSettings((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="business-address">Business Address</Label>
                  <Textarea
                    id="business-address"
                    value={businessSettings.businessAddress}
                    onChange={(e) => setBusinessSettings((prev) => ({ ...prev, businessAddress: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Settings
                </CardTitle>
                <CardDescription>Configure financial and operational parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                    <Select
                      value={businessSettings.fiscalYearStart}
                      onValueChange={(value) => setBusinessSettings((prev) => ({ ...prev, fiscalYearStart: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="October">October</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="working-days">Working Days per Week</Label>
                    <Input
                      id="working-days"
                      type="number"
                      min="1"
                      max="7"
                      value={businessSettings.workingDays}
                      onChange={(e) =>
                        setBusinessSettings((prev) => ({ ...prev, workingDays: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={businessSettings.taxRate}
                      onChange={(e) =>
                        setBusinessSettings((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="daily-target">Daily Sales Target</Label>
                    <Input
                      id="daily-target"
                      type="number"
                      value={businessSettings.dailyTarget}
                      onChange={(e) =>
                        setBusinessSettings((prev) => ({ ...prev, dailyTarget: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly-target">Monthly Sales Target</Label>
                    <Input
                      id="monthly-target"
                      type="number"
                      value={businessSettings.monthlyTarget}
                      onChange={(e) =>
                        setBusinessSettings((prev) => ({ ...prev, monthlyTarget: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about important events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h4>
                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">General Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="daily-reports">Daily Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive daily performance summaries</p>
                      </div>
                      <Switch
                        id="daily-reports"
                        checked={notifications.dailyReports}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, dailyReports: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-reports">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly analytics summaries</p>
                      </div>
                      <Switch
                        id="weekly-reports"
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReports: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="monthly-reports">Monthly Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive monthly business reports</p>
                      </div>
                      <Switch
                        id="monthly-reports"
                        checked={notifications.monthlyReports}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, monthlyReports: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Mobile & Push Notifications
                  </h4>
                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Alert Notifications
                  </h4>
                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="low-performance">Low Performance Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when performance drops</p>
                      </div>
                      <Switch
                        id="low-performance"
                        checked={notifications.lowPerformance}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, lowPerformance: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sales-alerts">Sales Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notifications for sales milestones</p>
                      </div>
                      <Switch
                        id="sales-alerts"
                        checked={notifications.salesAlerts}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, salesAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="staff-alerts">Staff Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notifications about staff activities</p>
                      </div>
                      <Switch
                        id="staff-alerts"
                        checked={notifications.staffAlerts}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, staffAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-alerts">System Alerts</Label>
                        <p className="text-sm text-muted-foreground">Important system notifications</p>
                      </div>
                      <Switch
                        id="system-alerts"
                        checked={notifications.systemAlerts}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, systemAlerts: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Admin Users</h4>
                      <p className="text-sm text-muted-foreground">Full access to all features</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>2 users</Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Manager Users</h4>
                      <p className="text-sm text-muted-foreground">Access to reports and staff management</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">3 users</Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Staff Users</h4>
                      <p className="text-sm text-muted-foreground">Limited access to personal data</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">4 users</Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Viewer Users</h4>
                      <p className="text-sm text-muted-foreground">Read-only access to dashboards</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">1 user</Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-medium">User Permissions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Default Role for New Users</Label>
                      <Select defaultValue="staff">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>User Registration</Label>
                      <Select defaultValue="invite-only">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open Registration</SelectItem>
                          <SelectItem value="invite-only">Invite Only</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Authentication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={securitySettings.twoFactorEnabled ? "default" : "destructive"}>
                          {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={securitySettings.twoFactorEnabled}
                          onCheckedChange={(checked) =>
                            setSecuritySettings((prev) => ({ ...prev, twoFactorEnabled: checked }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <Select
                          value={securitySettings.sessionTimeout.toString()}
                          onValueChange={(value) =>
                            setSecuritySettings((prev) => ({ ...prev, sessionTimeout: Number.parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="480">8 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                        <Select
                          value={securitySettings.passwordExpiry.toString()}
                          onValueChange={(value) =>
                            setSecuritySettings((prev) => ({ ...prev, passwordExpiry: Number.parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                            <SelectItem value="0">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="login-attempts">Max Login Attempts</Label>
                      <Input
                        id="login-attempts"
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.loginAttempts}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({ ...prev, loginAttempts: Number.parseInt(e.target.value) }))
                        }
                        className="w-32"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data Protection</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Audit Logging</Label>
                        <p className="text-sm text-muted-foreground">Log all user activities</p>
                      </div>
                      <Switch
                        checked={securitySettings.auditLogging}
                        onCheckedChange={(checked) =>
                          setSecuritySettings((prev) => ({ ...prev, auditLogging: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Encryption</Label>
                        <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest</p>
                      </div>
                      <Switch
                        checked={securitySettings.dataEncryption}
                        onCheckedChange={(checked) =>
                          setSecuritySettings((prev) => ({ ...prev, dataEncryption: checked }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                      <Textarea
                        id="ip-whitelist"
                        placeholder="Enter IP addresses or ranges, one per line"
                        value={securitySettings.ipWhitelist}
                        onChange={(e) => setSecuritySettings((prev) => ({ ...prev, ipWhitelist: e.target.value }))}
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Leave empty to allow all IPs. Use CIDR notation for ranges (e.g., 192.168.1.0/24)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Third-Party Integrations
                </CardTitle>
                <CardDescription>Connect with external services and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Analytics & Tracking</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="google-analytics">Google Analytics ID</Label>
                      <Input
                        id="google-analytics"
                        placeholder="GA-XXXXXXXXX-X"
                        value={integrationSettings.googleAnalytics}
                        onChange={(e) =>
                          setIntegrationSettings((prev) => ({ ...prev, googleAnalytics: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
                      <Input
                        id="facebook-pixel"
                        placeholder="XXXXXXXXXXXXXXX"
                        value={integrationSettings.facebookPixel}
                        onChange={(e) => setIntegrationSettings((prev) => ({ ...prev, facebookPixel: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Communication</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                      <Input
                        id="slack-webhook"
                        placeholder="https://hooks.slack.com/services/..."
                        value={integrationSettings.slackWebhook}
                        onChange={(e) => setIntegrationSettings((prev) => ({ ...prev, slackWebhook: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email-provider">Email Provider</Label>
                        <Select
                          value={integrationSettings.emailProvider}
                          onValueChange={(value) =>
                            setIntegrationSettings((prev) => ({ ...prev, emailProvider: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="smtp">SMTP</SelectItem>
                            <SelectItem value="sendgrid">SendGrid</SelectItem>
                            <SelectItem value="mailgun">Mailgun</SelectItem>
                            <SelectItem value="ses">Amazon SES</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="sms-provider">SMS Provider</Label>
                        <Select
                          value={integrationSettings.smsProvider}
                          onValueChange={(value) => setIntegrationSettings((prev) => ({ ...prev, smsProvider: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="twilio">Twilio</SelectItem>
                            <SelectItem value="nexmo">Nexmo</SelectItem>
                            <SelectItem value="aws-sns">AWS SNS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data Management</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select
                        value={integrationSettings.backupFrequency}
                        onValueChange={(value) =>
                          setIntegrationSettings((prev) => ({ ...prev, backupFrequency: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="export-format">Default Export Format</Label>
                      <Select
                        value={integrationSettings.exportFormat}
                        onValueChange={(value) => setIntegrationSettings((prev) => ({ ...prev, exportFormat: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="xlsx">Excel</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              These actions are irreversible. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Reset All Settings</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  This will reset all settings to their default values
                </p>
              </div>
              <Button variant="destructive" onClick={handleResetSettings} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Reset Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
