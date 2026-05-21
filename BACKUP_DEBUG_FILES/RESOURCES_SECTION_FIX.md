# Resources Section Fix - Complete Guide

## Problem

The Resources section in both Student and Counsellor dashboards is showing demo/placeholder data instead of real mental health resources.

## Solution

Populate the `resources` table with 35+ evidence-based mental health resources across 5 categories.

## Step 1: Apply the Migration

### Option A: Using Supabase Dashboard (Recommended)
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/029_populate_resources.sql`
5. Click **Run** or press `Ctrl+Enter`
6. Verify success message: "Resources populated successfully! 35 total_resources"

### Option B: Using Supabase CLI
```bash
# In your project directory
supabase db push

# Or apply specific migration
supabase migration up 029_populate_resources
```

## Step 2: Verify Resources

Run this query in Supabase SQL Editor to verify:

```sql
-- Check resources by category
SELECT 
  category,
  COUNT(*) as count,
  STRING_AGG(title, ', ') as titles
FROM resources
GROUP BY category
ORDER BY category;

-- Check total count
SELECT COUNT(*) as total_resources FROM resources;
```

Expected output:
- **Anxiety**: 5 resources
- **Focus**: 9 resources
- **Relationships**: 5 resources
- **Sleep**: 5 resources
- **Stress**: 11 resources
- **Total**: 35 resources

## What's Included

### 📚 Resource Categories

#### 1. **Stress Management** (11 resources)
- Box Breathing Exercise
- Progressive Muscle Relaxation
- Exam Pressure Management
- 4-7-8 Breathing Technique
- Gentle Yoga
- And more...

#### 2. **Sleep** (5 resources)
- Body Scan Meditation
- Sleep Hygiene Tips
- Yoga Nidra
- White Noise
- Sleep Cycle Education

#### 3. **Anxiety** (5 resources)
- 5-4-3-2-1 Grounding Technique
- Anxiety Journaling
- Mindfulness Meditation
- Cognitive Restructuring
- Understanding Anxiety

#### 4. **Focus & Productivity** (9 resources)
- Emotional Intelligence
- Pomodoro Technique
- Study Break Exercises
- Procrastination Strategies
- Focus Music
- Self-Compassion
- Gratitude Journaling
- And more...

#### 5. **Relationships** (5 resources)
- Building Connections
- Communication Skills
- Setting Boundaries
- Dealing with Loneliness
- Conflict Resolution

### 📝 Resource Types

- **🎥 Videos**: Educational and guided practice videos
- **📖 Articles**: Evidence-based reading materials
- **🏃 Exercises**: Practical activities and techniques
- **🧘 Meditations**: Guided meditation and relaxation
- **💨 Breathing**: Breathing exercises for quick relief

## Features After Fix

### Student Dashboard - Resources Page
✅ **Personalized Recommendations**
- Based on latest ARIA assessment scores
- Clinical thresholds for each category
- Top 3-5 relevant resources shown first

✅ **Smart Filtering**
- Filter by category (All, Stress, Sleep, Anxiety, Focus, Relationships)
- Filter by type (video, article, exercise, meditation, breathing)
- Search by title

✅ **Resource Cards**
- Title, type emoji, category badge
- Duration/reading time
- Description
- Direct links to content

### Counsellor Dashboard - Resources Page
✅ **Prescribe to Students**
- View all resources
- Prescribe specific resources to students
- Track which resources are assigned

✅ **Resource Library**
- Same comprehensive library as students
- Organized by category
- Quick prescribe button on each card

## Personalization Logic

The student resources page uses ARIA assessment scores to recommend relevant resources:

### Clinical Thresholds Used:
- **Stress (PSS-10)**: ≥18 → Stress resources
- **Anxiety (GAD-7)**: ≥10 → Anxiety resources
- **Depression (PHQ-9)**: ≥10 → Focus resources (behavioral activation)
- **Sleep (ISI)**: ≥14 → Sleep resources
- **Burnout (Maslach)**: ≥66 → Stress resources
- **Loneliness (UCLA)**: ≥40 → Relationships resources

If no concerns detected, shows top 3 popular resources.

## Testing

### Test Student Resources
1. Login as a student
2. Navigate to **Resources** page
3. Verify:
   - Resources load (not demo data)
   - Categories work
   - Type filters work
   - Search works
   - Resource cards show proper info
   - Links open correctly

### Test Counsellor Resources
1. Login as a counsellor
2. Navigate to **Resources** page
3. Verify:
   - All resources visible
   - Prescribe button works
   - Can select students
   - Resources organized by category

### Test Personalization
1. Complete a check-in as a student
2. Score high on stress (e.g., answer "Very Often" to stress questions)
3. Go to Resources page
4. Verify stress-related resources appear in recommendations

## Troubleshooting

### Issue: Still seeing demo data
**Solution**: 
- Clear browser cache (Ctrl+Shift+R)
- Verify migration ran successfully
- Check Supabase logs for errors

### Issue: Resources not loading
**Solution**:
- Check RLS policies on `resources` table
- Verify table has data: `SELECT COUNT(*) FROM resources;`
- Check browser console for errors

### Issue: Personalization not working
**Solution**:
- Verify student has completed at least one assessment
- Check assessment has `scores` field populated
- Verify scores are in correct format

## RLS Policies

The resources table should have these RLS policies:

```sql
-- Allow everyone to read resources
CREATE POLICY "Resources are viewable by authenticated users"
ON resources FOR SELECT
TO authenticated
USING (true);

-- Allow admins to manage resources
CREATE POLICY "Admins can manage resources"
ON resources FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

## Future Enhancements

### Possible Additions:
1. **Resource Ratings**: Let students rate resources
2. **Completion Tracking**: Track which resources students have used
3. **Custom Resources**: Allow counsellors to add college-specific resources
4. **Resource Collections**: Curated playlists for specific issues
5. **Offline Access**: Download resources for offline use
6. **Multi-language**: Resources in regional languages

## Summary

✅ **35 evidence-based resources** added
✅ **5 categories** covered (Stress, Sleep, Anxiety, Focus, Relationships)
✅ **5 resource types** (video, article, exercise, meditation, breathing)
✅ **Personalized recommendations** based on ARIA scores
✅ **Counsellor prescribe** functionality ready
✅ **Real URLs** to trusted mental health sources

The Resources section is now fully functional with real, helpful content for students! 🎉
