# MindSafe India - Complete Technical Architecture

## 📐 Architecture Overview for Diagram Creation

This document contains all technical details needed to create a comprehensive architecture diagram.

---

## 1. SYSTEM ARCHITECTURE LAYERS

### Layer 1: Client Layer (Frontend)
- **Technology**: Next.js 14 (App Router)
- **Rendering**: Server-Side Rendering (SSR) + Client-Side Rendering (CSR)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks (useState, useEffect, useContext)
- **Animations**: Framer Motion
- **Charts**: Recharts library
- **HTTP Client**: Fetch API (native)
- **WebSocket Client**: Supabase Realtime client

### Layer 2: API Layer (Backend)
- **Framework**: Next.js API Routes (serverless functions)
- **Runtime**: Node.js 18+
- **Authentication**: Supabase Auth (JWT tokens)
- **Authorization**: Row Level Security (RLS) policies
- **API Pattern**: RESTful endpoints
- **Response Format**: JSON

### Layer 3: Database Layer
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Supabase JavaScript client
- **Real-time**: Supabase Realtime (WebSocket)
- **Storage**: Supabase Storage (for files)
- **Security**: Row Level Security (RLS)
- **Migrations**: SQL migration files

### Layer 4: External Services Layer
- **AI Chatbot**: Mistral API (mistral-small-latest)
- **Video Calls**: Jitsi Meet (self-hosted/public)
- **SMS Alerts**: Twilio API
- **Email**: Resend API
- **Payments**: Razorpay API

### Layer 5: Deployment Layer
- **Hosting**: Vercel (serverless)
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain (DNS)
- **SSL**: Automatic HTTPS (Vercel)
- **CI/CD**: GitHub → Vercel auto-deploy

---

## 2. DETAILED COMPONENT ARCHITECTURE

### 2.1 Frontend Architecture

#### Directory Structure
```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   ├── student/page.tsx
│   │   │   └── counsellor/page.tsx
│   │   └── signup/
│   │       ├── student/page.tsx
│   │       └── counsellor/page.tsx
│   ├── student/                  # Student dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── checkin/page.tsx
│   │   ├── sessions/
│   │   │   ├── page.tsx
│   │   │   └── book/page.tsx
│   │   ├── prescriptions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── resources/page.tsx
│   │   └── chat/page.tsx
│   ├── counsellor/               # Counsellor dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── students/page.tsx
│   │   ├── sessions/page.tsx
│   │   ├── prescriptions/
│   │   │   ├── page.tsx
│   │   │   ├── [studentId]/page.tsx
│   │   │   └── detail/[id]/page.tsx
│   │   └── resources/page.tsx
│   ├── admin/                    # Admin dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── users/page.tsx
│   │   └── resources/page.tsx
│   └── api/                      # API routes
│       ├── assessments/
│       ├── sessions/
│       ├── prescriptions/
│       ├── prescription-messages/
│       ├── meetings/
│       └── chat/
├── components/                   # React components
│   ├── student/
│   ├── counsellor/
│   ├── admin/
│   ├── shared/
│   └── ui/
├── lib/                          # Utilities
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── aria/
│   │   ├── engine.ts
│   │   ├── insights.ts
│   │   └── types.ts
│   └── utils.ts
└── types/                        # TypeScript types
    └── index.ts
```


#### Key React Components (50+ total)

**Shared Components:**
- `Sidebar` - Navigation menu (role-based)
- `Toast` - Notification system
- `Modal` - Dialog boxes
- `Button` - Reusable button component
- `Input` - Form input fields
- `Select` - Dropdown selects
- `Card` - Content containers

**Student Components:**
- `EmotionTiles` - Daily check-in interface
- `AssessmentQuestion` - ARIA question display
- `ProgressStreak` - Gamification counter
- `SessionCard` - Upcoming session display
- `PrescriptionCard` - Prescription summary
- `FloatingChatButton` - AI chatbot trigger
- `ResourceCard` - Wellness resource display

**Counsellor Components:**
- `TriageList` - Priority student list
- `StudentCard` - Student summary card
- `RiskBadge` - Color-coded risk indicator
- `SessionCalendar` - Appointment calendar
- `PrescriptionForm` - Create prescription form
- `PrescriptionEditForm` - Edit prescription modal
- `MessageThread` - Conversation display
- `MessageInput` - Send message input
- `MeetingLink` - Video meeting link generator

**Admin Components:**
- `WellnessChart` - Campus health visualization
- `DepartmentBreakdown` - Department-wise stats
- `CounsellorUtilization` - Resource metrics
- `CrisisAlertPanel` - Critical case monitoring
- `NAACReportGenerator` - Compliance report tool

---

## 3. DATABASE ARCHITECTURE

