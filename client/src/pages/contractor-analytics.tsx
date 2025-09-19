import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Eye, 
  Globe, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Building2,
  TrendingUp,
  Users,
  Calendar,
  BarChart3
} from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface MonthlyStats {
  profileViews: number;
  websiteClicks: number;
  facebookClicks: number;
  instagramClicks: number;
  linkedinClicks: number;
  googleBusinessClicks: number;
  totalClicks: number;
  uniqueViewers: number;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default function ContractorAnalytics() {
  const { user } = useAuth();
  const typedUser = user as UserType | undefined;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Check if user is a contractor
  if (!typedUser || typedUser.role !== 'contractor') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground">This page is only available for contractors.</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Fetch monthly stats
  const { data: monthlyStats, isLoading } = useQuery<MonthlyStats>({
    queryKey: ['/api/contractor/analytics/monthly', selectedYear, selectedMonth],
    queryParams: { year: selectedYear, month: selectedMonth },
  });

  const chartData = [
    { name: 'Profile Views', value: monthlyStats?.profileViews || 0, color: '#8884d8' },
    { name: 'Website Clicks', value: monthlyStats?.websiteClicks || 0, color: '#82ca9d' },
    { name: 'Facebook Clicks', value: monthlyStats?.facebookClicks || 0, color: '#ffc658' },
    { name: 'Instagram Clicks', value: monthlyStats?.instagramClicks || 0, color: '#ff7c7c' },
    { name: 'LinkedIn Clicks', value: monthlyStats?.linkedinClicks || 0, color: '#8dd1e1' },
    { name: 'Google Business', value: monthlyStats?.googleBusinessClicks || 0, color: '#d084d0' },
  ];

  const StatCard = ({ icon: Icon, title, value, color }: { 
    icon: React.ComponentType<any>; 
    title: string; 
    value: number; 
    color: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your profile performance and homeowner engagement
          </p>
        </div>

        {/* Date Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Time Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-48" data-testid="select-month">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32" data-testid="select-year">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard 
                icon={Eye} 
                title="Profile Views" 
                value={monthlyStats?.profileViews || 0}
                color="#8884d8"
              />
              <StatCard 
                icon={Users} 
                title="Unique Viewers" 
                value={monthlyStats?.uniqueViewers || 0}
                color="#82ca9d"
              />
              <StatCard 
                icon={TrendingUp} 
                title="Total Clicks" 
                value={monthlyStats?.totalClicks || 0}
                color="#ffc658"
              />
              <StatCard 
                icon={Globe} 
                title="Website Clicks" 
                value={monthlyStats?.websiteClicks || 0}
                color="#ff7c7c"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Click Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Detailed Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <span>Profile Views</span>
                    </div>
                    <span className="font-bold text-lg">{monthlyStats?.profileViews || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-500" />
                      <span>Website Clicks</span>
                    </div>
                    <span className="font-bold text-lg">{monthlyStats?.websiteClicks || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <span>Facebook Clicks</span>
                    </div>
                    <span className="font-bold text-lg">{monthlyStats?.facebookClicks || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span>Instagram Clicks</span>
                    </div>
                    <span className="font-bold text-lg">{monthlyStats?.instagramClicks || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <span>LinkedIn Clicks</span>
                    </div>
                    <span className="font-bold text-lg">{monthlyStats?.linkedinClicks || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-red-500" />
                      <span>Google Business</span>
                    </div>
                    <span className="font-bold text-lg">{monthlyStats?.googleBusinessClicks || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            {monthlyStats && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Insights & Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monthlyStats.profileViews === 0 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          💡 <strong>No profile views yet.</strong> Make sure your profile is complete with photos, services, and contact information to attract more homeowners.
                        </p>
                      </div>
                    )}

                    {monthlyStats.websiteClicks === 0 && monthlyStats.profileViews > 0 && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          💡 <strong>Add your website URL</strong> to your profile to direct interested homeowners to learn more about your business.
                        </p>
                      </div>
                    )}

                    {monthlyStats.totalClicks > monthlyStats.profileViews && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          🎉 <strong>Great engagement!</strong> Your profile is converting views into clicks. Keep up the excellent work.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}