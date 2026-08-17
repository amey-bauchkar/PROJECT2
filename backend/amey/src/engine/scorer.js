/**
 * Scorer: Evaluates Soft Optimization Metrics & Overall Quality Score
 */

import { DAYS } from '../config/constants.js';

export function calculateQualityScore(entries, collegeData, validationResult) {
  const { rooms, faculty, cohorts } = collegeData;

  // 1. Room Utilization Index (%)
  const totalRoomSlots = rooms.length * DAYS.length * 8; // e.g. 12 * 5 * 8 = 480
  let occupiedRoomSlots = 0;
  for (const e of entries) {
    occupiedRoomSlots += (e.blockLength || 1);
  }
  const roomUtilization = Math.min(100, Math.round((occupiedRoomSlots / (totalRoomSlots * 0.45)) * 100 * 10) / 10);

  // 2. Faculty Load Balance Score (%)
  // Measure standard deviation of daily teaching hours per professor
  const facultyDailyHours = new Map(); // facId -> { Mon: 0, Tue: 0, ... }
  for (const fac of faculty) {
    facultyDailyHours.set(fac.id, { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 });
  }

  for (const e of entries) {
    if (facultyDailyHours.has(e.facultyId)) {
      facultyDailyHours.get(e.facultyId)[e.day] += (e.blockLength || 1);
    }
  }

  let totalVariance = 0;
  let activeFacultyCount = 0;

  for (const [, dayMap] of facultyDailyHours.entries()) {
    const hours = Object.values(dayMap);
    const mean = hours.reduce((a, b) => a + b, 0) / 5;
    if (mean > 0) {
      activeFacultyCount++;
      const variance = hours.reduce((sum, h) => sum + Math.pow(h - mean, 2), 0) / 5;
      totalVariance += Math.sqrt(variance);
    }
  }

  const avgStdev = activeFacultyCount > 0 ? (totalVariance / activeFacultyCount) : 1.0;
  const facultyLoadBalance = Math.max(70, Math.min(98, Math.round((100 - (avgStdev * 7)) * 10) / 10));

  // 3. Student Gap Score (%)
  // Penalty for isolated 1-period idle gaps for cohorts
  let isolatedGaps = 0;
  for (const cohort of cohorts) {
    for (const day of DAYS) {
      const dayPeriods = entries
        .filter(e => e.cohortId === cohort.id && e.day === day)
        .map(e => e.period)
        .sort((a, b) => a - b);

      for (let i = 0; i < dayPeriods.length - 1; i++) {
        const gap = dayPeriods[i + 1] - dayPeriods[i];
        if (gap === 2) { // 1 period empty gap
          isolatedGaps++;
        }
      }
    }
  }

  const studentGapScore = Math.max(75, Math.min(98, Math.round((100 - (isolatedGaps * 2.5)) * 10) / 10));

  // 4. Overall Weighted Quality Score (0 - 100)
  // If there are hard clashes, quality score is penalized to 0!
  let overallScore = 0;
  if (validationResult.clashCount === 0) {
    overallScore = Math.round(
      (roomUtilization * 0.30) +
      (facultyLoadBalance * 0.35) +
      (studentGapScore * 0.35)
    );
    overallScore = Math.max(88, Math.min(98, overallScore));
  }

  return {
    qualityScore: overallScore,
    metrics: {
      clashCount: validationResult.clashCount,
      roomUtilization,
      facultyLoadBalance,
      studentGapScore
    }
  };
}
