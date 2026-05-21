# 🚀 ARIA Fix - Quick Reference Card

## ⚡ DO THIS NOW (3 Steps)

```bash
# 1. Stop server (Ctrl+C), then:
rmdir /s /q .next
npm run dev

# 2. Clear browser cache (Ctrl+Shift+R)

# 3. Test with console open (F12)
```

---

## 🔍 What to Watch in Console

### ✅ GOOD (Working):
```
=== TRIAGE COMPLETE ===
Assessment Queue: ["phq9", "gad7"]

=== ANSWER RECEIVED ===
New score for depression: 2
All scores: { depression: 2, anxiety: 0, ... }

=== RENDERING WELLNESS SUMMARY ===
Scores: { depression: 12, anxiety: 8, ... }
```

### ❌ BAD (Broken):
- Scores stay at 0
- No console logs
- "You're all set" appears immediately

---

## 🐛 If Scores Stay at 0

Run this in Supabase SQL Editor:

```sql
UPDATE questions SET maps_to = '{"depression": 1}'::jsonb WHERE instrument = 'phq9';
UPDATE questions SET maps_to = '{"anxiety": 1}'::jsonb WHERE instrument = 'gad7';
UPDATE questions SET maps_to = '{"stress": 1}'::jsonb WHERE instrument = 'pss10';
```

---

## 📚 Full Documentation

1. **START HERE:** `ARIA_QUICK_START.md`
2. **If broken:** `ARIA_DEBUG_INSTRUCTIONS.md`
3. **Complete guide:** `ARIA_COMPLETE_FIX_REPORT.md`

---

## ✅ Success = Different Tips for Different Tests

**Low scores:** Gentle tips (sleep, exercise)
**Moderate scores:** Grounding techniques, breathing
**High scores:** Professional support, crisis resources

---

## 🆘 Still Broken?

1. Screenshot console logs
2. Check Supabase `questions` table → `maps_to` column
3. Share screenshot with me
