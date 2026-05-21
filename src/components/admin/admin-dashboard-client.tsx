'use client';

import { useState, useMemo } from 'react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampusTrendChart } from '@/components/admin/campus-trend-chart';
import { DepartmentBreakdown } from '@/components/admin/department-breakdown';
import { TimeRangeSelector } from '@/components/admin/time-range-selector';
import Link from 'next/link';

type TimeRange = '7d' | '30d' | '90d';

interface AdminDashboardClientProps {
  total: number;
  stable: number;
  attention: number;
  critical: number;
  checkedIn: number;
  trendData: Array<{
    date: string;
    stable: number;
    attention: number;
    critical: number;
    checkins: number;
  }>;
  students: Array<{ id: string; department: string | null | undefined }>;
  assessments: Array<{ user_id: string; date: string; risk_level: string }>;
}

export function AdminDashboardClient({
  total,
  stable,
  attention,
  critical,
  checkedIn,
  trendData,
  students,
  assessments,
}: AdminDashboardClientProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Filter trend data based on selected time range
  const filteredTrendData = useMemo(() => {
    if (!trendData.length) return [];
    
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    // If we have less data than the selected range, show all available data
    if (trendData.length <= days) {
      return trendData;
    }
    
    // Otherwise, show the last N days
    return trendData.slice(-days);
  }, [trendData, timeRange]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E2E]">Campus Wellness Dashboard</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Overall mental health overview · Last updated{' '}
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <Link href="/admin/reports">
            <button className="flex items-center gap-2 bg-[#3DBE29] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#32A822] transition-colors shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Report
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards - Overall Campus Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={total}
          subtext={`${checkedIn} checked in this month`}
          color="#3DBE29"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          }
        />
        <StatCard
          label="Stable"
          value={`${stable} (${total ? Math.round((stable / total) * 100) : 0}%)`}
          color="#3DBE29"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        />
        <StatCard
          label="Needs Attention"
          value={`${attention} (${total ? Math.round((attention / total) * 100) : 0}%)`}
          color="#FF9F43"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          }
        />
        <StatCard
          label="Critical"
          value={`${critical} (${total ? Math.round((critical / total) * 100) : 0}%)`}
          color="#FF6B6B"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        />
      </div>

      {/* Main Chart - Campus Wellness Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Campus Wellness Trend ({timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'})</CardTitle>
          <p className="text-sm text-[#6B7280]">Overall mental health distribution across campus</p>
        </CardHeader>
        <CardContent>
          <CampusTrendChart data={filteredTrendData} />
        </CardContent>
      </Card>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Department Breakdown</CardTitle>
          <p className="text-sm text-[#6B7280]">Wellness distribution by department</p>
        </CardHeader>
        <CardContent>
          <DepartmentBreakdown students={students} assessments={assessments} />
        </CardContent>
      </Card>
    </div>
  );
}
