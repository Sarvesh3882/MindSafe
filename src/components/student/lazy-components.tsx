import dynamic from 'next/dynamic';

// Skeleton components for lazy loading
export function ChartSkeleton() {
  return (
    <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
  );
}

export function CountdownSkeleton() {
  return (
    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
  );
}

// Lazy loaded components
export const MoodTrendChart = dynamic(
  () => import('@/components/student/mood-trend-chart').then(mod => ({ default: mod.MoodTrendChart })),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
);

export const CheckinCountdown = dynamic(
  () => import('@/components/student/checkin-countdown').then(mod => ({ default: mod.CheckinCountdown })),
  { 
    loading: () => <CountdownSkeleton />,
    ssr: false 
  }
);
