# AdaptiveLMS: Learning Management System with Adaptive Learning Dashboard

**Academic B.Tech Computer Science & Engineering Main Project**  
*A modern, intelligent, student-centered educational SaaS platform built with Angular, TypeScript, and a deterministic Rule-Based Adaptive Recommendation Engine.*

---

## 1. Project Overview & Architectural Vision

**AdaptiveLMS** is a functional Learning Management System designed to address a critical limitation of traditional static e-learning platforms: **one-size-fits-all content delivery**. 

Rather than presenting every student with an identical linear learning path, AdaptiveLMS continuously captures student assessment telemetry, evaluates competency across six core Computer Science subjects, categorizes skill strength levels (*Strong*, *Average*, *Weak*), and executes a transparent **Rule-Based Adaptive Recommendation Algorithm** to synthesize tailored next-step actions.

### Core Questions the Platform Answers for Students:
1. **What courses am I currently enrolled in?** — Centralized "My Learning" view with active progress bars.
2. **How much of each course have I completed?** — Real-time chapter and lesson completion indicators.
3. **Which subjects am I weak in?** — Quantitative competency matrix identifying Strong ($\ge 75\%$), Average ($40\% - 74\%$), and Weak ($< 40\%$) domains.
4. **What should I study next?** — Algorithmic recommendation engine generating prioritized remedial drills or advanced capstones.
5. **How am I performing in quizzes?** — Interactive evaluation runner with scoring, explanations, and historical logging.
6. **What learning activities should I complete today?** — Dynamic activity timeline and scheduled upcoming evaluations.

---

## 2. Technology Stack

- **Frontend Framework:** Angular 21 (Latest Stable, 100% Standalone Components)
- **Language:** TypeScript 5.9+ (Strict Typing, Interface Contracts)
- **Reactive Programming:** RxJS 7.8 (Observables, BehaviorSubjects, Pipeline Combinators)
- **Form Architecture:** Angular Reactive Forms (`FormBuilder`, `FormGroup`, Custom Validators)
- **Routing & Guards:** Angular Router with Functional `CanActivateFn` Route Protection
- **Persistence Layer:** Structured Browser `LocalStorage` Abstraction (`StorageService`)
- **Styling & Design System:** Custom SaaS CSS Design System featuring Google Font Inter, JetBrains Mono, Elevation Tokens, Responsive CSS Grid & Flexbox
- **Analytics Visualization:** Modern SVG & CSS-driven Telemetry Gauges, Dynamic Progress Tracks, and Interactive Bar Charts

---

## 3. Five-Member Team Distribution & Responsibilities

This project has been structured for a five-member engineering team. All student names are dynamically configurable via the Student Profile portal.

| Member | Name | Module Focus | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Gaurav Bodkhe** | **Authentication, User Management, App Layout & Student Dashboard** | Sign in, registration, form validation, password strength meter, show/hide password, remember me; Route guards, session handling, redirect to the originally requested page after login; Profile editing, logout confirmation; toast system, shared styles in styles.css, Student Dashboard: metric cards, My Learning row, weekly study chart, recent activity timeline |
| **Member 2** | **Shantanu Gadhave** | **Course & Learning Management, Theming** | Six-course catalog, instant search, category and difficulty filters, sorting, grid/list toggle, empty states; Course detail with syllabus accordion, objectives, sticky Resume/Enroll panel; Learning player: chapter sidebar, mark-as-completed, progress persistence, keyboard shortcuts; Sidebar navigation, header, light/dark theme (ThemeService) |
| **Member 3** | **Samarth Tanpure** | **Adaptive Dashboard UI** | Adaptive Dashboard page layout: competency cards and the viva simulator panel |
| **Member 4** | **Pranav Pagar** | **Quiz Runner** | Quiz runner screen: question display, timer, result summary |
| **Member 5** | **Pranav Pagire** | **Notification Dropdown & Demo Reset** | Notification dropdown with unread badge, and the Reset Demo Data button |

---

## 4. Application Architecture & Folder Organization

The codebase follows the recommended enterprise Angular layered architecture:

