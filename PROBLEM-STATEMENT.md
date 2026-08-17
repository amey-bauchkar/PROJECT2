# Problem Statement

## Problem Statement Number
SIH25091

## Title
AI-Based Timetable Generation System aligned with NEP 2020 for Multidisciplinary Education Structures

## Organization
Government of Jammu & Kashmir

## Category
Software

## Theme
Smart Automation

---

## Original Problem Statement
> **Title:** AI-Based Timetable Generation System aligned with NEP 2020 for Multidisciplinary Education Structures  
> **Problem Statement ID:** SIH25091  
> **Organization:** Government of Jammu & Kashmir  
> **Category:** Software  
> **Theme:** Smart Automation  

*(Note: The title and metadata represent the exact official problem statement provided for this challenge.)*

---

## Problem Understanding

### What the Problem Statement Explicitly States
1. **Target Deliverable:** A timetable generation system.
2. **Core Requirement:** The generation mechanism must be **AI-based**.
3. **Policy Alignment:** The system must strictly align with the principles/framework of **NEP 2020** (National Education Policy 2020).
4. **Institutional Context:** Designed for **Multidisciplinary Education Structures** (where students have flexible, cross-disciplinary subject choices).
5. **Stakeholder:** Originates from the **Government of Jammu & Kashmir** under the **Smart Automation** software category.

### What Needs Clarification / Further Research
1. Specific operational interpretation of "AI-based" (e.g., constraint satisfaction, heuristic optimization, machine learning, metaheuristics, or hybrid engines).
2. The exact operational model of multidisciplinary course combinations and credit framework under NEP 2020 implemented across higher education institutions in Jammu & Kashmir.
3. Detailed institutional constraints (e.g., physical room capacities, faculty availability, lab vs. theory slots, student elective clashes, institutional shifts).
4. Input and output data interfaces, formatting expectations, and scale (e.g., department level vs. college level vs. university level).

---

## Key Terms

- **AI-Based:**  
  Techniques drawn from Artificial Intelligence/Computational Intelligence (such as constraint satisfaction algorithms, evolutionary algorithms, heuristic search, optimization solvers, or machine learning) capable of autonomously resolving high-dimensional scheduling conflicts and combinatorial challenges.
- **Timetable Generation:**  
  The automated assignment of academic events (lectures, tutorials, practicals/labs) to specific time slots, physical rooms/labs, faculty members, and student cohorts without introducing invalid resource overlaps or scheduling conflicts.
- **NEP 2020 (National Education Policy 2020):**  
  India's education policy promoting flexible curriculum structures, multidisciplinary study, multiple entry/exit points, major/minor subject combinations, skill-enhancement courses (SEC), ability enhancement courses (AEC), and value-added courses (VAC).
- **Multidisciplinary Education Structures:**  
  Academic structures breaking traditional rigid departmental silos, allowing students across arts, science, commerce, and vocational streams to select interdisciplinary major and minor subjects, leading to complex and dynamic individual student schedules.

---

## Known Problem Area
The problem addresses the **University/College Course Timetabling Problem (UCTP)** under a **multidisciplinary framework**. 

Historically, timetables were generated for fixed, rigid class sections where all students in a batch followed an identical schedule. Under NEP 2020 multidisciplinary structures, students choose customized combinations of major, minor, multidisciplinary, skill, and value-added courses. This creates an exponential increase in combinatorial conflicts (student-level clashes, cross-department faculty sharing, shared lab/classroom contention). 

The problem demands an automated system capable of taking complex institutional inputs and generating clash-free, optimized academic schedules.

---

## Questions We Need to Research

### 1. Education / Domain Questions
- What specific curricular structures does NEP 2020 mandate (e.g., Major, Minor, Multidisciplinary Courses (MDC), Ability Enhancement (AEC), Skill Enhancement (SEC), Value Added Courses (VAC))?
- How do credit frameworks and weekly lecture/practical/tutorial hour allocations operate under NEP 2020?
- What cross-departmental sharing patterns exist for faculty, classrooms, and specialized laboratories?
- How are student batches/cohorts structured when every student might have a unique set of electives?

