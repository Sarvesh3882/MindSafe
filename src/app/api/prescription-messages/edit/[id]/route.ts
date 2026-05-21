// API Route: Edit Prescription Message
// PATCH /api/prescription-messages/edit/[id]
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { editMessageSchema } from '@/lib/prescriptions/validation';

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
    const validation = editMessageSchema.safeParse(body);

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

    // Fetch message to verify ownership and edit window
    const { data: message, error: fetchError } = await supabase
      .from('prescription_messages')
      .select('id, sender_id, sent_at')
      .eq('id', id)
      .single();

    if (fetchError || !message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (message.sender_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own messages' },
        { status: 403 }
      );
    }

    // Check 5-minute edit window
    const sentAt = new Date(message.sent_at);
    const now = new Date();
    const minutesSinceSent = (now.getTime() - sentAt.getTime()) / (1000 * 60);

    if (minutesSinceSent > 5) {
      return NextResponse.json(
        { success: false, error: 'Messages can only be edited within 5 minutes' },
        { status: 403 }
      );
    }

    // Update message
    const { data: updated, error: updateError } = await supabase
      .from('prescription_messages')
      .update({
        message_text: validation.data.messageText,
        is_edited: true,
        edited_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(
        `
        *,
        sender:users!sender_id(id, full_name, role, avatar_url)
      `
      )
      .single();

    if (updateError) {
      console.error('Error updating message:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update message' },
        { status: 500 }
      );
    }

    // TODO: Trigger real-time update

    return NextResponse.json({
      success: true,
      message: updated,
    });
  } catch (error) {
    console.error('Unexpected error in edit message:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
