import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateEmail } from '@/lib/validators';

/**
 * Email Availability Check API
 * GET /api/auth/check-email?email={email}
 * 
 * Checks if an email address is already registered in the system
 * Returns availability status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Validate that email parameter is provided
    if (!email) {
      return NextResponse.json(
        {
          available: false,
          error: 'Email is required'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          available: false,
          error: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Query database to check if email exists
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    // Handle database errors
    if (error) {
      console.error('Database error during email check:', error);
      return NextResponse.json(
        {
          available: false,
          error: 'System error. Please try again or contact support.'
        },
        { status: 500 }
      );
    }

    // If data exists, email is taken
    const available = !data;

    return NextResponse.json({
      available
    });

  } catch (error) {
    console.error('Unexpected error in email availability check:', error);
    return NextResponse.json(
      {
        available: false,
        error: 'System error. Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
