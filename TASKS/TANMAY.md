# Implementation Contract & Execution Blueprint: Tanmay (Frontend Admin, Diagnostics & What-If Lead)

## 1. Role & Identity
- **Name:** Tanmay
- **Role:** Frontend Admin Controls, AI Diagnostics & What-If Disruptor Engineer
- **Ownership:** `frontend/tanmay/` exclusively.

---

## 2. Mission Statement
Build an authoritative **Administrative Command Center, AI Timetable Health Dashboard, and Live What-If Disruptor Console** in React that gives administrators and evaluators full control over NEP 2020 parameters, triggers sub-second AI timetable generation, inspects executive quality metrics, and simulates live campus disruptions with real-time clash-free re-routing and visual diff cards.

---

## 3. Team Parallelism & Contract-First Mocking Protocol

### 🚀 TRUE PARALLEL DEVELOPMENT (START CODING FROM MINUTE 1)
You do NOT have to wait for Amey's backend to be finished. You start coding immediately from **Minute 1** using the frozen API contract and mock response fixtures provided in `src/api/apiClient.js`:

```
                       FROZEN API CONTRACTS & MOCK FIXTURES
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
   AMEY (Backend)             JANHAVI (Frontend 1)           TANMAY (YOU)
   • Builds MCV Solver        • Builds Timetable Grid        • Builds Admin Portal
   • Builds Real REST APIs    • Builds Student View          • Builds AI Scorecard
   • Implements Database      • Builds Room Heatmap          • Builds What-If Disruptor
   (Runs tests locally)       (Consumes Mock Fixtures)       (Consumes Mock Fixtures)
        │                              │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       ▼
                       INTEGRATION & LIVE API SWAP
```

### Tanmay's Execution Checklist:
1. Build `AdminConfigView.jsx`, `BasketManagerView.jsx`, `DiagnosticDashboardView.jsx`, and `WhatIfDisruptorView.jsx` in `frontend/tanmay/` using mock fixture data.
2. Build UI components locally inside `frontend/tanmay/components/` (do not worry about shared UI libraries).
3. Connect your buttons and forms to `generateTimetable()`, `simulateDisruption()`, and `commitSimulation()` from `src/api/apiClient.js`.
4. When Amey brings the live backend online, your code will seamlessly switch from mock fixtures to live API data without any UI rewrites!

---

## 4. Git Workflow & Branching Rules
- **Branch Naming:** `feat/tanmay-admin-portal`, `feat/tanmay-basket-manager`, `feat/tanmay-quality-scorecard`, `feat/tanmay-whatif-disruptor`.
- **Branch Lifespan:** Small, mergeable branches. Sync with `origin/main` before starting and before opening PRs.
- **Ownership Lockdown:** You own `frontend/tanmay/`. You must **NEVER** edit files inside `backend/amey/` or `frontend/janhavi/`.
- **Shared Files Protocol:**
  - `frontend/src/App.jsx`: Amey mounts your `<AdminConfigView />` and `<WhatIfDisruptorView />` containers into the main tab shell. You do NOT edit `App.jsx` directly.
  - `frontend/src/api/apiClient.js`: Pre-built helper functions `generateTimetable()`, `simulateDisruption()`, and `commitSimulation()` are ready to use.
  - `frontend/src/styles/theme.css`: Write your view/component styles inside `frontend/tanmay/` or use scoped classes.
  - **Decoupled Grid Refresh:** When you commit a simulation or generate a new timetable, invoke the `onTimetableUpdated()` callback passed down as a prop from `App.jsx`. Never attempt to directly import or mutate Janhavi's local state.

---

## 5. AI Coding Agent Directives (For Antigravity IDE)
When an AI coding agent operates on this task file:
1. **Scope Restriction:** Modify ONLY files within `frontend/tanmay/`.
2. **Never Edit Teammates' Workspaces:** Do not touch `frontend/janhavi/` or `backend/amey/`.
3. **No Phantom Props:** Consume exact data properties (`executionTimeMs`, `qualityScore`, `metrics`, `diffs: [{ courseName, oldSlot, newSlot, reason }]`) as defined in Section 7.
4. **Verification Gate:** Verify that One-Click Generation and the What-If Disruptor modal execute cleanly without React console warnings.

---

