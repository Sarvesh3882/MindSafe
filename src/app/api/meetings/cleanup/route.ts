// API Route: Cleanup Expired Meeting Links (Cron Job)
// POST /api/meetings/cleanup
// Author: MindSafe India Development Team
// Schedule: Daily at 2:00 AM

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Find expired sessions
    const { data: expiredSessions, error: fetchError } = await supabase
      .from('sessions')
      .select('id, meeting_link, meeting_link_provider, meeting_room_id')
      .lt('meeting_link_expires_at', new Date().toISOString())
      .not('meeting_link', 'is', null);

    if (fetchError) {
      console.error('Error fetching expired sessions:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch expired sessions' },
        { status: 500 }
      );
    }

    let cleanedCount = 0;
    const errors: string[] = [];

    // Process each expired session
    for (const session of expiredSessions || []) {
      try {
        // If Daily.co room, delete it via API
        if (session.meeting_link_provider === 'daily' && session.meeting_room_id) {
          const dailyApiKey = process.env.DAILY_API_KEY;
          if (dailyApiKey) {
            try {
              await fetch(`https://api.daily.co/v1/rooms/${session.meeting_room_id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${dailyApiKey}`,
                },
              });
            } catch (dailyError) {
              console.error(`Failed to delete Daily.co room ${session.meeting_room_id}:`, dailyError);
              errors.push(`Daily.co room ${session.meeting_room_id}`);
            }
          }
        }

        // Clear meeting link from database
        const { error: updateError } = await supabase
          .from('sessions')
          .update({
            meeting_link: null,
          })
          .eq('id', session.id);

        if (updateError) {
          console.error(`Failed to clear meeting link for session ${session.id}:`, updateError);
          errors.push(`Session ${session.id}`);
        } else {
          cleanedCount++;
        }
      } catch (error) {
        console.error(`Error processing session ${session.id}:`, error);
        errors.push(`Session ${session.id}`);
      }
    }

    return NextResponse.json({
      success: true,
      cleanedCount,
      totalExpired: expiredSessions?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Unexpected error in cleanup:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing (with auth)
export async function GET(request: Request) {
  return POST(request);
}
