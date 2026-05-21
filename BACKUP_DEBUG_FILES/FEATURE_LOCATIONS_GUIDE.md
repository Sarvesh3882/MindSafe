# Feature Locations Guide - MindSafe India

## 🎯 Quick Navigation: Where to Find Everything

This guide shows you exactly where each feature is located in the UI.

---

## 📋 **PRESCRIPTION MANAGEMENT SYSTEM**

### For Students:

#### 1. **Access Prescriptions**
- **Location**: Sidebar → "Prescriptions" (3rd item, purple pill icon)
- **Alternative**: Dashboard → Purple "My Prescriptions" card
- **URL**: `/student/prescriptions`

#### 2. **View Prescription Details**
- **Location**: Prescriptions page → Click any prescription card
- **URL**: `/student/prescriptions/[id]`
- **Features Available**:
  - View medication details (name, dosage, frequency, duration)
  - See wellness tips from counsellor
  - Read prescription notes
  - Send messages to counsellor about this prescription
  - View message history
  - Edit your own messages (5-minute window)

#### 3. **Send Prescription Messages**
- **Location**: Inside any prescription detail page
- **Features**:
  - Type message in the input box at bottom
  - Real-time message thread
  - See unread message count
  - Messages auto-refresh every 30 seconds

### For Counsellors:

#### 1. **Access Prescription Management**
- **Location**: Sidebar → "Prescriptions" (3rd item, purple pill icon)
- **Alternative**: Dashboard → Purple "Prescription Management" banner
- **URL**: `/counsellor/prescriptions`

#### 2. **View Student Prescriptions**
- **Location**: Prescriptions landing page → Click any student card
- **URL**: `/counsellor/prescriptions/[studentId]`
- **Shows**: All prescriptions for that student

#### 3. **Create New Prescription**
- **Location**: Student prescriptions page → "Create Prescription" button (top right)
- **Form Fields**:
  - Medication name
  - Dosage
  - Frequency
  - Duration
  - Notes
  - Wellness tips

#### 4. **Edit Prescription**
- **Location**: Prescription detail page → "Edit" button
- **Time Limit**: 24 hours after creation
- **URL**: `/counsellor/prescriptions/detail/[id]`

#### 5. **Send Dosage Adjustment Suggestions**
- **Location**: Prescription detail page → "Suggest Adjustment" button
- **Use Case**: Recommend dosage changes to student

#### 6. **Message Students About Prescriptions**
- **Location**: Inside any prescription detail page
- **Features**: Same as student messaging

---

## 🎥 **VIDEO MEETING SYSTEM**

### For Both Students and Counsellors:

#### 1. **Access Sessions Page**
- **Location**: Sidebar → "Sessions"
- **Student URL**: `/student/sessions`
- **Counsellor URL**: `/counsellor/sessions`

#### 2. **Generate Meeting Link**
- **Location**: Sessions page → Each session card has a meeting section
- **Options**:
  - **Automatic**: Link appears 15 minutes before session
  - **Manual**: Click "Start Meeting Now" button anytime
- **Features**:
  - Instant meeting generation
  - No waiting period required
  - Both student and counsellor see the same link
  - Link expires 2 hours after session ends

#### 3. **Join Video Session**
- **Location**: Sessions page → Session card → "Join Video Session" button
- **Opens**: Jitsi video meeting in new tab
- **Works**: For both scheduled and instant meetings

---

## 📅 **BOOKING SYSTEM**

### For Students:

#### 1. **Book a Session**
- **Location**: 
  - Dashboard → "Book a Session" card
  - Sessions page → "Book a Session" button
  - Sidebar → "Book Session"
- **URL**: `/student/sessions/book`

#### 2. **View Upcoming Sessions**
- **Location**: Sessions page → "Upcoming" section
- **Shows**: All scheduled sessions with meeting links

#### 3. **View Past Sessions**
- **Location**: Sessions page → "Past Sessions" section
- **Shows**: Completed, cancelled, or no-show sessions

### For Counsellors:

#### 1. **View All Sessions**
- **Location**: Sidebar → "Sessions"
- **URL**: `/counsellor/sessions`
- **Sections**:
  - Today's sessions
  - Upcoming sessions
  - Past sessions (last 20)

#### 2. **Update Session Status**
- **Location**: Sessions page → Each session has a status dropdown
- **Options**: Scheduled, Completed, Cancelled, No Show

---

## 🏠 **DASHBOARD FEATURES**

### Student Dashboard (`/student`)

**Quick Access Cards**:
1. **ARIA Assessment** (Blue) - Take mental health assessment
2. **Book a Session** (Green) - Schedule counselling
3. **My Prescriptions** (Purple) - View prescriptions
4. **Chat with ARIA** (Teal) - AI mental health support

### Counsellor Dashboard (`/counsellor`)

**Management Sections**:
1. **Session Management** (Green banner) - View and manage sessions
2. **Prescription Management** (Purple banner) - Manage student prescriptions
3. **Student Overview** - See all assigned students

---

## 🔔 **NOTIFICATION SYSTEM**

### Unread Message Badges:
- **Location**: Prescriptions sidebar item
- **Shows**: Red badge with unread count
- **Updates**: Real-time when new messages arrive

### Toast Notifications:
- **Appears**: Top-right corner
- **Types**:
  - Success (green) - Actions completed
  - Error (red) - Something went wrong
  - Info (blue) - General information

---

## 🎨 **UI COMPONENTS REFERENCE**

### Sidebar Navigation:
1. Dashboard (Home icon)
2. Sessions (Calendar icon)
3. **Prescriptions** (Pill icon) - NEW
4. Chat (Message icon)
5. Resources (Book icon)
6. Profile (User icon)

### Color Coding:
- **Green** (#3DBE29) - Sessions, booking, primary actions
- **Purple** (#9333EA) - Prescriptions, medication
- **Blue** (#3B82F6) - ARIA, assessments, information
- **Teal** (#00C9A7) - Chat, communication

---

## 🔍 **SEARCH & FILTERS**

### Prescription Filters (Student):
- **Location**: Prescriptions page → Filter buttons
- **Options**: All, Active, Completed, Discontinued

### Prescription Search (Counsellor):
- **Location**: Student prescriptions page → Search bar
- **Search By**: Medication name, notes, wellness tips

---

## 📱 **RESPONSIVE DESIGN**

All features work on:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (375px+)

---

## 🚀 **QUICK START CHECKLIST**

### As a Student:
- [ ] Complete ARIA assessment
- [ ] Book your first session
- [ ] Check prescriptions (if any)
- [ ] Join video meeting when session starts

### As a Counsellor:
- [ ] Review today's sessions
- [ ] Create prescriptions for students
- [ ] Respond to prescription messages
- [ ] Generate meeting links for sessions

---

## 💡 **PRO TIPS**

1. **Instant Meetings**: Don't wait for the 15-minute window - click "Start Meeting Now" anytime
2. **Message Editing**: You have 5 minutes to edit messages after sending
3. **Prescription Updates**: Counsellors have 24 hours to edit prescriptions
4. **Real-time Updates**: Message threads refresh automatically every 30 seconds
5. **Unread Badges**: Check the sidebar for new prescription messages

---

## 🆘 **TROUBLESHOOTING**

### Can't See Prescriptions?
- Check sidebar (3rd item with pill icon)
- Check dashboard for purple card
- Ensure you're logged in

### Meeting Link Not Showing?
- Go to Sessions page (not dashboard)
- Look inside each session card
- Click "Start Meeting Now" if needed

### Messages Not Sending?
- Check internet connection
- Ensure you're on prescription detail page
- Try refreshing the page

---

## 📞 **SUPPORT**

If you can't find a feature:
1. Check this guide first
2. Look in the sidebar navigation
3. Check your dashboard cards
4. Contact system administrator

---

**Last Updated**: May 16, 2026
**Version**: 2.0
**Status**: All features fully implemented and accessible