### 2. Technical & Algorithmic Questions
- What formal algorithmic classes exist for Automated Timetable Generation (e.g., CSP - Constraint Satisfaction Problems, Genetic Algorithms, Simulated Annealing, Tabu Search, Integer Linear Programming / SAT Solvers)?
- What distinguishes "Hard Constraints" (mandatory rules that make a timetable valid) from "Soft Constraints" (preference rules that make a timetable optimal)?
- What standard metrics measure timetable quality (e.g., gap minimization for students, faculty workload distribution, room utilization efficiency)?
- How do existing open-source or academic timetabling benchmarks (e.g., ITC - International Timetabling Competition formulations) structure constraints?

### 3. Data Questions
- What are the required input entities (Faculty, Rooms/Labs, Courses/Subjects, Student Enrolments/Elective Choices, Time Slots, Shifts/Days)?
- How are availability matrices (e.g., faculty unavailable times, room type restrictions) structured?
- What is the expected format and granularity of the generated timetable output (e.g., Master Timetable, Student-wise Timetable, Faculty-wise Timetable, Room-wise Timetable)?
- What volume/scale of entities should be targeted for an MVP (e.g., single department vs. multi-department college vs. university)?

### 4. AI / Computational Approach Questions
- What computational techniques qualify as "AI-based" in the context of combinatorial optimization and scheduling?
- Is pure Machine Learning (ML) suitable for constraint-critical scheduling, or are heuristic search/constraint-programming/evolutionary approaches more reliable for 100% clash-free outputs?
- What algorithmic approach is feasible to implement, tune, and demonstrate convincingly within an 18-hour hackathon environment?

---

## Constraints We Can Already Identify

*(Note: These are direct logical implications of the timetable problem domain, not invented requirements.)*

### Inferred Hard Constraints (Validity Requirements)
- **No Faculty Double-Booking:** A faculty member cannot be scheduled to teach multiple classes in the same time slot.
- **No Room/Lab Double-Booking:** A physical room or laboratory cannot host multiple distinct sessions at the same time.
- **No Student Group / Subject Overlap for Enrolled Cohorts:** Students enrolled in mandatory common subjects or concurrent chosen electives cannot have conflicting overlapping time slots.
- **Room Capacity & Type Compliance:** Practical/lab sessions must be assigned to appropriate laboratories; lecture sessions must not exceed the physical seating capacity of assigned rooms.

### Inferred Soft Constraints (Quality/Optimization Preferences)
- **Balanced Workload Distribution:** Faculty workload should be evenly distributed across weekdays rather than heavily clustered.
- **Minimization of Idle Gaps:** Excessive idle gaps/breaks in daily student or faculty schedules should be minimized.
- **Consecutive Practical/Lab Blocks:** Laboratory sessions typically require continuous multi-period blocks rather than isolated single periods.
- **Preferred Time Allocations:** Core/heavy analytical subjects scheduled in earlier morning slots where feasible.

---

## Unknowns & Assumptions

### Unknowns Requiring Research & Verification
- **Institution Scale & Scope:** Is the target an individual college, a multidisciplinary cluster, or an entire university ecosystem?
- **Elective Selection Model:** Do students select electives prior to timetable generation (fixed enrolment matrix), or is the timetable generated to offer pre-defined elective baskets?
- **Platform Expectations:** Is the evaluation focused on the optimization solver/engine, a web management portal, or both?
- **Evaluation Criteria:** How will hackathon evaluators assess "AI-based" — via solver speed, zero-clash guarantee, optimization score, or adaptability to dynamic changes?

### Explicit Assumptions (Subject to Research Phase)
- *[Inference]* The core technical challenge is solving a heavily constrained NP-hard combinatorial optimization problem.
- *[Inference]* NEP 2020 introduces significantly more inter-departmental dependencies than traditional fixed-syllabus degree programs.
- *[Inference]* The solution must provide clear, actionable outputs for administrators, teachers, and students.
