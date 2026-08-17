# Implementation Contract & Execution Blueprint: Amey (Backend, Database & Engine Lead)

## 1. Role & Identity
- **Name:** Amey
- **Role:** Team Leader, Backend Architect, Database Engineer & Core Scheduling Engine Developer
- **Ownership:** `backend/amey/` exclusively, plus root package setup, `.gitignore`, `.github/CODEOWNERS`, and shared frontend shell/API client contracts.

---

## 2. Mission Statement
Build a 100% deterministic, high-performance **NEP 2020 Constraint Scheduling Engine** in Node.js (sub-2-second execution), coupled with a resilient Express REST API, a non-destructive What-If Disruption Engine, and an explainable AI Diagnostic Co-Pilot that mathematically guarantees **100% of encoded constraints are validated with zero violations in the accepted timetable**.

---

## 3. Team Parallelism & Contract-First Mocking Protocol

### 🚀 TRUE PARALLEL DEVELOPMENT (CONTRACT-FIRST MOCKING)
Nobody waits for you to finish the solver before writing frontend code. You unlock your teammates on Minute 1 by providing the **Frozen API Contract and Mock Response Fixtures**:

```
                       FROZEN API CONTRACTS & MOCK FIXTURES
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
   AMEY (Backend)             JANHAVI (Frontend 1)           TANMAY (Frontend 2)
   • Builds MCV Solver        • Builds Timetable Grid        • Builds Admin Portal
   • Builds Real REST APIs    • Builds Student View          • Builds AI Scorecard
   • Implements Database      • Builds Room Heatmap          • Builds What-If Disruptor
   (Runs tests locally)       (Consumes Mock Data)           (Consumes Mock Data)
        │                              │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       ▼
                       INTEGRATION & LIVE API SWAP
```

### Amey's Execution Checklist:
1. **Minute 1 Deliverable:** Provide `frontend/src/api/apiClient.js` with all 6 endpoints returning mock fixture data matching Section 10 so Janhavi and Tanmay can start coding immediately.
2. **Core Solver Build:** Implement the 11-step mathematical constraint solver, invariant validator, and scorer in `backend/amey/src/engine/`.
3. **Database & API Routes:** Wire real MongoDB / JSON persistence and Express routes.
4. **Smoke Test:** Run `node backend/amey/test-solver.js` to assert 0 clashes.
5. **Integration:** Coordinate with Janhavi and Tanmay to switch from mock fixtures to live API.

---

## 4. Git Workflow & Branching Rules
- **Branch Naming:** `feat/amey-engine-solver`, `feat/amey-api-routes`, `feat/amey-simulation-engine`, `fix/amey-lab-consecutive-check`.
- **Branch Lifespan:** Small, mergeable branches. Sync with `origin/main` before starting and before opening PRs.
- **Ownership Lockdown:** You own `backend/amey/` and root shell. Never edit files in `frontend/janhavi/` or `frontend/tanmay/`.
- **Shared Files Owned by Amey:**
  - `frontend/src/App.jsx` (Mounts top-level views from Janhavi & Tanmay)
  - `frontend/src/api/apiClient.js` (Maintains pre-built helper functions with mock fallback)
  - `frontend/src/styles/theme.css` (Maintains global tokens and variables)
  - `package.json` & lockfiles (All package installations happen on `main` by Amey)

---

## 5. AI Coding Agent Directives (For Antigravity IDE)
When an AI coding agent operates on this task file:
1. **Scope Restriction:** Modify ONLY files within `backend/amey/` and designated shared shell files (`src/App.jsx`, `src/api/apiClient.js`).
2. **Contract Preservation:** Keep API response schemas strictly identical to Section 10.
3. **Modular Pipeline Isolation:** Ensure each engine file (`normalizer.js`, `conflictMatrix.js`, `basketOptimizer.js`, `constraintSolver.js`, `validator.js`, `scorer.js`) has testable, isolated inputs and outputs.
4. **Verification Gate:** Run `node backend/amey/test-solver.js` and verify 0 clashes before completing tasks.

