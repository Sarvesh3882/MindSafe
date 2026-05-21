// API Route: Get Student Prescriptions (Counsellor View)
// GET /api/prescriptions/student/[studentId]
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prescriptionQuerySchema } from '@/lib/prescriptions/validation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const supabase = await createClient();
    const { studentId } = await params; // AWAIT params!

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

    // Verify user is a counsellor
    const { data: counsellor } = await supabase
      .from('users')
      .select('id, role, college_id')
      .eq('id', session.user.id)
      .single();

    if (!counsellor || counsellor.role !== 'counsellor') {
      return NextResponse.json(
        { success: false, error: 'Only counsellors can access this endpoint' },
        { status: 403 }
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
      console.error('Query validation failed:', queryValidation.error);
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

    // Build query - fetch prescriptions created by this counsellor for the student
    // This bypasses the RLS issue by only fetching prescriptions the counsellor created
    let query = supabase
      .from('prescriptions')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId)
      .eq('counsellor_id', session.user.id) // Only fetch prescriptions created by this counsellor
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
      console.error('=== PRESCRIPTION FETCH ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error code:', error.code);
      console.error('Student ID:', studentId);
      console.error('Counsellor ID:', session.user.id);
      console.error('================================');
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch prescriptions', 
          details: error.message,
          hint: error.hint,
          code: error.code
        },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully fetched ${prescriptions?.length || 0} prescriptions for student ${studentId} by counsellor ${session.user.id}`);

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
    console.error('Unexpected error in get student prescriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
