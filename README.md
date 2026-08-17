# SmartSchedule NEP 2020 (SIH25091)
**AI-Based Timetable Generation System for Multidisciplinary Education Structures**

---

## 📌 Problem Overview
Under the **National Education Policy (NEP 2020)**, higher education institutions in Jammu & Kashmir and across India are moving from rigid class-section models to flexible, multidisciplinary credit frameworks. Students choose customized combinations across Major disciplines, Minor subjects, Multidisciplinary Courses (MDC), Ability Enhancement (AEC), Skill Enhancement (SEC), and Value Added Courses (VAC). 

This creates an exponential number of scheduling conflicts across cross-departmental faculty, shared physical infrastructure, and student elective tracks. **SmartSchedule** is a hybrid intelligent timetabling platform that pairs a deterministic constraint satisfaction engine (guaranteeing 100% clash-free schedules) with an explainable AI diagnostic layer and live what-if simulation capabilities.

---

## 👥 Team & Ownership Model
This project is built by a 3-person engineering team:

| Team Member | Role | Workspace / Ownership | Core Responsibilities |
|---|---|---|---|
| **Amey** | Team Lead / Backend & Engine | `backend/amey/` | Core Constraint Engine, NEP Basket Solver, Conflict Matrices, Validation, Database, API Services, Simulation Engine |
| **Janhavi** | Frontend Engineer | `frontend/janhavi/` | Interactive Master Grid, Student View, Faculty Schedule, Room Heatmap, Schedule Exploration & Filtering |
| **Tanmay** | Frontend Engineer | `frontend/tanmay/` | Admin Configuration Portal, NEP Basket Builder, What-If Disruption Controls, AI Diagnostic & Quality Dashboard |

---

## 🏛️ Project Documentation Roadmap
- 📄 [`PROBLEM-STATEMENT.md`](./PROBLEM-STATEMENT.md) — Official SIH25091 problem statement and domain analysis.
- 📄 [`SOLUTION.md`](./SOLUTION.md) — Research findings, solution comparison, and locked product definition.
- 📄 [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Complete technical architecture, algorithms, data models, and API contracts.
- 📄 [`TEAM-RULES.md`](./TEAM-RULES.md) — Git workflow, branch conventions, and collaboration rules.
- 📁 [`TASKS/`](./TASKS/) — Specific role task allocations ([`AMEY.md`](./TASKS/AMEY.md), [`JANHAVI.md`](./TASKS/JANHAVI.md), [`TANMAY.md`](./TASKS/TANMAY.md)).

---

## 🚀 Quick Architecture Summary
- **Frontend:** React (Vite) + Vanilla CSS / Design Tokens (Shared UI primitives, modular owned feature views).
- **Backend:** Node.js + Express (Modular Monolith, REST APIs).
- **Core Engine:** Custom Deterministic Constraint Satisfaction & Most-Constrained-Variable (MCV) Slot Allocator + NEP Basket Synchronizer.
- **AI Diagnostics:** Fast rule-based diagnostic templates + Async Groq LLM co-pilot for human-readable root-cause explanations and quality scorecards.
- **Database:** MongoDB / In-Memory JSON dual-mode persistence.
