# System Architecture: SmartSchedule NEP 2020 (SIH25091)

## 1. Architecture Overview
SmartSchedule is a **Modular Monolith** web platform designed to solve the NP-hard University Course Timetabling Problem (UCTP) under the National Education Policy (NEP 2020) curriculum framework. The architecture is structured into four decoupled layers:
1. **Presentation & Exploration Layer (Frontend):** Interactive multi-perspective timetable visualizations (Janhavi) and administrative/diagnostic controls (Tanmay).
2. **Application & API Layer (Backend):** RESTful orchestration layer (Amey) handling data persistence, scenario state, and async AI coordination.
3. **Deterministic Constraint & NEP Scheduling Engine (Core Solver):** A pure, standalone mathematical engine that normalizes inputs, builds student conflict matrices, synchronizes NEP elective baskets, and executes Most-Constrained-Variable (MCV) backtracking slot placement with zero hard-constraint violations.
4. **Explainable AI & Simulation Layer:** Fast deterministic rule-based diagnostics paired with asynchronous LLM co-pilot reasoning for natural language schedule explanations and live what-if re-routing.

---

## 2. Architecture Principles
- **Separation of Proof and Explanation:** The deterministic constraint engine is the sole authoritative source of timetable feasibility (0 double bookings). The AI layer is strictly an explainability, diagnostic, and advisory companion.
- **Fail-Safe Resilience:** If external cloud APIs (e.g., Groq/OpenAI, MongoDB Atlas) fail or experience network latency during a live demo, the system seamlessly uses local deterministic rule diagnostics and in-memory/JSON snapshot persistence.
- **Modular Frontend Isolation:** Features are partitioned strictly into owned modules (`frontend/janhavi/` and `frontend/tanmay/`), communicating exclusively through clear REST API contracts and typed data models.
- **Sub-3-Second Execution:** The algorithm operates on an optimized priority-queue constraint heuristic, ensuring live demo generation completes reliably in under 3 seconds.

---

## 3. System Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                   CLIENT TIER (React + Vite)                                      |
|                                                                                                   |
|  +---------------------------------------+     +-----------------------------------------------+  |
|  |       JANHAVI: VISUALIZATION          |     |          TANMAY: ADMIN & DIAGNOSTICS          |  |
|  | - Master Institutional Grid           |     | - Department & Room Configurator              |  |
|  | - Student Cohort / Major-Minor View   |     | - NEP 2020 Elective Basket Manager            |  |
|  | - Faculty Workload & Free-Period View |     | - Solver Trigger & Progress HUD               |  |
|  | - Room Occupancy & Capacity Heatmap   |     | - AI Constraint Doctor & Quality Scorecard    |  |
|  | - Live Filters & Search Bar           |     | - Live What-If Disruptor (Room/Faculty Leave) |  |
|  +---------------------------------------+     +-----------------------------------------------+  |
|                                     \             /                                               |
|                                 Shared UI Primitives & API Client                                 |
+---------------------------------------------------------------------------------------------------+
                                              | (HTTP / JSON)
                                              v
+---------------------------------------------------------------------------------------------------+
|                                    BACKEND TIER (Node.js / Express)                               |
|                                                                                                   |
|  +---------------------------+  +---------------------------+  +-------------------------------+  |
|  |     REST Controllers      |  |    Data Access Layer      |  |   What-If Simulation Manager  |  |
|  | - /api/config             |  | - MongoDB Mongoose Schemas|  | - Snapshot State In-Memory    |  |
|  | - /api/timetable/generate |  | - Resilient JSON Fallback |  | - Disruption Delta Computer   |  |
|  | - /api/timetable/simulate |  | - Demo Seed Data Provider |  | - Discard / Commit Service    |  |
|  +---------------------------+  +---------------------------+  +-------------------------------+  |
|                                              |                                                    |
|  +---------------------------------------------------------------------------------------------+  |
|  |                    CORE SCHEDULING ENGINE (AMEY - Pure Computational Core)                  |  |
|  |                                                                                             |  |
|  |  [Input Normalizer] -> [Conflict Matrix Builder] -> [NEP Basket Sync Engine]                |  |
|  |                                                                     |                       |  |
|  |  [Hard Constraint Validator] <- [Most-Constrained-Variable Solver] <-+                       |  |
|  |                |                                                                            |  |
|  |  [Soft Optimization Scorer] -> [100% Valid Master Timetable Output]                         |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                              |                                                    |
|  +---------------------------------------------------------------------------------------------+  |
|  |                         EXPLAINABLE AI & DIAGNOSTIC CO-PILOT LAYER                          |  |
|  | - Fast Rule-Based Bottleneck Inspector (Local Fallback)                                     |  |
|  | - Groq LLM Reasoning Co-Pilot (Natural Language Explanations & Policy Recommendations)      |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Technology Stack Selection & Justification

