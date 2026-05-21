**MindSafe India**

Product Requirements Document (PRD)

**AI-Powered Mental Health Platform for Indian Colleges**

Version 1.0 \| April 2026 \| Confidential

+-----------------------+-----------------------+-----------------------+
| **B2B SaaS**          | **AI-Powered**        | **Next.js +           |
|                       |                       | Supabase**            |
| College-focused       | Mistral API           |                       |
|                       |                       | Full Stack            |
+-----------------------+-----------------------+-----------------------+

**1. Executive Summary**

MindSafe India is a B2B SaaS mental health platform designed exclusively
for Indian colleges and universities. The platform digitizes and
automates the entire student mental health workflow --- from early
detection to counsellor connect --- making it accessible, stigma-free,
and clinically credible.

+-----------------------------------------------------------------------+
| **Mission Statement**                                                 |
|                                                                       |
| To make mental health support accessible, affordable, and stigma-free |
| for every college student in India --- through technology that feels  |
| like a friend, not a hospital.                                        |
+-----------------------------------------------------------------------+

**1.1 The Problem**

  -----------------------------------------------------------------------
  **Core Problem**           **Impact**             **Current Reality**
  -------------------------- ---------------------- ---------------------
  Lack of Early Detection    Issues go unnoticed    No systematic
                             until crisis           screening exists

  Stigma & Fear of Judgment  Students avoid seeking Manual, visible
                             help                   counsellor visits

  Inadequate Infrastructure  Counsellors            1 counsellor per 500+
                             overwhelmed            students

  Zero Real-Time Crisis      Delayed intervention   No alert systems in
  Response                                          place

  Fragmented Resources       Students don\'t know   Scattered,
                             where to turn          inaccessible content

  No Institutional           Admin can\'t measure   No data or analytics
  Visibility                 wellness               available
  -----------------------------------------------------------------------

**1.2 The Solution**

MindSafe India replaces manual, stigmatized mental health processes with
a fully digital, AI-driven platform that colleges can deploy
institution-wide. Students get seamless, invisible support. Counsellors
get smart triage tools. Admins get campus-wide analytics.

**2. Product Overview**

**2.1 Business Model**

  -----------------------------------------------------------------------
  **Aspect**                 **Details**
  -------------------------- --------------------------------------------
  Model Type                 B2B SaaS --- sold to colleges, not students

  Primary Customer           Student Welfare Officers, Deans, College
                             Management

  End Users                  Students, Counsellors, Admin staff

  Revenue Model              Monthly/Annual institutional subscription

  Key Value Prop             NAAC compliance + complete welfare
                             digitization
  -----------------------------------------------------------------------

**2.2 Pricing Tiers**

  ----------------------------------------------------------------------------
  **Plan**      **Price**       **Students**   **Key Features**
  ------------- --------------- -------------- -------------------------------
  Basic         ₹15,000/month   Up to 500      Student dashboard, Dynamic
                                               assessment, 1 counsellor
                                               account, Basic analytics

  Growth        ₹35,000/month   Up to 2,000    Everything in Basic + 5
                                               counsellor accounts, Full admin
                                               dashboard, Monthly reports

  Enterprise    Custom pricing  Unlimited      Everything in Growth + Custom
                                               branding, API access, NAAC
                                               compliance reports, Dedicated
                                               support
  ----------------------------------------------------------------------------

+-----------------------------------------------------------------------+
| **NAAC Advantage**                                                    |
|                                                                       |
| Indian colleges require NAAC accreditation for ranking and funding.   |
| Student welfare is a scored criteria.                                 |
|                                                                       |
| MindSafe India directly contributes to NAAC Student Support &         |
| Progression criteria --- making it an institutional necessity, not    |
| just a nice-to-have.                                                  |
+-----------------------------------------------------------------------+

**3. User Personas**

**3.1 The Student --- Primary End User**

  -----------------------------------------------------------------------
  **Attribute**      **Description**
  ------------------ ----------------------------------------------------
  Profile            18-24 year old college student, urban/semi-urban
                     India

  Pain Points        Exam stress, social pressure, stigma around mental
                     health, no safe space to vent

  Behavior           Prefers tapping/swiping over typing, uses apps like
                     Instagram, Duolingo

  Goal               Feel better without anyone knowing they sought help

  Device             Desktop-first (Web browser --- Chrome/Edge/Firefox)
  -----------------------------------------------------------------------

**3.2 The Counsellor --- Power User**

  -----------------------------------------------------------------------
  **Attribute**      **Description**
  ------------------ ----------------------------------------------------
  Profile            College-employed mental health professional

  Pain Points        Managing 100+ students manually, no triage system,
                     paper-based notes

  Goal               Know which students need urgent attention without
                     spending hours reviewing files

  Device             Web dashboard (desktop/tablet)
  -----------------------------------------------------------------------

**3.3 The Admin --- Decision Maker & Buyer**

  -----------------------------------------------------------------------
  **Attribute**      **Description**
  ------------------ ----------------------------------------------------
  Profile            Dean of Students / Student Welfare Officer / College
                     Management

  Pain Points        No visibility into campus mental health, NAAC
                     pressure, crisis incidents

  Goal               Institutional dashboard, compliance reports,
                     resource optimization

  Device             Web dashboard (desktop)
  -----------------------------------------------------------------------

**4. Core Features & Functionality**

**4.1 Dynamic Assessment Engine (ARIA)**

ARIA (Adaptive Response & Insight Algorithm) is the core innovation of
MindSafe India. It conducts clinically validated mental health
assessments invisibly --- users never feel like they\'re taking a test.

**How ARIA Works**

  --------------------------------------------------------------------------
  **Step**         **What Happens**           **User Experience**
  ---------------- -------------------------- ------------------------------
  1\. Daily        User taps an emotion tile  \"How are you feeling today?\"
  Check-in                                    with 6 emoji options

  2\. Drill Down   ARIA selects follow-up     2-3 situational quick-tap
                   questions based on tap     questions

  3\. Silent       Responses mapped to        User sees nothing clinical
  Scoring          PHQ-9/GAD-7/PSS scores     

  4\. Risk         Green / Orange / Red       Friendly recommendation shown
  Classification   flagging                   

  5\. Counsellor   Auto-notification if Red   \"Want to talk to someone
  Alert            flag triggered             today?\"
  --------------------------------------------------------------------------

**Question Bank Architecture**

The question bank is sourced entirely from clinically validated research
instruments, ensuring credibility and accuracy:

  ----------------------------------------------------------------------------
  **Source           **Category**    **Questions**   **Maps To**
  Instrument**                                       
  ------------------ --------------- --------------- -------------------------
  PHQ-9 (Official)   Depression      9               PHQ-9 Score (0-27)

  GAD-7 (Official)   Anxiety         7               GAD-7 Score (0-21)

  PSS-10             Perceived       10              Stress Score
                     Stress                          

  ISI                Sleep /         7               Sleep Score
                     Insomnia                        

  Maslach Burnout    Academic        22              Burnout Score
  Scale              Burnout                         

  UCLA Loneliness    Social          20              Loneliness Score
  Scale              Isolation                       

  AUDIT              Substance Use   10              Risk Score
  ----------------------------------------------------------------------------

+-----------------------------------------------------------------------+
| **ARIA Selection Logic**                                              |
|                                                                       |
| 1\. Checks user\'s last 7 days of assessment history                  |
|                                                                       |
| 2\. Identifies the weakest/most concerning category                   |
|                                                                       |
| 3\. Queries Supabase for unasked questions in that category matching  |
| current risk level                                                    |
|                                                                       |
| 4\. Serves mild questions for low-risk users, deeper questions for    |
| high-risk users                                                       |
|                                                                       |
| 5\. Flags category for review if fewer than 10 fresh questions remain |
+-----------------------------------------------------------------------+

**Risk Classification System**

  --------------------------------------------------------------------------
  **Level**   **Color**   **Criteria**           **System Action**
  ----------- ----------- ---------------------- ---------------------------
  Stable      Green       Scores within normal   Show wellness resources
                          range                  

  Needs       Orange      Moderate scores, 3+    Suggest counsellor booking
  Attention               consecutive bad days   

  Critical    Red         High scores, 5+        Instant counsellor alert +
                          consecutive bad days,  guardian SMS
                          crisis keywords        
  --------------------------------------------------------------------------

