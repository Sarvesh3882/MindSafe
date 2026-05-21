# Prevent Duplicate Colleges - Best Practices

## Problem Summary

The duplicate college issue occurred because:
1. **Test/demo data** was created during development
2. **Real data** was added later under a different college
3. **No cleanup** was done between test and production data
4. **Admin accounts** got assigned to wrong colleges

## How to Prevent This in Future

### 1. Use Separate Environments

**Development/Testing:**
- Use a separate Supabase project for testing
- Never mix test data with production data
- URL: `https://your-test-project.supabase.co`

**Production:**
- Use a clean Supabase project for real users
- URL: `https://your-prod-project.supabase.co`

### 2. Proper Onboarding Flow

When a new institution signs up:

**Step 1: Create College First**
```sql
-- Admin creates college during signup
INSERT INTO colleges (name, address, contact_email)
VALUES ('College Name', 'Address', 'contact@college.edu')
RETURNING id;
```

**Step 2: Create Admin Account**
```sql
-- Link admin to the college immediately
INSERT INTO users (email, role, college_id, full_name)
VALUES ('admin@college.edu', 'admin', '<college_id>', 'Admin Name');
```

**Step 3: Students/Counsellors Join**
```sql
-- All subsequent users get the same college_id
INSERT INTO users (email, role, college_id, full_name)
VALUES ('student@college.edu', 'student', '<college_id>', 'Student Name');
```

### 3. Database Constraints

Add constraints to prevent orphaned data:

```sql
-- Ensure users always have a college
ALTER TABLE users
ALTER COLUMN college_id SET NOT NULL;

-- Ensure college exists
ALTER TABLE users
ADD CONSTRAINT fk_users_college
FOREIGN KEY (college_id) REFERENCES colleges(id)
ON DELETE RESTRICT;

-- Prevent duplicate college names
CREATE UNIQUE INDEX idx_colleges_name_unique
ON colleges(LOWER(TRIM(name)));
```

### 4. Signup Flow Validation

In your signup code, ensure:

```typescript
// src/app/signup/admin/page.tsx
async function handleAdminSignup(email: string, password: string, collegeName: string) {
  // 1. Check if college already exists
  const { data: existingCollege } = await supabase
    .from('colleges')
    .select('id')
    .ilike('name', collegeName)
    .single();
  
  if (existingCollege) {
    throw new Error('College already exists. Please contact support.');
  }
  
  // 2. Create college first
  const { data: college } = await supabase
    .from('colleges')
    .insert({ name: collegeName })
    .select()
    .single();
  
  // 3. Create admin user with college_id
  const { data: authUser } = await supabase.auth.signUp({
    email,
    password,
  });
  
  // 4. Link user to college
  await supabase
    .from('users')
    .insert({
      id: authUser.user.id,
      email,
      role: 'admin',
      college_id: college.id,
    });
}
```

### 5. Regular Audits

Run this query monthly to check for issues:

```sql
-- Check for duplicate colleges
SELECT name, COUNT(*) as count
FROM colleges
GROUP BY name
HAVING COUNT(*) > 1;

-- Check for users without college
SELECT email, role
FROM users
WHERE college_id IS NULL;

-- Check for orphaned assessments
SELECT COUNT(*)
FROM assessments a
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = a.user_id
);
```

### 6. Data Cleanup Before Production

Before going live:

```sql
-- Delete all test data
DELETE FROM assessments WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test%' OR email LIKE '%demo%'
);

DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%demo%';

DELETE FROM colleges WHERE name LIKE '%test%' OR name LIKE '%demo%';

-- Verify clean state
SELECT 'Colleges' as table_name, COUNT(*) as count FROM colleges
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Assessments', COUNT(*) FROM assessments;
```

### 7. Admin Dashboard Checks

Add validation in admin dashboard:

```typescript
// src/app/admin/page.tsx
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get admin profile
  const { data: adminProfile } = await supabase
    .from('users')
    .select('college_id, colleges(name)')
    .eq('id', user.id)
    .single();
  
  // Validate college exists
  if (!adminProfile?.college_id) {
    return <ErrorPage message="Admin account not linked to any college. Contact support." />;
  }
  
  // Continue with dashboard...
}
```

## Current Cleanup Steps

### Step 1: Run Diagnostic
```bash
# In Supabase SQL Editor
Run: CLEANUP_DUPLICATES.sql
```

This will show:
- All colleges in system
- Duplicate college names
- Users by college
- Duplicate user emails
- Assessments by college

### Step 2: Execute Cleanup (if needed)
```bash
# Only if duplicates found
Run: EXECUTE_CLEANUP.sql
```

This will:
- Identify primary college (most data)
- Move all users to primary college
- Delete duplicate colleges
- Verify final state

### Step 3: Verify
```bash
# Check everything is clean
Run: CHECK_CURRENT_STATE.sql
```

## Files Created

1. **CLEANUP_DUPLICATES.sql** - Diagnostic query (run this first)
2. **EXECUTE_CLEANUP.sql** - Cleanup script (run if duplicates found)
3. **CHECK_CURRENT_STATE.sql** - Quick verification
4. **PREVENT_DUPLICATE_COLLEGES.md** - This guide

## Next Steps

1. ✅ Run `CLEANUP_DUPLICATES.sql` to check current state
2. ✅ Run `EXECUTE_CLEANUP.sql` if duplicates found
3. ✅ Implement database constraints to prevent future issues
4. ✅ Update signup flows to ensure proper college linking
5. ✅ Set up separate dev/prod environments
