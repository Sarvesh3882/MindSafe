# Project Cleanup Plan

## Summary
Found **200+ MD and SQL files** in the project. Many are temporary debug/diagnostic files from development.

---

## 📁 KEEP - Essential Documentation (17 files)

### Core Documentation
- ✅ `README.md` - Project overview
- ✅ `MindSafe_India_PRD_v2.md` - Latest product requirements
- ✅ `AGENTS.md` - AI agents documentation
- ✅ `PROJECT_STATUS_FINAL.md` - Final status report (just created)

### Feature Documentation
- ✅ `RESOURCES_SECTION_COMPLETE.md` - Resources feature complete guide
- ✅ `PRESCRIPTION_VISIBILITY_FIX.md` - Prescription fix documentation
- ✅ `TEST_PRESCRIPTION_FEATURE.md` - Testing guide for prescriptions
- ✅ `REPLACE_MISTRAL_API_KEY.md` - API key replacement guide
- ✅ `FIX_CHAT_FETCH_ERROR.md` - Chat troubleshooting

### Supabase Documentation
- ✅ `supabase/QUICK_START.md` - Database setup guide
- ✅ `supabase/SETUP_NAAC_STORAGE.md` - Storage setup

### Brand & Design
- ✅ `MindSafe_India_BRAND.md` - Brand guidelines
- ✅ `MindSafe_India_UIUX.md` - UI/UX guidelines
- ✅ `ILLUSTRATION_MAPPING.md` - Illustration usage
- ✅ `ILLUSTRATION_SOURCES.md` - Illustration credits

### Testing & Guides
- ✅ `TESTING_GUIDE.md` - General testing guide
- ✅ `FEATURE_LOCATIONS_GUIDE.md` - Feature locations

---

## 📁 KEEP - Database Files (Important)

### Migrations (31 files - ALL KEEP)
- ✅ `supabase/migrations/*.sql` - All 31 migration files (001-031)

### Seed Data (11 files - ALL KEEP)
- ✅ `supabase/seed_*.sql` - All seed files for assessment questions
- ✅ `supabase/run_all_seeds.sql`
- ✅ `supabase/run_all_seeds_supabase.sql`

### Diagnostic SQL (KEEP for troubleshooting)
- ✅ `DIAGNOSE_PRESCRIPTION_ISSUE.sql` - Prescription diagnostics
- ✅ `TEST_PRESCRIPTION_FLOW.sql` - Prescription testing
- ✅ `CHECK_PRESCRIPTIONS.sql` - Check prescriptions
- ✅ `VERIFY_RESOURCES.sql` - Verify resources

---

## 🗑️ DELETE - Temporary Debug Files (50+ files)

### Admin Dashboard Debug Files
- ❌ `ADMIN_DASHBOARD_ALL_FIXES_SUMMARY.md`
- ❌ `ADMIN_DASHBOARD_COMPLETE.md`
- ❌ `ADMIN_DASHBOARD_IMPLEMENTATION_STATUS.md`
- ❌ `ADMIN_DASHBOARD_OPTIMIZATION_COMPLETE.md`
- ❌ `ADMIN_DASHBOARD_SIMPLIFICATION_COMPLETE.md`
- ❌ `ADMIN_DATA_FIX_COMPLETE.md`
- ❌ `ALL_ADMIN_ERRORS_FIXED.md`
- ❌ `COMPLETE_ADMIN_DASHBOARD_FIX.md`
- ❌ `FINAL_ADMIN_FIXES_COMPLETE.md`

### Admin SQL Debug Files
- ❌ `CHECK_ADMIN_COLLEGE_ID.sql`
- ❌ `CHECK_AND_FIX_ADMIN_COLLEGE.sql`
- ❌ `CHECK_ASSESSMENT_DATA.sql`
- ❌ `FIX_ADMIN_COLLEGE_ID.sql`
- ❌ `FIX_ADMIN_COLLEGE_FINAL.sql`
- ❌ `VERIFY_DASHBOARD_DATA.sql`
- ❌ `DEBUG_TREND_DATA.sql`
- ❌ `SIMPLE_DEBUG.sql`
- ❌ `FIX_ASSESSMENT_RLS.sql`
- ❌ `TEST_ADMIN_ACCESS.sql`
- ❌ `FINAL_CHECK.sql`
- ❌ `CHECK_COMPLETED_ASSESSMENTS.sql`
- ❌ `MARK_ALL_COMPLETED.sql`
- ❌ `FINAL_DIAGNOSIS.sql`
- ❌ `SHOW_ALL_DATA_COMPLETE.sql`
- ❌ `SHOW_ALL_DATA.sql`

### College/Data Cleanup Debug Files
- ❌ `SWITCH_TO_REAL_COLLEGE.sql`
- ❌ `DIAGNOSE_DUPLICATE_COLLEGES.sql`
- ❌ `CLEANUP_DUPLICATES.sql`
- ❌ `FIX_DUPLICATE_COLLEGES.sql`
- ❌ `EXECUTE_CLEANUP.sql`
- ❌ `CHECK_SCHEMA.sql`
- ❌ `SIMPLE_CLEANUP_CHECK.sql`
- ❌ `VERIFY_CLEANUP_SUCCESS.sql`
- ❌ `DUPLICATE_COLLEGE_FIX_GUIDE.md`
- ❌ `HOW_TO_CLEANUP.md`
- ❌ `CLEANUP_SUMMARY.md`
- ❌ `CLEANUP_FAILED_SIGNUP.sql`
- ❌ `CLEANUP_SPECIFIC_EMAIL.sql`
- ❌ `CLEANUP_TEST_DATA.sql`
- ❌ `PREVENT_DUPLICATE_COLLEGES.md`

### Migration Application Guides (Temporary)
- ❌ `APPLY_MIGRATION_007.md`
- ❌ `APPLY_MIGRATION_011.md`
- ❌ `APPLY_MIGRATION_012.md`
- ❌ `APPLY_MIGRATION_013.md`
- ❌ `APPLY_MIGRATION_014.md`
- ❌ `APPLY_MIGRATION_026.md`
- ❌ `APPLY_PRESCRIPTION_MIGRATIONS.md`
- ❌ `APPLY_PRESCRIPTION_RLS_FIX.md`
- ❌ `APPLY_STORAGE_BUCKET_MIGRATION.md`
- ❌ `APPLY_ALL_RLS_FIXES.md`
- ❌ `MIGRATION_FAQ.md`
- ❌ `CLEANUP_DUPLICATE_MIGRATIONS.md`

### ARIA Assessment Debug Files
- ❌ `ARIA_2.0_STATUS.md`
- ❌ `ARIA_2.0_TEST_PLAN.md`
- ❌ `ARIA_FIXES_COMPLETE.md`
- ❌ `ARIA_FLOW_TEST_RESULTS.md`
- ❌ `CRITICAL_ASSESSMENT_FIXES.md`
- ❌ `supabase/ARIA_2.0_SETUP.md`

### Prescription System Debug Files (Keep only final docs)
- ❌ `PRESCRIPTION_DETAIL_404_FIX.md`
- ❌ `PRESCRIPTION_ERROR_EXPLAINED.md`
- ❌ `PRESCRIPTION_FEATURE_COMPLETE.md`
- ❌ `PRESCRIPTION_FEATURES_ADDED.md`
- ❌ `PRESCRIPTION_FINAL_STATUS.md`
- ❌ `PRESCRIPTION_FIXES_APPLIED.md`
- ❌ `PRESCRIPTION_FRONTEND_COMPLETE.md`
- ❌ `PRESCRIPTION_IMPLEMENTATION_COMPLETE.md`
- ❌ `PRESCRIPTION_MESSAGES_REALTIME_FIX.md`
- ❌ `PRESCRIPTION_MESSAGES_SEND_FIX.md`
- ❌ `PRESCRIPTION_NEXTJS15_FIX.md`
- ❌ `PRESCRIPTION_QUERY_PARAMS_FIX.md`
- ❌ `PRESCRIPTION_QUICK_START.md`
- ❌ `PRESCRIPTION_SUGGESTION_COMPLETE.md`
- ❌ `PRESCRIPTION_SUGGESTION_FIX.md`
- ❌ `PRESCRIPTION_SYSTEM_COMPLETE.md`
- ❌ `PRESCRIPTION_SYSTEM_FIX.md`
- ❌ `PRESCRIPTION_SYSTEM_PROGRESS.md`
- ❌ `PRESCRIPTION_SYSTEM_SUMMARY.md`
- ❌ `PRESCRIPTION_TESTING_GUIDE.md`
- ❌ `PRESCRIPTION_TROUBLESHOOTING.md`
- ❌ `PRESCRIPTION_ACCESS_GUIDE.md`
- ❌ `PRESCRIBED_RESOURCES_SEPARATED.md`
- ❌ `QUICK_FIX_PRESCRIPTIONS.sql`
- ❌ `CREATE_TEST_PRESCRIPTION.sql`
- ❌ `FIX_PRESCRIPTION_RLS.md`
- ❌ `TEST_PRESCRIPTION_VISIBILITY.md`
- ❌ `TROUBLESHOOT_PRESCRIBED_RESOURCES.md`