**4.2 Student Dashboard**

The student dashboard is designed around the principle: feel like a
wellness companion, not a clinical tool. First impression is everything.

  ------------------------------------------------------------------------
  **Section**     **Component**          **Purpose**
  --------------- ---------------------- ---------------------------------
  Hero Section    Daily Check-in         Entry point for invisible
                  (Emotion tiles)        assessment

  Progress        Streak counter +       Gamification for daily engagement
                  weekly mood trend      

  Quick Access    3 action cards:        Simple navigation
                  Check-in, Relax, Talk  
                  to Counsellor          

  Companion       AI Chatbot button      Optional, not prominent
                  (bottom corner)        

  Schedule        Upcoming session       Counsellor appointment visibility
                  details                
  ------------------------------------------------------------------------

+-----------------------------------------------------------------------+
| **UX Design Principle**                                               |
|                                                                       |
| Never use the words \'test\', \'assessment\', \'diagnosis\' or        |
| \'mental health screening\' in student-facing UI.                     |
|                                                                       |
| Brand language: \'Check-in\', \'How are you doing?\', \'Your          |
| wellness\', \'Let\'s chat\'.                                          |
|                                                                       |
| Target vibe: Duolingo meets Headspace --- friendly, streaky,          |
| non-clinical.                                                         |
+-----------------------------------------------------------------------+

**4.3 AI Chatbot Companion**

The chatbot is a secondary feature --- an optional companion for
students who prefer not to talk to a human counsellor. It is separate
from the assessment engine.

  -----------------------------------------------------------------------
  **Aspect**         **Assessment Engine    **AI Chatbot**
                     (ARIA)**               
  ------------------ ---------------------- -----------------------------
  Purpose            Clinical scoring       Emotional support (visible)
                     (invisible)            

  User Sees It?      Never                  Always

  Tone               Structured tap/slider  Warm, conversational
                     questions              

  AI Usage           No AI --- hardcoded    Mistral API
                     logic + question bank  

  Triggered By       Auto --- daily app     User chooses to open chat
                     open                   

  Output             Risk score stored in   Coping strategies, breathing
                     Supabase               exercises
  -----------------------------------------------------------------------

**4.4 Counsellor Dashboard**

Built for efficiency --- a counsellor managing 100+ students needs to
know who needs help most, right now.

  -----------------------------------------------------------------------
  **Feature**           **Description**
  --------------------- -------------------------------------------------
  Priority Triage List  Students sorted by risk level (Red first), with
                        trigger summary

  Session Calendar      Daily schedule with online/offline tags, open
                        slot management

  Student Profile View  Full trend graphs (PHQ-9, GAD-7, PSS over time),
                        session history, personal notes

  Session Notes Editor  Digital replacement for paper files, linked to
                        student profile

  Resource Prescription Send specific content (meditation, videos,
                        exercises) to student\'s dashboard

  Escalate to Admin     One-tap emergency escalation for crisis cases

  Smart Notifications   Alerts for score spikes, missed sessions, streak
                        breaks
  -----------------------------------------------------------------------

**4.5 Admin Dashboard**

Admins are decision-makers, not therapists. They need campus-wide
patterns, not individual cases. All student data shown to admin is fully
anonymized.

  -----------------------------------------------------------------------
  **Feature**           **Description**
  --------------------- -------------------------------------------------
  Campus Health         Real-time breakdown: % Green, Orange, Red
  Snapshot              students across campus

  Trend Analytics       Time-based graphs, department-wise breakdown,
                        exam season correlation

  Counsellor            Capacity tracking, session completion rates,
  Utilization           bottleneck identification

  Crisis Alerts Panel   Anonymized critical cases, escalation history

  Resource Manager      Add/remove content from student resource library

  One-Click PDF Report  Monthly wellness report: campus score, trends,
                        recommendations

  Bulk Onboarding       CSV upload for mass student/counsellor account
                        creation
  -----------------------------------------------------------------------

