import express from 'express';
import { getDemoData, updateConfig } from '../controllers/configController.js';
import {
  generateTimetableHandler,
  getActiveTimetableHandler,
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

// What-If Simulation Routes
router.post('/timetable/simulate', simulateDisruptionHandler);
router.post('/timetable/simulate/commit', commitSimulationHandler);

// Explainable AI Diagnostics Route
router.get('/diagnostics/explain/:timetableId', getDiagnosticsHandler);
router.get('/diagnostics/explain', getDiagnosticsHandler);

export default router;
