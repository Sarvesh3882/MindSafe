# 🚀 Prescription System - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Apply Migrations (2 minutes)
```sql
-- In Supabase SQL Editor, run these in order:
-- 1. supabase/migrations/014_create_prescriptions_table.sql
-- 2. supabase/migrations/015_create_prescription_messages_table.sql
-- 3. supabase/migrations/016_create_prescription_audit_log.sql
-- 4. supabase/migrations/017_extend_sessions_for_meeting_links.sql
-- 5. supabase/migrations/018_create_prescription_functions.sql
-- 6. supabase/migrations/019_prescriptions_rls_policies.sql
-- 7. supabase/migrations/020_prescription_messages_rls_policies.sql
-- 8. supabase/migrations/021_audit_log_and_sessions_rls.sql
```

### Step 2: Start Server (1 minute)
```bash
npm run dev
```

### Step 3: Test (2 minutes)

**As Counsellor:**
1. Go to `/counsellor/prescriptions/[studentId]`
2. Click "New Prescription"
3. Fill form and submit
4. ✅ See toast notification

**As Student:**
1. Go to `/student/prescriptions`
2. Click prescription card
3. Send a message
4. ✅ See message appear

---

## 📍 Key URLs

| User | Page | URL |
|------|------|-----|
| Student | List | `/student/prescriptions` |
| Student | Detail | `/student/prescriptions/[id]` |
| Counsellor | List | `/counsellor/prescriptions/[studentId]` |
| Counsellor | Detail | `/counsellor/prescriptions/detail/[id]` |

---

## 🎯 Core Features

### Students Can:
- ✅ View prescriptions
- ✅ Search & filter
- ✅ Send messages
- ✅ Edit messages (5 min)
- ✅ See unread badges
- ✅ View meeting links

### Counsellors Can:
- ✅ Create prescriptions
- ✅ Edit prescriptions (24 hrs)
- ✅ Delete prescriptions (24 hrs)
- ✅ Send suggestions
- ✅ Reply to messages
- ✅ Edit messages (5 min)

---

## 🔧 Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase
- **Database:** PostgreSQL (Supabase)
- **Real-time:** Supabase Realtime
- **Video:** Jitsi Meet
- **Icons:** Lucide React
- **Validation:** Zod

---

## 📊 Database Schema

### Tables:
- `prescriptions` - Treatment prescriptions
- `prescription_messages` - Messages between student/counsellor
- `prescription_audit_log` - Change history
- `sessions` - Extended with meeting link columns

### Functions:
- `get_unread_prescription_messages_count()`
- `mark_prescription_messages_read()`
- `generate_meeting_link_for_session()`
- `can_access_meeting_link()`

---

## 🎨 Components

| Component | Purpose |
|-----------|---------|
| `PrescriptionCard` | Display prescription in list |
| `PrescriptionForm` | Create new prescription |
| `PrescriptionEditForm` | Edit existing prescription |
| `PrescriptionSuggestionForm` | Send dosage suggestion |
| `MessageThread` | Display message conversation |
| `MessageInput` | Send messages |
| `MeetingLink` | Video meeting links |
| `Toast` | Notifications |

---

## 🔒 Security

- ✅ Row Level Security (RLS)
- ✅ College-based isolation
- ✅ Role-based access
- ✅ Time-based restrictions
- ✅ Input validation
- ✅ Audit logging

---

## 🐛 Troubleshooting

### Prescriptions not loading?
1. Check browser console
2. Verify user authenticated
3. Check RLS policies active

### Messages not sending?
1. Check character count (1-2000)
2. Verify prescription access
3. Check API response

### Real-time not working?
1. Verify Supabase Realtime enabled
2. Check channel subscription
3. Check RLS policies

---

## 📚 Documentation

- `PRESCRIPTION_SYSTEM_COMPLETE.md` - Full documentation
- `PRESCRIPTION_TESTING_GUIDE.md` - 24 test scenarios
- `PRESCRIPTION_IMPLEMENTATION_SUMMARY.md` - Implementation details

---

## ✅ Quick Test

```bash
# 1. Create prescription (counsellor)
# 2. View prescription (student)
# 3. Send message (student)
# 4. Reply (counsellor)
# 5. Edit message (either)
# ✅ All should work with toast notifications
```

---

## 🎉 You're Ready!

The system is complete and ready to use. Start testing and enjoy! 🚀

**Need help?** Check the full documentation files.

