"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  Settings,
  Building2,
  Bell,
  Users,
  Shield,
  Plug,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
} from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const handleSave = async () => {
    setIsLoading(true)
    setSaveStatus("saving")

    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSaveStatus("saved")
    setIsLoading(false)

    // Reset status after 3 seconds
    setTimeout(() => setSaveStatus("idle"), 3000)
  }

  const handleReset = () => {
    // Reset form logic here
    console.log("Resetting settings...")
  }

  const handleExport = () => {
    // Export settings logic
    const settings = {
      currency: "INR",
      timezone: "Asia/Kolkata",
      language: "en",
      notifications: true,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "analytics-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-muted-foreground mt-1">Manage your application preferences and configuration</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : saveStatus === "saved" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general" className="gap-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="business" className="gap-2">
                <Building2 className="h-4 w-4" />
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
                <Plug className="h-4 w-4" />
                Integrations
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>Configure basic application settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select defaultValue="INR">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                          <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="asia-kolkata">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="america-new_york">America/New_York (EST)</SelectItem>
                          <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                          <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                          <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select defaultValue="dd-mm-yyyy">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Display Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">Enable dark theme for the application</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Compact View</Label>
                          <p className="text-sm text-muted-foreground">Use compact layout for tables and lists</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto Refresh</Label>
                          <p className="text-sm text-muted-foreground">Automatically refresh data every 5 minutes</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Settings */}
            <TabsContent value="business" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Configure your business details and operational settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input id="businessName" placeholder="Enter business name" defaultValue="Beauty Salon Pro" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select defaultValue="beauty-salon">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beauty-salon">Beauty Salon</SelectItem>
                          <SelectItem value="spa">Spa & Wellness</SelectItem>
                          <SelectItem value="barbershop">Barbershop</SelectItem>
                          <SelectItem value="retail">Retail Store</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input id="taxRate" type="number" placeholder="18" defaultValue="18" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
                      <Select defaultValue="april">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="january">January</SelectItem>
                          <SelectItem value="april">April</SelectItem>
                          <SelectItem value="july">July</SelectItem>
                          <SelectItem value="october">October</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Textarea
                      id="businessAddress"
                      placeholder="Enter complete business address"
                      defaultValue="123 Beauty Street, Fashion District, Mumbai, Maharashtra 400001"
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Operational Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="workingHours">Working Hours</Label>
                        <Select defaultValue="9-6">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9-6">9:00 AM - 6:00 PM</SelectItem>
                            <SelectItem value="10-7">10:00 AM - 7:00 PM</SelectItem>
                            <SelectItem value="8-8">8:00 AM - 8:00 PM</SelectItem>
                            <SelectItem value="24-7">24/7</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weeklyOff">Weekly Off</Label>
                        <Select defaultValue="sunday">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunday">Sunday</SelectItem>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="none">No Weekly Off</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetRevenue">Monthly Target (₹)</Label>
                        <Input id="targetRevenue" type="number" placeholder="500000" defaultValue="500000" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Daily Sales Report</Label>
                          <p className="text-sm text-muted-foreground">Receive daily sales summary via email</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Staff Performance Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified about staff performance issues</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Low Revenue Warnings</Label>
                          <p className="text-sm text-muted-foreground">
                            Alert when daily revenue falls below threshold
                          </p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Monthly Reports</Label>
                          <p className="text-sm text-muted-foreground">Comprehensive monthly business reports</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Push Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Real-time Alerts</Label>
                          <p className="text-sm text-muted-foreground">Instant notifications for critical events</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Staff Check-in/out</Label>
                          <p className="text-sm text-muted-foreground">Notifications when staff check in or out</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Notification Timing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="reportTime">Daily Report Time</Label>
                        <Select defaultValue="9-00">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8-00">8:00 AM</SelectItem>
                            <SelectItem value="9-00">9:00 AM</SelectItem>
                            <SelectItem value="10-00">10:00 AM</SelectItem>
                            <SelectItem value="18-00">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alertThreshold">Revenue Alert Threshold (₹)</Label>
                        <Input id="alertThreshold" type="number" placeholder="10000" defaultValue="10000" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Settings */}
            <TabsContent value="users" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Current Users</h4>
                      <Button size="sm" className="gap-2">
                        <Users className="h-4 w-4" />
                        Add User
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Admin User</p>
                            <p className="text-sm text-muted-foreground">admin@beautysalon.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Admin</Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Manager</p>
                            <p className="text-sm text-muted-foreground">manager@beautysalon.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Manager</Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Default Permissions</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>View Sales Data</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow users to view sales reports and analytics
                          </p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Manage Staff</Label>
                          <p className="text-sm text-muted-foreground">
                            Permission to add, edit, and remove staff members
                          </p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Export Data</Label>
                          <p className="text-sm text-muted-foreground">Allow data export and report generation</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>Configure security settings and data protection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Authentication</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Session Timeout</Label>
                          <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                        </div>
                        <Select defaultValue="30">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Data Protection</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Data Encryption</Label>
                          <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest and in transit</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Audit Logging</Label>
                          <p className="text-sm text-muted-foreground">Log all user actions for security monitoring</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Automatic Backups</Label>
                          <p className="text-sm text-muted-foreground">Regular automated backups of your data</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Access Control</h4>
                    <div className="space-y-2">
                      <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                      <Textarea id="ipWhitelist" placeholder="Enter IP addresses (one per line)" rows={3} />
                      <p className="text-sm text-muted-foreground">
                        Restrict access to specific IP addresses. Leave empty to allow all IPs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Settings */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Third-party Integrations</CardTitle>
                  <CardDescription>Connect with external services and APIs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Payment Gateways</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Razorpay</p>
                            <p className="text-sm text-muted-foreground">Accept payments via UPI, cards, and wallets</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Connected</Badge>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">PayU</p>
                            <p className="text-sm text-muted-foreground">Alternative payment gateway for India</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Not Connected</Badge>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Communication</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Bell className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">WhatsApp Business</p>
                            <p className="text-sm text-muted-foreground">Send notifications via WhatsApp</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Not Connected</Badge>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Bell className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">SMS Gateway</p>
                            <p className="text-sm text-muted-foreground">Send SMS notifications to customers</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Connected</Badge>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Analytics & Reporting</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">Google Analytics</p>
                            <p className="text-sm text-muted-foreground">Track website and app analytics</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Not Connected</Badge>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Upload className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Cloud Storage</p>
                            <p className="text-sm text-muted-foreground">Backup data to Google Drive or Dropbox</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Connected</Badge>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">API Configuration</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <div className="flex gap-2">
                          <Input
                            id="apiKey"
                            type="password"
                            placeholder="Enter your API key"
                            defaultValue="sk_test_••••••••••••••••"
                          />
                          <Button variant="outline" size="sm">
                            Generate
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="webhookUrl">Webhook URL</Label>
                        <Input
                          id="webhookUrl"
                          placeholder="https://your-domain.com/webhook"
                          defaultValue="https://beautysalon.com/api/webhook"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Status */}
          {saveStatus !== "idle" && (
            <div className="fixed bottom-4 right-4 z-50">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {saveStatus === "saving" && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
                    {saveStatus === "saved" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {saveStatus === "error" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <span className="text-sm font-medium">
                      {saveStatus === "saving" && "Saving changes..."}
                      {saveStatus === "saved" && "Changes saved successfully"}
                      {saveStatus === "error" && "Failed to save changes"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
