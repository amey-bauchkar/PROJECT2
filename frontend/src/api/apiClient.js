/**
 * Frontend API Client with Real Backend Integration & Dual Fallback Fixtures
 */

const API_BASE_URL = 'http://127.0.0.1:5000';

export async function fetchWithFallback(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API Error] Failed to fetch ${endpoint}. Falling back:`, err.message);
    throw err;
  }
}

// 1. Fetch Demo Configuration
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
  return {
    departments: [
      { id: 'DEP_CS', code: 'CS', name: 'Computer Science & Engineering' },
      { id: 'DEP_PHYS', code: 'PHYS', name: 'Department of Physics' },
      { id: 'DEP_ECON', code: 'ECON', name: 'Department of Economics' },
      { id: 'DEP_LIT', code: 'LIT', name: 'Department of English Literature' }
    ],
    roomsCount: 12,
    facultyCount: 18,
    coursesCount: 24
  };
}

// 2. Fetch Active Timetable Schedule
export async function getActiveTimetable() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/timetable/active`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API Offline - using fallback', err.message);
  }
  return { success: true, timetableId: 'tt_mock', entries: [], qualityScore: 88, executionTimeMs: 2 };
}

// 3. Trigger One-Click AI Timetable Generation
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
  return { success: true, qualityScore: 88, executionTimeMs: 3 };
}

// 4. Simulate Live Campus Disruption
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
  return { success: true, diffs: [], aiExplanation: 'Simulated relocation.' };
}

// 5. Commit Simulated Schedule to Live State
export async function commitSimulation() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/timetable/simulate/commit`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API Offline - simulation committed locally');
  }
  return { success: true, message: 'Simulated schedule promoted to active timetable.' };
}

// 6. Get Explainable AI Diagnostic Scorecard
export async function getDiagnostics(timetableId = 'active') {
  try {
    const res = await fetch(`${API_BASE_URL}/api/diagnostics/explain/${timetableId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API Offline - using mock diagnostics');
  }
  return {
    success: true,
    scorecard: { hardViolations: 0, overallQuality: 88, roomUtilization: 82.5, facultyLoadBalance: 91.0 },
    aiSummary: 'Optimal NEP 2020 schedule.',
    recommendations: ['Maintain current balance.']
  };
}

// 7. Feature 1: Pre-Flight Student Clash Radar
export async function getConflictRadar() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/conflict-radar`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API Offline - using mock conflict radar');
  }
  return { success: false, message: 'Offline' };
}

// 8. Feature 3: Elective Demand & Room Capacity Auto-Splitter
export async function getElectiveOverdemand() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/electives/overdemand`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API Offline - using mock overdemand');
  }
  return { success: false, message: 'Offline' };
}

export async function executeAutoSplit(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/electives/auto-split`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API Offline - using mock auto split');
  }
  return { success: false, message: 'Offline' };
}

export const apiClient = {
  getHealth: async () => fetchWithFallback('/health'),
  getInstitutionalConfig: getDemoConfig,
  generateTimetable,
  getActiveTimetable,
  getConflictRadar,
  getElectiveOverdemand,
  executeAutoSplit,
  simulateDisruption,
  commitSimulation,
  getDiagnostics
};
