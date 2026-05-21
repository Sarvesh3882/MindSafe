'use client';

// Student Recommendations Page
// Displays all wellness recommendations for the authenticated student
// Author: MindSafe India Development Team

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PrescriptionCard } from '@/components/prescriptions/PrescriptionCard';
import { PrescriptionWithCounsellor } from '@/types/prescription';
import { Heart, Search, AlertCircle } from 'lucide-react';

export default function StudentPrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithCounsellor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('all');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [search, dateRange]);

  useEffect(() => {
    fetchPrescriptions();
    fetchUnreadCounts();
  }, [currentPage, search, dateRange]);

  const fetchUnreadCounts = async () => {
    try {
      const response = await fetch('/api/prescription-messages/unread-count');
      const data = await response.json();

      if (data.success && data.unreadCounts && Array.isArray(data.unreadCounts)) {
        // Convert array to object for easy lookup
        const counts: Record<string, number> = {};
        data.unreadCounts.forEach((item: { prescription_id: string; unread_count: number }) => {
          counts[item.prescription_id] = item.unread_count;
        });
        setUnreadCounts(counts);
      }
    } catch (err) {
      console.error('Failed to fetch unread counts:', err);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        dateRange,
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/prescriptions/my-prescriptions?${params}`);
      const data = await response.json();

      if (data.success) {
        setPrescriptions(data.prescriptions);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError('An error occurred while fetching recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-[#3DBE29]" />
            My Recommendations
          </h1>
          <p className="mt-2 text-gray-600">
            View your wellness guidance and counselor support
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Wellness Support Notice</p>
            <p>
              This platform provides counselor guidance and wellness support only. 
              It is not a substitute for licensed medical diagnosis, psychiatric treatment, 
              or emergency healthcare services. If you're experiencing a mental health 
              emergency, please contact emergency services or your campus health center immediately.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recommendations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent"
                />
              </div>
            </div>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3DBE29]"></div>
            <p className="mt-4 text-gray-600">Loading recommendations...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchPrescriptions}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Recommendations List */}
        {!loading && !error && (
          <>
            {prescriptions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No recommendations yet
                </h3>
                <p className="text-gray-600">
                  Your counselor will share wellness guidance and support strategies here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                    onClick={() => router.push(`/student/prescriptions/${prescription.id}`)}
                    unreadCount={unreadCounts[prescription.id] || 0}
                  />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} recommendations
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
