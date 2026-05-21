// API Route: Get Session Meeting Link
// GET /api/meetings/session/[sessionId]
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const supabase = await createClient();
    const { sessionId } = await params;

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

    // Fetch session
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if user has access
    const hasAccess =
      sessionData.student_id === session.user.id ||
      sessionData.counsellor_id === session.user.id;

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Return meeting link if available (no time-based restrictions)
    return NextResponse.json({
      success: true,
      meetingLink: sessionData.meeting_link || null,
      provider: sessionData.meeting_link_provider || null,
      expiresAt: sessionData.meeting_link_expires_at || null,
      roomId: sessionData.meeting_room_id || null,
    });
  } catch (error) {
    console.error('Unexpected error in get session meeting link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
