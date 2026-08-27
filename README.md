<div align="center">

# 🏛️ MOSAIC — Personal Life OS

**An elegant, local-first personal management system built for high intentionality.**  
*Tasks, habits, goals, calendar, daily reflections, deep focus metrics, and specialized life areas in one minimal workspace.*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://github.com/pmndrs/zustand)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

---

</div>

## 🌟 Overview

**Mosaic** is a comprehensive, distraction-free **Life Operating System (Life OS)** designed to help you plan, track, and execute your days with clarity and purpose. 

Rather than fragmenting your life across separate apps for tasks, calendar events, workout logs, habit trackers, and journals, Mosaic consolidates everything into a single, cohesive web interface anchored by a typography-first editorial design system.

---

## ✨ Key Features

### 📐 1. Daily Dashboard (Home)
- **Editorial Greeting & Clock**: Dynamic time-based greeting, live clock, and a waking-day progress bar (6:00 AM – 12:00 AM).
- **Snapshot Analytics**: Instant status counters for today's tasks, habits, and active focus goals.
- **Unified Day View**: View your schedule, high-priority tasks, habit toggles, and daily logs in one place.

### 📋 2. Task Management & Subtasks
- **Prioritization & Urgency**: Assign `High`, `Medium`, or `Low` priority to tasks with optional due dates and times.
- **Subtasks & Breakdown**: Break down complex tasks into checkable subtasks.
- **Recurrence Engine**: Set tasks to repeat daily, on weekdays, weekly, biweekly, monthly, or custom intervals.
- **Cross-Linking**: Associate tasks directly with specific **Goals**, **Projects**, or **Life Areas**.

### 🗓️ 3. Integrated Calendar
- **Flexible Grid Views**: Toggle seamlessly between Day, Week, and Month schedule layouts.
- **Custom Event Tagging**: Color-coded calendar events with location details, custom recurrence rules, and notes.

### 🔁 4. Habit Tracking & Streaks
- **Streak Tracker**: Monitor daily or weekly target frequencies with visual completion histories.
- **Completion Sound & Confetti**: Subtle sound feedback and visual effects upon completing habits or tasks.

### 🎯 5. Multi-Tiered Goals
- **Structured Hierarchy**: Organize long-term vision into `Long-term`, `Yearly`, `Monthly`, `Weekly`, and `Daily` goals.
- **Progress Tracking**: Visual progress bars (0–100%) mapped directly to sub-milestones and linked activities.

### 📖 6. Daily Log & Mindful Reflections
- **State Metrics**: Quantify your daily `Mood` (1–10), `Energy` (1–10), and `Focus` (1–10).
- **Structured Reflection**: Record daily Wins, Blockers/Problems, and Tomorrow's Intention.
- **Manual Timeline**: Log hourly activities or notes throughout the day.

### 📊 7. GitHub-Style Activity Heatmap
- **Visual Productivity Matrix**: Track your total activity density across all life areas over time.
- **Filterable Breakdown**: Inspect deep work, workouts, study sessions, and task completions.

### 🏗️ 8. Projects & Milestones
- **Project Workspaces**: Group tasks into focused projects with deadline tracking, status phases (`Planning`, `Active`, `Paused`, `Completed`), and milestone progress.

### 🔄 9. Periodic Reviews
- **Weekly & Monthly Audits**: Guided review prompts to evaluate completed tasks, study hours, workout consistency, what went well, and what to change.

### 📥 10. Quick Capture & Global Search
- **Universal Quick Capture**: Instant modal to dump thoughts, tasks, or inbox notes from anywhere.
- **Global Search**: Search across tasks, goals, projects, habits, courses, people, and daily logs instantly.

---

## 🎓 Specialized Life Areas

Mosaic features deep, specialized domain modules tailored for key life dimensions:

| Life Area | Highlights & Features |
| :--- | :--- |
| **🎓 Academics** | Course management, GPA targets, Attendance counter, Assignment due dates, Exam countdowns, and an integrated Study Session timer. |
| **🏋️ Gym & Fitness** | Exercise database, Weekly workout split planner (Mon–Sun muscle groups), Workout session logger (sets, reps, weight, PRs). |
| **🥗 Diet & Nutrition** | Meal logging (Breakfast, Lunch, Dinner, Snacks), calorie counter, protein/carbs/fats breakdown, and daily hydration tracker. |
| **💬 Personal CRM** | Contact manager with relationship context, last interaction timestamps, follow-up reminders, and interaction history. |
| **🎨 Custom Areas** | Create personalized domains with custom icons, descriptions, and color palettes. |

---

## 🔒 Privacy, Security & Data Ownership

- **100% Local-First**: All your data stays inside your browser (`localStorage` / local database). No server tracking, no external data collection.
- **Passcode PIN Protection**: Optional lock screen on startup to keep your personal journal and metrics private on shared devices.
- **Backup & Export**: Instant 1-click JSON backup export and restore capabilities in Settings.

---

## 🛠️ Tech Stack

```
Mosaic/
├── Frontend Core   : React 18 (TypeScript)
├── Build System    : Vite 5
├── State & Storage : Zustand (Persist middleware with localStorage)
├── Styling         : Tailwind CSS 3 + PostCSS
├── Typography      : Serif & Monospace editorial pairing
└── UI Icons        : Lucide React
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/devank-hub/Mosaic.git
cd Mosaic
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory, ready to be hosted on GitHub Pages, Vercel, Netlify, or any static web host.

---

## 💻 Project Structure

```
src/
├── components/
│   ├── areas/          # Specialized views (Academics, Gym, Nutrition, CRM)
│   ├── common/         # Modals (Quick Capture, Global Search, PIN Lock)
│   ├── gym/            # Weekly split & workout planners
│   ├── layout/         # Header, Sidebar, BottomNav
│   └── views/          # Main views (Home, Tasks, Goals, Habits, Heatmap, etc.)
├── db/                 # Storage adapter (localStorage & SQLite fallback)
├── services/           # Data synchronization services
├── store/              # Zustand store & seed data
├── types/              # TypeScript interfaces & type definitions
└── utils/              # Sound effects, confetti, and date utility helpers
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">

---
*Crafted for focus, clarity, and personal growth.*

</div>