---

## 6. Exact File & Module Directory Structure
```
backend/amey/
├── package.json                          <-- Express, cors, dotenv, mongoose, groq-sdk
├── server.js                             <-- Express app entry point on PORT 5000
└── src/
    ├── config/
    │   ├── db.js                         <-- MongoDB Atlas connection with instant in-memory fallback
    │   └── constants.js                  <-- NEP categories, days (Mon-Fri), periods (1-8), room types
    ├── data/
    │   └── sampleCollege.json            <-- Rich seed data (4 depts, 12 rooms, 18 faculty, 28 courses, cohorts)
    ├── engine/
    │   ├── normalizer.js                 <-- Slices courses into Theory (1h) & Lab (2-3h consecutive) blocks
    │   ├── conflictMatrix.js             <-- Builds student enrollment conflict graph G=(V,E)
    │   ├── basketOptimizer.js            <-- Groups Minor/MDC/SEC electives into synchronized horizontal time bands
    │   ├── constraintSolver.js           <-- Most-Constrained-Variable (MCV) Backtracking Slot Placement Solver
    │   ├── validator.js                  <-- Invariant hard-constraint auditor (guarantees 0 clashes)
    │   └── scorer.js                     <-- Calculates Room Utilization, Faculty Workload Balance, Gap Index
    ├── simulation/
    │   └── whatIfEngine.js               <-- In-memory snapshot cloning, isolated re-routing, and delta diffing
    ├── ai/
    │   └── diagnosticDoctor.js           <-- Rule-based bottleneck analyzer + Groq LLM co-pilot with offline fallback
    ├── models/
    │   └── TimetableModel.js             <-- Mongoose schemas (Department, Room, Faculty, Course, Timetable)
    ├── controllers/
    │   ├── configController.js           <-- Handles /api/config routes
    │   ├── timetableController.js        <-- Handles /api/timetable/generate, /active, /simulate, /commit
    │   └── diagnosticController.js       <-- Handles /api/diagnostics/explain
    └── routes/
        └── apiRoutes.js                  <-- Express router mounting all controllers
```

---

## 7. Exact Data Schemas & Sample Seed Data (`sampleCollege.json`)
The seed dataset in `backend/amey/src/data/sampleCollege.json` contains:
- **Departments (4):** CS, Physics, Economics, English Literature.
- **Rooms & Labs (12):** 6 Lecture Halls (`LH_101`..`LH_302`), 1 Auditorium (`AUD_01`), 2 Computer Labs (`LAB_CS1`, `LAB_CS2`), 2 Science Labs (`LAB_PHYS1`, `LAB_PHYS2`), 1 Language Lab (`LAB_LANG`).
- **Faculty (18):** 18 professors with department assignments, max hours per week, and availability matrices.
- **NEP Course Catalog (28):** Major (4cr), Minor (4cr), MDC (3cr), AEC (2cr), SEC (2cr Lab), VAC (2cr).
- **Student Cohorts (4):** `COHORT_CS_Y1` (60), `COHORT_PHYS_Y1` (50), `COHORT_ECON_Y1` (55), `COHORT_LIT_Y1` (45).

---

## 8. Core Scheduling Algorithm Logic (Step-by-Step Implementation)

### Step 1: Input Normalization (`normalizer.js`)
- `Input:` Raw JSON payload $\rightarrow$ `Output:` `NormalizedSessionList`.
- Theory courses (3 hrs/wk) $\rightarrow$ 3 single-period sessions (`blockLength: 1`).
- Practical labs (2 hrs/wk) $\rightarrow$ 1 atomic 2-period continuous block (`blockLength: 2`, `requiresConsecutive: true`).

