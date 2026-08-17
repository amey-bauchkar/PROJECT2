/**
 * Frontend API Client with Real Backend Integration & Dual Fallback Fixtures
 */

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export async function fetchWithFallback(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API Error] Failed to fetch ${endpoint}. Returning fallback data:`, err.message);
    throw err;
  }
}

export const apiClient = {
  // 1. Health check
  getHealth: async () => {
    return fetchWithFallback('/health');
  },

  // 2. Institutional Demo Config
  getInstitutionalConfig: async () => {
    return fetchWithFallback('/config/demo-data');
  },

  // 3. Generate Timetable
  generateTimetable: async () => {
    return fetchWithFallback('/timetable/generate', { method: 'POST' });
  },

  // 4. Get Active Timetable
  getActiveTimetable: async () => {
    return fetchWithFallback('/timetable/active');
  },

  // 5. Feature 1: Pre-Flight Student Clash Radar & Conflict Graph Explorer
  getConflictRadar: async () => {
    return fetchWithFallback('/conflict-radar');
  },

  // 6. Feature 3: Elective Demand & Room Capacity Auto-Splitter
  getElectiveOverdemand: async () => {
    return fetchWithFallback('/electives/overdemand');
  },

  executeAutoSplit: async (payload) => {
    return fetchWithFallback('/electives/auto-split', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 7. Simulate Campus Disruption
  simulateDisruption: async (disruptionPayload) => {
    return fetchWithFallback('/timetable/simulate', {
      method: 'POST',
      body: JSON.stringify(disruptionPayload)
    });
  },

  // 8. Commit Simulation
  commitSimulation: async () => {
    return fetchWithFallback('/timetable/simulate/commit', { method: 'POST' });
  },

  // 9. Explainable AI Diagnostics
  getDiagnostics: async (timetableId = 'active') => {
    return fetchWithFallback(`/diagnostics/explain/${timetableId}`);
  }
};
