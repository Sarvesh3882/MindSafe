# Video Meeting System - Test Plan

**Date**: 2024
**Status**: Ready for Testing
**Priority**: HIGH (Critical Bug Fix)

---

## Test Environment Setup

### Prerequisites
1. Two different browsers (or incognito + normal)
2. One student account
3. One counsellor account
4. At least one scheduled session between them

### Test Data
- **Student**: Any registered student account
- **Counsellor**: Any registered counsellor account
- **Session**: Status = 'scheduled', Date = today or future

---

## Test Cases

### Test Case 1: Basic Meeting Link Generation
**Objective**: Verify meeting link can be generated

**Steps**:
1. Login as student
2. Go to Sessions page
3. Find a scheduled session
4. Click "Start Meeting Now"

**Expected Result**:
- ✅ Button shows "Generating..." with spinner
- ✅ After 1-2 seconds, green card appears
- ✅ Shows "Meeting Link Ready"
- ✅ Shows Jitsi URL (https://meet.jit.si/mindsafe-...)
- ✅ Shows "Join Video Session" button
- ✅ Shows "Copy Link" button

**Pass/Fail**: ___________

---

### Test Case 2: Real-time Sync (Student → Counsellor)
**Objective**: Verify counsellor sees link when student generates it

**Steps**:
1. Login as student in Browser 1
2. Login as counsellor in Browser 2
3. Both go to Sessions page
4. Student clicks "Start Meeting Now"
5. Wait 2-3 seconds
6. Check counsellor's browser

**Expected Result**:
- ✅ Counsellor sees green card appear (within 2-3 seconds)
- ✅ Counsellor sees same Jitsi URL as student
- ✅ Counsellor can click "Join Video Session"
- ✅ No page refresh needed

**Pass/Fail**: ___________

---

### Test Case 3: Real-time Sync (Counsellor → Student)
**Objective**: Verify student sees link when counsellor generates it

**Steps**:
1. Login as student in Browser 1
2. Login as counsellor in Browser 2
3. Both go to Sessions page
4. Counsellor clicks "Start Meeting Now"
5. Wait 2-3 seconds
6. Check student's browser

**Expected Result**:
- ✅ Student sees green card appear (within 2-3 seconds)
- ✅ Student sees same Jitsi URL as counsellor
- ✅ Student can click "Join Video Session"
- ✅ No page refresh needed

**Pass/Fail**: ___________

---

### Test Case 4: No Flickering
**Objective**: Verify UI is stable and doesn't flicker

**Steps**:
1. Login as student
2. Go to Sessions page
3. Find a scheduled session
4. Click "Start Meeting Now"
5. Wait for green card to appear
6. Observe the UI for 10 seconds

**Expected Result**:
- ✅ No flickering or jumping
- ✅ Button doesn't change back to "Start Meeting Now"
- ✅ Green card stays stable
- ✅ Text doesn't jump around
- ✅ No constant re-rendering

**Pass/Fail**: ___________

---

### Test Case 5: Join Video Session
**Objective**: Verify Jitsi opens correctly

**Steps**:
1. Generate meeting link (as student or counsellor)
2. Click "Join Video Session" button

**Expected Result**:
- ✅ Opens new tab
- ✅ Loads Jitsi Meet interface
- ✅ Shows room name (mindsafe-...)
- ✅ Can enable camera/microphone
- ✅ Can join the meeting

**Pass/Fail**: ___________

---

### Test Case 6: Copy Link
**Objective**: Verify copy link functionality

**Steps**:
1. Generate meeting link
2. Click "Copy Link" button
3. Paste in notepad or browser

**Expected Result**:
- ✅ Shows alert "Meeting link copied to clipboard!"
- ✅ Clipboard contains Jitsi URL
- ✅ URL is valid and complete

**Pass/Fail**: ___________

---

### Test Case 7: Session Status Filtering
**Objective**: Verify meeting link only shows for scheduled sessions

**Steps**:
1. Login as counsellor
2. Go to Sessions page
3. Find a scheduled session → Check meeting link
4. Mark session as completed
5. Check if meeting link disappears

**Expected Result**:
- ✅ Scheduled sessions show meeting link
- ✅ Completed sessions show gray card "Session completed"
- ✅ No "Start Meeting Now" button for completed sessions
- ✅ No "Join Video Session" button for completed sessions

**Pass/Fail**: ___________

---

### Test Case 8: Past Sessions
**Objective**: Verify past sessions are limited and don't show meeting links

**Steps**:
1. Login as student or counsellor
2. Go to Sessions page
3. Scroll to "Past Sessions" section

**Expected Result**:
- ✅ Shows maximum 10 past sessions
- ✅ Past sessions show gray card (if completed)
- ✅ No meeting link generation option
- ✅ No flickering in past sessions

**Pass/Fail**: ___________

---

### Test Case 9: Double-Click Prevention
**Objective**: Verify can't generate duplicate links

**Steps**:
1. Login as student
2. Go to Sessions page
3. Click "Start Meeting Now" multiple times rapidly

**Expected Result**:
- ✅ Button becomes disabled after first click
- ✅ Shows "Generating..." only once
- ✅ Only one meeting link is created
- ✅ No duplicate links in database

**Pass/Fail**: ___________

---

### Test Case 10: Both Click Simultaneously
**Objective**: Verify system handles race condition

**Steps**:
1. Login as student in Browser 1
2. Login as counsellor in Browser 2
3. Both go to Sessions page
4. Both click "Start Meeting Now" at exactly the same time

**Expected Result**:
- ✅ Only one meeting link is created
- ✅ Both see the same link
- ✅ No errors in console
- ✅ No duplicate entries in database

**Pass/Fail**: ___________

---

### Test Case 11: Error Handling
**Objective**: Verify error messages work

**Steps**:
1. Stop the development server
2. Try to generate meeting link
3. Check error message

**Expected Result**:
- ✅ Shows red card with error message
- ✅ Shows "Try again" button
- ✅ Doesn't crash the page
- ✅ Can retry after server is back

**Pass/Fail**: ___________

---

### Test Case 12: Console Errors
**Objective**: Verify no console errors

**Steps**:
1. Open browser console (F12)
2. Go through all test cases above
3. Check for any errors or warnings

**Expected Result**:
- ✅ No errors in console
- ✅ No warnings about memory leaks
- ✅ No "Can't perform state update on unmounted component" warnings
- ✅ Clean console output

**Pass/Fail**: ___________

---

## Performance Tests

### Test Case 13: Polling Stops
**Objective**: Verify polling stops after link is found

**Steps**:
1. Open browser console (F12)
2. Go to Network tab
3. Generate meeting link
4. Watch network requests for 30 seconds

**Expected Result**:
- ✅ Polling requests stop after link is found
- ✅ No continuous requests to `/api/meetings/session/[sessionId]`
- ✅ No memory leaks
- ✅ Component cleans up properly

**Pass/Fail**: ___________

---

### Test Case 14: Multiple Sessions
**Objective**: Verify works with multiple sessions on same page

**Steps**:
1. Create 3-4 scheduled sessions
2. Go to Sessions page
3. Generate meeting link for first session
4. Check if other sessions still work

**Expected Result**:
- ✅ Each session has independent meeting link
- ✅ No interference between sessions
- ✅ All sessions can generate links
- ✅ No performance issues

**Pass/Fail**: ___________

---

## Browser Compatibility

### Test Case 15: Cross-Browser Testing
**Objective**: Verify works in different browsers

**Browsers to Test**:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

**Expected Result**:
- ✅ Works in all browsers
- ✅ No browser-specific issues
- ✅ Consistent UI across browsers

**Pass/Fail**: ___________

---

## Database Verification

### Test Case 16: Database Updates
**Objective**: Verify database is updated correctly

**Steps**:
1. Generate meeting link
2. Check database `sessions` table
3. Verify fields are populated

**Expected Result**:
- ✅ `meeting_link` contains Jitsi URL
- ✅ `meeting_room_id` contains room ID
- ✅ `meeting_link_provider` = 'jitsi'
- ✅ `meeting_link_generated_at` has timestamp
- ✅ `meeting_link_expires_at` = generated_at + 15 minutes

**Pass/Fail**: ___________

---

## Summary

**Total Test Cases**: 16

**Passed**: _____ / 16

**Failed**: _____ / 16

**Critical Issues Found**: _____________________

**Minor Issues Found**: _____________________

---

## Sign-off

**Tester Name**: _____________________

**Date**: _____________________

**Overall Status**: [ ] PASS [ ] FAIL

**Notes**:
_____________________
_____________________
_____________________

---

## Next Steps After Testing

If all tests pass:
- ✅ Deploy to production
- ✅ Monitor for any issues
- ✅ Collect user feedback

If tests fail:
- ❌ Document issues
- ❌ Fix bugs
- ❌ Re-test
- ❌ Repeat until all pass
