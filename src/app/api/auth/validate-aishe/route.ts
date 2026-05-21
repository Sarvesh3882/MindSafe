import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateAisheCodeFormat } from '@/lib/validators';

/**
 * AISHE Code Validation API
 * GET /api/auth/validate-aishe?code={aisheCode}
 * 
 * Validates AISHE code format and checks if it exists in the database
 * Returns college name and ID if valid
 */
export async function GET(request: NextRequest) {
  console.log('🚀 AISHE validation API called');
  
  try {
    const { searchParams } = new URL(request.url);
    const aisheCode = searchParams.get('code');
    
    console.log('📝 Received AISHE code:', aisheCode);

    // Validate that code parameter is provided
    if (!aisheCode) {
      return NextResponse.json(
        {
          valid: false,
          error: 'AISHE code is required'
        },
        { status: 400 }
      );
    }

    // Validate AISHE code format (C-XXXXX)
    if (!validateAisheCodeFormat(aisheCode)) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid AISHE code format. Expected: C-XXXXX'
        },
        { status: 400 }
      );
    }

    // Query database for matching AISHE code (case-insensitive)
    const supabase = await createClient();
    
    console.log('🔍 Validating AISHE code:', aisheCode);
    
    const { data, error } = await supabase
      .from('colleges')
      .select('id, name, aishe_code')
      .ilike('aishe_code', aisheCode)
      .single();

    console.log('📊 Query result:', { data, error });

    // Handle database errors
    if (error) {
      console.error('❌ Database error:', error);
      
      // If no rows found, return not found error
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            valid: false,
            error: `AISHE code "${aisheCode}" not found. Your college must complete institutional onboarding first at /demo`
          },
          { status: 404 }
        );
      }

      // Log other database errors
      console.error('Database error during AISHE validation:', error);
      return NextResponse.json(
        {
          valid: false,
          error: `System error: ${error.message || 'Please try again or contact support.'}`
        },
        { status: 500 }
      );
    }

    // Return success with college data
    return NextResponse.json({
      valid: true,
      collegeName: data.name,
      collegeId: data.id
    });

  } catch (error) {
    console.error('Unexpected error in AISHE validation:', error);
    return NextResponse.json(
      {
        valid: false,
        error: 'System error. Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
