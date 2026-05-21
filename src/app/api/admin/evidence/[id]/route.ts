import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('users')
      .select('role, college_id')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get evidence record
    const { data: evidence, error: fetchError } = await supabase
      .from('naac_evidence')
      .select('*')
      .eq('id', id)
      .eq('college_id', profile.college_id)
      .single();

    if (fetchError || !evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    // Extract file path from URL
    const urlParts = evidence.file_url.split('/naac-evidence/');
    const filePath = urlParts[1];

    // Delete file from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('naac-evidence')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from('naac_evidence')
      .delete()
      .eq('id', id)
      .eq('college_id', profile.college_id);

    if (deleteError) {
      console.error('Database deletion error:', deleteError);
      return NextResponse.json({ error: 'Deletion failed: ' + deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