### 3.1 Database Schema (PostgreSQL)

#### Table: `colleges`
```sql
id              UUID PRIMARY KEY
name            TEXT NOT NULL
plan_tier       TEXT (basic/growth/enterprise)
active          BOOLEAN DEFAULT true
onboarded_at    TIMESTAMPTZ
logo_url        TEXT
max_students    INTEGER DEFAULT 500
contact_email   TEXT
city            TEXT
state           TEXT
```

#### Table: `users`
```sql
id              UUID PRIMARY KEY (FK: auth.users)
email           TEXT NOT NULL UNIQUE
role            TEXT (student/counsellor/admin)
college_id      UUID (FK: colleges)
full_name       TEXT NOT NULL
phone           TEXT
guardian_phone  TEXT
department      TEXT
year            INTEGER
avatar_url      TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### Table: `questions`
```sql
id              UUID PRIMARY KEY
question        TEXT NOT NULL
category        TEXT (depression/anxiety/stress/sleep/burnout/loneliness/substance)
severity        TEXT (low/medium/high)
maps_to         JSONB (e.g., {"depression": 1})
options         JSONB (array of {label, value, emoji})
times_asked     INTEGER DEFAULT 0
created_at      TIMESTAMPTZ DEFAULT NOW()
```


#### Table: `assessments`
```sql
id                  UUID PRIMARY KEY
user_id             UUID (FK: users) NOT NULL
date                DATE NOT NULL DEFAULT CURRENT_DATE
scores              JSONB (e.g., {"depression":5,"anxiety":3,...})
risk_level          TEXT (stable/attention/critical)
questions_asked     UUID[] (array of question IDs)
emotion             TEXT
completed           BOOLEAN DEFAULT false
created_at          TIMESTAMPTZ DEFAULT NOW()
UNIQUE(user_id, date)
```

#### Table: `sessions`
```sql
id                  UUID PRIMARY KEY
student_id          UUID (FK: users) NOT NULL
counsellor_id       UUID (FK: users) NOT NULL
date                DATE NOT NULL
time                TIME NOT NULL
type                TEXT (online/offline)
status              TEXT (scheduled/completed/cancelled/no_show)
notes               TEXT
meeting_link        TEXT
link_generated_at   TIMESTAMPTZ
link_expires_at     TIMESTAMPTZ
created_at          TIMESTAMPTZ DEFAULT NOW()
```

#### Table: `prescriptions`
```sql
id                  UUID PRIMARY KEY
student_id          UUID (FK: users) NOT NULL
counsellor_id       UUID (FK: users) NOT NULL
medication_name     TEXT NOT NULL
dosage              TEXT NOT NULL
frequency           TEXT NOT NULL
duration            TEXT NOT NULL
notes               TEXT
wellness_tips       TEXT
is_suggestion       BOOLEAN DEFAULT false
is_deleted          BOOLEAN DEFAULT false
created_at          TIMESTAMPTZ DEFAULT NOW()
updated_at          TIMESTAMPTZ DEFAULT NOW()
```

#### Table: `prescription_messages`
```sql
id                  UUID PRIMARY KEY
prescription_id     UUID (FK: prescriptions) NOT NULL
sender_id           UUID (FK: users) NOT NULL
sender_role         TEXT (student/counsellor)
message_text        TEXT NOT NULL
is_read             BOOLEAN DEFAULT false
is_edited           BOOLEAN DEFAULT false
created_at          TIMESTAMPTZ DEFAULT NOW()
updated_at          TIMESTAMPTZ DEFAULT NOW()
```

#### Table: `prescription_audit_log`
```sql
id                  UUID PRIMARY KEY
prescription_id     UUID (FK: prescriptions) NOT NULL
changed_by          UUID (FK: users) NOT NULL
action              TEXT (created/updated/deleted)
old_values          JSONB
new_values          JSONB
changed_at          TIMESTAMPTZ DEFAULT NOW()
```

#### Table: `alerts`
```sql
id                  UUID PRIMARY KEY
student_id          UUID (FK: users) NOT NULL
counsellor_id       UUID (FK: users)
type                TEXT (score_spike/crisis_keyword/consecutive_bad_days/missed_session)
triggered_at        TIMESTAMPTZ DEFAULT NOW()
resolved            BOOLEAN DEFAULT false
resolved_at         TIMESTAMPTZ
notes               TEXT
```

#### Table: `resources`
```sql
id                  UUID PRIMARY KEY
title               TEXT NOT NULL
type                TEXT (video/article/exercise/meditation/breathing)
category            TEXT NOT NULL
url                 TEXT
content             TEXT
college_id          UUID (FK: colleges)
thumbnail           TEXT
duration            TEXT
created_at          TIMESTAMPTZ DEFAULT NOW()
```

#### Table: `chat_messages`
```sql
id                  UUID PRIMARY KEY
user_id             UUID (FK: users) NOT NULL
role                TEXT (user/assistant)
content             TEXT NOT NULL
created_at          TIMESTAMPTZ DEFAULT NOW()
```


### 3.2 Database Functions

#### Function: `get_user_role()`
```sql
RETURNS TEXT
Returns the role of the currently authenticated user
Used by RLS policies for authorization
```

#### Function: `get_user_college()`
```sql
RETURNS UUID
Returns the college_id of the currently authenticated user
Used by RLS policies for data isolation
```

#### Function: `get_unread_prescription_messages_count()`
```sql
RETURNS INTEGER
Counts unread messages for the current user
Used for badge notifications
```

#### Function: `mark_prescription_messages_as_read(prescription_id UUID)`
```sql
RETURNS VOID
Marks all messages in a prescription thread as read
Called when user opens prescription detail page
```

### 3.3 Row Level Security (RLS) Policies

#### Users Table Policies
1. **"Users can read own profile"**
   - SELECT: `id = auth.uid()`
2. **"Counsellors can read students in their college"**
   - SELECT: `get_user_role() = 'counsellor' AND college_id = get_user_college()`
3. **"Admins can read users in their college"**
   - SELECT: `get_user_role() = 'admin' AND college_id = get_user_college()`
4. **"Users can update own profile"**
   - UPDATE: `id = auth.uid()`

#### Assessments Table Policies
1. **"Students can read own assessments"**
   - SELECT: `user_id = auth.uid()`
2. **"Students can insert own assessments"**
   - INSERT: `user_id = auth.uid()`
3. **"Students can update own assessments"**
   - UPDATE: `user_id = auth.uid()`
4. **"Counsellors can read student assessments in their college"**
   - SELECT: `get_user_role() = 'counsellor' AND EXISTS (SELECT 1 FROM users WHERE id = assessments.user_id AND college_id = get_user_college())`

#### Sessions Table Policies
1. **"Students can read own sessions"**
   - SELECT: `student_id = auth.uid()`
2. **"Counsellors can read/write their sessions"**
   - ALL: `counsellor_id = auth.uid() OR student_id = auth.uid()`

#### Prescriptions Table Policies
1. **"Students can read own prescriptions"**
   - SELECT: `student_id = auth.uid()`
2. **"Counsellors can manage prescriptions for their students"**
   - ALL: `counsellor_id = auth.uid()`

#### Prescription Messages Table Policies
1. **"Users can read messages for their prescriptions"**
   - SELECT: `sender_id = auth.uid() OR prescription_id IN (SELECT id FROM prescriptions WHERE student_id = auth.uid() OR counsellor_id = auth.uid())`
2. **"Users can send messages for their prescriptions"**
   - INSERT: `sender_id = auth.uid()`

#### Alerts Table Policies
1. **"Counsellors can read alerts in their college"**
   - SELECT: `get_user_role() IN ('counsellor', 'admin')`
2. **"System can insert alerts"**
   - INSERT: `true`
3. **"Counsellors can update alerts"**
   - UPDATE: `get_user_role() = 'counsellor'`

#### Questions Table Policies
1. **"Authenticated users can read questions"**
   - SELECT: `auth.uid() IS NOT NULL`

#### Resources Table Policies
1. **"Authenticated users can read resources"**
   - SELECT: `auth.uid() IS NOT NULL`
2. **"Admins can manage resources"**
   - ALL: `get_user_role() = 'admin'`

#### Chat Messages Table Policies
1. **"Users can read own chat messages"**
   - SELECT: `user_id = auth.uid()`
2. **"Users can insert own chat messages"**
   - INSERT: `user_id = auth.uid()`


---

## 4. API ARCHITECTURE

### 4.1 API Endpoints (20+ total)

#### Assessment APIs
```
POST   /api/assessments/submit
       Body: { emotion, answers, scores }
       Returns: { assessment_id, risk_level }