+-----------------------------------------------------------------------+
| **Privacy Architecture**                                              |
|                                                                       |
| Counsellor sees: Student names, individual scores, session notes      |
|                                                                       |
| Admin sees: Anonymized aggregates only --- NEVER individual student   |
| identities                                                            |
|                                                                       |
| This separation is enforced at the database level via Supabase Row    |
| Level Security (RLS)                                                  |
+-----------------------------------------------------------------------+

**4.6 Authentication & Role-Based Access**

  -----------------------------------------------------------------------
  **Role**      **Login Method**   **Access Level**   **Redirects To**
  ------------- ------------------ ------------------ -------------------
  Student       College email +    Own data only      Student Dashboard
                password / Google                     
                SSO                                   

  Anonymous     No login required  Assessment +       Limited Student
  User                             Resources only (no View
                                   booking)           

  Counsellor    Assigned college   All students in    Counsellor
                email              their college      Dashboard

  Admin         Assigned admin     Anonymized campus  Admin Dashboard
                email              data               
  -----------------------------------------------------------------------

**5. Technical Architecture**

**5.1 Full Tech Stack**

  -----------------------------------------------------------------------------------
  **Layer**        **Technology**           **Purpose**     **Why Chosen**
  ---------------- ------------------------ --------------- -------------------------
  Frontend         Next.js 14 (App Router)  Web application Cursor-friendly, industry
                                                            standard

  Styling          Tailwind CSS + shadcn/ui UI components   Fast development,
                                                            polished output

  Database         Supabase (PostgreSQL)    All data        Auth + DB + Storage in
                                            storage         one

  Authentication   Supabase Auth            Role-based      Built-in, zero config
                                            login           

  AI --- Chatbot   Mistral API              Companion       Cheap, fast, EU privacy
                   (mistral-small-latest)   chatbot only    compliant

  AI ---           None (hardcoded logic)   ARIA question   Zero API cost, clinically
  Assessment                                selection       reliable

  Charts           Recharts                 Analytics       Native React,
                                            dashboards      Cursor-friendly

  SMS Alerts       Twilio                   Crisis          Simple API, reliable
                                            notifications   delivery

  Email            Resend                   Session         Developer-friendly
                                            reminders,      
                                            alerts          

  Payments         Razorpay                 B2B             UPI + Indian payment
                                            institutional   methods
                                            billing         

  Deployment       Vercel                   Hosting         One-click Next.js deploy
  -----------------------------------------------------------------------------------

**5.2 Database Schema (Supabase)**

  ------------------------------------------------------------------------
  **Table**       **Key Fields**             **Purpose**
  --------------- -------------------------- -----------------------------
  users           id, email, role,           All user accounts with role
                  college_id, created_at     assignment

  colleges        id, name, plan_tier,       Institutional accounts
                  active, onboarded_at       

  questions       id, question, category,    ARIA question bank
                  severity, maps_to (JSON),  
                  options (JSON),            
                  times_asked                

  assessments     id, user_id, date, scores  Daily assessment results
                  (JSON), risk_level,        
                  questions_asked            

  sessions        id, student_id,            Counsellor bookings
                  counsellor_id, date, type, 
                  status, notes              

  alerts          id, student_id,            Crisis escalation log
                  counsellor_id, type,       
                  triggered_at, resolved     

  resources       id, title, type, category, Wellness content library
                  url, college_id            
  ------------------------------------------------------------------------

**5.3 ARIA Algorithm --- Technical Flow**

  ------------------------------------------------------------------------
  **Step**        **Logic**              **Implementation**
  --------------- ---------------------- ---------------------------------
  1\. Weak Area   Find category with     Supabase query on assessments
  Detection       highest average score  table
                  in last 7 days         

  2\. Question    Exclude all question   Supabase .not(\'id\', \'in\',
  Filtering       IDs already asked to   askedIds)
                  this user              

  3\. Severity    Match question         Supabase .eq(\'severity\',
  Matching        severity to current    riskLevel)
                  user risk level        

  4\. Random      Pick one question      Math.random() on returned array
  Selection       randomly from filtered 
                  results                

  5\. Score       Map option selected to JSON maps_to field on each option
  Mapping         clinical score         
                  increment              

  6\. Risk Update Recalculate risk level Running total in assessments
                  after each answer      table

  7\. Alert       If Red: notify         Twilio webhook + Supabase alert
  Trigger         counsellor + guardian  insert
                  SMS                    
  ------------------------------------------------------------------------

