# MindSafe India 🧠

**AI-Powered Mental Health Platform for Indian Educational Institutions**

A comprehensive mental health management system designed specifically for Indian colleges and universities, featuring ARIA (Adaptive Risk Intelligence Assessment) engine, AI chatbot companion, and NAAC compliance tools.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

---

## 🌟 Features

### For Students
- **ARIA Assessment Engine** - Multi-dimensional mental health assessment (PHQ-9, GAD-7, PSS-10, ISI, MBI, UCLA)
- **Saathi AI Chatbot** - Empathetic AI companion powered by Mistral AI
- **Daily Check-ins** - Track mood and wellbeing over time
- **Progress Tracking** - Visualize mental health journey with charts
- **Resource Library** - 35+ evidence-based mental health resources
- **Session Booking** - Schedule counselling sessions with integrated Google Meet
- **Prescription Management** - View and manage prescribed resources

### For Counsellors
- **Student Monitoring** - Track student mental health with risk alerts
- **Clinical Dashboard** - View student assessments and progress
- **Resource Creation** - Create and prescribe custom resources
- **Session Management** - Manage counselling appointments
- **Alert System** - Automated alerts for high-risk students
- **Prescription System** - Prescribe resources and track engagement

### For Administrators
- **Campus Analytics** - Campus-wide mental health insights
- **Student Registry** - Manage student and counsellor accounts
- **NAAC Compliance** - Evidence upload and compliance reports
- **System Settings** - Configure institution-wide settings
- **Counsellor Management** - Onboard and manage counsellors

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Mistral AI API key (for chatbot)
- Twilio account (for SMS alerts)
- Resend account (for emails)
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mindsafe-india
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Mistral AI (Chatbot)
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_AGENT_ID=your_mistral_agent_id

# Twilio (SMS Alerts)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Resend (Email)
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=your_email

# Razorpay (Payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Supabase database**

Run migrations in your Supabase SQL editor:
```bash
# Navigate to supabase/migrations folder
# Run each migration file in order (001 to 031)
```

Or use the Supabase CLI:
```bash
supabase db push
```

5. **Seed the database**
```bash
# Run seed files in supabase/ folder
# seed_phq9_questions.sql
# seed_gad7_questions.sql
# ... (all seed files)
```

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📚 Documentation

- **[Product Requirements](./MindSafe_India_PRD_v2.md)** - Complete product specification
- **[ARIA Engine](./AGENTS.md)** - AI assessment engine documentation
- **[Brand Guidelines](./MindSafe_India_BRAND.md)** - Brand identity and guidelines
- **[UI/UX Guidelines](./MindSafe_India_UIUX.md)** - Design system documentation
- **[Testing Guide](./TESTING_GUIDE.md)** - How to test the application
- **[Database Setup](./supabase/QUICK_START.md)** - Supabase setup guide

### Feature-Specific Docs
- **[Resources System](./RESOURCES_SECTION_COMPLETE.md)** - Resource management guide
- **[Prescription System](./PRESCRIPTION_VISIBILITY_FIX.md)** - Prescription feature docs
- **[Chat Troubleshooting](./FIX_CHAT_FETCH_ERROR.md)** - Chatbot troubleshooting
- **[API Key Management](./REPLACE_MISTRAL_API_KEY.md)** - Mistral API setup

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16.2.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Radix UI** - Accessible components

### Backend
- **Supabase** - PostgreSQL database, authentication, storage
- **Next.js API Routes** - Serverless API endpoints
- **Row Level Security (RLS)** - Database security

### AI & Integrations
- **Mistral AI** - Chatbot (Saathi)
- **Twilio** - SMS notifications
- **Resend** - Email notifications
- **Razorpay** - Payment processing
- **Google Meet** - Video sessions

---

## 📁 Project Structure

