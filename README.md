# Developer Productivity Dashboard (DevTrack Pro)

A modern, responsive, and high-performance **Developer Productivity & Engineering Dashboard** built with **Next.js (App Router)**, **Tailwind CSS**, and **TypeScript** inside `/frontend`.

---

## ⚡ Quick Start (Run Locally)

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install dependencies (if not already installed)
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Open in browser
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🚀 Features & Architecture

- **Landing Dashboard Overview**:
  - Greeting banner with active sprint countdown and deep-work streak metrics.
  - 4 Key Performance Metric KPI Cards (Focus Time, PR Velocity, Commit Streak, Sprint Score).
  - Deep Work Focus Stopwatch & Pomodoro Chamber (25m, 50m, 5m break presets with progress ring and controls).
  - Tech stack LoC distribution meter and weekly velocity bar chart.
  - Priority sprint task highlight & live Git/telemetry stream.
- **Wayfinding & Navigation**:
  - Desktop responsive sidebar with active indicators and GitHub sync status.
  - Mobile & tablet slide-over navigation drawer.
  - Top header with command search (`⌘K` / `/` hint), stopwatch status, quick developer status picker (*Deep Focus*, *In Flow*, *Reviewing PRs*, *In Standup*, *Away*), notifications bell, and profile trigger.
- **Repository & Project Hub**:
  - Filter by category (*Backend*, *Frontend*, *DevOps*, *AI / ML*, *Mobile*) and health status (*On Track*, *At Risk*, *Delayed*, *Completed*).
  - Progress indicators, repository metadata, stars/forks/PR counters, and team avatars.
- **Sprint Tasks Management**:
  - Real-time search across titles, descriptions, and tags.
  - Priority filters (*Urgent*, *High*, *Medium*, *Low*) and status tabs (*All*, *To Do*, *In Progress*, *In Review*, *Done*).
  - Interactive status cycling with instant sprint velocity progress bar updates.
  - Toggle between **List View** and **Kanban Board Column View**.
  - **New Sprint Task Modal** with form validation.
- **Live Git & Telemetry Stream**:
  - Real-time mock stream for commits, PR merges, code reviews, and deployments with commit SHA copying.
- **Developer Profile**:
  - Developer stats, editable focus status message, GitHub connection, and earned engineering badges.
- **Loading & Empty States**:
  - "Simulate Load" header toggle switch to preview shimmering loading skeletons across all views.
  - Rich empty states with action buttons when search queries or filters produce no results.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge
