# Quick Start: Deploy Recommendations Update

## 🚀 Deploy in 3 Steps (15 minutes)

### Step 1: Database Migration (2 min)
1. Open Supabase Dashboard → SQL Editor
2. Copy and run: `supabase/migrations/041_add_recommendation_categories.sql`
3. Verify: `SELECT category, COUNT(*) FROM prescriptions GROUP BY category;`

### Step 2: Deploy Code (5 min)
```bash
git add .
git commit -m "feat: Transform prescriptions to wellness recommendations"
git push origin main
```
Vercel will auto-deploy.

### Step 3: Verify (8 min)
1. Go to your site `/student`
2. Check dashboard shows "🌿 My Recommendations"
3. Click → Verify disclaimer banner visible
4. Check sidebar shows "Recommendations"
5. Click a recommendation → Verify labels (Guidance, Follow-up, Support Period)

**Done!** ✅

---

## 📋 What Changed

| Component | Old | New |
|-----------|-----|-----|
| Dashboard | 💊 My Prescriptions | 🌿 My Recommendations |
| Sidebar | Prescriptions | Recommendations |
| Labels | Dosage, Frequency | Guidance, Follow-up |
| Colors | Blue | Green |
| Text | "prescribed medications" | "wellness guidance" |

---

## ✅ What's Included

### Files Modified (9)
1. Type definitions
2. Student prescriptions page
3. Prescription card
4. Dashboard card
5. Sidebar navigation
6. Message components
7. Resources page
8. Database migration

### Features Added
- ✅ Wellness categories (7 types)
- ✅ Category badges with colors
- ✅ Safety disclaimer banner
- ✅ Green wellness theme
- ✅ Heart icons
- ✅ Supportive language

---

## 🔒 Safety

- ✅ Zero breaking changes
- ✅ Backward compatible
- ✅ Easy rollback
- ✅ No downtime
- ✅ Existing data works

---

## 🐛 Troubleshooting

**Issue**: Migration fails
**Fix**: Column might exist, skip ALTER TABLE part

**Issue**: Old text still showing
**Fix**: Hard refresh (Ctrl+Shift+R)

**Issue**: Sidebar not updated
**Fix**: Clear `.next` folder, rebuild

---

## 📞 Need Help?

Check these files:
- `DEPLOY_RECOMMENDATIONS_UPDATE.md` - Detailed deployment guide
- `RECOMMENDATIONS_SUMMARY.md` - Complete overview
- `RECOMMENDATIONS_TRANSFORMATION_COMPLETE.md` - Full documentation

---

## 🎯 Success Checklist

After deployment:
- [ ] Dashboard card shows "My Recommendations"
- [ ] Sidebar shows "Recommendations"
- [ ] Disclaimer banner visible
- [ ] Category badges showing
- [ ] Green color theme
- [ ] Heart icons (not pills)
- [ ] "Recommended by" (not "Prescribed by")
- [ ] No medical terminology visible

---

**Status**: Ready to Deploy
**Time**: 15 minutes
**Risk**: Low
**Rollback**: 5 minutes if needed

**Let's go!** 🚀
