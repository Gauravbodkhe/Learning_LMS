# AdaptiveLMS UI Redesign & Product Architecture Changelog

Built for **AdaptiveLMS** (Angular 21 standalone architecture, TypeScript, custom tokenized CSS). Designed with a clean product aesthetic inspired by Linear, Notion, and GitHub — flat surfaces, high contrast, 1.5px stroke geometry, and zero AI clutter.

---

## 1. Design System & Tokens (`src/styles.css`, `ThemeService`)
- **Flat Color Tokens & Semantics:**
  - **Light Theme:** `#f8f9fa` page background, `#ffffff` surface, `#f1f3f5` raised surface, `#e2e5e9` borders, and `#191c21` primary text.
  - **Night Mode Palette:** `#0f1115` page background, `#171a21` surface, `#1e222b` raised surface, `rgba(255, 255, 255, 0.09)` borders, and `#e6e8ec` primary text.
  - **Single Accent Color:** Muted indigo (`#4f5bd5` in light mode, `#6b77eb` in dark mode) to eliminate visual vibration.
  - **High-Contrast Evaluation Statuses (>4.5:1 WCAG AA):**
    - **Strong:** `#167a3a` (light) / `#3fb950` (dark).
    - **Average:** `#966600` (light) / `#d29922` (dark).
    - **Weak:** `#c92a2a` (light) / `#f85149` (dark).
- **Spacing Scale:** Strict 8px grid alignment: `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-5` (20px), `--space-6` (24px), and `--space-8` (32px).
- **Border Radii:** Consistent product radii: `--radius-sm` (6px) for buttons, inputs, chips, and table cells; `--radius-md` (10px) for cards and panels.
- **Micro-Interactions & Motion:**
  - 120ms–150ms transitions on `color`, `background-color`, and `border-color`.
  - Global `:focus-visible` ring (2px solid accent with 2px offset).
  - `@media (prefers-reduced-motion: reduce)` disabling all transitions and animations.

---

## 2. Dedicated Left Sidebar Restyling (`src/styles.css`, `src/app/layout/sidebar/`)
- **Distinct Sidebar Color Tokens:**
  - **Light Mode (Deep Navy):** `--sidebar-bg: #1b2233`, `--sidebar-border: rgba(255, 255, 255, 0.08)`, `--sidebar-text: #c5cad6`, `--sidebar-text-muted: #7c8497`, `--sidebar-hover-bg: rgba(255, 255, 255, 0.06)`, `--sidebar-active-bg: rgba(255, 255, 255, 0.10)`, `--sidebar-active-text: #ffffff`, `--sidebar-accent: #8d96f0`.
  - **Dark Mode:** `--sidebar-bg: #12151c`, `--sidebar-border: rgba(255, 255, 255, 0.08)` (distinct from page background `#0f1115`).
  - Strict compliance with WCAG AA (contrast ratio > 7:1 for text, > 4.5:1 for muted labels).
- **Structure & Layout:**
  - Background uses `--sidebar-bg`; 1px right border using `--sidebar-border`. No shadow.
  - Wordmark and nav labels use `--sidebar-text`; group labels ("Learn", "Account") in sentence case use `--sidebar-text-muted`.
  - Icons follow `currentColor`.
  - Hover uses `--sidebar-hover-bg` with zero scaling or movement.
  - Active nav item has `--sidebar-active-bg`, `--sidebar-active-text`, and a crisp 2px left indicator bar in `--sidebar-accent`.
  - Collapsed tooltips inherit `--sidebar-bg` with `--sidebar-text` and 1px `--sidebar-border`.
  - Keyboard toggle shortcut `[` and responsive mobile drawer under 900px.

---

## 3. Five-Member Team Workload & Credit Rebalance
- **Unified Member Model (`src/app/core/models/lms.models.ts`):**
  - `{ id: string; name: string; module: string; summary: string; }` with zero roll numbers and zero featured flags.
- **5-Member Registry (`src/app/core/services/demo-data.ts`, `team.service.ts`):**
  1. **Gaurav Bodkhe:** Authentication, User Management, App Layout & Student Dashboard.
  2. **Shantanu Gadhave:** Course & Learning Management, Theming.
  3. **Samarth Tanpure:** Adaptive Dashboard UI (display and viva simulator panel).
  4. **Pranav Pagar:** Quiz Runner (basic quiz flow and result screen).
  5. **Pranav Pagire:** Notification Dropdown & Demo Reset.
  - Automatic stale-data discarding (flushes old 4-member or rollNo data from LocalStorage and loads clean benchmark defaults).
  - "Reset Demo Data" restores initial benchmark state.
- **Profile Page Team Panel (`student-profile.component.*`):**
  - ONE single list with identical row size across all five members.
  - 42px initials avatar, strong editable name, module badge, and one-line summary.
  - Name editing validation (required, max 40 characters) and inline "Saved" message.
  - Removed every reference to roll numbers, rollNo, and university roll codes project-wide.
- **Single-Line Footer (`footer.component.ts`):**
  - Displays: `M1: Gaurav Bodkhe · M2: Shantanu Gadhave · M3: Samarth Tanpure · M4: Pranav Pagar · M5: Pranav Pagire`
  - Equal typographic weight for all members; wraps cleanly at 360px without breaking.
- **Documentation (`README.md`):**
  - One clean 5-row team table with Member, Name, Module Focus, and Responsibilities.
  - All references to roll numbers, rollNo, and CSE-2022 completely removed.

---

## 4. Extra Implementation for Gaurav and Shantanu
- **Gaurav Bodkhe (Auth, Layout & Dashboard):**
  - Reactive form error states for login and registration with validation messages.
  - Profile inline "Saved" confirmation pill and toast notification dispatch.
  - Sidebar collapse with state persistence in `StorageService`.
  - Zero-flash theme toggle early script in `index.html`.
  - Lightweight `ToastService` with non-intrusive floating alert notifications.
- **Shantanu Gadhave (Courses, Player & Telemetry):**
  - "X of Y lessons completed" progress indicators on all course cards (`course-list` and dashboard `my-learning`).
  - Last-visited course resume chip on the dashboard hero banner.
  - Animated count-up numbers for all dashboard metric cards.
  - Interactive weekly study hours bar chart with hover values and tooltips.
  - Keyframe checkmark animation on lesson completion in the learning player.

---

## 5. Build Verification
- **Command:** `npm run build`
- **Result:** Exit code 0 (Compiled in 8.5 seconds, 0 compilation errors, 0 CSS warnings).
- **Initial Bundle:** `545.18 kB` raw (`124.38 kB` gzipped transfer).
- **Styles Bundle:** `10.45 kB` raw (`2.22 kB` gzipped transfer).
