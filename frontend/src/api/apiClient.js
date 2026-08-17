/**
 * ============================================================================
 * NEP 2020 AI Timetable Orchestrator - API Client & Mock Fixture Provider
 * ============================================================================
 * Owned by: Amey (Team Leader)
 * Consumed by: Janhavi (Frontend Visualization) & Tanmay (Frontend Admin)
 * 
 * Contract-First Parallelism Rule:
 * This client provides real REST fetchers with automatic local mock fallbacks.
 * Frontend teammates can develop against realistic schedule fixtures immediately!
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// ==========================================
// REALISTIC NEP 2020 MOCK SCHEDULE FIXTURE
// ==========================================
const MOCK_TIMETABLE_FIXTURE = {
  success: true,
  timetableId: 'tt_mock_nep2020_001',
  generatedAt: new Date().toISOString(),
  executionTimeMs: 385,
  qualityScore: 94,
  metrics: {
    clashCount: 0,
    roomUtilization: 83.5,
    facultyLoadBalance: 92.0,
    studentGapScore: 95.0
  },
  aiSummary: "Optimal NEP 2020 schedule generated with 0 hard clashes. All 4 Major cohort core subjects, 4 Minor electives, and practical laboratory blocks have been allocated into collision-free synchronized time bands with 94/100 quality score.",
  recommendations: [
    "Computer Lab 1 has 88% peak load between 11:00 AM - 01:00 PM; balanced by moving SEC Web Lab to Thursday.",
    "Faculty teaching load has a standard deviation of 1.2 hours/day, ensuring balanced workload distribution.",
    "0 student elective basket collisions detected across CS, Physics, Economics, and Literature cohorts."
  ],
  entries: [
    // Monday
    { id: 'e_101', day: 'Mon', period: 1, timeLabel: '09:00 - 09:50', courseId: 'CS101', courseName: 'Programming in C++', category: 'Major', facultyId: 'FAC_01', facultyName: 'Dr. A. Verma', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_102', day: 'Mon', period: 1, timeLabel: '09:00 - 09:50', courseId: 'PHYS101', courseName: 'Mechanics & Optics', category: 'Major', facultyId: 'FAC_05', facultyName: 'Dr. S. Sharma', roomId: 'LH_102', roomNumber: 'LH-102', cohortId: 'COHORT_PHYS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_103', day: 'Mon', period: 2, timeLabel: '09:50 - 10:40', courseId: 'CS102', courseName: 'Discrete Mathematics', category: 'Major', facultyId: 'FAC_02', facultyName: 'Prof. N. Gupta', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_104', day: 'Mon', period: 2, timeLabel: '09:50 - 10:40', courseId: 'ECON101', courseName: 'Microeconomics', category: 'Major', facultyId: 'FAC_09', facultyName: 'Dr. M. Koul', roomId: 'LH_201', roomNumber: 'LH-201', cohortId: 'COHORT_ECON_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_105', day: 'Mon', period: 3, timeLabel: '11:00 - 11:50', courseId: 'AEC_COMM', courseName: 'English Communication', category: 'AEC', facultyId: 'FAC_14', facultyName: 'Prof. G. Kaul', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_106', day: 'Mon', period: 3, timeLabel: '11:00 - 11:50', courseId: 'LIT101', courseName: 'World Literature', category: 'Major', facultyId: 'FAC_13', facultyName: 'Dr. R. Dhar', roomId: 'LH_202', roomNumber: 'LH-202', cohortId: 'COHORT_LIT_Y1', sessionType: 'Theory', blockLength: 1 },
    // Monday Lab Block (Spans Period 5 & 6)
    { id: 'e_107', day: 'Mon', period: 5, timeLabel: '01:40 - 03:20', courseId: 'CS101_LAB', courseName: 'C++ Data Structures Lab', category: 'Major', facultyId: 'FAC_01', facultyName: 'Dr. A. Verma', roomId: 'LAB_CS1', roomNumber: 'Lab CS-1', cohortId: 'COHORT_CS_Y1', sessionType: 'Practical', blockLength: 2 },
    { id: 'e_108', day: 'Mon', period: 7, timeLabel: '03:20 - 04:10', courseId: 'VAC_ETHICS', courseName: 'Digital Ethics & Privacy', category: 'VAC', facultyId: 'FAC_02', facultyName: 'Prof. N. Gupta', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },

    // Tuesday (NEP Synchronized Minor Basket Day)
    { id: 'e_201', day: 'Tue', period: 1, timeLabel: '09:00 - 09:50', courseId: 'PHYS102', courseName: 'Mathematical Physics I', category: 'Major', facultyId: 'FAC_06', facultyName: 'Prof. V. Jamwal', roomId: 'LH_102', roomNumber: 'LH-102', cohortId: 'COHORT_PHYS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_202', day: 'Tue', period: 2, timeLabel: '09:50 - 10:40', courseId: 'ECON102', courseName: 'Quantitative Methods', category: 'Major', facultyId: 'FAC_10', facultyName: 'Prof. A. Lone', roomId: 'LH_201', roomNumber: 'LH-201', cohortId: 'COHORT_ECON_Y1', sessionType: 'Theory', blockLength: 1 },
    // Synchronized Minor Band 1 (Period 3)
    { id: 'e_203', day: 'Tue', period: 3, timeLabel: '11:00 - 11:50', courseId: 'ECON_MIN_01', courseName: 'Macroeconomics for Policy (Minor)', category: 'Minor', facultyId: 'FAC_11', facultyName: 'Dr. Z. Mir', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_204', day: 'Tue', period: 3, timeLabel: '11:00 - 11:50', courseId: 'CS_MIN_01', courseName: 'Data Literacy (Minor)', category: 'Minor', facultyId: 'FAC_03', facultyName: 'Dr. P. Bhat', roomId: 'LH_102', roomNumber: 'LH-102', cohortId: 'COHORT_PHYS_Y1', sessionType: 'Theory', blockLength: 1 },
    // Tuesday Physics Lab Block (Spans Period 5 & 6)
    { id: 'e_205', day: 'Tue', period: 5, timeLabel: '01:40 - 03:20', courseId: 'PHYS101_LAB', courseName: 'Optics & Mechanics Lab', category: 'Major', facultyId: 'FAC_05', facultyName: 'Dr. S. Sharma', roomId: 'LAB_PHYS1', roomNumber: 'Physics Lab 1', cohortId: 'COHORT_PHYS_Y1', sessionType: 'Practical', blockLength: 2 },

    // Wednesday (NEP Multidisciplinary MDC Day)
    { id: 'e_301', day: 'Wed', period: 1, timeLabel: '09:00 - 09:50', courseId: 'CS101', courseName: 'Programming in C++', category: 'Major', facultyId: 'FAC_01', facultyName: 'Dr. A. Verma', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    // Synchronized MDC Band (Period 2)
    { id: 'e_302', day: 'Wed', period: 2, timeLabel: '09:50 - 10:40', courseId: 'MDC_ASTRO', courseName: 'Introductory Astronomy (MDC)', category: 'MDC', facultyId: 'FAC_08', facultyName: 'Prof. M. Singh', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_303', day: 'Wed', period: 2, timeLabel: '09:50 - 10:40', courseId: 'MDC_FIN', courseName: 'Personal Finance & Markets (MDC)', category: 'MDC', facultyId: 'FAC_12', facultyName: 'Prof. H. Qureshi', roomId: 'LH_102', roomNumber: 'LH-102', cohortId: 'COHORT_PHYS_Y1', sessionType: 'Theory', blockLength: 1 },
    // SEC Skill Lab (Period 5 & 6)
    { id: 'e_304', day: 'Wed', period: 5, timeLabel: '01:40 - 03:20', courseId: 'SEC_WEB', courseName: 'Web Design Lab (SEC)', category: 'SEC', facultyId: 'FAC_04', facultyName: 'Prof. T. Raina', roomId: 'LAB_CS2', roomNumber: 'Lab CS-2', cohortId: 'COHORT_CS_Y1', sessionType: 'Practical', blockLength: 2 },

    // Thursday
    { id: 'e_401', day: 'Thu', period: 1, timeLabel: '09:00 - 09:50', courseId: 'CS102', courseName: 'Discrete Mathematics', category: 'Major', facultyId: 'FAC_02', facultyName: 'Prof. N. Gupta', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_402', day: 'Thu', period: 2, timeLabel: '09:50 - 10:40', courseId: 'ECON101', courseName: 'Microeconomics', category: 'Major', facultyId: 'FAC_09', facultyName: 'Dr. M. Koul', roomId: 'LH_201', roomNumber: 'LH-201', cohortId: 'COHORT_ECON_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_403', day: 'Thu', period: 3, timeLabel: '11:00 - 11:50', courseId: 'ECON_MIN_01', courseName: 'Macroeconomics for Policy (Minor)', category: 'Minor', facultyId: 'FAC_11', facultyName: 'Dr. Z. Mir', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_404', day: 'Thu', period: 4, timeLabel: '11:50 - 12:40', courseId: 'AEC_COMM', courseName: 'English Communication', category: 'AEC', facultyId: 'FAC_14', facultyName: 'Prof. G. Kaul', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_405', day: 'Thu', period: 5, timeLabel: '01:40 - 02:30', courseId: 'VAC_WELLNESS', courseName: 'Yoga & Physical Fitness', category: 'VAC', facultyId: 'FAC_15', facultyName: 'Dr. F. Wani', roomId: 'AUD_01', roomNumber: 'Main Auditorium', cohortId: 'COHORT_ECON_Y1', sessionType: 'Theory', blockLength: 1 },

    // Friday
    { id: 'e_501', day: 'Fri', period: 1, timeLabel: '09:00 - 09:50', courseId: 'CS101', courseName: 'Programming in C++', category: 'Major', facultyId: 'FAC_01', facultyName: 'Dr. A. Verma', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_502', day: 'Fri', period: 2, timeLabel: '09:50 - 10:40', courseId: 'MDC_ASTRO', courseName: 'Introductory Astronomy (MDC)', category: 'MDC', facultyId: 'FAC_08', facultyName: 'Prof. M. Singh', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 },
    { id: 'e_503', day: 'Fri', period: 3, timeLabel: '11:00 - 11:50', courseId: 'VAC_ETHICS', courseName: 'Digital Ethics & Privacy', category: 'VAC', facultyId: 'FAC_02', facultyName: 'Prof. N. Gupta', roomId: 'LH_101', roomNumber: 'LH-101', cohortId: 'COHORT_CS_Y1', sessionType: 'Theory', blockLength: 1 }
  ]
};

// ==========================================
// API HELPER FUNCTIONS
// ==========================================

/**
 * 1. Fetch Demo Configuration (Rooms, Faculty, Courses, Cohorts)
 */
export async function getDemoConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/config/demo-data`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('API Offline - using fallback demo config', err.message);
  }
  // Fallback demo config
  return {
    departments: [
      { id: 'DEP_CS', code: 'CS', name: 'Computer Science & Engineering' },
      { id: 'DEP_PHYS', code: 'PHYS', name: 'Department of Physics' },
      { id: 'DEP_ECON', code: 'ECON', name: 'Department of Economics' },
      { id: 'DEP_LIT', code: 'LIT', name: 'Department of English Literature' }
    ],
    roomsCount: 12,
    facultyCount: 18,
    coursesCount: 28
  };
}

/**
 * 2. Fetch Active Timetable Schedule
 */
export async function getActiveTimetable() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/timetable/active`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API Offline - using mock timetable fixture', err.message);
  }
  return MOCK_TIMETABLE_FIXTURE;
}

/**
 * 3. Trigger One-Click AI Timetable Generation
 */
export async function generateTimetable(options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/timetable/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API Offline - simulating generate timetable', err.message);
  }
  // Simulated generation delay for realistic HUD animation
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    ...MOCK_TIMETABLE_FIXTURE,
    executionTimeMs: Math.floor(Math.random() * 200 + 300),
    generatedAt: new Date().toISOString()
  };
}

/**
 * 4. Simulate Live Campus Disruption (What-If Analysis)
 */
