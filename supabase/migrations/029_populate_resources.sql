-- Populate Resources Table with Mental Health Content
-- Comprehensive library of evidence-based mental wellness resources

-- Clear existing demo data if any
DELETE FROM resources;

-- STRESS MANAGEMENT RESOURCES
INSERT INTO resources (title, type, category, duration, url, content) VALUES
('5-Minute Box Breathing Exercise', 'breathing', 'Stress', '5 min', 'https://www.youtube.com/watch?v=tEmt1Znux58', 'Simple breathing technique to reduce stress and anxiety instantly. Breathe in for 4, hold for 4, out for 4, hold for 4.'),
('Progressive Muscle Relaxation Guide', 'exercise', 'Stress', '15 min', 'https://www.anxietycanada.com/articles/progressive-muscle-relaxation/', 'Systematic tension and relaxation of muscle groups to release physical stress and promote calmness.'),
('How to Deal with Exam Pressure', 'article', 'Stress', '6 min read', 'https://www.mindtools.com/pages/article/managing-exam-stress.htm', 'Evidence-based strategies for managing academic stress and performing better under pressure.'),
('Stress Management for Students', 'video', 'Stress', '12 min', 'https://www.youtube.com/watch?v=0fL-pn80s-c', 'Practical stress management techniques specifically designed for college students.'),
('4-7-8 Breathing Technique', 'breathing', 'Stress', '3 min', 'https://www.healthline.com/health/4-7-8-breathing', 'Dr. Andrew Weil''s relaxation breathing technique to calm the nervous system quickly.');

-- SLEEP RESOURCES
INSERT INTO resources (title, type, category, duration, url, content) VALUES
('Body Scan Meditation for Sleep', 'meditation', 'Sleep', '20 min', 'https://www.youtube.com/watch?v=15q-N-_kkrU', 'Guided body scan meditation to help you fall asleep naturally and peacefully.'),
('Sleep Hygiene: 10 Tips for Better Rest', 'article', 'Sleep', '8 min read', 'https://www.sleepfoundation.org/sleep-hygiene', 'Science-backed sleep hygiene practices to improve sleep quality and duration.'),
('Yoga Nidra for Deep Sleep', 'meditation', 'Sleep', '30 min', 'https://www.youtube.com/watch?v=M0u9GST_j3s', 'Ancient yogic sleep meditation technique for profound relaxation and restorative rest.'),
('Understanding Your Sleep Cycle', 'article', 'Sleep', '5 min read', 'https://www.sleepfoundation.org/stages-of-sleep', 'Learn about sleep stages and how to optimize your sleep schedule for better rest.'),
('White Noise for Sleep', 'meditation', 'Sleep', '60 min', 'https://www.youtube.com/watch?v=nMfPqeZjc2c', 'Calming white noise to mask distractions and promote deep, uninterrupted sleep.');

-- ANXIETY MANAGEMENT RESOURCES
INSERT INTO resources (title, type, category, duration, url, content) VALUES
('5-4-3-2-1 Grounding Technique', 'exercise', 'Anxiety', '5 min', 'https://www.urmc.rochester.edu/behavioral-health-partners/bhp-blog/april-2018/5-4-3-2-1-coping-technique-for-anxiety.aspx', 'Powerful grounding exercise to manage anxiety and panic attacks using your five senses.'),
('Journaling for Anxiety Relief', 'exercise', 'Anxiety', '15 min', 'https://www.psychologytoday.com/us/blog/shyness-is-nice/201404/how-keep-thought-diary-combat-anxiety', 'Structured journaling techniques to process anxious thoughts and reduce worry.'),
('Understanding Anxiety', 'video', 'Anxiety', '10 min', 'https://www.youtube.com/watch?v=jryCoo0BrRk', 'Educational video explaining what anxiety is and how to manage it effectively.'),
('Mindfulness for Anxiety', 'meditation', 'Anxiety', '10 min', 'https://www.youtube.com/watch?v=ZToicYcHIOU', 'Guided mindfulness meditation specifically designed to reduce anxiety and worry.'),
('Cognitive Restructuring for Anxiety', 'article', 'Anxiety', '7 min read', 'https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Anxiety', 'Learn to identify and challenge anxious thoughts using CBT techniques.');