GET    /api/assessments/history
       Query: ?user_id=UUID&limit=30
       Returns: { assessments: [...] }
```

#### Session APIs
```
POST   /api/sessions/book
       Body: { counsellor_id, date, time, type, reason }
       Returns: { session_id, confirmation }

GET    /api/sessions/my-sessions
       Query: ?role=student&status=scheduled
       Returns: { sessions: [...] }

PATCH  /api/sessions/[id]/status
       Body: { status, notes }
       Returns: { success: true }
```

#### Prescription APIs
```
POST   /api/prescriptions/create
       Body: { student_id, medication_name, dosage, frequency, duration, notes, wellness_tips }
       Returns: { prescription_id }

POST   /api/prescriptions/suggest
       Body: { student_id, medication_name, dosage, notes }
       Returns: { suggestion_id }

GET    /api/prescriptions/my-prescriptions
       Query: ?role=student
       Returns: { prescriptions: [...] }

GET    /api/prescriptions/student/[studentId]
       Returns: { prescriptions: [...] }

PATCH  /api/prescriptions/[id]
       Body: { dosage, frequency, duration, notes, wellness_tips }
       Returns: { success: true }

DELETE /api/prescriptions/[id]
       Returns: { success: true }

GET    /api/prescriptions/history/[studentId]
       Returns: { prescriptions: [...], audit_log: [...] }
