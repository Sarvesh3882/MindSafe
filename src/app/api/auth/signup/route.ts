import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  validateAisheCodeFormat, 
  validateEmail, 
  validatePassword, 
  validatePhoneNumber,
  validateFullName,
  validateDepartment,
  validateRollNumber
} from '@/lib/validators';

/**
 * Sign-Up API for Students and Counsellors
 * POST /api/auth/signup
 * 
 * Creates a new user account with Supabase Auth and user profile
 * Validates AISHE code, email uniqueness, and all required fields
 * Implements rollback on failure to maintain data integrity
 */

interface SignUpRequest {
  role: 'student' | 'counsellor';
  fullName: string;
  email: string;
  phone: string;
  password: string;
  aisheCode: string;
  department: string;
  rollNumber?: string; // Only for students
}

export async function POST(request: NextRequest) {
  let authUserId: string | null = null;
  
  console.log('🚀 Sign-up API called');
  
  try {
    // Parse request body
    const body: SignUpRequest = await request.json();
    const { role, fullName, email, phone, password, aisheCode, department, rollNumber } = body;
    
    console.log('📝 Sign-up request:', { role, fullName, email, phone: phone.substring(0, 3) + '***', aisheCode, department, rollNumber });

    // ============================================================
    // Validate required fields
    // ============================================================

    if (!role || !fullName || !email || !phone || !password || !aisheCode || !department) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required'
        },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'student' && role !== 'counsellor') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role. Must be student or counsellor'
        },
        { status: 400 }
      );
    }

    // Validate roll number for students
    if (role === 'student' && !rollNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Roll number is required for students'
        },
        { status: 400 }
      );
    }

    // ============================================================
    // Validate field formats
    // ============================================================

    // Validate full name
    if (!validateFullName(fullName)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid full name. Must be 2-100 characters with letters and spaces only'
        },
        { status: 400 }
      );
    }

    // Validate AISHE code format
    if (!validateAisheCodeFormat(aisheCode)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid AISHE code format. Expected: C-XXXXX'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: phoneValidation.error || 'Invalid phone number'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password does not meet requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Validate department
    if (!validateDepartment(department)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid department name'
        },
        { status: 400 }
      );
    }

    // Validate roll number for students
    if (role === 'student' && rollNumber && !validateRollNumber(rollNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid roll number format'
        },
        { status: 400 }
      );
    }

    // ============================================================
    // Verify AISHE code exists in database
    // ============================================================

    const supabase = await createClient();
    
    const { data: collegeData, error: collegeError } = await supabase
      .from('colleges')
      .select('id, name')
      .ilike('aishe_code', aisheCode)
      .single();

    if (collegeError || !collegeData) {
      return NextResponse.json(
        {
          success: false,
          error: 'AISHE code not found. Please contact your college administrator.'
        },
        { status: 404 }
      );
    }

    // ============================================================
    // Check email uniqueness
    // ============================================================

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered. Please log in or use a different email.'
        },
        { status: 409 }
      );
    }

    // ============================================================
    // Create Supabase Auth account
    // ============================================================

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });

    if (authError || !authData.user) {
      console.error('❌ Auth account creation failed:', authError);
      console.error('   Error code:', authError?.code);
      console.error('   Error message:', authError?.message);
      return NextResponse.json(
        {
          success: false,
          error: authError?.message || 'Failed to create account. Please try again.'
        },
        { status: 500 }
      );
    }

    authUserId = authData.user.id;
    console.log('✅ Auth account created:', authUserId);

    // ============================================================
    // Create user profile in users table
    // ============================================================

    const userProfile = {
      id: authData.user.id,
      email: email.toLowerCase(),
      role,
      college_id: collegeData.id,
      full_name: fullName,
      phone: phoneValidation.formatted,
      department,
      ...(role === 'student' && rollNumber ? { roll_number: rollNumber } : {})
    };

    const { error: profileError } = await supabase
      .from('users')
      .insert(userProfile);

    if (profileError) {
      console.error('❌ User profile creation failed:', profileError);
      console.error('   Error code:', profileError.code);
      console.error('   Error message:', profileError.message);
      console.error('   Error details:', profileError.details);
      
      // Rollback: Delete auth account
      try {
        await supabase.auth.admin.deleteUser(authUserId);
        console.log('🔄 Rolled back auth account');
      } catch (rollbackError) {
        console.error('❌ Rollback failed:', rollbackError);
      }

      return NextResponse.json(
        {
          success: false,
          error: `Failed to create user profile: ${profileError.message}`
        },
        { status: 500 }
      );
    }

    console.log('✅ User profile created successfully');

    // ============================================================
    // Return success
    // ============================================================

    return NextResponse.json({
      success: true,
      userId: authData.user.id
    });

  } catch (error) {
    console.error('Unexpected error in sign-up:', error);

    // Attempt rollback if auth user was created
    if (authUserId) {
      try {
        const supabase = await createClient();
        await supabase.auth.admin.deleteUser(authUserId);
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'System error. Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
