-- Verify resources were populated correctly

-- 1. Check total count (should be 35)
SELECT COUNT(*) as total_resources FROM resources;

-- 2. Check breakdown by category
SELECT 
  category,
  COUNT(*) as count
FROM resources
GROUP BY category
ORDER BY category;

-- 3. Check breakdown by type
SELECT 
  type,
  COUNT(*) as count
FROM resources
GROUP BY type
ORDER BY type;

-- 4. Sample resources from each category
SELECT 
  category,
  title,
  type,
  duration,
  CASE WHEN url IS NOT NULL THEN 'Yes' ELSE 'No' END as has_url,
  CASE WHEN content IS NOT NULL THEN 'Yes' ELSE 'No' END as has_content
FROM resources
ORDER BY category, title
LIMIT 10;

-- 5. Check for any missing data
SELECT 
  COUNT(*) as total,
  COUNT(title) as has_title,
  COUNT(type) as has_type,
  COUNT(category) as has_category,
  COUNT(url) as has_url,
  COUNT(content) as has_content,
  COUNT(duration) as has_duration
FROM resources;

SELECT '✅ Resources verification complete!' as status;
