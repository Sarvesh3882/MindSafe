# Prescription Management System - Testing Guide

## 🧪 Complete Testing Checklist

This guide will help you test all features of the prescription management system.

---

## Prerequisites

1. ✅ Database migrations 014-021 applied
2. ✅ Development server running (`npm run dev`)
3. ✅ Two test accounts:
   - Student account
   - Counsellor account (same college as student)

---

## Test 1: Student Views Prescriptions

### Steps:
1. Log in as **student**
2. Navigate to `/student/prescriptions`
3. Verify you see the prescriptions page

### Expected Results:
- ✅ Page loads without errors
- ✅ Search bar visible
- ✅ Date filter dropdown visible
- ✅ Empty state shows if no prescriptions
- ✅ Prescriptions list shows if data exists

### Test Variations:
- Try searching for a medication name
- Try different date filters (7d, 30d, 90d, all)
- Check pagination if more than 20 prescriptions

---

## Test 2: Counsellor Creates Prescription

### Steps:
1. Log in as **counsellor**
2. Navigate to `/counsellor/prescriptions/[studentId]`
   (Replace [studentId] with actual student UUID)
3. Click "New Prescription" button
4. Fill in the form:
   - Medication Name: "Sertraline"
   - Dosage: "50mg"
   - Frequency: "Once daily"
   - Duration: "30 days"
   - Notes: "Take with food"
   - Wellness Tips: "Practice mindfulness daily"
5. Click "Create Prescription"

### Expected Results:
- ✅ Form validates required fields
- ✅ Character counts update as you type
- ✅ Toast notification shows "Prescription created successfully"
- ✅ Form closes
- ✅ New prescription appears in list
- ✅ Prescription card shows all details

### Test Variations:
- Try submitting with empty fields (should fail)
- Try exceeding character limits (should fail)
- Try creating multiple prescriptions

---

## Test 3: Student Views Prescription Details

### Steps:
1. Log in as **student**
2. Navigate to `/student/prescriptions`
3. Click on any prescription card

### Expected Results:
- ✅ Detail page loads
- ✅ Medication name displayed prominently
- ✅ Dosage, frequency, duration visible
- ✅ Notes section shows if present
- ✅ Wellness tips section shows if present
- ✅ Counsellor name visible
- ✅ Prescribed date visible
- ✅ Messages section visible
- ✅ Message input box visible

---

## Test 4: Student Sends Message

### Steps:
1. On prescription detail page (from Test 3)
2. Scroll to messages section
3. Type a message: "Should I take this with breakfast or dinner?"
4. Press Enter (or click Send button)

### Expected Results:
- ✅ Message appears in thread immediately
- ✅ Toast notification shows "Message sent successfully"
- ✅ Input box clears
- ✅ Message shows "Sent" status
- ✅ Character count resets to 0/2000

### Test Variations:
- Try sending empty message (should fail)
- Try sending 2001 characters (should fail)
- Try Shift+Enter for new line
- Try sending multiple messages

---

## Test 5: Counsellor Replies to Message

### Steps:
1. Log in as **counsellor**
2. Navigate to `/counsellor/prescriptions/[studentId]`
3. Click the prescription with messages
4. Scroll to messages section
5. Type a reply: "Take it with breakfast for best results"
6. Press Enter

### Expected Results:
- ✅ Reply appears in thread
- ✅ Toast notification shows success
- ✅ Message shows on right side (own message)
- ✅ Student's message shows on left side
- ✅ Timestamps visible

---

## Test 6: Edit Message (Within 5 Minutes)

### Steps:
1. Immediately after sending a message (Test 4 or 5)
2. Look for "Edit" button under your message
3. Click "Edit"
4. Change the text
5. Click "Save"

### Expected Results:
- ✅ Edit button visible (only for own messages)
- ✅ Textarea appears with current text
- ✅ Character count shows
- ✅ Cancel and Save buttons visible
- ✅ Message updates after save
- ✅ "edited" indicator appears
- ✅ Toast notification shows success

