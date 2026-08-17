import express from 'express';
import { getDemoData, updateConfig } from '../controllers/configController.js';
import {
  generateTimetableHandler,
  getActiveTimetableHandler,
  getConflictRadarHandler,
  getElectiveDemandHandler,
  executeAutoSplitHandler,
  simulateDisruptionHandler,
  commitSimulationHandler
} from '../controllers/timetableController.js';
import { getDiagnosticsHandler } from '../controllers/diagnosticController.js';

const router = express.Router();

// Configuration Routes
router.get('/config/demo-data', getDemoData);
router.post('/config/update', updateConfig);

// Timetable Generation & Active Schedule Routes
router.post('/timetable/generate', generateTimetableHandler);
router.get('/timetable/active', getActiveTimetableHandler);

// Feature 1: Pre-Flight Student Clash Radar & Conflict Graph Explorer
router.get('/conflict-radar', getConflictRadarHandler);

// Feature 3: Elective Demand & Room Capacity Auto-Splitter
router.get('/electives/overdemand', getElectiveDemandHandler);
router.post('/electives/auto-split', executeAutoSplitHandler);

// What-If Simulation Routes
router.post('/timetable/simulate', simulateDisruptionHandler);
router.post('/timetable/simulate/commit', commitSimulationHandler);

// Explainable AI Diagnostics Route
router.get('/diagnostics/explain/:timetableId', getDiagnosticsHandler);
router.get('/diagnostics/explain', getDiagnosticsHandler);

export default router;