| Layer | Chosen Technology | Why Selected | Alternatives Considered & Why Rejected |
|---|---|---|---|
| **Frontend Framework** | **React (Vite, JavaScript)** | High rendering speed, fast HMR, rich ecosystem, instant setup, deep team familiarity. | *Next.js:* Unnecessary SSR complexity for an internal hackathon dashboard. *Vue/Angular:* Slower setup for the team. |
| **Frontend Styling** | **Vanilla CSS + Design Tokens** | Maximum control, zero external CSS framework build issues, ultra-clean gov-tech styling. | *Tailwind CSS:* Risk of version mismatches across 2 frontend team workspaces. |
| **Backend Runtime** | **Node.js (Express, ES Modules)** | Lightweight, unified JavaScript full-stack, rapid REST API development, instant startup. | *Python (FastAPI):* Context switching between JS frontend and Python backend slows down 18-hr hackathon delivery. |
| **Scheduling Engine** | **Custom Heuristic & Constraint Propagation Engine (Node.js)** | 100% deterministic, zero external binary dependency, instant sub-second execution in JS runtime, easy debugging. | *Google OR-Tools (C++/Python):* Requires native bindings/Python sub-process causing cross-platform setup friction. *Genetic Algos:* Non-deterministic convergence risk during live demo. |
| **Database & Persistence** | **MongoDB (Atlas) + In-Memory/JSON Snapshot** | Native JSON document model, flexible schema for complex timetable arrays, instant mock fallback. | *PostgreSQL:* Relational joins across nested multi-period timetable grids add unnecessary ORM boilerplate under time pressure. |
| **AI / Diagnostics** | **Groq Vision/Chat SDK + Local Rule Diagnostics** | Sub-second inference latency for real-time explanations, reliable fallback if offline. | *OpenAI GPT-4:* Slower latency (~3-5s) can stall live judge interactions. |

---

## 5. Frontend Architecture
The frontend is organized into two independent feature modules under a single Vite React app:
- `frontend/janhavi/`:
  - `views/`: `MasterTimetableView.jsx`, `StudentTimetableView.jsx`, `FacultyTimetableView.jsx`, `RoomHeatmapView.jsx`.
  - `components/`: `TimetableGrid.jsx`, `TimeSlotCard.jsx`, `FilterBar.jsx`, `ExportButton.jsx`.
  - `hooks/`: `useTimetableData.js`, `useFilteredTimetable.js`.
- `frontend/tanmay/`:
  - `views/`: `AdminConfigView.jsx`, `BasketManagerView.jsx`, `DiagnosticDashboardView.jsx`, `WhatIfDisruptorView.jsx`.
  - `components/`: `CourseBasketCard.jsx`, `ConstraintForm.jsx`, `QualityScorecard.jsx`, `AIExplanationCard.jsx`, `DisruptionModal.jsx`.
  - `hooks/`: `useSolverControls.js`, `useWhatIfSimulation.js`.
- `frontend/src/`: Shared root app (`App.jsx`), router, API client (`src/api/apiClient.js`), UI primitives (`src/components/ui/`), and global styles (`src/styles/`).

---

