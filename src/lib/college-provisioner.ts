import { createClient } from '@supabase/supabase-js';

/**
 * Generates a unique college code
 * Format: COL-YYYYMMDD-XXXX
 * Example: COL-20260428-A7K9
 */
export function generateCollegeCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `COL-${date}-${random}`;
}

/**
 * Generates a strong temporary password
 */
function generateTemporaryPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export interface ProvisionData {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminRole: string;
  collegeName: string;
  aisheCode: string;
  studentCount: string;
  planTier: string;
  paymentId: string;
}

export interface ProvisionResult {
  success: boolean;
  collegeCode?: string;
  adminEmail?: string;
  temporaryPassword?: string;
  collegeId?: string;
  error?: string;
}

/**
 * Provisions a new college and admin account
 * Creates college record, admin user in Supabase Auth, and user profile
 */
export async function provisionCollege(data: ProvisionData): Promise<ProvisionResult> {
  try {
    // Initialize Supabase with Service Role Key to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        db: {
          schema: 'public'
        }
      }
    );

    // Generate unique college code
    const collegeCode = generateCollegeCode();
    
    // Generate temporary password for admin
    const temporaryPassword = generateTemporaryPassword();

    // Step 1: Create college record
    const { data: college, error: collegeError } = await supabaseAdmin
      .from('colleges')
      .insert({
        name: data.collegeName,
        aishe_code: data.aisheCode,
        student_count: data.studentCount,
        plan_tier: data.planTier,
        payment_id: data.paymentId,
        college_code: collegeCode,
        active: true,
      })
      .select('id')
      .single();

    if (collegeError) {
      console.error('Failed to create college:', collegeError);
      return {
        success: false,
        error: 'Failed to create college workspace',
      };
    }

    const collegeId = college.id;

    // Step 2: Create admin user in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.adminEmail,
      password: temporaryPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: data.adminName,
        role: 'admin',
      },
    });

    if (authError) {
      console.error('Failed to create admin user:', authError);
      
      // Rollback: Delete college record
      await supabaseAdmin.from('colleges').delete().eq('id', collegeId);
      
      return {
        success: false,
        error: 'Failed to create admin account',
      };
    }

    // Step 3: Create user profile
    const { error: profileError } = await supabaseAdmin.from('users').insert({
      id: authUser.user.id,
      email: data.adminEmail,
      full_name: data.adminName,
      role: 'admin',
      college_id: collegeId,
    });

    if (profileError) {
      console.error('Failed to create user profile:', profileError);
      
      // Rollback: Delete auth user and college
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from('colleges').delete().eq('id', collegeId);
      
      return {
        success: false,
        error: 'Failed to create user profile',
      };
    }

    // Success!
    console.log(`College provisioned successfully: ${collegeCode}`);
    
    return {
      success: true,
      collegeCode,
      adminEmail: data.adminEmail,
      temporaryPassword,
      collegeId,
    };
  } catch (error) {
    console.error('Provisioning error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during provisioning',
    };
  }
}
