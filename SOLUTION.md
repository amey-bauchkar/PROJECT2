# Solution: AI-Based Timetable Generation System aligned with NEP 2020

## 1. Problem Summary
Under the National Education Policy (NEP 2020), higher education institutions across Jammu & Kashmir and India are transitioning from rigid, department-siloed classroom models to flexible, multidisciplinary credit frameworks. Students now choose cross-departmental combinations comprising Major disciplines, Minor subjects, Multidisciplinary Courses (MDC), Ability Enhancement Courses (AEC), Skill Enhancement Courses (SEC), and Value Added Courses (VAC). 

This curricular flexibility shatters the traditional assumption of "fixed cohort sections" (where an entire class attends identical lectures in the same room all week). Instead, every individual student or student subgroup possesses an individualized schedule. Manually or heuristically scheduling hundreds of students, cross-departmental faculty, limited specialized laboratories, and physical lecture halls without overlapping time slots or violating credit requirements is an **NP-hard combinatorial conflict optimization problem**. Institutions face severe scheduling bottlenecks, faculty over-allocation, student elective clashes, and idle campus infrastructure.

---

## 2. Core Problem Insight
**The fundamental challenge is not "drawing a timetable grid"; it is resolving multi-dimensional resource contention in a non-siloed student-choice matrix.**

In traditional timetabling, the unit of scheduling is a **Section/Batch** (e.g., "Computer Science - Year 2 - Division A"). 
In NEP 2020 multidisciplinary timetabling, the unit of scheduling shifts to **Individual Course Offerings with Dynamic Student Enrolment Baskets**.

If a Physics Major student takes a Minor in Economics, a Skill course in Data Analysis, and an AEC in Modern Kashmiri/Dogri/Urdu literature, their scheduled periods must not clash with each other, while simultaneously ensuring that the Economics lecturer, Physics lab, and Literature classroom are available and within capacity. Traditional manual methods or naive sequential schedulers inevitably lock themselves into unresolvable dead-ends.

---

## 3. Confirmed Facts (From Problem Statement & Formal Context)
1. **Problem Statement ID:** SIH25091 (Software Category, Smart Automation Theme).
2. **Target Domain:** Multidisciplinary higher education institutions under the mandate of the Government of Jammu & Kashmir.
3. **Core Mandate:** Timetable generation must be automated, intelligent ("AI-based"), and structurally aligned with NEP 2020.
4. **Team Resources:** Three-person team (Amey: Backend/Database, Janhavi: Frontend, Tanmay: Frontend).
5. **Operational Context:** 18-hour hackathon execution constraint with a mandatory live, deterministic, and defensible demonstration.

---

## 4. Assumptions (Explicitly Inferred for Hackathon Scope)
1. *[Assumption]* **Elective Selection Model:** The institution collects student course enrollments/elective choices prior to timetable finalization (or groups them into pre-validated elective baskets), providing an input matrix of `Student -> [Courses]`.
2. *[Assumption]* **Institutional Scale for Demo:** A representative multidisciplinary college campus consisting of 3–5 interconnected departments (e.g., Sciences, Humanities, Commerce/Vocational), ~20–30 faculty, ~30–50 course modules, and ~10–15 shared lecture halls/labs. This provides sufficient complexity to prove NP-hard conflict resolution while generating in under 10 seconds during a live judge demonstration.
3. *[Assumption]* **Time Slot Discretization:** The academic week is discretized into standardized time periods (e.g., Monday–Friday/Saturday, 6–8 periods per day, with distinct single slots for Theory and multi-period continuous blocks for Practicals/Labs).
4. *[Assumption]* **Hard vs. Soft Constraint Separation:** A timetable is only valid if **zero** hard constraints are violated. Optimization is evaluated by minimizing soft constraint penalty scores.

---

## 5. Research Findings

### A. NEP 2020 Higher Education Curricular Structure
Research into the UGC Curriculum and Credit Framework for Undergraduate Programmes (CCFUP) under NEP 2020 reveals six distinct course categories:
1. **Major (Discipline Specific Core - DSC):** 4 credits (3 Theory + 1 Lab/Tutorial). Fixed primary cohort.
2. **Minor (Discipline Specific Elective - DSE):** 4 credits. Cross-departmental students joining from other disciplines.
3. **Multidisciplinary Courses (MDC):** 3 credits. Broad exploratory courses taken outside the student's home faculty (e.g., Humanities student taking Natural Science).
4. **Ability Enhancement Courses (AEC):** 2 credits. Language, Environmental Science, and Communication shared across wide batches.
5. **Skill Enhancement Courses (SEC):** 2–3 credits. Practical hands-on training requiring specialized computer/vocational labs.
6. **Value Added Courses (VAC):** 2 credits. Common institutional modules (Ethics, Digital Fluency, Yoga/Health).

