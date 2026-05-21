// API Route: Create Prescription
// POST /api/prescriptions/create
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prescriptionSchema } from '@/lib/prescriptions/validation';
import type { CreatePrescriptionRequest, PrescriptionResponse } from '@/types/prescription';

export async function POST(request: Request) {
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

    // Parse and validate request body
    const body: CreatePrescriptionRequest = await request.json();
    const validation = prescriptionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { studentId, medicationName, dosage, frequency, duration, notes, wellnessTips } =
      validation.data;

    // Verify user is a counsellor
    const { data: counsellor, error: counsellorError } = await supabase
      .from('users')
      .select('id, role, college_id')
      .eq('id', session.user.id)
      .single();

    if (counsellorError || !counsellor || counsellor.role !== 'counsellor') {
      return NextResponse.json(
        { success: false, error: 'Only counsellors can create prescriptions' },
        { status: 403 }
      );
    }

    // Verify student exists and is in same college
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('id, college_id')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    if (student.college_id !== counsellor.college_id) {
      return NextResponse.json(
        { success: false, error: 'Cannot create prescription for student from different college' },
        { status: 403 }
      );
    }

    // Create prescription
    const { data: prescription, error: insertError } = await supabase
      .from('prescriptions')
      .insert({
        student_id: studentId,
        counsellor_id: session.user.id,
        medication_name: medicationName,
        dosage,
        frequency,
        duration,
        notes: notes || null,
        wellness_tips: wellnessTips || null,
        is_suggestion: false,
      })
      .select(
        `
        *,
        counsellor:users!counsellor_id(id, full_name, avatar_url)
      `
      )
      .single();

    if (insertError) {
      console.error('Error creating prescription:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create prescription' },
        { status: 500 }
      );
    }

    // TODO: Trigger notification to student
    // This will be implemented in a later step

    return NextResponse.json({
      success: true,
      prescription,
    });
  } catch (error) {
    console.error('Unexpected error in create prescription:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