### Step 2: Conflict Matrix Computation (`conflictMatrix.js`)
- `Input:` `StudentCohort` enrollments $\rightarrow$ `Output:` Adjacency conflict matrix `conflictMatrix[courseA][courseB] -> Boolean`.

### Step 3: NEP Elective Basket Synchronization (`basketOptimizer.js`)
- `Input:` Minor & MDC courses $\rightarrow$ `Output:` `ElectiveBands` synchronized to universal horizontal time bands.

### Step 4: Most-Constrained-Variable (MCV) Backtracking Placement (`constraintSolver.js`)
- Sort sessions by constraint difficulty: $\text{Difficulty} = (\text{blockLength} \times 100) + (\text{isLab} ? 50 : 0) + (\text{ConflictDegree} \times 10)$.
- Forward-check candidate `(Day, Period, Room)` slots satisfying teacher, room, capacity, and cohort invariants.
- Backtrack recursively if domain becomes empty. Timeout watchdog: 3000ms.

### Step 5: Hard Invariant Validation (`validator.js`)
- Audits solved entries to guarantee: 0 Faculty double-bookings, 0 Room double-bookings, 0 Cohort overlaps.

### Step 6: Soft Metric Scoring (`scorer.js`)
- Room Utilization (%), Faculty Workload Balance (%), Student Gap Index (%). Returns overall score (88–98).

---

## 9. What-If Simulation Engine (`whatIfEngine.js`)
- Deep-clones `activeTimetable` into an isolated memory snapshot.
- Slices out *only* sessions affected by `ROOM_CLOSURE` or `FACULTY_LEAVE`.
- Re-runs targeted MCV allocation for only the relocated sessions into alternative available slots.
- Returns structured diff array: `[{ courseId, courseName, oldSlot, newSlot, reason }]`.

---

## 10. Complete API Contracts Specification

### Route 1: `GET /api/config/demo-data`
- **Response (200):** `{ "success": true, "data": { departments, rooms, faculty, courses, cohorts } }`

### Route 2: `POST /api/timetable/generate`
- **Response (200):**
  ```json
  {
    "success": true,
    "timetableId": "tt_178690012",
    "executionTimeMs": 420,
    "qualityScore": 94,
    "metrics": {
      "clashCount": 0,
      "roomUtilization": 82.5,
      "facultyLoadBalance": 91.0,
      "studentGapScore": 95.0
    },
    "entries": [
      {
        "id": "e_1",
        "day": "Mon",
        "period": 1,
        "courseId": "CS101",
        "courseName": "Data Structures",
        "category": "Major",
        "facultyId": "FAC_01",
        "facultyName": "Dr. A. Verma",
        "roomId": "LH_101",
        "roomNumber": "LH-101",
        "cohortId": "COHORT_CS_Y1",
        "sessionType": "Theory",
        "blockLength": 1
      }
    ],
    "aiSummary": "Clash-free schedule generated in 420ms. 0 hard conflicts detected."
  }
  ```

### Route 3: `GET /api/timetable/active`
- **Response (200):** Same schema as Route 2.

### Route 4: `POST /api/timetable/simulate`
- **Request Body:** `{ "disruptionType": "ROOM_CLOSURE" | "FACULTY_LEAVE", "targetId": "LAB_CS1", "day": "Wed" }`
- **Response (200):** `{ "success": true, "originalTimetableId": "...", "simulatedEntries": [ ... ], "diffs": [ ... ], "aiExplanation": "..." }`

### Route 5: `POST /api/timetable/simulate/commit`
- **Response (200):** `{ "success": true, "message": "Simulation committed as active timetable." }`

### Route 6: `GET /api/diagnostics/explain/:timetableId`
- **Response (200):** `{ "success": true, "scorecard": { ... }, "aiAnalysis": "...", "recommendations": [ ... ] }`

---

## 11. Automated Testing & Verification
- Test script `backend/amey/test-solver.js` asserts `clashCount === 0`, `executionTime < 2000ms`, and valid simulation diff generation.
