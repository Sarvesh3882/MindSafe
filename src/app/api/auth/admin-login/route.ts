import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin Login API
 * POST /api/auth/admin-login
 * 
 * Custom authentication for admins using email + college code
 * Creates a session without requiring a password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, collegeCode } = body;

    // Validate required fields
    if (!email || !collegeCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and college code are required'
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Query users table for admin with matching email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, role, college_id, email')
      .eq('email', email.toLowerCase())
      .eq('role', 'admin')
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid admin credentials'
        },
        { status: 401 }
      );
    }

    // Query colleges table to verify college code
    const { data: collegeData, error: collegeError } = await supabase
      .from('colleges')
      .select('id, college_code, name')
      .eq('id', userData.college_id)
      .single();

    if (collegeError || !collegeData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to verify college information'
        },
        { status: 500 }
      );
    }

    // Verify college code matches
    if (collegeData.college_code !== collegeCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid college code'
        },
        { status: 401 }
      );
    }

    // Check if auth user exists
    const { data: authUser } = await supabase.auth.admin.getUserById(userData.id);

    if (!authUser.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin account not found in authentication system'
        },
        { status: 404 }
      );
    }

    // Generate a session token for the admin
    // Note: This uses the service role to create a session
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.email,
      options: {
        redirectTo: `${request.nextUrl.origin}/admin`
      }
    });

    if (sessionError || !sessionData) {
      console.error('Session creation failed:', sessionError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create session'
        },
        { status: 500 }
      );
    }

    // Return success with session info
    return NextResponse.json({
      success: true,
      message: 'Admin login successful'
    });

  } catch (error) {
    console.error('Unexpected error in admin login:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'System error. Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
