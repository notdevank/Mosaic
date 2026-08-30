# Mosaic

A local-first life workspace. Daily planning, tasks, habits, journaling, and domain tracking (academics, fitness, nutrition) in one calm, tactile app that never leaves your device.

Your data is 100% local. No accounts, no mandatory cloud, no telemetry.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tauri](https://img.shields.io/badge/Tauri-v2-FFC107?style=flat-square&logo=tauri)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Why Mosaic

Most productivity tools force a bad trade: spread your life across a dozen disconnected apps, or hand your data to someone else's server. Mosaic does neither. It's a single workspace that runs natively on desktop and web, with everything stored on your machine. The interface is intentionally quiet, a warm monochrome palette with sage accents, so the tool stays out of the way and the work stays front and center.

---

## Screenshots

| Home Dashboard | Journal & Markdown Studio |
| :---: | :---: |
| ![Dashboard](./public/screenshots/dashboard.png) | ![Journal](./public/screenshots/journal.png) |

| Calendar View | Gym & Workout Studio |
| :---: | :---: |
| ![Calendar](./public/screenshots/calendar.png) | ![Gym](./public/screenshots/gym.png) |

| Activity Heatmap |
| :---: |
| ![Heatmap](./public/screenshots/heatmap.png) |

---

## Features

### Core workspace

- **Editorial Dashboard** — Live clock, waking-day progress, customizable greeting, agenda preview, and a daily reflection card.
- **Journal Studio** — Write and Read modes with live Markdown rendering, reading-time estimate, and mood tracking.
- **Gym & Workout Studio** — Real-time set logging, weight and rep inputs, volume calculation, and a customizable 7-day split.
- **Task Management** — Priority tags, due dates, subtasks, and quick capture.
- **Calendar & Agenda** — Month, week, and day views that map tasks, events, and deadlines.
- **Habit Tracking** — Daily check-ins, streaks, and completion history.
- **Activity Heatmap** — A 365-day matrix across habits, study, workouts, and tasks.
- **Inbox & Quick Capture** — Dump unprocessed thoughts, then convert them to tasks later.

### Life modules

- **Academics** — Course catalog, target GPA calculator, attendance counters, assignment deadlines, and a study session timer.
- **Gym & Fitness** — Workout logger, volume metrics, and a weekly training split.
- **Diet & Nutrition** — Meal logging, macro distribution (protein, carbs, fats), and hydration tracking.
- **Communication** — Contact directory with relationship notes and follow-up reminders.

---

## Architecture & Storage

Mosaic is built local-first, with zero mandatory cloud dependencies.

- **Desktop** — SQLite (`mosaic.db`) through the Tauri v2 runtime.
- **Web & PWA** — Reactive state persisted with IndexedDB and `localStorage`.
- **Backup & restore** — One-click JSON snapshot export and import from Settings.
- **Passcode** — Optional 4-digit PIN lock screen.

---

## Download & Install

Grab a prebuilt binary for your platform:

| Platform | Download | Format |
| :--- | :--- | :--- |
| macOS | [Universal .dmg](https://github.com/notdevank/Mosaic/releases/latest) | Apple Silicon & Intel |
| Windows | [.exe installer](https://github.com/notdevank/Mosaic/releases/latest) | 64-bit |
| Linux | [.AppImage / .deb](https://github.com/notdevank/Mosaic/releases/latest) | AppImage & Debian |
| Arch Linux | `makepkg -si` via `PKGBUILD` | `pkg.tar.zst` |
| Android / Mobile | PWA / APK | Progressive Web App & APK |

---

## Tech Stack

- **Frontend**: React 18, TypeScript 5, Vite 5
- **Desktop**: Tauri v2 (Rust)
- **Styling**: Tailwind CSS 3 (warm monochrome + sage accents)
- **State**: Zustand 4
- **Icons**: Lucide React

---

## Development

```bash
# Clone the repository
git clone https://github.com/notdevank/Mosaic.git
cd Mosaic

# Install dependencies
npm install

# Start the web dev server
npm run dev

# Start the Tauri desktop app
npm run tauri:dev
```

The web app runs at `http://localhost:3000`.

---

## License

[MIT](LICENSE)