### Test Variations:
- Try editing after 5 minutes (button should disappear)
- Try canceling edit
- Try exceeding character limit

---

## Test 7: Real-time Message Updates

### Steps:
1. Open two browser windows side by side
2. Log in as **student** in window 1
3. Log in as **counsellor** in window 2
4. Navigate both to the same prescription detail page
5. Send a message from window 1
6. Watch window 2

### Expected Results:
- ✅ Message appears in window 2 automatically
- ✅ No page refresh needed
- ✅ Message appears within 1-2 seconds

---

## Test 8: Unread Message Badges

### Steps:
1. Log in as **student**
2. Have counsellor send a message (from another browser)
3. Navigate to `/student/prescriptions`
4. Look for unread badge on prescription card

### Expected Results:
- ✅ Blue badge with number appears
- ✅ Number matches unread count
- ✅ Badge disappears after viewing messages

---

## Test 9: Edit Prescription (Within 24 Hours)

### Steps:
1. Log in as **counsellor**
2. Navigate to prescription detail page
3. Click "Edit" button (only visible within 24 hours)
4. Change dosage to "100mg"
5. Click "Save Changes"

### Expected Results:
- ✅ Edit button visible (within 24 hours)
- ✅ Modal opens with pre-filled form
- ✅ All fields editable
- ✅ Toast notification shows success
- ✅ Changes reflected immediately
- ✅ Updated timestamp changes

### Test Variations:
- Try editing after 24 hours (button should be hidden)
- Try canceling edit
- Try invalid data

---

## Test 10: Delete Prescription (Within 24 Hours)

### Steps:
1. Log in as **counsellor**
2. Navigate to prescription detail page
3. Click "Delete" button
4. Confirm deletion

### Expected Results:
- ✅ Delete button visible (within 24 hours)
- ✅ Confirmation dialog appears
- ✅ Toast notification shows success
- ✅ Redirects back to list
- ✅ Prescription no longer visible

### Test Variations:
- Try deleting prescription with messages (should fail)
- Try canceling deletion

---

## Test 11: Send Prescription Suggestion

### Steps:
1. Log in as **counsellor**
2. Navigate to `/counsellor/prescriptions/[studentId]`
3. Click "Send Suggestion" button
4. Fill in:
   - Medication Name: "Sertraline"
   - Suggested Dosage: "100mg (increased from 50mg)"
   - Reason: "Patient showing good tolerance, increase for better efficacy"
5. Click "Send Suggestion"

### Expected Results:
- ✅ Modal opens
- ✅ Form validates
- ✅ Toast notification shows success
- ✅ Suggestion appears in list with yellow "Suggestion" badge
- ✅ Student can see suggestion

---

## Test 12: Search Prescriptions

### Steps:
1. Log in as **student**
2. Navigate to `/student/prescriptions`
3. Type "Sertraline" in search box
4. Wait for results

### Expected Results:
- ✅ Results filter as you type
- ✅ Only matching prescriptions show
- ✅ Empty state if no matches
- ✅ Clear search to see all again

---

## Test 13: Filter by Date Range

### Steps:
1. Log in as **student**
2. Navigate to `/student/prescriptions`
3. Select "Last 7 Days" from dropdown
4. Verify results

### Expected Results:
- ✅ Only prescriptions from last 7 days show
- ✅ Try other ranges (30d, 90d, all)
- ✅ Results update immediately

---

## Test 14: Pagination

### Steps:
1. Create 25+ prescriptions (or use existing data)
2. Log in as **student**
3. Navigate to `/student/prescriptions`
4. Scroll to bottom

### Expected Results:
- ✅ Shows "Showing 1 to 20 of X prescriptions"
- ✅ "Next" button visible
- ✅ Click "Next" to see page 2
- ✅ "Previous" button works
- ✅ Page number updates

---

## Test 15: Meeting Link Generation

