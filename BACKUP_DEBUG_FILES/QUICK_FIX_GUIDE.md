# Quick Fix Guide - Real-time Meeting Sync

## 🚨 Problem

- Meeting links not syncing between student and counsellor
- When one person clicks "Start Meeting Now", the other doesn't see it
- Meeting URL not visible to share

## ✅ Solution (3 Steps)

### Step 1: Enable Realtime in Supabase (2 minutes)

1. Go to https://supabase.com/dashboard
2. Select your project: `usompgticzgsrsbyglap`
3. Click **Database** → **Replication** (left sidebar)
4. Find the `sessions` table in the list
5. Toggle **Enable Realtime** to ON
6. Click **Save**

**OR** run this SQL in Supabase SQL Editor:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
GRANT SELECT ON sessions TO anon, authenticated;
```

---

### Step 2: Apply Database Migration (1 minute)

Run this command in your terminal:

```bash
cd c:\Users\codex\OneDrive\Documents\MindSafe_India\mindsafe-india
supabase db push
```

This applies migration `022_enable_realtime_sessions.sql`

---

### Step 3: Test It! (2 minutes)

1. **Open Browser A** (Chrome):
   - Login as counsellor
   - Go to Sessions page
   - Find a scheduled session

2. **Open Browser B** (Firefox or Incognito):
   - Login as student (same session)
   - Go to Sessions page
   - Find the same session

3. **In Browser A** (Counsellor):
   - Click "Start Meeting Now"
   - Wait 2 seconds

4. **Watch Browser B** (Student):
   - Meeting URL should appear automatically!
   - "Join Video Session" button should appear!
   - **NO REFRESH NEEDED!**

5. **Verify**:
   - ✅ Both see the same meeting URL
   - ✅ Both can copy the link
   - ✅ Both can join the meeting

---

## 🎉 Done!

If you see the meeting link appear on both pages automatically, **it's working!**

---

## 🐛 Still Not Working?

### Check 1: Is Realtime Enabled?

Run this in Supabase SQL Editor:

```sql
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

Should show `sessions` in the results.

### Check 2: Browser Console

1. Open browser console (F12)
2. Go to sessions page
3. Look for: `Subscription status: SUBSCRIBED`

If you see `CHANNEL_ERROR`, Realtime is not enabled (go back to Step 1).

### Check 3: Restart Realtime

1. Go to Supabase Dashboard
2. Settings → API
3. Click "Restart Realtime"
4. Wait 30 seconds
5. Try again

---

## 📞 Need Help?

Check the detailed guide: `REALTIME_SYNC_FIX.md`

---

**Total Time**: 5 minutes  
**Difficulty**: Easy  
**Result**: Real-time meeting link sync! 🎉
