// API Route: Generate Meeting Link
// POST /api/meetings/generate
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

    // Parse request body
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Verify session exists and user has access
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('id, student_id, counsellor_id, date, time, meeting_link')
      .eq('id', sessionId)
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if user is part of this session
    const hasAccess =
      sessionData.student_id === session.user.id ||
      sessionData.counsellor_id === session.user.id;

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if meeting link already exists
    if (sessionData.meeting_link) {
      return NextResponse.json({
        success: true,
        meetingLink: sessionData.meeting_link,
        provider: 'jitsi',
        message: 'Meeting link already exists',
      });
    }

    // Generate meeting link using database function
    const { data: roomId, error: generateError } = await supabase.rpc(
      'generate_meeting_link_for_session',
      {
        session_uuid: sessionId,
      }
    );

    if (generateError) {
      console.error('Error generating meeting link:', generateError);
      return NextResponse.json(
        { success: false, error: 'Failed to generate meeting link' },
        { status: 500 }
      );
    }

    // Fetch updated session with meeting link
    const { data: updatedSession } = await supabase
      .from('sessions')
      .select('meeting_link, meeting_link_provider, meeting_link_expires_at')
      .eq('id', sessionId)
      .single();

    return NextResponse.json({
      success: true,
      meetingLink: updatedSession?.meeting_link,
      provider: updatedSession?.meeting_link_provider || 'jitsi',
      expiresAt: updatedSession?.meeting_link_expires_at,
    });
  } catch (error) {
    console.error('Unexpected error in generate meeting link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