## 6. Exact File & Module Directory Structure
```
frontend/tanmay/
├── components/
│   ├── QualityScorecard.jsx          <-- Circular score gauge (0-100%) + Hard/Soft metric bars
│   ├── AIExplanationCard.jsx         <-- Rich AI Executive Summary & Policy Recommendations
│   ├── BasketCard.jsx                <-- Visualizer card for NEP 2020 elective credit bands
│   ├── GeneratorHUD.jsx              <-- Prominent trigger button + animated 5-phase solver progress HUD
│   └── DisruptionModal.jsx           <-- Standout feature: Room/Faculty disruption trigger modal
├── views/
│   ├── AdminConfigView.jsx           <-- Top-level tab: Pre-loaded template loader & resource overview
│   ├── BasketManagerView.jsx         <-- Top-level tab: NEP 2020 Major/Minor elective basket manager
│   ├── DiagnosticDashboardView.jsx   <-- Top-level tab: AI Health Scorecard & Constraint Doctor
│   └── WhatIfDisruptorView.jsx       <-- Top-level tab: Live disruption simulator & side-by-side diff console
└── hooks/
    ├── useSolverControls.js          <-- Triggers POST /api/timetable/generate with animated progress
    └── useWhatIfSimulation.js        <-- Manages simulation state, diffs, and live commit/discard actions
```

---

## 7. Exact Component Props & Logic Specifications

### Component 1: `GeneratorHUD.jsx` (`useSolverControls.js`)
- **Action Button:** Prominent `"⚡ Generate AI Timetable"` button.
- **5-Phase Progress State Machine:**
  - `Phase 1: Normalizing NEP Curricula & Slicing Lab Blocks...`
  - `Phase 2: Constructing Cohort Conflict Graph G=(V,E)...`
  - `Phase 3: Synchronizing Minor & MDC Elective Baskets...`
  - `Phase 4: Executing MCV Backtracking Solver...`
  - `Phase 5: Auditing Hard Invariants (0 Faculty/Room Clashes)...`
- **Execution HUD:** Displays solver time badge (e.g. `⚡ Solved in 420ms | 0 Hard Clashes`).

### Component 2: `QualityScorecard.jsx`
- **Props:** `metrics: { clashCount, roomUtilization, facultyLoadBalance, studentGapScore }, qualityScore: Number`
- **Visuals:** Circular SVG gauge ($94/100$) + 4 metric progress bars.

### Component 3: `AIExplanationCard.jsx`
- **Props:** `aiSummary: String, recommendations: Array<String>`
- **Visuals:** Natural language executive briefing + 2–3 actionable bullets with lightbulb icons.

---

## 8. Standout Feature: What-If Disruptor Console (`WhatIfDisruptorView.jsx` & `DisruptionModal.jsx`)

### User Workflow & Interaction Logic:
1. **Disruption Trigger:**
   - Option A: **"Simulate Room Maintenance"** (Select room `LAB_CS1`, day `Wednesday`).
   - Option B: **"Simulate Faculty Leave"** (Select teacher `Dr. A. Verma`, day `Thursday`).
2. **Side-by-Side Diff Cards (`DiffCard.jsx`):**
   ```
   ┌────────────────────────────────────────────────────────────┐
   │ ⚠️ RELOCATED SESSION: CS201 Data Structures Lab            │
   │                                                            │
   │ ❌ OLD SLOT: Wednesday • Period 3-4 (11:00 AM) • LAB_CS1   │
   │    (Reason: Room LAB_CS1 locked for maintenance on Wed)     │
   │                                                            │
   │ ✅ NEW SLOT: Thursday • Period 5-6 (01:40 PM) • LAB_CS2    │
   │    (AI Verification: 0 student clashes, Room LAB_CS2 open) │
   └────────────────────────────────────────────────────────────┘
   ```
3. **Actions:**
   - `[Apply Changes to Live Timetable]` $\rightarrow$ Calls `POST /api/timetable/simulate/commit` and triggers `onTimetableUpdated()`.
   - `[Discard Simulation]` $\rightarrow$ Reverts preview without altering live schedule.

---

## 9. Data Hooks & API Integration (`useWhatIfSimulation.js`)
```javascript
import { useState } from 'react';
import { simulateDisruption, commitSimulation } from '../../src/api/apiClient';

export function useWhatIfSimulation(onCommitSuccess) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);

  const runSimulation = async (disruptionPayload) => {
    setIsSimulating(true);
    setError(null);
    try {
      const result = await simulateDisruption(disruptionPayload);
      setSimulationResult(result);
    } catch (err) {
      setError(err.message || 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  const applySimulation = async () => {
    try {
      await commitSimulation();
      setSimulationResult(null);
      if (onCommitSuccess) onCommitSuccess();
    } catch (err) {
      setError(err.message || 'Failed to commit simulation');
    }
  };

  const discardSimulation = () => {
    setSimulationResult(null);
    setError(null);
  };

  return { isSimulating, simulationResult, error, runSimulation, applySimulation, discardSimulation };
}
```

---

## 10. Definition of Done
- Admin can load pre-configured template and view resource summaries.
- Clicking "Generate AI Timetable" triggers solver HUD animation and delivers active schedule in $<1\text{s}$.
- Quality Scorecard renders animated circular gauge and accurate percentage metric bars.
- AI Explanation card displays natural language briefing.
- What-If Disruptor allows simulating room/teacher disruptions, renders side-by-side diff cards, and successfully applies changes to the live timetable.