## 6. Backend Architecture
The backend is structured as a clear, modular Express application:
- `backend/amey/src/config/`: `db.js` (MongoDB connection with graceful fallback) and `constants.js` (NEP course categories, days, slots).
- `backend/amey/src/engine/`:
  - `normalizer.js`: Validates and structures raw institutional inputs.
  - `conflictMatrix.js`: Calculates student enrollment intersections.
  - `basketOptimizer.js`: Aligns Minor/MDC/SEC courses into synchronized time slots.
  - `constraintSolver.js`: Recursive Most-Constrained-Variable placement engine.
  - `validator.js`: Verifies 0 faculty, 0 room, and 0 student clashes.
  - `scorer.js`: Computes gap penalty, workload balance, and room utilization scores.
- `backend/amey/src/simulation/`: `whatIfEngine.js` for non-destructive scenario staging.
- `backend/amey/src/ai/`: `diagnosticDoctor.js` (Rule diagnostics + Groq LLM prompt synthesis).
- `backend/amey/src/controllers/`: REST controller handlers.
- `backend/amey/src/routes/`: Express router definitions.
- `backend/amey/src/data/`: Default high-quality NEP 2020 demo seeds (`sampleCollege.json`).

---

## 7. Scheduling Engine Architecture (The 11-Step Pipeline)

```
1. Input Ingestion: Load Departments, Rooms, Faculty, NEP Courses, Student Elective choices.
2. Normalization: Verify credit-hours, break courses into Theory (1h) and Lab (2-3h consecutive) blocks.
3. Conflict Graph Construction: Build undirected graph G=(V,E) where edge (u,v) exists if any student takes both course u and v.
4. NEP Basket Partitioning: Group all elective courses into synchronized horizontal bands (Band A, Band B, etc.).
5. Variable Ordering (MCV): Sort sessions by highest constraint degree (Labs first -> Core Major -> Synced Baskets -> Common AEC/VAC).
6. Domain Filtering (Forward Checking): Filter available (Day, Period, Room, Faculty) tuples satisfying hard constraints.
7. Allocation & Backtracking: Assign slots iteratively; backtrack if a dead-end is encountered.
8. Hard Constraint Audit: Verify 100% clash-freedom across all dimensions.
9. Soft Optimization Scoring: Compute institutional efficiency score (0–100%).
10. AI Diagnostic Generation: Produce structured explanations and quality insights.
11. Timetable Packaging: Output Master, Student, Faculty, and Room projections.
```

---

## 8. Database Architecture & Conceptual Data Model

### Required Entities (MVP)

1. **`Department`**
   - Fields: `id`, `name`, `code` (e.g., "CS", "PHYS", "ECON", "LIT").
2. **`Room`**
   - Fields: `id`, `roomNumber`, `capacity`, `type` (`"LectureHall"` | `"ComputerLab"` | `"ScienceLab"`), `building`.
3. **`Faculty`**
   - Fields: `id`, `name`, `departmentId`, `designation`, `maxHoursPerWeek`, `unavailableSlots` (`[{day, period}]`).
4. **`Course` (NEP 2020 Aligned)**
   - Fields: `id`, `code`, `name`, `departmentId`, `category` (`"Major"` | `"Minor"` | `"MDC"` | `"AEC"` | `"SEC"` | `"VAC"`), `credits`, `theoryHoursPerWeek`, `labHoursPerWeek`, `requiredRoomType`, `facultyId`.
5. **`StudentCohort` / `Enrollment`**
   - Fields: `id`, `cohortCode` (e.g., "BSc-CS-Y1-A"), `size`, `enrolledCourseIds` (`[courseId]`).
6. **`Timetable` (Master Container)**
   - Fields: `id`, `academicYear`, `semester`, `status` (`"Draft"` | `"Active"` | `"Simulated"`), `qualityScore`, `metrics` (`{ clashCount, roomUtilization, facultyLoadBalance, studentGapScore }`), `entries` (`[TimetableEntry]`), `createdAt`.
7. **`TimetableEntry` (Embedded sub-document)**
   - Fields: `id`, `day` (`"Mon"`-`"Fri"`), `period` (`1`-`8`), `courseId`, `facultyId`, `roomId`, `cohortId`, `sessionType` (`"Theory"` | `"Practical"`), `blockLength`.

