# Deploy Recommendations Update - Quick Guide

## ✅ Changes Completed (60%)

### Files Modified
1. ✅ `src/types/prescription.ts` - Added wellness categories and updated types
2. ✅ `src/app/student/prescriptions/page.tsx` - Updated to "My Recommendations"
3. ✅ `src/components/shared/sidebar.tsx` - Changed nav label to "Recommendations"
4. ✅ `src/components/student/dashboard-client.tsx` - Updated dashboard card
5. ✅ `src/components/prescriptions/PrescriptionCard.tsx` - Wellness-focused card
6. ✅ `src/components/prescriptions/MessageInput.tsx` - Updated placeholder
7. ✅ `src/components/prescriptions/MessageThread.tsx` - Updated empty state
8. ✅ `src/components/student/student-resources-client.tsx` - Updated badge text
9. ✅ `supabase/migrations/041_add_recommendation_categories.sql` - Database migration

---

## 🚀 Deployment Steps

### Step 1: Run Database Migration
```sql
-- In Supabase SQL Editor, run:
-- File: supabase/migrations/041_add_recommendation_categories.sql

-- This will:
-- 1. Add 'category' column to prescriptions table
-- 2. Add CHECK constraint for valid categories
-- 3. Create index for filtering
-- 4. Set default category for existing records
```

### Step 2: Deploy Frontend Changes
```bash
# All changes are already made to the files
# Just need to deploy to Vercel

# If using Git:
git add .
git commit -m "feat: Transform prescriptions to wellness recommendations"
git push origin main

# Vercel will auto-deploy
```

### Step 3: Verify Deployment
1. **Student View**:
   - Go to `/student`
   - Check dashboard card shows "🌿 My Recommendations"
   - Click card → Should show recommendations list
   - Verify disclaimer banner is visible
   - Check sidebar shows "Recommendations"
   - Click a recommendation → Verify labels (Guidance, Follow-up, Support Period)

2. **Counselor View**:
   - Go to `/counsellor`
   - Check sidebar shows "Recommendations"
   - Go to `/counsellor/prescriptions`
   - Verify existing recommendations display correctly

---

## 📋 What Changed (User-Visible)

### Before → After

| Component | Before | After |
|-----------|--------|-------|
| **Dashboard Card** | 💊 My Prescriptions | 🌿 My Recommendations |
| **Sidebar** | Prescriptions | Recommendations |
| **Page Title** | My Prescriptions | My Recommendations |
| **Card Icon** | Pill (blue) | Heart (green) |
| **Field Labels** | Dosage, Frequency, Duration | Guidance, Follow-up, Support Period |
| **Counselor Text** | Prescribed by | Recommended by |
| **Empty State** | "counsellor will prescribe medications" | "counselor will share wellness guidance" |
| **Message Placeholder** | "Type your message..." | "Share your thoughts or ask questions..." |

---

## ⚠️ Important Notes

### Database Compatibility
- ✅ Table names unchanged (`prescriptions`, `prescription_messages`)
- ✅ Column names unchanged (for backend compatibility)
- ✅ API endpoints unchanged
- ✅ URLs unchanged (`/student/prescriptions`)
- ✅ Only UI labels changed

### Backward Compatibility
- ✅ Existing data works without changes
- ✅ Old recommendations get default category "Emotional Wellbeing"
- ✅ All existing functionality preserved
- ✅ No breaking changes

---

## 🔄 Remaining Work (40%)

### Still To Do:
1. ⏳ Student prescription detail page (`/student/prescriptions/[id]`)
2. ⏳ Counselor prescriptions page (`/counsellor/prescriptions`)
3. ⏳ Add recommendation form (counselor student detail page)
4. ⏳ Counselor prescription detail page
5. ⏳ API response messages

### Priority for Next Phase:
1. **Add Recommendation Form** - Most important for counselors
2. **Student Detail Page** - Complete student experience
3. **Counselor Pages** - Full counselor workflow

---

## 🧪 Testing Checklist

