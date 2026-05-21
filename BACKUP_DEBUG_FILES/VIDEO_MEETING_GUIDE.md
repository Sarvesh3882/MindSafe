# 📹 Video Meeting System - How It Works

## 🎯 Overview

The video meeting system is **integrated with the sessions booking system**. When a counsellor and student have a scheduled session, a Jitsi meeting link is automatically generated.

---

## 🔄 How Video Meetings Work

### Step 1: Book a Session
1. Student books a session with counsellor
2. Session is created in database with date/time
3. Status: "scheduled"

### Step 2: Meeting Link Generation
**Automatic generation happens when:**
- Session is 15 minutes away from start time
- Either student or counsellor accesses the session detail page
- API endpoint `/api/meetings/generate` is called

### Step 3: Access Meeting Link
**15 minutes before session:**
- Meeting link becomes available
- Both student and counsellor can see "Join Meeting" button
- Click button to join Jitsi video call

### Step 4: After Session
- Meeting link expires after session end time
- Link is automatically cleaned up by cron job

---

## 📍 Where to Find Meeting Links

### For Students:
1. Go to **Sessions** page (`/student/sessions`)
2. Find your upcoming session
3. **15 minutes before** session time, you'll see "Join Meeting" button
4. Click to join video call

### For Counsellors:
1. Go to **Sessions** page (`/counsellor/sessions`)
2. Find the scheduled session
3. **15 minutes before** session time, you'll see "Join Meeting" button
4. Click to join video call

---

## 🎨 What You'll See

### Before 15 Minutes:
```
┌─────────────────────────────────────┐
│ Session with Dr. Priya Sharma       │
│ Date: May 16, 2026                  │
│ Time: 10:00 AM                      │
│ Status: Scheduled                   │
│                                     │
│ ⏰ Meeting link available in 45 min │
└─────────────────────────────────────┘
```

### 15 Minutes Before:
```
┌─────────────────────────────────────┐
│ Session with Dr. Priya Sharma       │
│ Date: May 16, 2026                  │
│ Time: 10:00 AM                      │
│ Status: Scheduled                   │
│                                     │
│ [📹 Join Meeting] ← CLICK HERE      │
└─────────────────────────────────────┘
```

### After Clicking:
- Opens Jitsi Meet in new tab
- Room name: `mindsafe-session-[sessionId]`
- Both parties can join the same room
- No account needed, no downloads required

---

## 🔧 Technical Details

### Database Structure:
The `sessions` table has these columns for meetings:
- `meeting_link` - The Jitsi URL
- `meeting_platform` - "jitsi" (default)
- `link_generated_at` - When link was created
- `link_expires_at` - When link expires
- `link_accessed` - Whether link was used

### API Endpoints:
1. **Generate Link**: `POST /api/meetings/generate`
   - Input: `{ sessionId }`
   - Output: `{ meetingLink, expiresAt }`

2. **Get Link**: `GET /api/meetings/session/[sessionId]`
   - Returns meeting link if available
   - Checks if within access window (15 min before to end time)

3. **Cleanup**: `POST /api/meetings/cleanup`
   - Cron job to remove expired links
   - Runs periodically

### Meeting Link Format:
```
https://meet.jit.si/mindsafe-session-[sessionId]
```

Example:
```
https://meet.jit.si/mindsafe-session-abc123def456
```

---

## ⏰ Time-Based Access

### Access Window:
- **Available from**: 15 minutes before session start
- **Available until**: Session end time
- **After end time**: Link expires and is removed

### Example Timeline:
```
Session: 10:00 AM - 11:00 AM

09:00 AM  ❌ Too early - link not available
09:30 AM  ❌ Too early - link not available
09:45 AM  ✅ Link becomes available (15 min before)
10:00 AM  ✅ Session starts - link available
10:30 AM  ✅ During session - link available
11:00 AM  ✅ Session ends - link still available
11:01 AM  ❌ Link expires and is removed
```

---

## 🎯 How to Test

### Test Scenario 1: Book and Join
1. **As Student**: Book a session with counsellor
2. **Wait or modify**: Session time to be within 15 minutes
3. **As Student**: Go to Sessions page
4. **See**: "Join Meeting" button appears
5. **Click**: Opens Jitsi in new tab
6. **As Counsellor**: Also click "Join Meeting"
7. **Result**: Both in same video room!

### Test Scenario 2: Early Access
1. **As Student**: Try to access meeting 30 minutes before
2. **See**: Message "Meeting link available in X minutes"
3. **Wait**: Until 15 minutes before
4. **Refresh**: Page
5. **See**: "Join Meeting" button now appears

---

## 🔗 Integration with Prescriptions

The meeting links are **also available in prescription detail pages**:

1. When viewing a prescription
2. If there's an associated session
3. Meeting link shows in the prescription detail view
4. Same time-based access rules apply

---

## 🎨 MeetingLink Component

The `MeetingLink` component handles all the logic:

```tsx
<MeetingLink
  sessionId="abc123"
  sessionStartTime="2026-05-16T10:00:00Z"
  sessionEndTime="2026-05-16T11:00:00Z"
/>
```

**Features:**
- Automatic time checking
- Countdown timer
- Link generation on demand
- Error handling
- Loading states

---

## 🐛 Troubleshooting

### Issue: Can't see "Join Meeting" button
**Solutions:**
1. Check session is within 15 minutes of start time
2. Refresh the page
3. Check session status is "scheduled"
4. Verify migrations 017 is applied

### Issue: Meeting link doesn't work
**Solutions:**
1. Check Jitsi Meet is not blocked by firewall
2. Try opening link in incognito mode
3. Check browser console for errors
4. Verify link format is correct

### Issue: Both parties can't see each other
**Solutions:**
1. Both must join the same room (same sessionId)
2. Check camera/microphone permissions
3. Try refreshing the Jitsi page
4. Check internet connection

---

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Database Schema | ✅ Complete | Migration 017 |
| API Endpoints | ✅ Complete | 3 endpoints |
| MeetingLink Component | ✅ Complete | Time-based access |
| Sessions Integration | ✅ Complete | Auto-generation |
| Prescriptions Integration | ✅ Complete | Shows in detail view |
| Jitsi Integration | ✅ Complete | No API key needed |

---

## 🎉 Summary

**Video meetings work through the sessions system:**

1. **Book a session** (student or counsellor)
2. **Wait for 15 minutes before** session time
3. **Go to Sessions page** and find your session
4. **Click "Join Meeting"** button
5. **Video call opens** in Jitsi Meet
6. **Both parties join** the same room

**It's automatic, time-based, and integrated!** 🚀

---

## 📞 Quick Reference

### Where to Find:
- **Students**: `/student/sessions` → Click session → "Join Meeting"
- **Counsellors**: `/counsellor/sessions` → Click session → "Join Meeting"
- **Also in**: Prescription detail pages (if session linked)

### When Available:
- **From**: 15 minutes before session start
- **Until**: Session end time
- **Platform**: Jitsi Meet (free, no account needed)

---

**Last Updated**: 2024
**Status**: ✅ WORKING
**Platform**: Jitsi Meet

