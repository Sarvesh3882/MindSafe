# Apply Migration 011 — Chat Sessions

Run this in your Supabase SQL editor to enable chat history:

```sql
-- Copy contents of: supabase/migrations/011_chat_sessions.sql
```

Or run via CLI:
```bash
supabase db push
```

## What this adds
- `chat_sessions` table — stores named sessions per user
- `session_id` column on `chat_messages` — links messages to sessions
- RLS policies — users can only see/delete their own sessions
- Auto-trigger — updates `updated_at` on session when a message is added
