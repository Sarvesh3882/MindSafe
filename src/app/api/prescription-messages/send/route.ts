// API Route: Send Prescription Message
// POST /api/prescription-messages/send
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { messageSchema } from '@/lib/prescriptions/validation';
import type { SendMessageRequest, MessageResponse } from '@/types/prescription';

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
    const body: SendMessageRequest = await request.json();
    const validation = messageSchema.safeParse(body);

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

    const { prescriptionId, messageText, parentMessageId } = validation.data;

    // Verify user has access to this prescription
    const { data: prescription, error: prescriptionError } = await supabase
      .from('prescriptions')
      .select('id, student_id, counsellor_id')
      .eq('id', prescriptionId)
      .single();

    if (prescriptionError || !prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Check if user is either the student or counsellor for this prescription
    const isStudent = prescription.student_id === session.user.id;
    const isCounsellor = prescription.counsellor_id === session.user.id;

    if (!isStudent && !isCounsellor) {
      return NextResponse.json(
        { success: false, error: 'You do not have access to this prescription' },
        { status: 403 }
      );
    }

    // If counsellor, verify same college (additional security check)
    if (isCounsellor) {
      const { data: counsellor } = await supabase
        .from('users')
        .select('college_id')
        .eq('id', session.user.id)
        .single();

      const { data: student } = await supabase
        .from('users')
        .select('college_id')
        .eq('id', prescription.student_id)
        .single();

      if (counsellor?.college_id !== student?.college_id) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    // Create message
    const { data: message, error: insertError } = await supabase
      .from('prescription_messages')
      .insert({
        prescription_id: prescriptionId,
        sender_id: session.user.id,
        parent_message_id: parentMessageId || null,
        message_text: messageText,
      })
      .select(
        `
        *,
        sender:users!sender_id(id, full_name, role, avatar_url)
      `
      )
      .single();

    if (insertError) {
      console.error('Error creating message:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // TODO: Trigger real-time broadcast via Supabase Realtime
    // This happens automatically via database triggers

    // TODO: Trigger notification to recipient
    // This will be implemented in a later step

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Unexpected error in send message:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
