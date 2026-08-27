# Mosaic

A personal Life OS web application built with **React**, **TypeScript**, and **Zustand**. Mosaic brings together tasks, goals, habits, calendars, daily logs, and life-area tracking into a single, cohesive workspace.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- **Dashboard** — At-a-glance overview of your day with quick-capture
- **Calendar** — Day/week/month views with event management
- **Tasks** — Full task manager with priorities and due dates
- **Goals** — Long-term goal tracking with progress indicators
- **Habits** — Daily habit streaks and consistency tracking
- **Daily Log** — Journaling and daily reflections
- **Heatmap** — GitHub-style activity heatmap across all areas
- **Projects** — Project-based task grouping
- **Reviews** — Periodic review prompts (weekly, monthly)
- **Inbox** — Quick-capture inbox for unsorted thoughts
- **Life Areas** — Dedicated spaces for Academics, Gym, Nutrition, Communication, and custom areas
- **PIN Lock** — Optional passcode lock on startup
- **Dark Mode** — Full dark theme support
- **Global Search** — Search across all your data

## Tech Stack

| Layer    | Technology            |
| -------- | --------------------- |
| Frontend | React 18 + TypeScript |
| Styling  | Tailwind CSS 3        |
| State    | Zustand               |
| Storage  | localStorage          |
| Bundler  | Vite 5                |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/devank-hub/Mosaic.git
cd Mosaic

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server.

## Project Structure

```
Mosaic/
├── src/
│   ├── components/
│   │   ├── areas/          # Life-area specific views
│   │   ├── common/         # Shared UI components
│   │   ├── layout/         # Sidebar, Header, BottomNav
│   │   └── views/          # Main app views
│   ├── db/                 # Storage layer (localStorage)
│   ├── services/           # Business logic
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── index.html
└── package.json
```

## License

[MIT](LICENSE)