### Resources Debug Files (Keep only final doc)
- ❌ `RESOURCES_COMPLETE_SUMMARY.md`
- ❌ `RESOURCES_FINAL_VERSION.md`
- ❌ `RESOURCES_FIX_COMPLETE.md`
- ❌ `RESOURCES_FIX_SUMMARY.md`
- ❌ `RESOURCES_PAGE_IMPROVEMENTS.md`
- ❌ `RESOURCES_QUICK_GUIDE.md`
- ❌ `RESOURCES_REDESIGN_COMPLETE.md`
- ❌ `RESOURCES_SECTION_FIX.md`
- ❌ `FIX_RESOURCES_RLS.md`
- ❌ `CHECK_RESOURCES_SCHEMA.sql`

### Dashboard/UI Debug Files
- ❌ `DASHBOARD_ANIMATIONS_FINAL.md`
- ❌ `DASHBOARD_DESIGN_MOCKUP.md`
- ❌ `DASHBOARD_IMPLEMENTATION_CHECKLIST.md`
- ❌ `DASHBOARD_PERFORMANCE_OPTIMIZATION.md`
- ❌ `FINAL_DASHBOARD_CLEANUP.md`
- ❌ `STUDENT_DASHBOARD_FIXES.md`
- ❌ `STUDENT_DASHBOARD_FIXES_SUMMARY.md`
- ❌ `STUDENT_DASHBOARD_UX_IMPROVEMENTS.md`
- ❌ `COUNSELLOR_DASHBOARD_CHANGES.md`
- ❌ `COUNSELLOR_DASHBOARD_REDESIGN.md`
- ❌ `COUNSELLOR_CLINICAL_DASHBOARD.md`

### Chat/Saathi Debug Files
- ❌ `CHAT_PAGE_FINAL.md`
- ❌ `CHAT_PAGE_IMPROVEMENTS.md`

### Session/Meeting Debug Files
- ❌ `DEBUG_BOOKING_ISSUE.sql`
- ❌ `SESSION_NOTES_FIX.md`
- ❌ `SESSION_NOTES_HISTORY_FEATURE.md`
- ❌ `SESSION_STATUS_FIX.md`
- ❌ `SESSION_SUMMARY.md`
- ❌ `SESSIONS_PAGE_IMPROVEMENTS.md`
- ❌ `VIDEO_MEETING_FLICKERING_FIX.md`
- ❌ `VIDEO_MEETING_GUIDE.md`
- ❌ `VIDEO_MEETING_INTEGRATION_COMPLETE.md`
- ❌ `VIDEO_MEETING_SUCCESS.md`
- ❌ `VIDEO_MEETING_TEST_PLAN.md`
- ❌ `VIDEO_MEETING_VISUAL_GUIDE.md`
- ❌ `SIMPLE_VIDEO_CALL_FIX.md`
- ❌ `SIMPLE_VIDEO_MEETING_SOLUTION.md`
- ❌ `INSTANT_MEETING_FEATURE.md`
- ❌ `NEXT_STEPS_VIDEO_MEETING.md`
- ❌ `REALTIME_MEETING_SYNC.md`
- ❌ `REALTIME_SYNC_FIX.md`
- ❌ `TEST_REALTIME_SYNC.md`
- ❌ `SYNC_FIX_COMPLETE.md`

### Check-in Debug Files
- ❌ `CHECKIN_GATING_FIX.md`
- ❌ `CHECKIN_GATING_IMPLEMENTATION.md`
- ❌ `CHECKIN_PAGE_IMPROVEMENTS.md`

### Progress/Wellness Debug Files
- ❌ `PROGRESS_SIMPLIFICATION_COMPLETE.md`
- ❌ `WELLNESS_GRAPHS_FIXED.md`
- ❌ `WELLNESS_TIPS_DYNAMIC.md`
- ❌ `WELLNESS_TIPS_EXPANSION.md`
- ❌ `WELLNESS_TIPS_TEST_GUIDE.md`
- ❌ `WELLNESS_TIPS_TEST_RESULTS.md`
- ❌ `WELLNESS_TIPS_VERIFICATION.md`
- ❌ `MOOD_TIMELINE_FIX.md`
- ❌ `MOOD_TIMELINE_VERIFICATION.md`

### Loading/Performance Debug Files
- ❌ `LOADING_SKELETONS_ADDED.md`
- ❌ `STUDENT_LOADING_SKELETONS_ADDED.md`
- ❌ `PERFORMANCE_ANALYSIS.md`
- ❌ `PERFORMANCE_OPTIMIZATION_APPLIED.md`

