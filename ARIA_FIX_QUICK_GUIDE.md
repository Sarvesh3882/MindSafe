# ARIA Questions Loading — Quick Fix Guide

## Problem
Triage questions not loading in ARIA check-in flow.

## Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
Go to your Supabase project → SQL Editor

### Step 2: Run This Script
Copy and paste the entire content of:
```
FIX_ARIA_QUESTIONS_LOADING.sql
```

### Step 3: Verify
You should see output like:
```
status: "Triage Questions Loaded"
count: 5

test: "Anonymous Access Test"
accessible_questions: 5
```

### Step 4: Test in Browser
1. Go to `/student/checkin` or `/checkin`
2. Select an emotion
3. Questions should load ✓

## What This Fixes
1. ✅ Allows anonymous users to read questions (RLS policy)
2. ✅ Seeds 5 triage questions covering all domains
3. ✅ Fixes options format (text → label)

## If Still Not Working

### Check 1: Verify Questions Exist
```sql
SELECT COUNT(*) FROM questions WHERE is_triage = TRUE;
```
Should return: **5**

### Check 2: Check RLS Policy
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'questions';
```
Should include: **"Anyone can read questions"**

### Check 3: Test Anonymous Access
```sql
SET ROLE anon;
SELECT COUNT(*) FROM questions WHERE is_triage = TRUE;
RESET ROLE;
```
Should return: **5** (not 0)

### Check 4: Browser Console
Open DevTools → Console, look for:
- ❌ `Failed to fetch triage questions`
- ❌ `Could not load questions`

If you see these, the RLS policy may not be applied correctly.

## Need More Details?
See: `ARIA_QUESTIONS_FIX_SUMMARY.md`

