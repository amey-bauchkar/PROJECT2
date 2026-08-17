# Team Collaboration, Git Architecture & Parallel Workflow Rules

## 1. Team Structure & Strict Ownership Boundaries
- **Amey (Team Lead / Backend Architect):** Exclusively owns `backend/amey/`, root configuration, database, engine, and shared application shell (`frontend/src/`).
- **Janhavi (Frontend Timetable Visualizations):** Exclusively owns `frontend/janhavi/`.
- **Tanmay (Frontend Admin, Diagnostics & What-If):** Exclusively owns `frontend/tanmay/`.

*The Iron Law of Ownership:* No developer writes code inside another member's folder without explicit coordination and PR review.

---

## 2. Contract-First Mocking: The True Parallelism Engine
*Nobody waits for someone else to finish before coding.* We achieve true 3-person parallelism from Minute 1 through **Contract-First Mocking**:

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

1. **Minute 1:** Amey provides the frozen API Contract and mock JSON fixtures in `frontend/src/api/apiClient.js` and `backend/amey/src/data/sampleCollege.json`.
2. **Hours 1–6 (Simultaneous Execution):**
   - Amey writes the real mathematical constraint solver, validator, and Express routes.
   - Janhavi writes all 4 timetable views, filtering hooks, and UI badges against the mock fixture data.
   - Tanmay writes the Admin configuration, Generator HUD, AI Health Scorecard, and What-If Disruptor modal against the mock fixture data.
3. **Integration Phase:** Janhavi and Tanmay toggle their API client from mock data to live backend (`http://localhost:5000/api`), run end-to-end tests, and merge into `main`.

---

## 3. Granular Branching Strategy (Short-Lived Branches)
*Never use long-lived monolithic branches.* Large branches that live all day create unnecessary integration friction.

### Standard Branch Naming Convention:
- `feat/amey-engine-solver`
- `feat/amey-api-routes`
- `feat/janhavi-master-grid`
- `feat/janhavi-student-view`
- `feat/tanmay-admin-portal`
- `feat/tanmay-whatif-disruptor`
- `fix/amey-lab-consecutive-check`
- `fix/janhavi-grid-overflow`

### Branch Lifecycle Rule:
- **Scope:** 1 concrete sub-feature, 1 screen, or 1 engine module per branch.
- **Keep Branches Small and Mergeable:** Merge back into `main` frequently in small, high-confidence pull requests.

---

## 4. The Event-Driven Git Synchronization Workflow

### A. Before Starting Work on a Feature:
```bash
git checkout main
git pull origin main
git checkout -b feat/your-name-feature-name
```

### B. When to Sync with `main`:
Sync with `main` at natural break points:
1. Before starting a new sub-task.
2. Whenever Amey announces a shared contract or dependency update.
3. Right before opening a Pull Request.
```bash
git fetch origin
git merge origin/main   # (or git rebase origin/main)
```

### C. Before Committing:
```bash
git status
git add frontend/janhavi/  # ONLY stage files within your owned workspace!
git commit -m "feat(views): implement student major-minor schedule filter"
```

### D. Opening Pull Request & Peer Review:
- Create a PR targeting `main`.
- Must modify files strictly within your owned folder.
- Minimum 1 approval required (Amey reviews frontend PRs; Janhavi/Tanmay review backend contracts).

### E. Post-Merge Cleanup:
```bash
git checkout main
git pull origin main
git branch -d feat/your-name-feature-name
```

---

## 5. Shared Frontend Files & Single-Owner Policy

| Shared File / Area | Designated Owner | Who May Edit | How to Request Changes |
|---|---|---|---|
| `frontend/src/App.jsx` | **Amey** | Amey only | Propose your top-level view export (`MasterTimetableView`, `AdminConfigView`); Amey mounts it in the Tab Shell. |
| `frontend/src/api/apiClient.js` | **Amey** | Amey only | Endpoints are pre-written with mock fallback. If new parameters are needed, Amey updates the contract. |
| `frontend/src/styles/theme.css` | **Amey** | Amey only | Contains only global CSS variables/tokens. Janhavi and Tanmay write scoped styles inside their own folders. |
| `package.json` & lockfiles | **Amey** | Amey only | All hackathon packages are pre-installed. If a new library is needed, Amey installs it on `main`. |
| `.env` & `.env.example` | **Amey** | Amey only | Never commit `.env`. Keep secrets in local `.env` only. |

*Component Local-First Rule:* Janhavi and Tanmay create UI components inside their own folders (`frontend/janhavi/components/`, `frontend/tanmay/components/`). Do not prematurely create shared components in `src/components/ui/` unless genuinely reused across both modules.

---

## 6. Real-World Merge-Conflict Preventions

1. **App.jsx Isolation:** Amey provides a 4-tab shell upfront. Janhavi and Tanmay export top-level containers; Amey mounts them.
2. **Lockfile Isolation:** Pre-install all libraries in Phase 3. Amey alone touches `package.json`.
3. **Scoped Styling:** Zero component-specific CSS in `theme.css`. Write scoped CSS inside owned folders.
4. **Frozen API Contract:** Mock JSON responses matching `ARCHITECTURE.md` Section 9 allow frontend developers to code without waiting for backend completion.
5. **Decoupled State Sync:** Tanmay triggers generation and invokes `onTimetableUpdated()` callback passed from `App.jsx` rather than mutating Janhavi's local state.

---

## 7. What To Do If a Merge Conflict Occurs
1. **Do not panic and DO NOT force push (`--force`).**
2. Check which file is conflicting (`git status`).
3. If it's inside your owned folder: Open the file, resolve conflict markers, and commit.
4. If it's a shared file (e.g. `App.jsx` or `package.json`): **Call Amey immediately.** Amey will resolve the shared conflict with both authors present.
5. Re-run local tests to ensure the project builds and runs cleanly before completing the merge.

---

## 8. Prohibited Actions
- ❌ **NEVER run `git push --force` on `main`.**
- ❌ **NEVER edit files inside another teammate's owned folder without permission.**
- ❌ **NEVER commit `.env` or files containing API keys.**
- ❌ **NEVER install npm packages without coordinating with Amey.**
- ❌ **NEVER merge a PR that has failing tests or broken UI renders.**