---

## 9. API Architecture & REST Contracts

### Base URL: `/api`

#### A. Configuration & Inputs
- `GET /api/config/demo-data` — Returns pre-loaded NEP 2020 college dataset.
- `POST /api/config/update` — Updates rooms, faculty availability, or course parameters.

#### B. Generation & Schedule Retrieval
- `POST /api/timetable/generate`
  - **Request Body:** `{ departments, rooms, faculty, courses, cohorts, timingConfig }` (or empty to use active dataset).
  - **Response (200):** `{ success: true, timetableId, executionTimeMs, qualityScore, metrics, entries: [...] }`
  - **Error (422):** `{ success: false, error: "INFEASIBLE_CONSTRAINTS", diagnostics: { reason, bottleneck, suggestedFix } }`
- `GET /api/timetable/active` — Returns the current active generated timetable.

#### C. What-If Simulation
- `POST /api/timetable/simulate`
  - **Request Body:** `{ disruptionType: "ROOM_CLOSURE" | "FACULTY_LEAVE", targetId, replacementOption }`
  - **Response (200):** `{ success: true, originalTimetableId, simulatedTimetable: { entries, diff: [...] }, aiExplanation }`
- `POST /api/timetable/simulate/commit` — Promotes simulated timetable to active state.

#### D. AI Diagnostics & Health Scorecard
- `GET /api/diagnostics/explain/:timetableId` — Returns AI-generated rationale, workload analysis, and efficiency insights.

---

## 10. Data Flow
1. **Client Action:** Admin selects "Generate NEP 2020 Timetable" in Tanmay's portal.
2. **API Call:** Tanmay's view invokes `POST /api/timetable/generate`.
3. **Backend Execution:** Express controller invokes `Engine.solve()`.
4. **Engine Pipeline:** Normalization -> Conflict Matrix -> Basket Optimizer -> MCV Solver -> Validator -> Scorer.
5. **State Storage:** Valid timetable saved to MongoDB / In-Memory cache.
6. **AI Co-Pilot:** `diagnosticDoctor.js` synthesizes health scorecard and explanation metrics.
7. **Response:** Complete JSON payload delivered to frontend in < 3s.
8. **UI Rendering:** Janhavi's module renders the multi-perspective grids; Tanmay's module renders the Scorecard and AI Diagnosis.

---

## 11. Timetable Generation Flow
```
[User Clicks Generate]
         ↓
Check Inputs Valid? ---> NO ---> Return 400 Bad Request (Missing Faculty/Rooms)
         ↓ YES
Construct Graph & Matrix
         ↓
Can Baskets Synchronize? ---> NO ---> Return 422 (Conflicting Common Electives)
         ↓ YES
Execute MCV Backtracking Solver (Timeout: 3000ms)
         ↓
Found Solution? ---> NO ---> Trigger Diagnostic Doctor & Return Infeasibility Analysis
         ↓ YES
Validate 0 Clashes (Hard) & Compute Soft Score
         ↓
Save Timetable & Return JSON Payload
```

---

## 12. Validation Flow
Every candidate timetable is audited against **3 Invariant Hard Constraints**:
1. **Faculty Overlap Invariant:** $\forall (e_1, e_2), e_1.faculty = e_2.faculty \implies (e_1.day \neq e_2.day \lor e_1.period \neq e_2.period)$
2. **Room Overlap Invariant:** $\forall (e_1, e_2), e_1.room = e_2.room \implies (e_1.day \neq e_2.day \lor e_1.period \neq e_2.period)$
3. **Student Cohort Invariant:** $\forall (e_1, e_2), (e_1.cohort \cap e_2.cohort \neq \emptyset) \implies (e_1.day \neq e_2.day \lor e_1.period \neq e_2.period)$

If *any* invariant is violated, the timetable is rejected.

---