-- FOCUS & PRODUCTIVITY RESOURCES
INSERT INTO resources (title, type, category, duration, url, content) VALUES
('Understanding Your Emotions', 'video', 'Focus', '12 min', 'https://www.youtube.com/watch?v=h-rRgpPbR5w', 'Learn emotional intelligence and how to manage your feelings effectively.'),
('Pomodoro Technique for Students', 'article', 'Focus', '5 min read', 'https://todoist.com/productivity-methods/pomodoro-technique', 'Time management method to improve focus and productivity while studying.'),
('Mindful Study Break Exercises', 'exercise', 'Focus', '10 min', 'https://www.mindful.org/take-a-mindful-moment-5-simple-practices-for-daily-life/', 'Quick mindfulness exercises to refresh your mind during study sessions.'),
('Overcoming Procrastination', 'article', 'Focus', '8 min read', 'https://www.psychologytoday.com/us/basics/procrastination', 'Evidence-based strategies to overcome procrastination and boost motivation.'),
('Focus Music for Studying', 'meditation', 'Focus', '60 min', 'https://www.youtube.com/watch?v=jfKfPfyJRdk', 'Concentration-enhancing background music for deep focus and productivity.');

-- RELATIONSHIPS & SOCIAL WELLNESS
INSERT INTO resources (title, type, category, duration, url, content) VALUES
('Building Meaningful Connections', 'article', 'Relationships', '10 min read', 'https://www.helpguide.org/articles/relationships-communication/making-good-friends.htm', 'How to build and maintain healthy friendships in college.'),
('Effective Communication Skills', 'video', 'Relationships', '15 min', 'https://www.youtube.com/watch?v=eIho2S0ZahI', 'Learn assertive communication techniques for better relationships.'),
('Setting Healthy Boundaries', 'article', 'Relationships', '7 min read', 'https://www.psychologytoday.com/us/blog/communication-success/201510/7-powerful-benefits-healthy-boundaries', 'Why boundaries matter and how to set them in relationships.'),
('Dealing with Loneliness', 'article', 'Relationships', '6 min read', 'https://www.mind.org.uk/information-support/tips-for-everyday-living/loneliness/', 'Practical strategies to cope with loneliness and build social connections.'),
('Conflict Resolution Skills', 'video', 'Relationships', '12 min', 'https://www.youtube.com/watch?v=KY5TWVz5ZDU', 'Learn healthy ways to resolve conflicts and disagreements.');

-- GENERAL WELLNESS & SELF-CARE
INSERT INTO resources (title, type, category, duration, url, content) VALUES
('Morning Meditation Routine', 'meditation', 'Focus', '10 min', 'https://www.youtube.com/watch?v=inpok4MKVLM', 'Start your day with clarity and calm through guided morning meditation.'),
('Self-Compassion Practice', 'exercise', 'Focus', '8 min', 'https://self-compassion.org/category/exercises/', 'Learn to treat yourself with kindness and understanding during difficult times.'),
('Gratitude Journaling', 'exercise', 'Focus', '10 min', 'https://positivepsychology.com/gratitude-journal/', 'Daily gratitude practice to boost mood and overall well-being.'),
('Gentle Yoga for Stress Relief', 'exercise', 'Stress', '20 min', 'https://www.youtube.com/watch?v=COp7BR_Dvps', 'Gentle yoga sequence to release tension and promote relaxation.'),
('Mental Health First Aid', 'article', 'Focus', '15 min read', 'https://www.mhanational.org/mental-health-first-aid', 'Learn how to support yourself and others during mental health challenges.');

-- Verify insertion
SELECT 
  category,
  COUNT(*) as resource_count
FROM resources
GROUP BY category
ORDER BY category;

SELECT 'Resources populated successfully!' as status, COUNT(*) as total_resources FROM resources;