**5.4 Mistral API Usage --- Chatbot Only**

+-----------------------------------------------------------------------+
| **Cost Optimization Decision**                                        |
|                                                                       |
| Dynamic Assessment uses ZERO Mistral API calls --- all logic is       |
| hardcoded + Supabase queries.                                         |
|                                                                       |
| Mistral is used exclusively for the AI Chatbot companion feature,     |
| which is user-initiated.                                              |
|                                                                       |
| This reduces API costs to near-zero for core functionality and        |
| eliminates AI hallucination risk in clinical scoring.                 |
+-----------------------------------------------------------------------+

  -----------------------------------------------------------------------
  **Feature**            **Uses        **Rationale**
                         Mistral?**    
  ---------------------- ------------- ----------------------------------
  Daily check-in         No            Pulled from validated question
  questions                            bank in Supabase

  Assessment scoring     No            Hardcoded JSON mappings from
                                       research instruments

  Risk classification    No            Rule-based threshold logic

  Chatbot companion      Yes           Natural language responses require
                                       LLM

  Crisis keyword         No            Keyword list hardcoded for
  detection                            reliability
  -----------------------------------------------------------------------

**6. Competitive Analysis**

  -----------------------------------------------------------------------------------------
  **Feature**       **Wysa**   **Amaha**   **MindPeers**   **Manodarpan**   **MindSafe
                                                                            India**
  ----------------- ---------- ----------- --------------- ---------------- ---------------
  AI Support        Yes        No          No              No               Yes

  Confidential      Yes        Yes         Yes             Yes              Yes
  Booking                                                                   

  Safety Alert      No         No          Yes             No               Yes

  Languages         English    English     English         English + Hindi  English +
                                                                            Regional

  Cost Model        Freemium   Paid        Paid            Free             B2B
                                                                            Institutional

  Self-Help Content No         No          No              No               Yes

  Admin Analytics   No         No          No              No               Yes

  Stigma-free       Yes        Yes         Yes             Yes              Yes
  Access                                                                    

  Anonymous Mode    No         No          No              No               Yes

  NAAC Compliance   No         No          No              No               Yes
  Reports                                                                   
  -----------------------------------------------------------------------------------------

+-----------------------------------------------------------------------+
| **Competitive Moat**                                                  |
|                                                                       |
| MindSafe India is the ONLY platform with: Admin Analytics + Safety    |
| Alert + AI Support + Anonymous Mode + NAAC Compliance Reports.        |
|                                                                       |
| Key differentiator: Manodarpan (govt-backed, free) is the closest     |
| competitor but has zero AI, zero analytics, no self-help content.     |
|                                                                       |
| Positioning: \'Manodarpan 2.0 built for Gen Z\' --- familiar concept, |
| modern execution.                                                     |
+-----------------------------------------------------------------------+

**7. MVP Build Plan**

**7.1 Phase 1 --- MVP (6 Weeks)**

  ------------------------------------------------------------------------
  **Week**   **Focus**          **Deliverables**
  ---------- ------------------ ------------------------------------------
  Week 1     Foundation         Supabase setup, Auth, Role-based routing,
                                Login page

  Week 2     Student Dashboard  Emotion tiles, daily check-in UI, streak
                                counter

  Week 3     ARIA Engine        Question bank upload, scoring logic, risk
                                classification

  Week 4     Counsellor         Triage list, session calendar, student
             Dashboard          profile view

  Week 5     Admin Dashboard    Campus snapshot, trend charts (Recharts),
                                alerts panel

  Week 6     Integration &      Twilio alerts, Razorpay billing, Vercel
             Polish             deployment
  ------------------------------------------------------------------------

**7.2 Phase 2 --- Post-MVP**

  --------------------------------------------------------------------------
  **Feature**            **Priority**   **Rationale**
  ---------------------- -------------- ------------------------------------
  AI Chatbot (Mistral)   High           Differentiator for student
                                        engagement

  Progressive Web App    Medium         Allows students to install web app
  (PWA)                                 on desktop/laptop

  PDF Report Generator   Medium         Key for admin/NAAC use case

  Video Consultation     Medium         Premium counsellor feature

  Regional Language      High           Critical for Tier 2/3 college market
  Support                               

  Gamification (streaks, Medium         Retention driver
  badges)                               
  --------------------------------------------------------------------------

