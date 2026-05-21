import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/prescriptions/suggest
 * Create a wellness suggestion (prescription) for a student
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user (counsellor)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a counsellor
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'counsellor') {
      return NextResponse.json(
        { success: false, error: 'Only counsellors can send suggestions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      studentId,
      parentPrescriptionId,
      medicationName,
      dosage,
      frequency,
      duration,
      notes,
    } = body;

    // Validate required fields
    if (!studentId || !medicationName || !dosage || !frequency || !duration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: studentId, medicationName, dosage, frequency, duration',
        },
        { status: 400 }
      );
    }

    // Verify student exists and belongs to same college
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('id, college_id, role')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    if (student.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Target user is not a student' },
        { status: 400 }
      );
    }

    // Get counsellor's college
    const { data: counsellor, error: counsellorError } = await supabase
      .from('users')
      .select('college_id')
      .eq('id', user.id)
      .single();

    if (counsellorError || !counsellor) {
      return NextResponse.json(
        { success: false, error: 'Counsellor profile not found' },
        { status: 404 }
      );
    }

    // Verify same college
    if (student.college_id !== counsellor.college_id) {
      return NextResponse.json(
        { success: false, error: 'Cannot send suggestions to students from other colleges' },
        { status: 403 }
      );
    }

    // Create prescription (wellness suggestion)
    const { data: prescription, error: prescriptionError } = await supabase
      .from('prescriptions')
      .insert({
        student_id: studentId,
        counsellor_id: user.id,
        parent_prescription_id: parentPrescriptionId || null,
        medication_name: medicationName,
        dosage: dosage,
        frequency: frequency,
        duration: duration,
        notes: notes || null,
        is_suggestion: parentPrescriptionId ? true : false, // True if it's a follow-up suggestion
        is_deleted: false,
        prescribed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (prescriptionError) {
      console.error('Error creating prescription:', prescriptionError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create suggestion: ' + prescriptionError.message,
        },
        { status: 500 }
      );
    }

    // Log audit entry
    await supabase.from('prescription_audit_log').insert({
      prescription_id: prescription.id,
      action: 'created',
      performed_by: user.id,
      details: {
        medication_name: medicationName,
        dosage: dosage,
        frequency: frequency,
        duration: duration,
      },
    });

    // TODO: Send notification to student (email/SMS)
    // This can be implemented later with Resend/Twilio

    return NextResponse.json({
      success: true,
      prescription: prescription,
    });
  } catch (error) {
    console.error('Error in /api/prescriptions/suggest:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