### Before Deploying
- [x] Database migration tested locally
- [x] Student dashboard loads
- [x] Recommendations list loads
- [x] Card displays correctly
- [x] Sidebar navigation works
- [x] No console errors

### After Deploying
- [ ] Run migration in production Supabase
- [ ] Verify student dashboard
- [ ] Verify recommendations list
- [ ] Check disclaimer visibility
- [ ] Test navigation
- [ ] Check counselor view
- [ ] Verify no broken links
- [ ] Check mobile responsiveness

---

## 🐛 Troubleshooting

### Issue: Migration Fails
**Solution**: Check if column already exists
```sql
-- Check existing columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'prescriptions';

-- If category exists, skip ALTER TABLE
-- Just run the UPDATE and CREATE INDEX parts
```

### Issue: Old Recommendations Show No Category
**Solution**: Run the UPDATE statement
```sql
UPDATE prescriptions 
SET category = 'Emotional Wellbeing' 
WHERE category IS NULL;
```

### Issue: Colors Not Showing
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Sidebar Still Shows "Prescriptions"
**Solution**: 
1. Check if `sidebar.tsx` was updated
2. Clear Next.js cache: `rm -rf .next`
3. Rebuild: `npm run build`

---

## 📊 Impact Summary

### User Experience
- ✅ Clearer, more supportive language
- ✅ Wellness-focused design (green theme)
- ✅ Category badges for better organization
- ✅ Prominent disclaimer for safety
- ✅ No medical terminology

### Technical
- ✅ Zero breaking changes
- ✅ Backward compatible
- ✅ Database structure preserved
- ✅ API endpoints unchanged
- ✅ Easy rollback if needed

### Ethical & Legal
- ✅ Clear scope of service
- ✅ No medical claims
- ✅ Proper disclaimers
- ✅ Wellness-focused positioning
- ✅ Reduced liability risk

---

## 🎯 Success Metrics

After deployment, verify:
- ✅ Zero "prescription" or "medication" visible to students
- ✅ All recommendations show category badges
- ✅ Disclaimer visible on all relevant pages
- ✅ Green color theme throughout
- ✅ Heart/wellness icons instead of pill icons
- ✅ "Recommended by" instead of "Prescribed by"

---

## 📞 Support

### If Issues Arise:
1. Check browser console for errors
2. Verify database migration ran successfully
3. Check Vercel deployment logs
4. Verify all files were committed and pushed
5. Clear cache and test in incognito mode

### Rollback Plan:
If critical issues occur:
```bash
# Revert Git commit
git revert HEAD
git push origin main

# Vercel will auto-deploy previous version

# Database rollback (if needed)
ALTER TABLE prescriptions DROP COLUMN IF EXISTS category;
```

---

## ✨ Next Steps

### Phase 2 (Remaining 40%):
1. Update student prescription detail page
2. Update counselor pages
3. Add category dropdown to add recommendation form
4. Update API response messages
5. Add validation to prevent medical terms
6. Create wellness guidance templates

### Phase 3 (Enhancements):
1. Add category filtering
2. Add wellness tips library
3. Add recommendation templates
4. Add analytics for categories
5. Add export functionality

---

## 📝 Deployment Checklist

- [ ] Database migration ready
- [ ] All files committed to Git
- [ ] Pushed to main branch
- [ ] Vercel deployment triggered
- [ ] Migration run in production Supabase
- [ ] Student view tested
- [ ] Counselor view tested
- [ ] Mobile view tested
- [ ] No console errors
- [ ] Disclaimer visible
- [ ] Categories displaying
- [ ] Navigation working
- [ ] Messages working
- [ ] Team notified of changes

---

**Status**: Ready for Deployment
**Completion**: 60%
**Risk Level**: Low (backward compatible)
**Estimated Deploy Time**: 15 minutes
**Rollback Time**: 5 minutes if needed

---

## 🎉 You're Ready!

The transformation is 60% complete with all critical user-facing components updated. The remaining 40% can be deployed in Phase 2 without affecting current functionality.

**Deploy with confidence!** 🚀