**8. Non-Functional Requirements**

  -----------------------------------------------------------------------
  **Requirement**       **Specification**
  --------------------- -------------------------------------------------
  Data Privacy          DPDP Act 2023 (India) compliant --- no PII stored
                        with clinical scores

  Encryption            AES-256 end-to-end encryption for all health data

  Anonymization         Admin sees zero student names --- enforced via
                        Supabase Row Level Security

  Uptime                99.9% SLA --- mental health platform cannot
                        afford downtime

  Response Time         \< 2 seconds for all dashboard loads

  Scalability           Supabase + Vercel auto-scale --- supports 10,000+
                        concurrent users

  Platform              Desktop web --- optimized for 1280px+ screen
                        width, Chrome/Edge/Firefox

  Accessibility         WCAG 2.1 AA compliance --- supports students with
                        disabilities
  -----------------------------------------------------------------------

**9. Success Metrics & KPIs**

  ------------------------------------------------------------------------
  **Metric**            **Target (6      **Measurement**
                        months)**        
  --------------------- ---------------- ---------------------------------
  College Onboarding    10 colleges      Contracts signed

  Student DAU           40% of enrolled  Supabase analytics
                        students         

  Check-in Completion   \> 60% daily     Assessment completions / active
  Rate                                   users

  Counsellor Session    \> 70% slots     Session bookings / available
  Utilization           filled           slots

  Early Detection Rate  30% more cases   Orange + Red flags per 100
                        flagged vs       students
                        manual           

  Admin Report          \> 1 per college PDF generation count
  Downloads             per month        

  Revenue               ₹5L MRR          Razorpay dashboard
  ------------------------------------------------------------------------

**10. Risks & Mitigations**

  ----------------------------------------------------------------------------
  **Risk**           **Severity**   **Mitigation**
  ------------------ -------------- ------------------------------------------
  Student stigma     High           Anonymous mode, wellness-first branding,
  prevents adoption                 peer ambassador program

  Clinical accuracy  High           100% research-instrument sourced
  of assessments                    questions, counsellor review process

  Data breach /      High           DPDP compliance, AES-256 encryption,
  privacy concern                   Supabase RLS

  College budget     Medium         NAAC angle justifies cost, tiered pricing,
  constraints                       free pilot offer

  Counsellor         Medium         Simple UX, training sessions, reduces
  resistance to                     their manual workload
  digital tools                     

  Mistral API        Low            Chatbot is optional feature --- core
  downtime (chatbot)                assessment works without it

  Question bank      Low            150+ questions at launch, human-reviewed
  exhaustion                        expansion quarterly
  ----------------------------------------------------------------------------

**11. Glossary**

  -----------------------------------------------------------------------
  **Term**           **Definition**
  ------------------ ----------------------------------------------------
  ARIA               Adaptive Response & Insight Algorithm ---
                     MindSafe\'s proprietary question selection engine

  PHQ-9              Patient Health Questionnaire-9 --- clinically
                     validated 9-question depression screening tool

  GAD-7              Generalized Anxiety Disorder-7 --- 7-question
                     anxiety assessment instrument

  PSS-10             Perceived Stress Scale --- 10-item psychological
                     instrument for stress measurement

  ISI                Insomnia Severity Index --- 7-item tool for
                     assessing sleep disorder severity

  NAAC               National Assessment and Accreditation Council ---
                     Indian college accreditation body

  DPDP Act           Digital Personal Data Protection Act 2023 ---
                     India\'s primary data privacy law

  RLS                Row Level Security --- Supabase feature enforcing
                     data access at database level

  B2B SaaS           Business-to-Business Software as a Service --- sold
                     to institutions, not individuals

  MRR                Monthly Recurring Revenue --- key SaaS business
                     metric
  -----------------------------------------------------------------------

MindSafe India --- Product Requirements Document v1.0 \| Confidential \|
April 2026