export async function simulateDisruption(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/timetable/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API Offline - simulating what-if disruption', err.message);
  }

  // Simulated relocation diff
  return {
    success: true,
    originalTimetableId: MOCK_TIMETABLE_FIXTURE.timetableId,
    diffs: [
      {
        courseId: 'CS101_LAB',
        courseName: 'C++ Data Structures Lab',
        oldSlot: { day: payload.day || 'Mon', period: 5, roomNumber: 'Lab CS-1' },
        newSlot: { day: 'Thu', period: 6, roomNumber: 'Lab CS-2' },
        reason: `${payload.targetId || 'Lab CS-1'} closed for scheduled maintenance on ${payload.day || 'Monday'}`
      }
    ],
    aiExplanation: `Disruption simulated: Re-routed 1 practical lab session from ${payload.targetId || 'Lab CS-1'} to Lab CS-2. 0 student cohort conflicts introduced.`,
    simulatedEntries: MOCK_TIMETABLE_FIXTURE.entries
  };
}

/**
 * 5. Commit Simulated Schedule to Live State
 */
export async function commitSimulation() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/timetable/simulate/commit`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API Offline - simulation committed locally');
  }
  return { success: true, message: 'Simulated schedule promoted to active timetable.' };
}

/**
 * 6. Get Explainable AI Diagnostic Scorecard
 */
export async function getDiagnostics(timetableId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/diagnostics/explain/${timetableId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API Offline - using mock diagnostics');
  }
  return {
    success: true,
    scorecard: {
      hardViolations: 0,
      overallQuality: 94,
      roomUtilization: 83.5,
      facultyLoadBalance: 92.0
    },
    aiSummary: MOCK_TIMETABLE_FIXTURE.aiSummary,
    recommendations: MOCK_TIMETABLE_FIXTURE.recommendations
  };
}