### Steps:
1. Create a session with start time 10 minutes from now
2. Log in as **student** or **counsellor**
3. Navigate to session page (wherever MeetingLink component is used)
4. Wait until 15 minutes before session

### Expected Results:
- ✅ Countdown timer shows before access window
- ✅ "Generate Meeting Link" button appears at access time
- ✅ Click button to generate link
- ✅ "Join Video Session" button appears
- ✅ Clicking opens Jitsi in new tab
- ✅ Link expires 2 hours after session

---

## Test 16: Toast Notifications

### Steps:
1. Perform any action (create, edit, delete, send message)
2. Watch top-right corner

### Expected Results:
- ✅ Toast appears with appropriate message
- ✅ Green for success
- ✅ Red for error
- ✅ Blue for info
- ✅ Auto-dismisses after 3 seconds
- ✅ Can manually close with X button

---

## Test 17: Form Validation

### Steps:
1. Try creating prescription with:
   - Empty medication name
   - 201 character medication name
   - Empty dosage
   - Empty duration
   - 2001 character notes

### Expected Results:
- ✅ Error messages appear
- ✅ Form doesn't submit
- ✅ Error clears when you start typing
- ✅ Character count turns red when over limit

---

## Test 18: Responsive Design

### Steps:
1. Open any page
2. Resize browser window
3. Try mobile size (375px)
4. Try tablet size (768px)
5. Try desktop size (1920px)

### Expected Results:
- ✅ Layout adapts to screen size
- ✅ No horizontal scrolling
- ✅ Buttons stack on mobile
- ✅ Text remains readable
- ✅ Forms work on all sizes

---

## Test 19: Keyboard Navigation

### Steps:
1. Open prescription form
2. Use Tab key to navigate
3. Use Enter to submit
4. Use Escape to close modals

### Expected Results:
- ✅ Tab moves between fields
- ✅ Focus visible
- ✅ Enter submits forms
- ✅ Shift+Enter adds new line in textarea
- ✅ Escape closes modals

---

## Test 20: Error Handling

### Steps:
1. Disconnect internet
2. Try sending a message
3. Reconnect internet
4. Try again

### Expected Results:
- ✅ Error message shows
- ✅ Toast notification shows error
- ✅ Retry button available
- ✅ Works after reconnecting

---

## Security Tests

### Test 21: Access Control

**Student Access:**
1. Log in as student
2. Try accessing `/counsellor/prescriptions/[studentId]`

**Expected:** Should be blocked or show error

**Counsellor Access:**
1. Log in as counsellor from College A
2. Try accessing student from College B

**Expected:** Should not see prescriptions (RLS blocks)

### Test 22: Time Windows

**Edit Window:**
1. Create prescription
2. Wait 24 hours
3. Try to edit

**Expected:** Edit button should be hidden

**Message Edit:**
1. Send message
2. Wait 5 minutes
3. Try to edit

**Expected:** Edit button should disappear

---

## Performance Tests

### Test 23: Load Time

1. Navigate to `/student/prescriptions`
2. Measure load time

**Expected:** Page loads in < 2 seconds

### Test 24: Real-time Latency

1. Send message from one browser
2. Measure time until it appears in another

**Expected:** Message appears in < 2 seconds

---

## Bug Report Template

If you find a bug, report it with:

```
**Bug Title:** [Short description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[If applicable]

**Browser:** [Chrome/Firefox/Safari]
**Device:** [Desktop/Mobile/Tablet]
**User Role:** [Student/Counsellor]
```

---

## Test Results Summary

After completing all tests, fill this out:

```
Total Tests: 24
Passed: __
Failed: __
Blocked: __

Critical Issues: __
Major Issues: __
Minor Issues: __

Ready for Production: Yes / No
```

---

## Next Steps After Testing

1. ✅ Fix any bugs found
2. ✅ Re-test failed scenarios
3. ✅ Get user acceptance sign-off
4. ✅ Deploy to staging
5. ✅ Final smoke test
6. ✅ Deploy to production

---

**Happy Testing! 🧪**