```
src/
└── app/
    ├── core/
    │   ├── guards/
    │   │   └── auth.guard.ts                     # Functional CanActivateFn protecting student routes
    │   ├── models/
    │   │   └── lms.models.ts                     # TypeScript interfaces (Course, Quiz, AdaptiveRecommendation, etc.)
    │   └── services/
    │       ├── adaptive-learning.service.ts     # Core rule-based recommendation and competency engine
    │       ├── app-state.service.ts             # Global demo state restoration orchestrator
    │       ├── assessment.service.ts            # Quiz submission, evaluation, and attempt history
    │       ├── auth.service.ts                  # User session management and credentials verification
    │       ├── course.service.ts                # Catalog filtering, search, and syllabus tracking
    │       ├── demo-data.ts                     # Realistic baseline dataset for offline demonstration
    │       ├── learning.service.ts              # Active lesson execution, activity telemetry, and dashboard stats
    │       ├── notification.service.ts          # System alerts and unread badges
    │       ├── storage.service.ts               # LocalStorage read/write abstraction
    │       └── team.service.ts                  # Configurable 5-member academic project registry
    │
    ├── features/
    │   ├── adaptive-learning/                   # Module 5: Adaptive Dashboard & Viva Simulator
    │   │   ├── adaptive-dashboard.component.ts
    │   │   ├── adaptive-dashboard.component.html
    │   │   └── adaptive-dashboard.component.css
    │   ├── assessments/                         # Module 6: Quiz System & Runner
    │   │   ├── assessment-list/                 # Quiz catalog and evaluation history
    │   │   └── quiz-runner/                     # Interactive timer, questions, and explanations
    │   ├── auth/                                # Module 1: Authentication
    │   │   ├── login/                           # Sign in with quick-fill credentials
    │   │   └── register/                        # Registration with department selection
    │   ├── courses/                             # Module 3: Catalog & Details
    │   │   ├── course-list/                     # Search, filters, and cards
    │   │   └── course-detail/                   # Full syllabus and objectives
    │   ├── dashboard/                           # Module 2: Student Dashboard
    │   │   ├── dashboard.component.ts
    │   │   ├── dashboard.component.html
    │   │   └── dashboard.component.css
    │   ├── learning/                            # Module 4: Learning Player
    │   │   ├── learning-player.component.ts
    │   │   ├── learning-player.component.html
    │   │   └── learning-player.component.css
    │   └── profile/                             # Student profile & team registry
    │       ├── student-profile.component.ts
    │       ├── student-profile.component.html
    │       └── student-profile.component.css
    │
    ├── layout/
    │   ├── footer/                              # Project team credits and academic footer
    │   └── header/                              # Sticky navigation, notifications, and profile popover
    │
    ├── app.component.ts                         # Root application shell
    ├── app.routes.ts                            # Declarative Angular routing table
    ├── app.config.ts                            # Application configuration & providers
    └── styles.css                               # Global SaaS design system & theme tokens
```

---

## 5. Detailed Module Breakdown

### Module 1: Authentication & User Management
- **Demo Student Account:** Pre-configured with `student@lms.com` and `password123`. A one-click **Quick Fill** button is provided on the login page for rapid evaluator inspection.
- **Registration Form:** Validates full name, email format, department selection, and password matching with inline error feedback.
- **Route Guard:** `authGuard` intercepts unauthorized access to `/dashboard`, `/courses`, `/learning/:id`, `/assessments`, `/adaptive-learning`, and `/profile`, redirecting visitors to `/login`.
- **Session Continuity:** Maintains login state across browser reloads via LocalStorage token storage.

### Module 2: Student Dashboard
- **Welcome Hero Section:** Displays the student's name, current localized date, dynamic motivational quote, and a high-priority "Continue Learning" shortcut.
- **Metric Cards:** Four real-time indicators displaying *Total Enrolled Courses*, *Courses Completed*, *Average Quiz Score*, and *Overall Learning Progress*.
- **My Learning Row:** Shows enrolled course thumbnails, titles, instructors, percentage completion, and direct resume buttons.
- **Telemetry Visualizations:** Weekly study hours bar chart and subject-wise competency progress gauges.
- **Timeline & Upcoming Events:** Real-time log of recently completed lessons, quiz submissions, and upcoming scheduled tests.

### Module 3: Course Management
- **Six Comprehensive Courses:**
  1. *Modern Angular & Enterprise Architecture* (Web Development, Intermediate)
  2. *Advanced JavaScript & Asynchronous Programming* (Programming, Advanced)
  3. *Relational Databases & SQL Query Optimization* (Database Management, Intermediate)
  4. *Python for Data Engineering & Scientific Computing* (Data Science, Beginner)
  5. *Data Structures & Algorithmic Problem Solving* (Computer Science Fundamentals, Advanced)
  6. *Responsive Web Design: Modern HTML5 & CSS3* (Web Development, Beginner)
- **Interactive Catalog:** Live keyword search, category filter pills, difficulty dropdowns, and sorting by Title, Progress, or Duration.
- **Course Details:** Full instructor biography, course objectives checklist, chapter syllabus breakdown, and target learning outcomes.

### Module 4: Learning Content & Lesson Interface
- **Distraction-Free Environment:** Full-width player layout with collapsible chapter syllabus sidebar.
- **Rich Educational Material:** Structured lesson text, real code examples with syntax formatting, summaries, and key architectural takeaways.
- **Video Lecture Showcase:** High-definition video player placeholder with playback controls, scrub bar, and streaming indicators.
- **Progress Tracking:** Clicking **Mark as Completed** updates course progress percentage, registers completion in the activity log, triggers a notification, and persists state in LocalStorage.
- **Linear Navigation:** Previous and Next buttons with boundary detection.

### Module 5: Adaptive Learning Dashboard (Core Module)
- **Subject Competency Analysis:** Evaluates proficiency across JavaScript, Angular, HTML & CSS, DBMS, Python, and Data Structures.
- **Strength Classification:**
  - **Strong:** $\ge 75\%$ (Green indicator)
  - **Average:** $40\% - 74\%$ (Amber indicator)
  - **Weak:** $< 40\%$ (Crimson indicator)
- **Rule-Based Recommendation Engine:**
  - `Rule R-101 [Score < 40%]`: Remedial Trigger. Recommends beginner-level fundamentals, component lifecycle review, and primer lessons.
  - `Rule R-202 [40% <= Score < 70%]`: Practice & Consolidation. Recommends targeted coding exercises and index tuning drills.
  - `Rule R-303 [70% <= Score < 90%]`: Intermediate Expansion. Recommends architectural patterns and runtime profiling.
  - `Rule R-404 [Score >= 90%]`: Subject Mastery. Recommends capstone implementations and peer leadership.
- **Personalized Learning Path:** Visual roadmap charting milestones across *Beginner*, *Intermediate*, and *Advanced* tiers, dynamically showing *Completed*, *In Progress*, and *Upcoming* badges.
- **Improvement Metrics:** Calculates score deltas ($\Delta\%$), tracking previous score vs latest score, consecutive study streak, and resolved recommendations.
- **Viva Demonstration Simulator:** Interactive testing bar enabling examiners to trigger simulated test scores (e.g. Angular 85%, Python 30%, DBMS 95%) and witness real-time rule re-evaluations.

### Module 6: Quiz & Assessment System
- **Subject Coverage:** Quizzes with $\ge 5$ questions each for Angular, JavaScript, Database Management, Python, and HTML & CSS.
- **Interactive Quiz Runner:** Multiple-choice options (A, B, C, D), single-select logic, timer countdown, and interactive question palette.
- **Instant Result Computation:** Calculates percentage, pass/fail threshold evaluation, and displays detailed question-by-question review with pedagogical explanations.
- **Adaptive Feedback Loop:** Submitting a quiz automatically invokes `AdaptiveLearningService.recordQuizResult()`, refreshing student ratings and re-generating recommendations.

### Module 7: Notifications & Global State Management
- **Notification Center:** Dropdown in the top navigation with live unread badge, category indicators, mark-as-read, mark-all-read, and clear actions.
- **Benchmark Reset:** A "Reset Demo Data" option accessible from the header and profile page restores the entire application (courses, attempts, recommendations, and activity logs) to original baseline demo data.

---

## 6. How to Run and Build the Project

### Prerequisites
- Node.js (v18, v20, v22, or v26)
- npm (v9+)

### Installation
From the project directory:
```bash
npm install
```

### Running the Development Server
```bash
npm start
# or
npx ng serve --open
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Building for Production
```bash
npm run build
```
Production assets are generated in the `dist/lms-app/browser/` folder, ready for deployment on any static web server or cloud provider (e.g. Firebase, Vercel, Netlify, Apache, Nginx).

---

## 7. Academic Viva Defense Guide

When demonstrating this project to academic evaluators or external examiners:

1. **Demonstrate Login & Route Protection:**
   - Show how accessing protected routes without logging in redirects to `/login`.
   - Use the **Quick Fill** button to sign in as the demo student.
2. **Review the Student Dashboard:**
   - Point out the real-time statistics cards, active enrolled courses, and weekly learning telemetry.
3. **Explore Course Management & Learning Player:**
   - Open *Modern Angular & Enterprise Architecture*.
   - Mark a lesson as completed and show that the course progress percentage advances in real time and persists after refreshing the browser.
4. **Demonstrate the Adaptive Learning Dashboard:**
   - Highlight the six evaluated subjects and explain how Angular currently sits at 35% (*Weak*) while JavaScript sits at 88% (*Strong*).
   - Show how `Rule R-101` generates a prioritized remediation card for Angular fundamentals.
5. **Demonstrate Real-Time Adaptability via Quiz Submission:**
   - Navigate to **Assessments** and launch the *Angular Standalone & Core Architecture Quiz*.
   - Answer the questions and submit the test.
   - Return to the **Adaptive Learning Dashboard** to show how the Angular score, strength category, and recommendations immediately updated.
   - Alternatively, use the **Live Viva Demonstration Simulator** to test simulated scores on the fly!
6. **Show Configurable Team Distribution:**
   - Navigate to **Student Profile** and show the Five-Member Team Distribution panel where member names can be edited and saved.

---

## 8. License
Developed for academic submission and evaluation in the Bachelor of Technology in Computer Science and Engineering program (Academic Year 2026 - 27).
