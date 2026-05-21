// API Route: Get Unread Message Count Per Prescription
// GET /api/prescription-messages/unread-count
// Author: MindSafe India Development Team

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

    // Get unread counts per prescription
    const { data, error } = await supabase
      .from('prescription_messages')
      .select('prescription_id')
      .eq('is_read', false)
      .neq('sender_id', session.user.id);

    if (error) {
      console.error('Error getting unread counts:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to get unread counts' },
        { status: 500 }
      );
    }

    // Count messages per prescription
    const counts: Record<string, number> = {};
    data?.forEach((msg) => {
      counts[msg.prescription_id] = (counts[msg.prescription_id] || 0) + 1;
    });

    // Convert to array format
    const unreadCounts = Object.entries(counts).map(([prescription_id, unread_count]) => ({
      prescription_id,
      unread_count,
    }));

    return NextResponse.json({
      success: true,
      unreadCounts,
    });
  } catch (error) {
    console.error('Unexpected error in unread count:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
