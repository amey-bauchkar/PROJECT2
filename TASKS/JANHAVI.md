# Implementation Contract & Execution Blueprint: Janhavi (Frontend Visualization Lead)

## 1. Role & Identity
- **Name:** Janhavi
- **Role:** Frontend Timetable Visualization & UX Engineer
- **Ownership:** `frontend/janhavi/` exclusively.

---

## 2. Mission Statement
Build an exceptionally responsive, beautiful, and interactive **Multi-Perspective Timetable Visualization Suite** in React that enables evaluators, students, and faculty to explore clash-free NEP 2020 schedules across Master, Student Cohort, Faculty Workload, and Room Heatmap views with instant sub-50ms filtering and prominent 0-clash proof.

---

## 3. Team Parallelism & Contract-First Mocking Protocol

### 🚀 TRUE PARALLEL DEVELOPMENT (START CODING FROM MINUTE 1)
You do NOT have to wait for Amey's backend to be finished. You start coding immediately from **Minute 1** using the frozen API contract and mock response fixtures provided in `src/api/apiClient.js`:

```
                       FROZEN API CONTRACTS & MOCK FIXTURES
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
   AMEY (Backend)             JANHAVI (YOU)                  TANMAY (Frontend 2)
   • Builds MCV Solver        • Builds Timetable Grid        • Builds Admin Portal
   • Builds Real REST APIs    • Builds Student View          • Builds AI Scorecard
   • Implements Database      • Builds Room Heatmap          • Builds What-If Disruptor
   (Runs tests locally)       (Consumes Mock Fixtures)       (Consumes Mock Fixtures)
        │                              │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       ▼
                       INTEGRATION & LIVE API SWAP
```

### Janhavi's Execution Checklist:
1. Build `TimetableGrid.jsx`, `MasterTimetableView.jsx`, `StudentTimetableView.jsx`, `FacultyTimetableView.jsx`, and `RoomHeatmapView.jsx` in `frontend/janhavi/` using mock fixture data.
2. Build UI components locally inside `frontend/janhavi/components/` (do not worry about shared UI libraries).
3. Once your views render cleanly, connect to `getActiveTimetable()` from `src/api/apiClient.js`.
4. When Amey brings the live backend online, your code will seamlessly switch from mock fixtures to live API data without any UI rewrites!

---

## 4. Git Workflow & Branching Rules
- **Branch Naming:** `feat/janhavi-master-grid`, `feat/janhavi-student-view`, `feat/janhavi-room-heatmap`, `fix/janhavi-grid-overflow`.
- **Branch Lifespan:** Small, mergeable branches. Sync with `origin/main` before starting and before opening PRs.
- **Ownership Lockdown:** You own `frontend/janhavi/`. You must **NEVER** edit files inside `backend/amey/` or `frontend/tanmay/`.
- **Shared Files Protocol:**
  - `frontend/src/App.jsx`: Amey mounts your `<MasterTimetableView />` container into the main tab shell. You do NOT edit `App.jsx` directly.
  - `frontend/src/api/apiClient.js`: Pre-built helper functions `getActiveTimetable()` and `getDemoConfig()` are ready to use.
  - `frontend/src/styles/theme.css`: Write your view/component styles inside `frontend/janhavi/` or use scoped classes.

---

## 5. AI Coding Agent Directives (For Antigravity IDE)
When an AI coding agent operates on this task file:
1. **Scope Restriction:** Modify ONLY files within `frontend/janhavi/`.
2. **Never Edit Teammates' Workspaces:** Do not touch `frontend/tanmay/` or `backend/amey/`.
3. **No Phantom Props:** Consume exact data properties (`day`, `period`, `courseName`, `category`, `facultyName`, `roomNumber`, `sessionType`, `blockLength`) as defined in Section 7.
4. **Verification Gate:** Verify that all 4 perspective views render without React console errors and handle loading, empty, and error states gracefully.

