<div align="center">

```
  ███╗   ███╗ ██████╗ ███████╗ █████╗ ██╗ ██████╗ 
  ████╗ ████║██╔═══██╗██╔════╝██╔══██╗██║██╔════╝ 
  ██╔████╔██║██║   ██║███████╗███████║██║██║      
  ██║╚██╔╝██║██║   ██║╚════██║██╔══██║██║██║      
  ██║ ╚═╝ ██║╚██████╔╝███████║██║  ██║██║╚██████╗ 
  ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ 
```

**A local-first Personal Operating System built for focus, tracking, and daily reflection.**

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://github.com/pmndrs/zustand)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📌 About Mosaic

**Mosaic** is a unified personal dashboard designed to consolidate daily planning, habit forming, goal setting, journaling, and domain tracking into a single web workspace. Built with a clean, typography-led editorial UI, it runs completely local-first inside your browser with no cloud dependencies required.

---

## ⚡ Features

### 🌅 1. Dashboard (Home)
- **Time-Aware Greeting & Live Clock**: Dynamic greeting (`Good Morning`, `Good Afternoon`, etc.) and real-time clock.
- **Waking-Day Progress Bar**: Visual progress indicator tracking time elapsed across your waking day (6:00 AM – 12:00 AM).
- **Daily Snapshot Tiles**: Quick metrics for completed tasks, habit check-ins, and active goals.
- **Unified Overview**: Today's scheduled events, task checklist, habit toggles, and daily log preview.

### 📋 2. Task Management
- **Prioritization**: Assign `High`, `Medium`, or `Low` priority tags.
- **Due Dates & Times**: Schedule tasks with specific due dates and time slots.
- **Checkable Subtasks**: Add and check off subtasks within any parent task.
- **Recurrence Rules**: Set tasks to repeat daily, on weekdays, weekly, biweekly, monthly, or custom intervals.
- **Domain Association**: Tag tasks with specific Goals, Projects, or Life Areas.

### 🗓️ 3. Calendar
- **Grid Views**: Switch between Month, Week, and Day schedule layouts.
- **Event Scheduling**: Create calendar events with start/end times, location, and notes.
- **Integrated View**: See scheduled tasks, exams, workout logs, and goals directly on the calendar grid.

### 🔁 4. Habits & Streaks
- **Weekly Tracking Grid**: Check off daily habits across a Monday–Sunday grid.
- **Streak Calculation**: View current and best completion streaks for each habit.
- **Completion Effects**: Audio tone and ambient particle visual feedback upon completing items.

### 🎯 5. Multi-Tier Goals
- **Goal Horizons**: Categorize goals into `Long-term`, `Yearly`, `Monthly`, `Weekly`, and `Daily` tiers.
- **Progress Tracking**: Progress percentage sliders (0–100%) and target dates.

### 📓 6. Daily Log & Bio-Metrics
- **Self-Assessment Sliders**: Log daily ratings for `Mood` (1–10), `Energy` (1–10), and `Focus` (1–10).
- **Structured Journaling**: Record daily Wins, Obstacles/Problems, and Tomorrow's Intention.
- **Auto-Collated Timeline**: View an automatically generated timeline of all completed tasks, activities, and workouts logged on that date.
- **On This Day**: Look back at daily logs recorded exactly one year prior.

### 🟩 7. Activity Heatmap
- **365-Day Contribution Grid**: GitHub-style heatmap tracking overall daily activity density.
- **Area Filtering**: Filter activity intensity by specific Life Areas (Academics, Gym, Nutrition, etc.).
- **Day Inspector**: Click any cell to inspect logged activities, habits, and tasks for that date.

### 📈 8. Plan vs Reality
- **7-Day Comparison**: Compare scheduled calendar events and planned tasks against actual completed tasks, study hours, and workout duration.

### 🔄 9. Periodic Reviews
- **Weekly & Monthly Audits**: Guided review logs calculating completed task totals, total study hours, workout counts, and habit completion percentages.
- **Reflection Prompts**: Fill out fields for *"What went well"*, *"What didn't go well"*, *"What to change"*, and *"Next period priorities"*.

### 📥 10. Inbox & Quick Capture
- **Quick Capture Modal**: Global modal to capture quick thoughts or tasks from anywhere (`Cmd/Ctrl + K`).
- **Inbox Converter**: Convert captured inbox notes directly into actionable tasks.

---

## 🎓 Specialized Life Areas

Mosaic includes dedicated views tailored to specific life domains:

| Life Area | Key Capabilities |
| :--- | :--- |
| **🎓 Academics** | Course list, Target vs Actual GPA calculator, Class attendance counters, Assignment deadline manager, Exam countdowns, and a built-in Study Session recorder. |
| **🏋️ Gym & Fitness** | Mon–Sun muscle group split planner (`chest`, `back`, `legs`, `shoulders`, `arms`, `core`, `rest`), Exercise database, Workout logger (sets, reps, weight in kg), and Body Measurement tracker (weight, body fat %). |
| **🥗 Diet & Nutrition** | Meal logger (Breakfast, Lunch, Dinner, Snacks), calorie counter, macronutrient tracking (Protein, Carbs, Fats), daily water hydration tracker, and daily macro targets. |
| **💬 Communication (CRM)** | Contact directory with relationship context, last interaction dates, follow-up reminders, contact information, and interaction history logs. |
| **🎨 Custom Areas** | Create personalized areas with custom titles, icons, and descriptions. |

---

## 🔒 Security & Data Management

- **100% Local Storage**: All data is stored directly in browser `localStorage` (with optional SQLite support).
- **Startup Passcode PIN Lock**: Optional 4-digit PIN lock screen on application launch to keep your log private on shared computers.
- **Backup Export & Import**: 1-click JSON data export and import tools under Settings.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **State Management** | Zustand 4 (with Persist middleware) |
| **Build Tool** | Vite 5 |
| **Icons** | Lucide React |

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/devank-hub/Mosaic.git
cd Mosaic
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

### 4. Build for production
```bash
npm run build
```
The compiled static assets will be output to `dist/`.

---

## ⌨️ Shortcuts

| Key Shortcut | Action |
| :--- | :--- |
| `Cmd` + `K` / `Ctrl` + `K` | Open Quick Capture & Global Search |
| `Esc` | Close active modal |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
