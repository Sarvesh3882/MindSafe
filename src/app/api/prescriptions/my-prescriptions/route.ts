// API Route: Get My Prescriptions (Student)
// GET /api/prescriptions/my-prescriptions
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prescriptionQuerySchema } from '@/lib/prescriptions/validation';
import type { PrescriptionsListResponse } from '@/types/prescription';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryValidation = prescriptionQuerySchema.safeParse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      search: searchParams.get('search') || null,
      dateRange: searchParams.get('dateRange') || 'all',
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: queryValidation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { page, limit, search, dateRange } = queryValidation.data;

    // Build query
    let query = supabase
      .from('prescriptions')
      .select(
        `
        *
      `,
        { count: 'exact' }
      )
      .eq('student_id', session.user.id)
      .eq('is_deleted', false)
      .order('prescribed_at', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.ilike('medication_name', `%${search}%`);
    }

    // Apply date range filter
    if (dateRange && dateRange !== 'all') {
      const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
      const days = daysMap[dateRange];
      if (days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        query = query.gte('prescribed_at', cutoffDate.toISOString());
      }
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Execute query
    const { data: prescriptions, error, count } = await query;

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch prescriptions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      prescriptions: prescriptions || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Unexpected error in get my prescriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
