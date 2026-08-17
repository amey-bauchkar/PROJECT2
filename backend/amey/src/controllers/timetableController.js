import { loadSeedData, getActiveTimetableState, setActiveTimetableState } from '../config/db.js';
import { normalizeCurriculum } from '../engine/normalizer.js';
import { buildConflictMatrix } from '../engine/conflictMatrix.js';
import { solveTimetable } from '../engine/constraintSolver.js';
import { validateTimetable } from '../engine/validator.js';
import { calculateQualityScore } from '../engine/scorer.js';
import { simulateDisruption } from '../simulation/whatIfEngine.js';
import { generateAIExplanation } from '../ai/diagnosticDoctor.js';

let latestSimulatedTimetable = null;

export async function generateTimetableHandler(req, res) {
  try {
    const collegeData = loadSeedData();

    // 1. Normalize events
    const events = normalizeCurriculum(collegeData);

    // 2. Build Conflict Matrix
    const conflictInfo = buildConflictMatrix(events, collegeData.cohorts);

    // 3. Solve Constraint Backtracking
    const { assignments, executionTimeMs } = solveTimetable(events, collegeData, conflictInfo);

    // 4. Validate Invariants
    const validation = validateTimetable(assignments);

    // 5. Calculate Score
    const { qualityScore, metrics } = calculateQualityScore(assignments, collegeData, validation);

    const timetableId = `tt_${Date.now()}`;
    const draftTimetable = {
      timetableId,
      generatedAt: new Date().toISOString(),
      executionTimeMs,
      qualityScore,
      metrics,
      entries: assignments,
      isSimulated: false
    };

    // 6. Generate AI Diagnostics
    const aiReport = await generateAIExplanation(draftTimetable);
    const completeTimetable = {
      ...draftTimetable,
      aiSummary: aiReport.aiSummary,
      recommendations: aiReport.recommendations
    };

    // Save as active timetable
    setActiveTimetableState(completeTimetable);

    res.status(200).json({
      success: true,
      ...completeTimetable
    });
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate clash-free timetable',
      error: error.message
    });
  }
}

export async function getActiveTimetableHandler(req, res) {
  try {
    let active = getActiveTimetableState();

    // If no timetable generated yet, generate one on the fly!
    if (!active) {
      const collegeData = loadSeedData();
      const events = normalizeCurriculum(collegeData);
      const conflictInfo = buildConflictMatrix(events, collegeData.cohorts);
      const { assignments, executionTimeMs } = solveTimetable(events, collegeData, conflictInfo);
      const validation = validateTimetable(assignments);
      const { qualityScore, metrics } = calculateQualityScore(assignments, collegeData, validation);

      const draftTimetable = {
        timetableId: `tt_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        executionTimeMs,
        qualityScore,
        metrics,
        entries: assignments,
        isSimulated: false
      };

      const aiReport = await generateAIExplanation(draftTimetable);
      active = {
        ...draftTimetable,
        aiSummary: aiReport.aiSummary,
        recommendations: aiReport.recommendations
      };

      setActiveTimetableState(active);
    }

    res.status(200).json({
      success: true,
      ...active
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active timetable',
      error: error.message
    });
  }
}

export function simulateDisruptionHandler(req, res) {
  try {
    const active = getActiveTimetableState();
    if (!active) {
      return res.status(400).json({ success: false, message: 'No active timetable to simulate disruptions on.' });
    }

    const collegeData = loadSeedData();
    const result = simulateDisruption(active, req.body, collegeData);

    latestSimulatedTimetable = {
      ...active,
      timetableId: `tt_sim_${Date.now()}`,
      entries: result.simulatedEntries,
      isSimulated: true
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Simulation failed', error: error.message });
  }
}

export function commitSimulationHandler(req, res) {
  try {
    if (!latestSimulatedTimetable) {
      return res.status(400).json({ success: false, message: 'No simulation result available to commit.' });
    }

    setActiveTimetableState(latestSimulatedTimetable);
    latestSimulatedTimetable = null;

    res.status(200).json({
      success: true,
      message: 'Simulated disruption schedule committed as live active timetable.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to commit simulation', error: error.message });
  }
}