```
mindsafe-india/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── student/           # Student dashboard
│   │   ├── counsellor/        # Counsellor dashboard
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── student/          # Student components
│   │   ├── counsellor/       # Counsellor components
│   │   └── admin/            # Admin components
│   └── lib/                   # Utilities
│       ├── aria/             # ARIA assessment engine
│       ├── mistral/          # Mistral AI integration
│       ├── supabase/         # Supabase clients
│       └── notifications/    # Alert system
├── supabase/
│   ├── migrations/           # Database migrations (34)
│   └── seed_*.sql           # Seed data (10 files)
├── public/                   # Static assets
└── docs/                     # Documentation
```

---

## 🔐 Security

- **Row Level Security (RLS)** - All database tables protected
- **Role-Based Access Control** - Student, Counsellor, Admin roles
- **Data Encryption** - All sensitive data encrypted
- **Secure Authentication** - Supabase Auth with JWT
- **API Rate Limiting** - Protection against abuse
- **HTTPS Only** - Enforced in production

---

## 🧪 Testing

### Run TypeScript Check
```bash
npm run build
```

### Manual Testing
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing checklist.

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Add environment variables
- Deploy!

3. **Configure Domain**
- Add custom domain in Vercel settings
- Update `NEXT_PUBLIC_APP_URL` environment variable

### Environment Variables
Make sure to add all environment variables from `.env.local` to your deployment platform.

---

## 📊 Database Migrations

The project uses 34 migrations to set up the complete database schema:

```bash
001 - Initial schema (users, colleges, assessments)
002 - Consent system
003 - Prescriptions
004 - Escalation system
005 - ARIA 2.0 engine
006 - Role-based auth
007-031 - Feature additions and fixes
```

See `supabase/migrations/` for all migration files.

---

## 🎨 Brand Identity

**Colors:**
- Primary: `#3DBE29` (Green)
- Secondary: `#00C9A7` (Teal)
- Background: `#FFFFFF` (White)
- Text: `#1E1E2E` (Dark)

**Typography:**
- Headings: Inter (Bold)
- Body: Inter (Regular)

See [MindSafe_India_BRAND.md](./MindSafe_India_BRAND.md) for complete brand guidelines.

---

## 🤝 Contributing

This is a proprietary project. For internal development:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📝 License

Proprietary - All rights reserved.

---

## 🆘 Support

### Common Issues

**Chat not working?**
- Check Mistral API key is valid
- See [FIX_CHAT_FETCH_ERROR.md](./FIX_CHAT_FETCH_ERROR.md)

**Database errors?**
- Verify all migrations are applied
- Check RLS policies are enabled
- See [supabase/QUICK_START.md](./supabase/QUICK_START.md)

**Build errors?**
- Run `npm run build` to check TypeScript errors
- Verify all environment variables are set

### Documentation
- [Project Status](./PROJECT_STATUS_FINAL.md) - Current project status
- [Cleanup Report](./POST_CLEANUP_TEST_REPORT.md) - Latest test results

---

## 🎯 Roadmap

### Completed ✅
- ARIA 2.0 Assessment Engine
- Saathi AI Chatbot
- Student Dashboard
- Counsellor Dashboard
- Admin Dashboard
- Resource Management
- Prescription System
- Session Booking
- NAAC Compliance Tools
- Alert System
- Payment Integration

### Planned 🚧
- Mobile App (React Native)
- Advanced Analytics
- Multi-language Support
- Accessibility Improvements (WCAG 2.1 AA)
- Integration with more mental health tools

---

## 👥 Team

**MindSafe India** - Mental Health Platform for Educational Institutions

For inquiries: [Contact Information]

---

## 🙏 Acknowledgments

- **Mistral AI** - For the Saathi chatbot
- **Supabase** - For the backend infrastructure
- **Next.js** - For the amazing framework
- **Indian Mental Health Community** - For guidance and support

---

## 📈 Stats

- **65 Routes** - Complete application coverage
- **34 Migrations** - Comprehensive database schema
- **35+ Resources** - Evidence-based mental health content
- **0 TypeScript Errors** - Type-safe codebase
- **Production Ready** - Fully tested and deployed

---

**Built with ❤️ for Indian students' mental wellbeing**