## 13. What-If Simulation Flow
```
1. Active Timetable Snapshot created in memory.
2. User applies disruption (e.g., "Dr. Sharma unavailable on Wednesday").
3. Simulation Engine extracts affected entries (e.g., Physics Lab Wed P3-P4).
4. Local Re-Optimization Engine searches for alternative clash-free slots without modifying unrelated courses.
5. Diff Engine flags moved sessions (Old Slot vs. New Slot).
6. AI Co-Pilot generates explanation: "Moved Physics Lab to Thursday P5-P6 because Room 102 was open and no cohort clash occurred."
7. User can review diff, test views, and choose: [Commit to Live] or [Discard Simulation].
```

---

## 14. AI Diagnostic Architecture
```
[Timetable Metrics + Constraint Logs]
                 ↓
[Rule-Based Pre-Analyzer] (Extracts room deficits, faculty hours, student gaps)
                 ↓
[Groq LLM Prompt Synthesizer] (Formats prompt with structured JSON context)
                 ↓
[Groq API (qwen/qwen3.6-27b)] (Executes fast inference in < 800ms)
                 ↓
[Structured Diagnostic Response] (Health Scorecard, Executive Summary, Actionable Suggestions)
                 ↓
*(Fallback if offline: Instant deterministic template engine)*
```

---

## 15. Security & Input Validation
- **Input Sanitization:** All payload arrays (faculty, rooms, courses) validated using schema validators before entering engine.
- **API Protection:** Admin actions (Generate, Simulate, Commit) guarded by clean session/token headers.
- **Environment Isolation:** Groq and MongoDB secrets strictly isolated in backend `.env`.

---

## 16. Error Handling Strategy
- **Infeasible Constraints:** Never returns generic 500 error. Always returns structured 422 with the exact root cause identified by the solver.
- **Solver Timeout:** If complex constraints exceed 3000ms, falls back to a greedy relaxed solver and returns partial timetable with warning tags.
- **AI Service Outage:** Gracefully degrades to local rule-based diagnostic text strings without throwing UI errors.

---

## 17. Performance Targets
- **Timetable Generation:** $\le 2.0\text{ seconds}$ for 5 departments / 40 courses / 20 faculty.
- **Validation Run:** $\le 50\text{ ms}$.
- **What-If Re-Routing:** $\le 800\text{ ms}$.
- **Frontend Grid Render:** $\le 60\text{ fps}$ smooth tab switching.

---

## 18. Deployment Architecture
- **Frontend:** Vercel / Netlify (Static SPA bundle built via Vite).
- **Backend:** Render / Railway / Node.js Server (Port 5000).
- **Database:** MongoDB Atlas M0 Free Tier (with automatic in-memory fallback).
- **CORS:** Configured to allow all origins in development and production staging.

---

## 19. Module Ownership

```
PROJECT2/
├── frontend/
│   ├── janhavi/    <-- Janhavi's Owned Module (Timetable Visualizations & Schedules)
│   ├── tanmay/     <-- Tanmay's Owned Module (Admin Config, Baskets, What-If & AI Dashboard)
│   └── src/        <-- Shared Application Shell (Amey coordinates)
│
└── backend/
    └── amey/       <-- Amey's Owned Module (Server, Database, Constraint Engine, AI Layer)
```

---

## 20. Shared Files & Coordination Protocol
- `frontend/src/App.jsx`: Main routing container. Amey/Janhavi/Tanmay coordinate on mounting views.
- `frontend/src/api/apiClient.js`: Shared Axios/Fetch wrapper. Amey maintains endpoints.
- `frontend/src/components/ui/`: Shared Button, Badge, Modal, Card, Header components.
- `frontend/src/styles/theme.css`: Shared design tokens.

---

## 21. Architectural Tradeoffs
1. **Deterministic Heuristics over Deep RL:** Sacrificed theoretical multi-objective reinforcement learning for 100% guaranteed zero-clash convergence within the 18-hour hackathon timeline.
2. **Synchronized NEP Time Bands over Pure Dynamic Slotting:** Grouping Minors and MDCs into standardized horizontal time bands reduces conflict search space by 80%, ensuring instant sub-second solver speed.
3. **Decoupled AI Layer over End-to-End LLM Scheduler:** Eliminates hallucinated room clashes while retaining human-like natural language explainability.