---

## 6. Exact File & Module Directory Structure
```
frontend/janhavi/
├── components/
│   ├── TimetableGrid.jsx             <-- Core Day x Period 2D Matrix renderer
│   ├── TimeSlotCard.jsx              <-- Individual slot card with NEP category badge & tooltip
│   ├── LabBlockCard.jsx              <-- Multi-period continuous block renderer (stretches across periods)
│   ├── FilterBar.jsx                 <-- Search input, Department filter, Semester picker
│   └── VerificationHUD.jsx           <-- Pulsing green "0 Hard Clashes | 100% Invariant Safe" banner
├── views/
│   ├── MasterTimetableView.jsx       <-- Top-level tab: Full institutional schedule grid
│   ├── StudentTimetableView.jsx      <-- Top-level tab: Personalized Major + Minor elective schedule
│   ├── FacultyTimetableView.jsx      <-- Top-level tab: Professor workload & free-period schedule
│   └── RoomHeatmapView.jsx           <-- Top-level tab: Room occupancy and capacity utilization heatmap
└── hooks/
    ├── useTimetableData.js           <-- Fetches active timetable from GET /api/timetable/active
    └── useFilteredTimetable.js       <-- Client-side multi-dimensional search & filter engine
```

---

## 7. Exact Component Props & Perspective Views

### Component 1: `TimetableGrid.jsx` & `LabBlockCard.jsx`
- Columns: Days (`Mon`–`Fri`); Rows: Periods (`Period 1` to `Period 8`).
- Multi-period practical lab rendering: Continuous visual block spanning 2 periods (`row-span-2`).
- **NEP Category Color Badges:**
  - Major (DSC): Royal Blue (`border-l-4 border-l-blue-600 bg-blue-50 text-blue-900`)
  - Minor (DSE): Purple (`border-l-4 border-l-purple-600 bg-purple-50 text-purple-900`)
  - MDC: Emerald (`border-l-4 border-l-emerald-600 bg-emerald-50 text-emerald-900`)
  - AEC: Amber (`border-l-4 border-l-amber-600 bg-amber-50 text-amber-900`)
  - SEC: Teal (`border-l-4 border-l-teal-600 bg-teal-50 text-teal-900`)
  - VAC: Rose (`border-l-4 border-l-rose-600 bg-rose-50 text-rose-900`)

### View 1: `MasterTimetableView.jsx`
- Full college schedule with Department filter pills, search input, and `VerificationHUD`.

### View 2: `StudentTimetableView.jsx`
- Dropdowns: Select Major (e.g. CS) and Minor (e.g. Economics). Renders clash-free personal student calendar.

### View 3: `FacultyTimetableView.jsx`
- Dropdown: Select Professor. Highlights teaching hours vs. explicit `"Free Period / Research Window"` slots.

### View 4: `RoomHeatmapView.jsx`
- 12 Rooms (Rows) vs. Time Slots (Columns) with color-graded occupancy (`Green = Vacant`, `Blue = Theory`, `Purple = Lab`).

---

## 8. Data Hook & API Integration (`useTimetableData.js`)
```javascript
import { useState, useEffect } from 'react';
import { getActiveTimetable } from '../../src/api/apiClient';

export function useTimetableData() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimetable = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveTimetable();
      setTimetable(data);
    } catch (err) {
      setError(err.message || 'Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return { timetable, loading, error, refreshTimetable: fetchTimetable };
}
```

---

## 9. Definition of Done
- Master Timetable Grid renders all 5 days and 8 periods with proper day/time headers.
- Multi-period lab sessions visibly span continuous periods.
- Student Major+Minor filter accurately isolates a student's personal schedule with 0 clashes.
- Faculty Schedule accurately shows teaching periods vs. free periods.
- Room Heatmap clearly indicates vacant vs. occupied rooms.
- All views gracefully handle loading, empty, and API error states.
