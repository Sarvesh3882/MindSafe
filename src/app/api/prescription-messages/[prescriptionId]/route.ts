// API Route: Get Prescription Messages
// GET /api/prescription-messages/[prescriptionId]
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ prescriptionId: string }> }
) {
  try {
    const supabase = await createClient();
    const { prescriptionId } = await params;

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

    const hasAccess =
      prescription.student_id === session.user.id ||
      prescription.counsellor_id === session.user.id;

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('prescription_messages')
      .select(
        `
        *,
        sender:users!sender_id(id, full_name, role, avatar_url)
      `
      )
      .eq('prescription_id', prescriptionId)
      .order('sent_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    // Mark unread messages as read
    await supabase.rpc('mark_prescription_messages_read', {
      prescription_uuid: prescriptionId,
      reader_uuid: session.user.id,
    });

    return NextResponse.json({
      success: true,
      messages: messages || [],
    });
  } catch (error) {
    console.error('Unexpected error in get messages:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
