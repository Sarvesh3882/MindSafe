# Testing Real-time Meeting Link Sync

## Quick Test Guide

Follow these steps to verify that meeting links sync in real-time between student and counsellor.

---

## 🎯 Prerequisites

1. **Two Browser Windows** (or two different browsers)
2. **Two Accounts**:
   - One student account
   - One counsellor account
3. **One Scheduled Session** between them

---

## 📋 Test Steps

### Setup:

1. **Browser A**: Login as **Counsellor**
   - Go to `/counsellor/sessions`
   - Find a scheduled session with a student

2. **Browser B**: Login as **Student** (the same student from the session)
   - Go to `/student/sessions`
   - Find the same scheduled session

3. **Position Windows**: Place both browser windows side-by-side so you can see both

---

### Test 1: Counsellor Generates Link

**Expected Result**: Student's page updates automatically

1. In **Browser A (Counsellor)**:
   - Find the session card
   - Click **"Start Meeting Now"** button
   - Wait 2-3 seconds

2. Watch **Browser B (Student)**:
   - ✅ The session card should update automatically
   - ✅ "Start Meeting Now" button should change to "Join Video Session"
   - ✅ Green box should appear with meeting link
   - ✅ **NO PAGE REFRESH NEEDED!**

**If this works**: ✅ Real-time sync is working!

---

### Test 2: Student Generates Link (Different Session)

**Expected Result**: Counsellor's page updates automatically

1. Book another session (or use a different existing session)

2. In **Browser B (Student)**:
   - Find the new session card
   - Click **"Start Meeting Now"** button
   - Wait 2-3 seconds

3. Watch **Browser A (Counsellor)**:
   - ✅ The session card should update automatically
   - ✅ "Start Meeting Now" button should change to "Join Video Session"
   - ✅ Green box should appear with meeting link
   - ✅ **NO PAGE REFRESH NEEDED!**

**If this works**: ✅ Bidirectional sync is working!

---

### Test 3: Both Can Join Same Meeting

**Expected Result**: Both users join the same Jitsi room

1. From **Test 1**, both should see "Join Video Session" button

2. In **Browser A (Counsellor)**:
   - Click **"Join Video Session"**
   - Jitsi opens in new tab
   - Note the room name in URL

3. In **Browser B (Student)**:
   - Click **"Join Video Session"**
   - Jitsi opens in new tab
   - Note the room name in URL

4. **Verify**:
   - ✅ Both URLs should be identical
   - ✅ Both should see each other in the video call
   - ✅ Can communicate via video/audio

**If this works**: ✅ Meeting link sharing is working!

---

## 🎬 Visual Test Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    BEFORE CLICKING                          │
├──────────────────────────┬──────────────────────────────────┤
│  Browser A (Counsellor)  │  Browser B (Student)             │
├──────────────────────────┼──────────────────────────────────┤
│  Session Card:           │  Session Card:                   │
│  ┌────────────────────┐  │  ┌────────────────────┐          │
│  │ 🕐 Starts in 2hrs  │  │  │ 🕐 Starts in 2hrs  │          │
│  │                    │  │  │                    │          │
│  │ [Start Meeting]    │  │  │ [Start Meeting]    │          │
│  └────────────────────┘  │  └────────────────────┘          │
└──────────────────────────┴──────────────────────────────────┘

                    Counsellor clicks button
                              ↓