*Scheduling Impact:* Major courses can be scheduled within departmental rooms, but Minors, MDCs, AECs, and SECs create cross-cutting horizontal time bands where multiple departments must sync their schedules to avoid student-level clashes.

### B. Computational Timetabling Paradigms (UCTP Literature)
Academic literature categorizes the University Course Timetabling Problem (UCTP) into three primary computational approaches:
1. **Constraint Satisfaction & Exact Solvers (CSP / ILP / SMT):** Formulates all rules as mathematical linear inequalities or boolean constraints. Solvers like OR-Tools (CP-SAT) guarantee 100% hard-constraint satisfaction and mathematical proof of optimality, but require rigid mathematical formulation.
2. **Metaheuristic & Evolutionary Algorithms (Genetic Algorithms, Simulated Annealing, Tabu Search):** Represents chromosomes/states as schedules, applying mutations, crossovers, and heuristic fitness evaluation. Highly adaptable to complex multi-objective soft constraints, but may occasionally converge slowly or require tuning to reach zero hard violations.
3. **Machine Learning / LLM-Based Generation:** Generative models and neural approaches struggle severely with strict combinatorial boolean satisfiability, frequently producing hallucinations or subtle double-bookings. However, LLMs excel at **explainability, natural language constraint ingestion, and human-readable diagnostics**.

---

## 6. Solution Options Considered

### Option A: Pure Constraint-Programming Engine (CP-SAT Solver)
- **Core Idea:** Formulate the entire college timetable as an exact Constraint Satisfaction Problem (CSP) executed via a high-performance solver engine.
- **Problem It Solves:** Guarantees 100% clash-free schedules with mathematical proof of constraint satisfaction.
- **How It Works:** Every lecture event is mapped to decision variables `(course, faculty, room, timeslot)`. Hard constraints are expressed as exact constraints; soft preferences are formulated as an objective minimization function.
- **Role of AI:** Computational Intelligence & Automated Constraint Programming (CP-SAT / Backtracking Search).
- **Pros:** 100% deterministic; zero hard clashes; instant execution (<2s); highly defensible.
- **Cons:** Cold mathematical output; lacks conversational explainability; black-box for non-technical users.
- **Hackathon Feasibility:** High (9/10).
- **Demo Value:** 7.5/10 (Requires strong visualization to avoid feeling like a simple script).

### Option B: Pure Genetic Algorithm (Metaheuristic Evolutionary Engine)
- **Core Idea:** Simulate natural selection with a population of randomly generated timetables, iteratively applying crossover, mutation, and elitism to minimize fitness penalties.
- **Problem It Solves:** Handles fuzzy, complex, and evolving soft preference criteria without needing rigid linear constraints.
- **How It Works:** Encodes timetables into gene matrices. Evaluates fitness based on clash counts and gaps. Evolves over 500–2,000 generations.
- **Role of AI:** Evolutionary Bio-Inspired Artificial Intelligence.
- **Pros:** Visually impressive generation progress (fitness graph rising in real-time); highly intuitive concept for judges.
- **Cons:** Non-deterministic; risk of getting stuck in local minima during a live 30-second judge demo; slower convergence for tight room constraints.
- **Hackathon Feasibility:** Medium (7/10).
- **Demo Value:** 8/10 (Great visual charts, higher live-demo failure risk).

### Option C: Hybrid AI Engine — Constraint Optimizer + Explainable LLM Diagnostic Co-Pilot (SELECTED)
- **Core Idea:** Combine a deterministic, fast Constraint Satisfaction Engine (guaranteeing 100% clash-free feasibility) with an interactive **AI Scheduling Assistant / Diagnostic Co-Pilot** that translates complex NEP 2020 rules, explains why specific slots were chosen, and performs automated root-cause analysis on impossible constraints.
- **Problem It Solves:** Solves both the **mathematical conflict problem** (zero clashes) AND the **administrative usability problem** (explaining decisions, resolving over-constrained deadlocks, and recommending policy adjustments).
- **How It Works:**
  1. *Solver Core:* A fast heuristic/constraint satisfaction engine rapidly generates valid time-room-faculty allocations.
  2. *NEP 2020 Basket Engine:* Automatically groups cross-departmental electives (Minor/MDC/SEC) into non-overlapping common slots.
  3. *AI Diagnostic Co-Pilot:* Analyzes the generated schedule to output an Executive Timetable Quality Scorecard, explaining tradeoffs and providing actionable recommendations if an administrator enters conflicting inputs.
- **Role of AI:** Hybrid AI — Symbolic Constraint Optimization for rigorous math + LLM/Heuristic Diagnostics for explainability and intelligent relaxation suggestions.
- **Pros:** 100% reliable during live demo; zero double-booking risk; exceptional demo wow-factor; deep educational domain relevance; highly defensible architecture.
- **Cons:** Requires clear boundary separation between solver and LLM layer to prevent latency.
- **Hackathon Feasibility:** High (9/10).
- **Demo Value:** 9.5/10.

---

## 7. Solution Comparison Matrix

| Evaluation Criteria (1–10) | Option A (CP Solver) | Option B (Genetic Algo) | Option C (Hybrid AI Engine) |
|---|:---:|:---:|:---:|
| **Problem Fit (NEP 2020 Focus)** | 8.0 | 7.5 | **9.5** |
| **Feasibility (3-Person / 18-Hr)** | 8.5 | 7.0 | **9.0** |
| **Innovation & Wow-Factor** | 6.5 | 7.5 | **9.5** |
| **Demo Clarity & Visuals** | 7.0 | 8.0 | **9.5** |
| **Technical Strength & Defensibility** | **9.5** | 7.5 | 9.0 |
| **Reliability (Zero-Clash Live Guarantee)** | **10.0** | 6.5 | **10.0** |
| **Data Dependency Risk** | Low (8.5) | Low (8.5) | Low (8.5) |
| **AI Relevance & Justification** | 8.0 | 8.5 | **9.5** |
| **Scalability Potential** | 9.0 | 7.0 | 9.0 |
| **Implementation Risk** | Low | Medium-High | Low-Medium |
| **TOTAL SCORE (out of 110)** | **84.0** | **75.0** | **101.5** |

### Score Justifications
- **Option C Wins on Demo Clarity & Innovation (9.5):** Combining a reliable zero-clash solver with an AI explanation engine allows judges to see mathematical perfection alongside real-world administrative intelligence.
- **Option B Penalized on Reliability (6.5):** Stochastic genetic algorithms run the risk of an unluckily long convergence time or lingering clash during a 2-minute live demo.
- **Option A Penalized on Innovation (6.5):** A pure solver without explanation features feels like a traditional backend script rather than a smart automation platform.

---

## 8. Selected Solution
**Option C: Hybrid AI Timetable Engine (NEP 2020 Multi-Track Constraint Solver + Explainable AI Diagnostic Co-Pilot)**

---

## 9. Why This Solution Was Selected & Tradeoffs Accepted

### Why Option C?
1. **Zero-Failure Live Demo:** The core scheduling relies on deterministic constraint satisfaction and basket allocation heuristics, guaranteeing that the live demo will *never* produce an illegal double-booking or crash.
2. **True NEP 2020 Relevance:** Explicitly models the Major-Minor-MDC-AEC-SEC basket structure rather than treating subjects as generic generic blocks.
3. **Explainable AI:** Solves the real-world administrative grievance: *"Why did the system put Physics at 9 AM and Economics at 11 AM?"* and *"What exact constraint caused the schedule to fail when Room 101 was closed?"*
4. **Clean 3-Person Team Division:**
   - **Amey (Backend/Engine):** Constraint satisfaction algorithms, NEP basket logic, validation engine, mock dataset generators.
   - **Janhavi (Frontend):** Interactive Master & Entity Timetable Grid (Faculty view, Student Cohort view, Room Occupancy heatmap, Live Filters).
   - **Tanmay (Frontend):** Administrative Management Portal, Constraint Configuration, NEP Course Basket Builder, and AI Diagnostic & Quality Dashboard.

### Tradeoffs Accepted
- We intentionally use structured heuristic constraint logic rather than deep reinforcement learning models because training neural networks for exact discrete timetabling within 18 hours introduces catastrophic demo risk.
- We focus on a multi-department college scale (3–5 departments) rather than attempting a statewide multi-campus university network.

---

## 10. How the Solution Works (High-Level Mechanism)

```
[Institutional Inputs]
(Faculty, Rooms, NEP Courses, Student Electives, Time Slots)
                       ↓
[Phase 1: NEP 2020 Elective Basket Optimizer]
(Groups non-clashing Minor/MDC/SEC courses into synchronized time slots)
                       ↓
[Phase 2: Heuristic Constraint Solver & Allocation Engine]
(Hard Constraints: Room capacity, Teacher availability, Zero double-booking)
(Soft Constraints: Workload distribution, Gap minimization, Consecutive lab blocks)
                       ↓
[Phase 3: Automated Clash & Quality Scoring Validator]
(Validates 100% hard adherence & computes institutional efficiency index)
                       ↓
[Phase 4: AI Explainability & Diagnostic Layer]
(Generates human-readable schedule summaries, constraint explanations & fix recommendations)
                       ↓
[Multi-Perspective Interactive Timetable Views]
(Master Grid | Student Major/Minor Schedule | Faculty Schedule | Room Heatmap)
```

---

## 11. Target Users
1. **College Academic Deans & Timetable Coordinators:** Responsible for building institutional schedules across all faculties.
2. **Department Heads (HODs):** Need to verify departmental faculty workload, lecture distribution, and laboratory utilization.
3. **Faculty Members:** Need clear, clash-free personal schedules with minimal idle waiting gaps.
4. **Multidisciplinary Students:** Need individualized, clash-free weekly timetables showing their Major, Minor, and Skill classes with room assignments.

---

## 12. System Inputs
- **Departments & Rooms:** Name, Room Number, Capacity, Type (Theory Lecture Hall / Computer Lab / Science Lab).
- **Faculty Registry:** Name, Department, Max Weekly Hours, Daily Availability Windows.
- **NEP Course Catalog:** Course Name, Category (Major/Minor/MDC/AEC/SEC/VAC), Department, Credits, Weekly Theory Hours, Weekly Lab Hours.
- **Student Enrollment Baskets:** Student IDs / Cohort Groups and their chosen Major, Minor, and Elective combinations.
- **Institutional Timing Template:** Days per week (5 or 6), Periods per day (e.g., 6 periods of 50 mins + lunch break).

---

## 13. Processing & Intelligence
1. **Conflict Matrix Generation:** Pre-computes pairs of courses that share common students and must *never* be placed in concurrent time slots.
2. **NEP Elective Synchronization:** Binds cross-departmental Minor and MDC subjects into universal horizontal time bands.
3. **Constraint-Propagated Slot Placement:** Assigns highest-constraint courses first (Most-Constrained-Variable heuristic) to prevent dead-ends.
4. **Multi-Factor Penalty Scoring:** Evaluates candidate placements against soft constraints (faculty idle hours, student gaps, room under-utilization).
5. **AI Diagnostic Analysis:** Generates human-understandable reasoning for schedule decisions and Pinpoints exact bottlenecks if an impossible constraint is introduced.

---

## 14. System Outputs
1. **Institutional Master Timetable:** Full interactive cross-department schedule matrix.
2. **Student Cohort & Individual Timetables:** Personalized views for any selected Major + Minor combination.
3. **Faculty Workload Timetables:** Weekly schedule per teacher showing teaching hours, free periods, and room numbers.
4. **Room Utilization Heatmap:** Room-by-room occupancy showing utilization percentages and free periods.
5. **AI Timetable Health Scorecard:** Comprehensive metrics (0–100%) on Clash-Freedom (100%), Room Efficiency, Faculty Workload Balance, and Student Gap Index.

---

## 15. Core User Flow
```
1. Configuration & Data Setup
   Administrator selects pre-configured NEP 2020 College Template or imports custom departmental data.
                               ↓
2. Constraint & Basket Definition
   Admin reviews Major/Minor combinations, room capacities, and faculty availability.
                               ↓
3. One-Click AI Timetable Generation
   Admin triggers the generation engine; the solver executes in < 3 seconds with a live generation animation.
                               ↓
4. Automated Validation & Quality Scorecard
   System displays 100% hard constraint verification, soft optimization score, and AI quality summary.
                               ↓
5. Interactive Multi-Perspective Exploration
   Admin and stakeholders switch seamlessly between Master Grid, Faculty View, Student View, and Room Heatmap.
                               ↓
6. What-If Simulation & Export
   Admin can adjust a constraint (e.g., mark a room under renovation) and watch the AI engine instantly recalculate and explain adjustments.
```

---

## 16. MVP Definition (Minimal Viable Product)
To ensure 100% completion in the 18-hour hackathon, the MVP is strictly focused on proving the core value:
- **Core Input:** Pre-loaded multi-department NEP dataset (Sciences, Arts, Commerce) with realistic student elective baskets.
- **Core Engine:** Deterministic Heuristic/Constraint Solver executing in Node.js/Python backend with zero hard clashes.
- **Core Views:**
  1. Interactive Master Timetable Grid with intuitive color-coded NEP course badges.
  2. Faculty-wise Schedule Filter.
  3. Student Cohort / Elective-combination Filter.
  4. Room Utilization Matrix.
- **Core Verification:** Live validation banner proving 0 faculty clashes, 0 room clashes, 0 student elective clashes.

---

## 17. Standout Feature Candidates
1. **Candidate 1: Real-Time "What-If" Room/Faculty Disruptor:** Instant live schedule re-balancing when a teacher goes on sudden leave or a room is disabled.
2. **Candidate 2: Explainable AI Constraint Doctor:** Natural language diagnostic tool that explains why any specific slot was chosen or why an impossible scenario failed.
3. **Candidate 3: NEP 2020 Dynamic Credit & Basket Builder:** Visual matrix showing how elective baskets automatically shift to prevent cross-stream clashes.
4. **Candidate 4: Visual Student Clash-Risk Heatmap:** Graphical representation of student enrollment overlaps before and after generation.

---

## 18. Selected Standout Feature
**Selected: The "AI Constraint Doctor & Dynamic Disruptor" (Combines Candidate 1 & 2)**
- **Why it wins:** Judges love seeing both *proactive intelligence* (explaining why the timetable is optimal) and *reactive resilience* (clicking "Simulate Faculty Absence" and watching the engine re-route the schedule in real time without breaking any NEP elective rules).

---

## 19. Edge Cases & Resilience Strategy

| Edge Case | What Happens | How the System Responds | What the User Sees |
|---|---|---|---|
| **Impossible Constraint (Over-Constrained)** | 10 faculty requested for 5 available rooms simultaneously. | Engine detects mathematical infeasibility during pre-flight validation. | Clear "AI Constraint Doctor" alert highlighting exact bottleneck: *"Room Deficit: 10 concurrent lectures require at least 10 rooms, but only 5 exist in Period 2."* |
| **Faculty Unavailability Clash** | Key professor only available 2 hours/week for a 4-hour course. | Solver flags credit-hour deficit. | Warning card suggesting either increasing availability or assigning an assistant faculty. |
| **Popular Elective Over-Subscription** | 120 students pick a Minor course, but the largest room has 60 seats. | Engine automatically partitions the elective into two synchronized sections or schedules in an auditorium. | Visual badge: *"Auto-split into Section A & B across synchronized slots."* |
| **Single-Period Lab Error** | A 3-hour practical lab cannot fit into a fragmented single period. | Engine enforces atomic consecutive slot blocking. | Labs are always locked into continuous 2-period or 3-period afternoon blocks. |

---

## 20. Risks and Fallback Plans

1. **Risk: Solver gets stuck or takes too long on complex datasets.**
   - *Fallback:* Built-in solver timeout (3 seconds) with greedy fallback heuristic that fills highest-constraint major courses first, followed by synchronized elective baskets.
2. **Risk: Frontend grid becomes cluttered or unreadable with 50+ classes.**
   - *Fallback:* Dynamic multi-tab filtering (Filter by Department, Filter by Year/Semester, Filter by Room, Filter by Faculty).
3. **Risk: External AI/LLM API latency or rate limits during live judge demo.**
   - *Fallback:* Fast, pre-computed local rule-based explanation templates for diagnostics, with LLM enhancement as an async progressive enhancement.

---

## 21. Future Scope (Post-Hackathon Expansion)
- Mobile App / WhatsApp integration for automated daily schedule notifications to faculty and students.
- Biometric & RFID attendance integration to track real-time room occupancy vs. scheduled timetable.
- Multi-campus university cluster optimization with inter-college travel time buffers for visiting professors.
- Automated NEP Academic Bank of Credits (ABC) integration.