### Error Fix Debug Files
- ❌ `CLEAR_HYDRATION_ERRORS.md`
- ❌ `FIX_HYDRATION_NOW.md`
- ❌ `FLICKERING_FIX_SUMMARY.md`
- ❌ `FIX_NO_TREND_DATA.md`
- ❌ `FIX_ONBOARDING_ERROR.md`
- ❌ `STUDENT_NOT_FOUND_FIX.md`
- ❌ `SECTION_HEADING_FIX.md`
- ❌ `SIDEBAR_IMPROVEMENTS.md`
- ❌ `INSTRUMENT_CONFIG_FIX.md`
- ❌ `POLLING_FALLBACK_FIX.md`
- ❌ `RAZORPAY_MODAL_FIX.md`
- ❌ `REPORTS_SECTION_FIX.md`

### Email Debug Files
- ❌ `EMAIL_FIX_FINAL.md`
- ❌ `EMAIL_TROUBLESHOOTING.md`
- ❌ `QUICK_EMAIL_FIX.md`

### Counsellor Visibility Debug Files
- ❌ `COUNSELLOR_VISIBILITY_FIX_SUMMARY.md`
- ❌ `QUICK_FIX_COUNSELLOR_VISIBILITY.md`
- ❌ `DEBUG_COUNSELLOR_VISIBILITY.sql`

### NAAC Debug Files
- ❌ `NAAC_REPORTS_IMPLEMENTATION_COMPLETE.md`
- ❌ `QUICK_FIX_EVIDENCE_UPLOAD.md`
- ❌ `CREATE_BUCKET_MANUALLY.md`
- ❌ `CREATE_STORAGE_POLICIES.sql`

### Phase/Implementation Status Files
- ❌ `ALL_FEATURES_ACCESSIBLE.md`
- ❌ `ALL_PHASES_COMPLETE.md`
- ❌ `PHASE_1_IMPLEMENTATION_COMPLETE.md`
- ❌ `PHASE_2_IMPLEMENTATION_COMPLETE.md`
- ❌ `PHASE_4_CHATBOT_CONTEXT_COMPLETE.md`
- ❌ `PHASE_6_SESSION_VERIFICATION_COMPLETE.md`
- ❌ `IMPLEMENTATION_COMPLETE.md`
- ❌ `IMPLEMENTATION_COMPLETE_SUMMARY.md`
- ❌ `PRD_V2_COMPLETION_REPORT.md`
- ❌ `CODE_AUDIT_COMPLETE.md`
- ❌ `FINAL_STATUS_SUMMARY.md`
- ❌ `PROJECT_STATUS_COMPLETE.md`
- ❌ `READY_TO_TEST.md`

### Test Results Files
- ❌ `TEST_RESULTS.md`
- ❌ `TYPE_CHECK_RESULTS.md`

### Miscellaneous Debug Files
- ❌ `CLAUDE.md`
- ❌ `PROJECT_CONTEXT.md`
- ❌ `START_HERE.md`
- ❌ `QUICK_REFERENCE.md`
- ❌ `QUICK_FIX_GUIDE.md`
- ❌ `ULTRA_SIMPLE_FIX.md`
- ❌ `COMPLETE_SYSTEM_GUIDE.md`
- ❌ `HERO_BANNER_FINAL.md`
- ❌ `HERO_BANNER_IMPROVEMENTS.md`
- ❌ `TRIAGE_EXPANSION.md`
- ❌ `CHECK_CURRENT_STATE.sql`
- ❌ `CHECK_MIGRATION_STATUS.sql`
- ❌ `CHECK_RLS_POLICY_DETAILS.sql`
- ❌ `CREATE_SAMPLE_ASSESSMENTS.sql`

### Old PRD (Keep v2, delete v1)
- ❌ `MindSafe_India_PRD.md` (v1 - superseded by v2)

---

## 📊 Cleanup Summary

### Files to KEEP: ~60 files
- Core documentation: 17
- Database migrations: 31
- Seed data: 11
- Essential diagnostic SQL: 4

### Files to DELETE: ~140 files
- Temporary debug MD files: ~120
- Temporary debug SQL files: ~20

### Space Saved: Estimated 5-10 MB

---

## ⚠️ Before Deleting

**IMPORTANT**: Create a backup folder first!

```bash
# Create backup folder
mkdir BACKUP_DEBUG_FILES

# Move files to backup instead of deleting
# (in case you need them later)
```

---

## 🎯 Recommended Action

**Option 1: Safe Cleanup (Recommended)**
- Move all debug files to `BACKUP_DEBUG_FILES/` folder
- Keep for 1-2 weeks
- Delete backup folder after confirming everything works

**Option 2: Aggressive Cleanup**
- Delete all debug files immediately
- Keep only the 60 essential files listed above

**Option 3: Archive**
- Create a ZIP archive of all debug files
- Store archive outside project
- Delete files from project

---

## 📝 Next Steps

1. Review this list
2. Confirm which files to delete
3. I'll execute the cleanup
4. Verify project still builds successfully

**Ready to proceed?** Let me know which option you prefer!
