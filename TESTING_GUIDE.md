# Testing Guide - Clear Today's Check-ins

## Quick Start

### Method 1: Node.js Script (Recommended)

**Run the script:**
```bash
node clear-todays-checkins.mjs
```

**Or specify user email:**
```bash
node clear-todays-checkins.mjs student@example.com
```

**What it does:**
- Shows all users in database
- Finds today's assessments
- Deletes them safely
- Allows you to test check-in flow again

---

### Method 2: SQL Query (Supabase Dashboard)

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Copy and paste from `CLEAR_TODAYS_CHECKINS.sql`
4. Replace `your-email@example.com` with actual email
5. Click "Run"

---

## Detailed Usage

### Node.js Script Options

#### Option A: Interactive (shows all users)
```bash
node clear-todays-checkins.mjs
```

**Output:**
```
🧹 Clearing Today's Check-ins...

📅 Today's date: 2024-01-15

📋 Fetching all users...

Available users:
  1. John Doe (john@example.com) - student
  2. Jane Smith (jane@example.com) - student
  3. Dr. Kumar (kumar@example.com) - counsellor

Using first user: John Doe (john@example.com)

🔍 Checking for today's assessments...

📊 Found 2 assessment(s) for today:
  1. stressed - moderate (10:30:45 AM)
  2. anxious - high (2:15:30 PM)

🗑️  Deleting 2 assessment(s)...
✅ Successfully deleted today's check-ins!

🎉 You can now test the check-in flow again.
```

#### Option B: Specific User
```bash
node clear-todays-checkins.mjs student@college.edu
```

**Output:**
```
🧹 Clearing Today's Check-ins...

📅 Today's date: 2024-01-15

🔍 Looking up user: student@college.edu
✅ Found user: Student Name (student@college.edu)

🔍 Checking for today's assessments...

📊 Found 1 assessment(s) for today:
  1. happy - low (9:00:00 AM)

🗑️  Deleting 1 assessment(s)...
✅ Successfully deleted today's check-ins!

🎉 You can now test the check-in flow again.
```

---

### SQL Query Options

#### Option 1: Delete for Specific User (Safe)
```sql
DELETE FROM assessments
WHERE user_id = (
  SELECT id FROM users WHERE email = 'student@example.com'
)
AND date = CURRENT_DATE;
```

#### Option 2: Check Before Deleting (Very Safe)
```sql
-- See what will be deleted
SELECT 
  u.email,
  u.name,
  a.emotion,
  a.risk_level,
  a.created_at
FROM assessments a
JOIN users u ON a.user_id = u.id
WHERE a.date = CURRENT_DATE
ORDER BY a.created_at DESC;
```

#### Option 3: Delete for ALL Users (Dangerous!)
```sql
-- ⚠️ WARNING: Deletes ALL today's check-ins for ALL users
DELETE FROM assessments WHERE date = CURRENT_DATE;
```

#### Option 4: Delete by User ID
```sql
DELETE FROM assessments 
WHERE user_id = 'uuid-here' 
AND date = CURRENT_DATE;
```

---

## Testing Workflow

### Complete Test Cycle:

1. **Do a check-in**
   - Login as student
   - Go to Check-in page
   - Complete ARIA assessment
   - See results

2. **Try to check-in again**
   - Should see "You've already checked in today"
   - Cannot do another check-in

3. **Clear today's check-ins**
   ```bash
   node clear-todays-checkins.mjs student@example.com
   ```

4. **Check-in again**
   - Refresh the page
   - Should be able to check-in again
   - Test different emotions/responses

5. **Repeat as needed**

---

## Common Use Cases

### Testing Different Risk Levels
```bash
# 1. Check-in with low risk answers
# 2. Clear check-in
node clear-todays-checkins.mjs

# 3. Check-in with high risk answers
# 4. Clear check-in
node clear-todays-checkins.mjs

# 5. Check-in with crisis keywords
```

### Testing Multiple Students
```bash
# Student 1
node clear-todays-checkins.mjs student1@college.edu

# Student 2
node clear-todays-checkins.mjs student2@college.edu

# Student 3
node clear-todays-checkins.mjs student3@college.edu
```

### Testing Counsellor Dashboard
```bash
# 1. Have students check-in
# 2. View in counsellor dashboard
# 3. Clear all check-ins
node clear-todays-checkins.mjs student1@college.edu
node clear-todays-checkins.mjs student2@college.edu

# 4. Have students check-in again with different data
```

---

## Troubleshooting

### Error: "User not found"
**Problem:** Email doesn't exist in database

**Solution:**
```bash
# List all users first
node clear-todays-checkins.mjs
# Copy the correct email from the list
```

### Error: "Missing Supabase credentials"
**Problem:** `.env.local` file not found or incomplete

**Solution:**
1. Check `.env.local` exists
2. Verify it has:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Error: "No check-ins found"
**Problem:** User hasn't checked in today

**Solution:**
- This is normal! Just means nothing to delete
- Do a check-in first, then run the script

### Script doesn't run
**Problem:** Node.js not installed or wrong version

**Solution:**
```bash
# Check Node.js version
node --version
# Should be v18 or higher

# If not installed, download from nodejs.org
```

---

## Safety Features

### Built-in Protections:
1. ✅ Only deletes today's assessments (not historical data)
2. ✅ Shows what will be deleted before deleting
3. ✅ Requires user confirmation (email or selection)
4. ✅ Uses service role key (bypasses RLS safely)
5. ✅ Logs all actions for audit trail

### What It DOESN'T Delete:
- ❌ Historical assessments (previous days)
- ❌ User accounts
- ❌ Chat messages
- ❌ Prescriptions
- ❌ Sessions
- ❌ Any other data

---

## Advanced Usage

### Delete Specific Date (Not Today)
Edit the script and change:
```javascript
const today = '2024-01-10'; // Specific date instead of today
```

### Delete Multiple Days
```sql
-- Delete last 3 days
DELETE FROM assessments 
WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com')
AND date >= CURRENT_DATE - INTERVAL '3 days';
```

### Bulk Delete for Testing
```bash
# Create a batch script
for email in student1@test.com student2@test.com student3@test.com
do
  node clear-todays-checkins.mjs $email
done
```

---

## Production Warning

⚠️ **DO NOT USE IN PRODUCTION**

This script is for **testing/development only**. In production:
- Users should only check-in once per day
- Historical data should be preserved
- Deletions should be logged and audited
- Use proper admin tools, not scripts

---

## Files Created

1. **`clear-todays-checkins.mjs`** - Node.js script (recommended)
2. **`CLEAR_TODAYS_CHECKINS.sql`** - SQL queries (alternative)
3. **`TESTING_GUIDE.md`** - This guide

---

## Quick Reference

```bash
# Basic usage
node clear-todays-checkins.mjs

# Specific user
node clear-todays-checkins.mjs user@example.com

# Check what exists (SQL)
SELECT * FROM assessments WHERE date = CURRENT_DATE;

# Delete for user (SQL)
DELETE FROM assessments 
WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com')
AND date = CURRENT_DATE;
```

---

## Support

If you encounter issues:
1. Check the error message
2. Verify `.env.local` is correct
3. Ensure user exists in database
4. Check Supabase dashboard for data
5. Review this guide's troubleshooting section

Happy testing! 🎉