┌─────────────────────────────────────────────────────────────┐
│                    AFTER CLICKING                           │
├──────────────────────────┬──────────────────────────────────┤
│  Browser A (Counsellor)  │  Browser B (Student)             │
├──────────────────────────┼──────────────────────────────────┤
│  Session Card:           │  Session Card:                   │
│  ┌────────────────────┐  │  ┌────────────────────┐          │
│  │ 🎥 Link Ready      │  │  │ 🎥 Link Ready      │ ← Auto!  │
│  │                    │  │  │                    │          │
│  │ [Join Session] ✅  │  │  │ [Join Session] ✅  │          │
│  └────────────────────┘  │  └────────────────────┘          │
└──────────────────────────┴──────────────────────────────────┘
```

---

## ⏱️ Timing Expectations

- **Link Generation**: 1-2 seconds
- **Database Update**: < 100ms
- **Realtime Broadcast**: 100-300ms
- **UI Update**: < 50ms
- **Total Sync Time**: < 500ms (half a second!)

**If it takes longer than 2 seconds**, check:
- Network connection
- Browser console for errors
- Supabase Realtime status

---

## 🐛 Troubleshooting

### Student's Page Doesn't Update

**Check**:
1. Are both users logged in?
2. Is it the same session?
3. Is the student page still open?
4. Check browser console for errors
5. Try refreshing student page manually

**Fix**:
- Ensure Supabase Realtime is enabled
- Check RLS policies allow SELECT on sessions
- Verify network connectivity

---

### Counsellor's Page Doesn't Update

**Check**:
1. Same as above
2. Is the counsellor page still open?
3. Try refreshing counsellor page manually

---

### Both See Different Links

**This should NOT happen!**

**If it does**:
1. Check database - should only have one meeting_link per session
2. Check if multiple sessions exist with same details
3. Verify sessionId is correct in both components

---

### Meeting Link Doesn't Work

**Check**:
1. Is the link a valid Jitsi URL?
2. Does it start with `https://meet.jit.si/`?
3. Try copying and pasting the link directly
4. Check if Jitsi is accessible in your region

---

## 📊 Success Criteria

### ✅ All Tests Pass If:

1. **Instant Updates**:
   - [ ] Student page updates when counsellor generates link
   - [ ] Counsellor page updates when student generates link
   - [ ] Updates happen in < 1 second
   - [ ] No page refresh needed

2. **Same Link**:
   - [ ] Both users see identical meeting link
   - [ ] Both can click "Join Video Session"
   - [ ] Both join the same Jitsi room

3. **Reliable**:
   - [ ] Works consistently (test 3-5 times)
   - [ ] Works in different browsers
   - [ ] Works with different sessions

---

## 🎉 Expected Outcome

After testing, you should be able to:

✅ Generate meeting link from either side
✅ See instant updates on the other side
✅ Join the same video meeting
✅ No confusion about which link to use
✅ Seamless collaboration experience

---

## 📝 Test Report Template

```
Date: _______________
Tester: _______________

Test 1: Counsellor Generates Link
- Link generated: [ ] Yes [ ] No
- Student page updated: [ ] Yes [ ] No
- Update time: _______ seconds
- Result: [ ] Pass [ ] Fail

Test 2: Student Generates Link
- Link generated: [ ] Yes [ ] No
- Counsellor page updated: [ ] Yes [ ] No
- Update time: _______ seconds
- Result: [ ] Pass [ ] Fail

Test 3: Both Join Same Meeting
- Same URL: [ ] Yes [ ] No
- Both in same room: [ ] Yes [ ] No
- Can communicate: [ ] Yes [ ] No
- Result: [ ] Pass [ ] Fail

Overall Result: [ ] All Pass [ ] Some Fail

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🚀 Quick Test (30 seconds)

**Fastest way to verify**:

1. Open counsellor sessions in Chrome
2. Open student sessions in Firefox (or incognito)
3. Click "Start Meeting Now" in Chrome
4. Watch Firefox - should update in < 1 second
5. ✅ If it updates automatically: **IT WORKS!**

---

## 💡 Pro Tips

1. **Use Two Monitors**: Easier to see both pages
2. **Use Browser DevTools**: Check Network tab for realtime events
3. **Test Multiple Times**: Ensure consistency
4. **Test Different Sessions**: Verify isolation
5. **Test Network Issues**: Disconnect/reconnect to test resilience

---

**Status**: Ready for Testing
**Estimated Test Time**: 5-10 minutes
**Difficulty**: Easy
**Required**: 2 accounts, 1 scheduled session

---

**Happy Testing!** 🎉
