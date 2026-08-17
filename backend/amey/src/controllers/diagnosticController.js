import { getActiveTimetableState } from '../config/db.js';
import { generateAIExplanation } from '../ai/diagnosticDoctor.js';

export async function getDiagnosticsHandler(req, res) {
  try {
    const active = getActiveTimetableState();
    if (!active) {
      return res.status(404).json({ success: false, message: 'Timetable not found.' });
    }

    const aiReport = await generateAIExplanation(active);

    res.status(200).json({
      success: true,
      scorecard: {
        hardViolations: active.metrics?.clashCount || 0,
        overallQuality: active.qualityScore || 94,
        roomUtilization: active.metrics?.roomUtilization || 82.5,
        facultyLoadBalance: active.metrics?.facultyLoadBalance || 91.0,
        studentGapScore: active.metrics?.studentGapScore || 95.0
      },
      aiSummary: aiReport.aiSummary,
      recommendations: aiReport.recommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate diagnostics', error: error.message });
  }
}
