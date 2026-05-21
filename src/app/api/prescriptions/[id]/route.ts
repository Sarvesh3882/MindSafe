// API Route: Update/Delete Prescription
// PATCH /api/prescriptions/[id] - Update
// DELETE /api/prescriptions/[id] - Soft Delete
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { updatePrescriptionSchema } from '@/lib/prescriptions/validation';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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
    const body = await request.json();
    const validation = updatePrescriptionSchema.safeParse(body);

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

    // Fetch prescription to verify ownership and edit window
    const { data: prescription, error: fetchError } = await supabase
      .from('prescriptions')
      .select('id, counsellor_id, created_at, is_deleted')
      .eq('id', id)
      .single();

    if (fetchError || !prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (prescription.counsellor_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own prescriptions' },
        { status: 403 }
      );
    }

    // Check 24-hour edit window
    const createdAt = new Date(prescription.created_at);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      return NextResponse.json(
        { success: false, error: 'Prescriptions can only be edited within 24 hours' },
        { status: 403 }
      );
    }

    // Update prescription
    const { data: updated, error: updateError } = await supabase
      .from('prescriptions')
      .update(validation.data)
      .eq('id', id)
      .select(
        `
        *,
        counsellor:users!counsellor_id(id, full_name, avatar_url)
      `
      )
      .single();

    if (updateError) {
      console.error('Error updating prescription:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update prescription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      prescription: updated,
    });
  } catch (error) {
    console.error('Unexpected error in update prescription:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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

    // Fetch prescription
    const { data: prescription, error: fetchError } = await supabase
      .from('prescriptions')
      .select('id, counsellor_id, created_at')
      .eq('id', id)
      .single();

    if (fetchError || !prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (prescription.counsellor_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own prescriptions' },
        { status: 403 }
      );
    }

    // Check 24-hour window
    const createdAt = new Date(prescription.created_at);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      return NextResponse.json(
        { success: false, error: 'Prescriptions can only be deleted within 24 hours' },
        { status: 403 }
      );
    }

    // Check for associated messages
    const { count } = await supabase
      .from('prescription_messages')
      .select('id', { count: 'exact', head: true })
      .eq('prescription_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete prescription with messages' },
        { status: 400 }
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from('prescriptions')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting prescription:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete prescription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Prescription deleted successfully',
    });
  } catch (error) {
    console.error('Unexpected error in delete prescription:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
