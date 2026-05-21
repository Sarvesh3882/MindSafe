import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Sign-Out API
 * POST /api/auth/signout
 * GET /api/auth/signout (for direct navigation)
 * 
 * Signs out the current user and clears the session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign-out error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to sign out. Please try again.'
        },
        { status: 500 }
      );
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    });

  } catch (error) {
    console.error('Unexpected error in sign-out:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'System error. Please try again.'
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for direct navigation (e.g., clicking a link)
 * Redirects to login page after signing out
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Sign out the user
    await supabase.auth.signOut();

    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));

  } catch (error) {
    console.error('Unexpected error in sign-out:', error);
    // Redirect to login anyway
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