```

#### Prescription Message APIs
```
POST   /api/prescription-messages/send
       Body: { prescription_id, message_text }
       Returns: { message_id }

GET    /api/prescription-messages/[prescriptionId]
       Returns: { messages: [...] }

PATCH  /api/prescription-messages/edit/[id]
       Body: { message_text }
       Returns: { success: true }

GET    /api/prescription-messages/unread-count
       Returns: { count: 5 }
```

#### Meeting APIs
```
POST   /api/meetings/generate
       Body: { session_id }
       Returns: { meeting_link, expires_at }

GET    /api/meetings/session/[sessionId]
       Returns: { meeting_link, status }

POST   /api/meetings/cleanup
       Returns: { cleaned_count }
```

#### Chat APIs
```
POST   /api/chat/send
       Body: { message, context }
       Returns: { response, suggestions }

GET    /api/chat/history
       Returns: { messages: [...] }
```

#### User APIs
```
GET    /api/users/profile
       Returns: { user: {...} }

PATCH  /api/users/profile
       Body: { full_name, phone, department, year }
       Returns: { success: true }
```


### 4.2 API Request/Response Flow

```
Client (Browser)
    ↓ HTTP Request (with JWT token in header)
Next.js API Route (/api/*)
    ↓ Validate JWT token
    ↓ Extract user_id from token
Supabase Client (with user context)
    ↓ Execute query with RLS
PostgreSQL Database
    ↓ Apply RLS policies
    ↓ Return filtered data
Supabase Client
    ↓ Format response
Next.js API Route
    ↓ Return JSON response
Client (Browser)
    ↓ Update UI
```

### 4.3 Authentication Flow

```
User enters credentials
    ↓
POST /api/auth/login (Supabase Auth)
    ↓
Supabase validates credentials
    ↓
Returns JWT token + refresh token
    ↓
Client stores tokens in cookies
    ↓
Subsequent requests include JWT in Authorization header
    ↓
Middleware validates JWT on each request
    ↓
If valid: proceed to route
If invalid: redirect to /login
```

---

## 5. ARIA ASSESSMENT ENGINE ARCHITECTURE

### 5.1 ARIA Algorithm Flow

```
User opens app
    ↓
Display emotion tiles (6 options)
    ↓
User taps emotion (e.g., 😔)
    ↓
ARIA Engine: buildAssessmentQueue()
    ↓
Analyze triage signals:
  - Emotion severity
  - Recent assessment history
  - Consecutive bad days
    ↓
Determine assessment instruments:
  - Baseline: PHQ-9 + GAD-7 (always)
  - If high triage: + PSS-10, ISI, UCLA, etc.
    ↓
Select questions from question bank
    ↓
Display questions one by one
    ↓
User answers (tap/slider)
    ↓
ARIA Engine: accumulateScore()
    ↓
Map answer to score:
  - maps_to: {"depression": 1}
  - value: 2
  - scores.depression += 2
    ↓
After all questions answered
    ↓
ARIA Engine: classifyRisk()
    ↓
Calculate risk level:
  - Depression ≥15 OR Anxiety ≥15 OR Stress ≥27 → Critical
  - Moderate scores → Attention
  - Low scores → Stable
    ↓
Save assessment to database
    ↓
If Critical: trigger alert
    ↓
ARIA Engine: buildWellnessSummary()
    ↓
Generate personalized tips based on scores
    ↓
Display results to user
```

### 5.2 ARIA Engine Components

#### File: `src/lib/aria/engine.ts`

**Functions:**
- `buildAssessmentQueue(triageResult, recentHistory)` - Determines which instruments to administer
- `accumulateScore(currentScores, answer, question)` - Updates running score totals
- `classifyRisk(finalScores)` - Determines risk level (stable/attention/critical)
- `selectNextQuestion(category, askedQuestions)` - Picks next question from bank

#### File: `src/lib/aria/insights.ts`

**Functions:**
- `buildWellnessSummary(scores, riskLevel)` - Generates personalized wellness tips
- `getRecommendations(category, severity)` - Returns category-specific advice
- `formatScoreDisplay(scores)` - Formats scores for UI display

### 5.3 Question Bank Structure

```json
{
  "id": "uuid",
  "question": "How often have you been feeling down, low, or hopeless?",
  "category": "depression",
  "severity": "medium",
  "maps_to": {"depression": 1},
  "options": [
    {"label": "Not at all", "value": 0, "emoji": "😊"},
    {"label": "A few days", "value": 1, "emoji": "🙂"},
    {"label": "More than half the days", "value": 2, "emoji": "😐"},
    {"label": "Nearly every day", "value": 3, "emoji": "😔"}
  ]
}
```

**Total Questions:** 85+
- PHQ-9: 9 questions (depression)
- GAD-7: 7 questions (anxiety)
- PSS-10: 10 questions (stress)
- ISI: 7 questions (sleep)
- Maslach: 22 questions (burnout)
- UCLA: 20 questions (loneliness)
- AUDIT: 10 questions (substance)


---

## 6. REAL-TIME ARCHITECTURE

### 6.1 Supabase Realtime Implementation

#### Technology
- **Protocol**: WebSocket (via Supabase Realtime)
- **Library**: `@supabase/supabase-js`
- **Sync Speed**: < 500ms
- **Fallback**: 30-second polling if WebSocket fails

#### Use Cases

**1. Meeting Link Sync**
```typescript
// Counsellor generates link
const { data } = await supabase
  .from('sessions')
  .update({ 
    meeting_link: jitsiLink,
    link_generated_at: new Date(),
    link_expires_at: expiryTime
  })
  .eq('id', sessionId);

// Student's page subscribes to changes
const channel = supabase
  .channel(`session-${sessionId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'sessions',
    filter: `id=eq.${sessionId}`
  }, (payload) => {
    setMeetingLink(payload.new.meeting_link);
  })
  .subscribe();
```

**2. Message Updates**
```typescript
// Subscribe to new messages
const channel = supabase
  .channel(`prescription-${prescriptionId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'prescription_messages',
    filter: `prescription_id=eq.${prescriptionId}`
  }, (payload) => {
    setMessages(prev => [...prev, payload.new]);
  })
  .subscribe();
```

**3. Unread Badge Updates**
```typescript
// Subscribe to message read status changes
const channel = supabase
  .channel('unread-messages')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'prescription_messages'
  }, () => {
    refreshUnreadCount();
  })
  .subscribe();
```

### 6.2 Real-time Data Flow

```
User A performs action (e.g., generates meeting link)
    ↓
Client A: Update database via Supabase client
    ↓
PostgreSQL: Row updated
    ↓
Supabase Realtime: Detects change via database triggers
    ↓
Supabase Realtime: Broadcasts change to all subscribed clients
    ↓
Client B: Receives WebSocket message (< 500ms)
    ↓
Client B: Updates UI automatically
    ↓
User B sees change without refresh
```

---

## 7. EXTERNAL SERVICE INTEGRATIONS

### 7.1 Mistral AI (Chatbot)

**Endpoint**: `https://api.mistral.ai/v1/chat/completions`
**Model**: `mistral-small-latest`
**Authentication**: API key in header

**Request Flow:**
```
User sends message
    ↓
POST /api/chat/send
    ↓
Fetch conversation history from database
    ↓
Build context with system prompt + history
    ↓
POST to Mistral API
    ↓
Receive AI response
    ↓
Save message to database
    ↓
Return response to client
```

**System Prompt:**
```
You are ARIA, a compassionate mental health companion for college students.
Provide supportive, non-judgmental responses.
Suggest coping strategies and breathing exercises.
Detect crisis keywords and recommend professional help.
```

### 7.2 Jitsi Meet (Video Calls)

**Type**: Self-hosted or public instance
**URL Pattern**: `https://meet.jit.si/{roomName}`
**Authentication**: None (public rooms)

**Link Generation:**
```typescript
const roomName = `mindsafe-${sessionId}-${timestamp}`;
const meetingLink = `https://meet.jit.si/${roomName}`;
const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

await supabase
  .from('sessions')
  .update({ meeting_link: meetingLink, link_expires_at: expiresAt })
  .eq('id', sessionId);
```

**Cleanup:**
```typescript
// Cron job runs every hour
const expiredSessions = await supabase
  .from('sessions')
  .update({ meeting_link: null })
  .lt('link_expires_at', new Date());
```

### 7.3 Twilio (SMS Alerts)

**Endpoint**: `https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json`
**Authentication**: Account SID + Auth Token

**Crisis Alert Flow:**
```
ARIA detects critical risk
    ↓
Trigger alert in database
    ↓
POST /api/alerts/send-sms
    ↓
Fetch guardian phone from user profile
    ↓
POST to Twilio API
    ↓
SMS sent to guardian
    ↓
Log alert in audit trail
```

**SMS Template:**
```
MindSafe India Alert: Your ward [Student Name] may need support. 
Please contact them or reach out to the college counsellor.
```

### 7.4 Resend (Email)

**Endpoint**: `https://api.resend.com/emails`
**Authentication**: API key in header

**Email Types:**
1. Session confirmation
2. Session reminder (24 hours before)
3. Prescription notification
4. Crisis alert to counsellor

**Email Flow:**
```
Event triggered (e.g., session booked)
    ↓
POST /api/emails/send
    ↓
Build email template
    ↓
POST to Resend API
    ↓
Email sent
    ↓
Log delivery status
```

### 7.5 Razorpay (Payments)

**Endpoint**: `https://api.razorpay.com/v1/`
**Authentication**: Key ID + Key Secret (Basic Auth)

**Payment Flow:**
```
College admin selects plan
    ↓
POST /api/payments/create-order
    ↓
POST to Razorpay: Create order
    ↓
Return order_id to client
    ↓
Client: Open Razorpay checkout
    ↓
User completes payment
    ↓
Razorpay webhook: Payment success
    ↓
POST /api/payments/webhook
    ↓
Verify signature
    ↓
Update college plan_tier in database
    ↓
Send confirmation email
```


---

## 8. DEPLOYMENT ARCHITECTURE

### 8.1 Vercel Deployment

**Platform**: Vercel (serverless)
**Region**: Auto (closest to user)
**Build Command**: `npm run build`
**Output Directory**: `.next`
**Node Version**: 18.x

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_key]
MISTRAL_API_KEY=[mistral_key]
TWILIO_ACCOUNT_SID=[twilio_sid]
TWILIO_AUTH_TOKEN=[twilio_token]
TWILIO_PHONE_NUMBER=[phone]
RESEND_API_KEY=[resend_key]
RAZORPAY_KEY_ID=[razorpay_id]
RAZORPAY_KEY_SECRET=[razorpay_secret]
```

**Deployment Flow:**
```
Developer pushes to GitHub (main branch)
    ↓
GitHub webhook triggers Vercel
    ↓
Vercel: Clone repository
    ↓
Vercel: Install dependencies (npm install)
    ↓
Vercel: Build Next.js app (npm run build)
    ↓
Vercel: Deploy to edge network
    ↓
Vercel: Update DNS (if custom domain)
    ↓
Deployment complete (< 2 minutes)
    ↓
Automatic HTTPS certificate
```

### 8.2 Supabase Hosting

**Platform**: Supabase Cloud
**Region**: ap-south-1 (Mumbai, India)
**Database**: PostgreSQL 15
**Storage**: 1GB free tier → Paid plans

**Services:**
- **Database**: PostgreSQL with RLS
- **Auth**: JWT-based authentication
- **Storage**: File uploads (avatars, resources)
- **Realtime**: WebSocket subscriptions
- **Edge Functions**: Serverless functions (not used currently)

### 8.3 CDN & Edge Network

**Vercel Edge Network:**
- **Global CDN**: 100+ edge locations
- **Static Assets**: Cached at edge
- **Dynamic Routes**: Served from nearest region
- **Cache Strategy**: 
  - Static files: Cache forever
  - API routes: No cache
  - Pages: Incremental Static Regeneration (ISR)

### 8.4 CI/CD Pipeline

```
GitHub Repository (main branch)
    ↓
Push/Merge
    ↓
Vercel Auto-Deploy
    ↓
Build & Test
    ↓
Deploy to Production
    ↓
Health Check
    ↓
Rollback if failed
```

**Rollback Strategy:**
- Vercel keeps previous deployments
- One-click rollback to any previous version
- Zero downtime deployments

---

## 9. SECURITY ARCHITECTURE

### 9.1 Authentication Security

**JWT Tokens:**
- **Algorithm**: HS256
- **Expiry**: 1 hour (access token)
- **Refresh**: 7 days (refresh token)
- **Storage**: HTTP-only cookies (secure)

**Password Security:**
- **Hashing**: bcrypt (via Supabase Auth)
- **Salt Rounds**: 10
- **Min Length**: 8 characters
- **Requirements**: None (user choice)

### 9.2 Authorization Security

**Row Level Security (RLS):**
- Enforced at database level
- Cannot be bypassed by API
- Policies checked on every query
- User context from JWT token

**Role-Based Access Control (RBAC):**
- Student: Own data only
- Counsellor: Students in same college
- Admin: Anonymized aggregates

### 9.3 Data Security

**Encryption:**
- **In Transit**: HTTPS/TLS 1.3
- **At Rest**: PostgreSQL encryption (Supabase)
- **Passwords**: bcrypt hashed
- **Tokens**: JWT signed

**Data Isolation:**
- College-level isolation via `college_id`
- RLS policies enforce boundaries
- No cross-college data access

### 9.4 API Security

**Rate Limiting:**
- Not implemented yet (Phase 1 roadmap)
- Plan: 100 requests/minute per IP

**Input Validation:**
- Zod schemas for API inputs
- SQL injection prevention (parameterized queries)
- XSS prevention (React escaping)

**CORS:**
- Allowed origins: Production domain only
- Credentials: true (cookies)

### 9.5 Audit Trail

**Prescription Audit Log:**
- Every create/update/delete logged
- Immutable records
- Includes old and new values
- Timestamp and user ID

**Session Logs:**
- All session status changes logged
- Meeting link generation tracked
- Counsellor notes timestamped

---

## 10. MONITORING & OBSERVABILITY

### 10.1 Logging

**Vercel Logs:**
- Real-time function logs
- Error tracking
- Performance metrics

**Supabase Logs:**
- Database query logs
- Auth logs
- Realtime connection logs

### 10.2 Error Tracking

**Client-Side:**
- Console errors logged
- Toast notifications for user-facing errors

**Server-Side:**
- API errors logged to Vercel
- Database errors logged to Supabase

### 10.3 Performance Monitoring

**Metrics Tracked:**
- API response time
- Database query time
- Page load time
- Realtime sync latency

**Tools:**
- Vercel Analytics (built-in)
- Supabase Dashboard (built-in)


---

## 11. SCALABILITY ARCHITECTURE

### 11.1 Database Scalability

**Current Capacity:**
- 10,000 concurrent connections
- 100GB storage (free tier: 500MB)
- Automatic backups

**Scaling Strategy:**
- **Vertical**: Upgrade Supabase plan
- **Horizontal**: Read replicas (future)
- **Caching**: Redis layer (future)

**Indexing:**
```sql
CREATE INDEX idx_assessments_user_date ON assessments(user_id, date);
CREATE INDEX idx_sessions_counsellor ON sessions(counsellor_id);
CREATE INDEX idx_prescriptions_student ON prescriptions(student_id);
CREATE INDEX idx_messages_prescription ON prescription_messages(prescription_id);
```

### 11.2 API Scalability

**Serverless Functions:**
- Auto-scaling based on traffic
- No server management
- Pay per execution

**Caching Strategy:**
- Static assets: CDN cached
- API responses: No cache (real-time data)
- Database queries: Connection pooling

### 11.3 Frontend Scalability

**Code Splitting:**
- Route-based splitting (Next.js automatic)
- Component lazy loading
- Dynamic imports for heavy components

**Image Optimization:**
- Next.js Image component
- Automatic WebP conversion
- Responsive images

**Bundle Size:**
- Current: ~200KB (gzipped)
- Target: < 300KB

---

## 12. DATA FLOW DIAGRAMS

### 12.1 Student Check-in Flow

```
Student opens app
    ↓
GET /student/checkin
    ↓
Server: Fetch today's assessment (if exists)
    ↓
If exists: Show results
If not: Show emotion tiles
    ↓
Student taps emotion (😔)
    ↓
POST /api/assessments/start
    ↓
ARIA: buildAssessmentQueue()
    ↓
Return first question
    ↓
Display question
    ↓
Student answers
    ↓
POST /api/assessments/answer
    ↓
ARIA: accumulateScore()
    ↓
Return next question (or complete)
    ↓
Repeat until all questions answered
    ↓
POST /api/assessments/complete
    ↓
ARIA: classifyRisk()
    ↓
Save assessment to database
    ↓
If critical: Trigger alert
    ↓
ARIA: buildWellnessSummary()
    ↓
Return results
    ↓
Display wellness summary
```

### 12.2 Prescription Creation Flow

```
Counsellor opens student profile
    ↓
Click "Create Prescription"
    ↓
Fill form (medication, dosage, frequency, duration, notes, tips)
    ↓
Click "Save"
    ↓
POST /api/prescriptions/create
    ↓
Validate inputs (Zod schema)
    ↓
Check authorization (RLS)
    ↓
Insert into prescriptions table
    ↓
Insert into audit_log table
    ↓
Return prescription_id
    ↓
Send email notification to student
    ↓
Display success toast
    ↓
Redirect to prescription detail page
```

### 12.3 Video Meeting Flow

```
Counsellor opens session detail
    ↓
Click "Start Meeting Now"
    ↓
POST /api/meetings/generate
    ↓
Generate Jitsi room name
    ↓
Create meeting link
    ↓
Update sessions table (meeting_link, link_generated_at, link_expires_at)
    ↓
Supabase Realtime: Broadcast change
    ↓
Student's page: Receive WebSocket message (< 500ms)
    ↓
Student's page: Update UI (show "Join Video Session" button)
    ↓
Both click "Join Video Session"
    ↓
Open Jitsi Meet in new tab
    ↓
Both join same room
    ↓
Video consultation begins
```

### 12.4 Messaging Flow

```
Student opens prescription detail
    ↓
GET /api/prescription-messages/[prescriptionId]
    ↓
Fetch all messages
    ↓
Mark messages as read
    ↓
Display message thread
    ↓
Student types message
    ↓
Click "Send"
    ↓
POST /api/prescription-messages/send
    ↓
Validate message (10-1000 chars)
    ↓
Insert into prescription_messages table
    ↓
Supabase Realtime: Broadcast new message
    ↓
Counsellor's page: Receive WebSocket message
    ↓
Counsellor's page: Update unread badge
    ↓
Counsellor opens prescription
    ↓
See new message
    ↓
Type reply
    ↓
POST /api/prescription-messages/send
    ↓
Student's page: Receive WebSocket message
    ↓
Student's page: Display reply (no refresh needed)
```

---

## 13. TECHNOLOGY STACK SUMMARY

### Frontend Stack
```
Framework:        Next.js 14 (App Router)
Language:         TypeScript 5.x
Styling:          Tailwind CSS 3.x
UI Components:    shadcn/ui
State Management: React Hooks
Animations:       Framer Motion
Charts:           Recharts
HTTP Client:      Fetch API
WebSocket:        Supabase Realtime Client
```

### Backend Stack
```
Runtime:          Node.js 18+
Framework:        Next.js API Routes
Database:         PostgreSQL 15 (Supabase)
ORM:              Supabase JavaScript Client
Authentication:   Supabase Auth (JWT)
Real-time:        Supabase Realtime (WebSocket)
Storage:          Supabase Storage
```

### External Services
```
AI Chatbot:       Mistral API (mistral-small-latest)
Video Calls:      Jitsi Meet
SMS:              Twilio
Email:            Resend
Payments:         Razorpay
```

### DevOps Stack
```
Hosting:          Vercel (Serverless)
Database Host:    Supabase Cloud
Version Control:  GitHub
CI/CD:            Vercel Auto-Deploy
Domain:           Custom domain + Vercel DNS
SSL:              Automatic HTTPS (Vercel)
CDN:              Vercel Edge Network
```

### Development Tools
```
Package Manager:  npm
Linter:           ESLint
Formatter:        Prettier
Type Checking:    TypeScript
Testing:          (Not implemented yet)
```

---

## 14. ARCHITECTURE DIAGRAM COMPONENTS

### For Creating Visual Diagram

#### Layer 1: Client Layer
- **Browser** (Chrome, Firefox, Edge)
  - Next.js React App
  - Tailwind CSS UI
  - Supabase Realtime Client

#### Layer 2: CDN/Edge Layer
- **Vercel Edge Network**
  - Static Asset Caching
  - Global Distribution
  - HTTPS/TLS

#### Layer 3: Application Layer
- **Vercel Serverless Functions**
  - Next.js API Routes
  - Authentication Middleware
  - Business Logic

#### Layer 4: Database Layer
- **Supabase**
  - PostgreSQL Database
  - Row Level Security
  - Realtime Subscriptions
  - File Storage

#### Layer 5: External Services Layer
- **Mistral AI** (Chatbot)
- **Jitsi Meet** (Video)
- **Twilio** (SMS)
- **Resend** (Email)
- **Razorpay** (Payments)

#### Data Flow Arrows
- **HTTP/HTTPS** (Client ↔ Vercel)
- **WebSocket** (Client ↔ Supabase Realtime)
- **PostgreSQL Protocol** (Vercel ↔ Supabase)
- **REST API** (Vercel ↔ External Services)

#### Security Boundaries
- **JWT Authentication** (All API calls)
- **RLS Policies** (Database queries)
- **HTTPS/TLS** (All network traffic)

---

## 15. PERFORMANCE METRICS

### Current Performance
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Database Query Time**: < 100ms
- **Realtime Sync Latency**: < 500ms
- **Bundle Size**: ~200KB (gzipped)

### Target Performance (Phase 1)
- **Page Load Time**: < 1 second
- **API Response Time**: < 300ms
- **Database Query Time**: < 50ms
- **Realtime Sync Latency**: < 300ms
- **Bundle Size**: < 150KB (gzipped)

---

**Document Version**: 1.0  
**Last Updated**: May 2026  
**Purpose**: Technical architecture reference for diagram creation  
**Audience**: Developers, architects, technical stakeholders
