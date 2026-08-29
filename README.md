# Mosaic

> A local-first Personal Life OS for planning, tracking, journaling, and reflection.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tauri](https://img.shields.io/badge/Tauri-v2-FFC107?style=flat-square&logo=tauri)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Table of Contents
- [Why Mosaic](#why-mosaic)
- [Screenshots](#screenshots)
- [Core Features](#core-features)
- [Life Areas](#life-areas)
- [Tech Stack](#tech-stack)
- [Local-First Data Model](#local-first-data-model)
- [Quick Start](#quick-start)
- [Build and Package](#build-and-package)
- [Optional Sync Server](#optional-sync-server)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Why Mosaic
Mosaic brings your day-to-day system into one workspace: tasks, habits, goals, journal entries, reviews, calendar planning, and domain-specific life areas. It is designed to run well as a desktop app (Tauri) and in the browser, while keeping your data under your control.

## Screenshots

| Home Dashboard | Journal Studio |
| :---: | :---: |
| ![Dashboard](./public/screenshots/dashboard.png) | ![Journal](./public/screenshots/journal.png) |

| Calendar View | Gym Studio |
| :---: | :---: |
| ![Calendar](./public/screenshots/calendar.png) | ![Gym](./public/screenshots/gym.png) |

| Activity Heatmap |
| :---: |
| ![Heatmap](./public/screenshots/heatmap.png) |

## Core Features
- **Home dashboard** with greeting, progress context, and daily focus.
- **Today + Tasks** workflows for capture, prioritization, and execution.
- **Journal studio** with write/read experience and mood-aware entries.
- **Calendar views** for month/week/day planning.
- **Habits + heatmap** for consistency tracking over time.
- **Projects, goals, reviews, and archive** for longer planning loops.
- **Quick capture + inbox** for low-friction thought collection.
- **Passcode lock** and personalization from Settings.
- **Backup/restore** using portable JSON snapshots.

## Life Areas
Mosaic includes built-in area modules and allows custom areas:
- **Academics**
- **Gym & Fitness**
- **Nutrition**
- **Communication**
- **Custom Areas**

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Desktop Runtime:** Tauri v2 + Rust
- **State Layer:** Zustand
- **Desktop Persistence:** SQLite (`@tauri-apps/plugin-sql`)
- **Web Persistence:** `localStorage` / IndexedDB-backed browser storage
- **Styling:** Tailwind CSS

## Local-First Data Model
- Desktop builds persist state in a local SQLite database (`sqlite:mosaic.db`) with localStorage mirroring for compatibility.
- Web usage persists in browser storage.
- Import/export support in Settings enables manual backups.
- No cloud account is required for core usage.

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Rust toolchain (required for Tauri desktop development/build)
- Platform-specific Tauri system dependencies (Linux/macOS/Windows)

### 1) Install dependencies
```bash
npm install
```

### 2) Run in web mode
```bash
npm run dev
```
Open `http://localhost:3000`.

### 3) Run as desktop app (Tauri)
```bash
npm run tauri:dev
```

## Build and Package

### Web production build
```bash
npm run build:web
```

### Desktop production build
```bash
npm run tauri:build
```

### Platform helpers
```bash
npm run build:linux
npm run build:windows
npm run build:android
```

### Arch package
```bash
npm run arch:package
```
(Uses `PKGBUILD` at the repository root.)

## Optional Sync Server
A lightweight sync server exists at `server/sync-server.cjs`.

Run it with:
```bash
node server/sync-server.cjs
```

Default endpoints:
- `GET /health`
- `GET/POST /api/sync`

> Security note: set a strong `SECRET_TOKEN` before exposing the server beyond local/private networks.

## Project Structure
```text
Mosaic
├─ src/                 # React app source
│  ├─ components/       # Views, areas, layout, shared UI
│  ├─ store/            # Zustand state and seed data
│  ├─ db/               # SQLite storage adapter
│  └─ services/         # Sync and integration services
├─ src-tauri/           # Rust/Tauri desktop runtime
├─ public/              # Static assets and screenshots
├─ server/              # Optional sync server
└─ PKGBUILD             # Arch Linux packaging recipe
```

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Make focused changes with clear commit messages.
4. Validate locally (`npm run build`, and desktop flows if relevant).
5. Open a pull request with a concise summary.

## License
[MIT](./LICENSE)
