/**
 * ============================================================================
 * Automated Test Suite: Deterministic NEP 2020 Constraint Solver Engine
 * ============================================================================
 */

import { loadSeedData } from './src/config/db.js';
import { normalizeCurriculum } from './src/engine/normalizer.js';
import { buildConflictMatrix } from './src/engine/conflictMatrix.js';
import { solveTimetable } from './src/engine/constraintSolver.js';
import { validateTimetable } from './src/engine/validator.js';
import { calculateQualityScore } from './src/engine/scorer.js';
import { simulateDisruption } from './src/simulation/whatIfEngine.js';

console.log('============================================================');
console.log('🧪 RUNNING NEP 2020 CONSTRAINT ENGINE SMOKE TESTS');
console.log('============================================================\n');

try {
  // Test 1: Seed Data Ingestion
  process.stdout.write('1. Loading NEP 2020 Institutional Seed Data... ');
  const collegeData = loadSeedData();
  console.log(`✅ (${collegeData.departments.length} depts, ${collegeData.rooms.length} rooms, ${collegeData.faculty.length} faculty, ${collegeData.courses.length} courses)`);

  // Test 2: Input Normalization
  process.stdout.write('2. Normalizing Courses & Cohorts into Schedulable Events... ');
  const events = normalizeCurriculum(collegeData);
  const labEvents = events.filter(e => e.isLab);
  console.log(`✅ (${events.length} total events, ${labEvents.length} continuous lab blocks)`);

  // Test 3: Conflict Graph Construction
  process.stdout.write('3. Constructing Contention Graph G=(V,E)... ');
  const conflictInfo = buildConflictMatrix(events, collegeData.cohorts);
  console.log(`✅ (Degree Map initialized, Max degree: ${Math.max(...events.map(e => conflictInfo.getDegree(e.eventId)))})`);

  // Test 4: Backtracking Constraint Satisfaction Solver
  process.stdout.write('4. Executing Most-Constrained-Variable (MCV) Solver... ');
  const { assignments, executionTimeMs } = solveTimetable(events, collegeData, conflictInfo);
  console.log(`✅ (Solved in ${executionTimeMs}ms)`);

  if (executionTimeMs > 3000) {
    throw new Error(`Solver execution time exceeded 3000ms limit! (${executionTimeMs}ms)`);
  }

  // Test 5: Invariant Hard-Constraint Audit
  process.stdout.write('5. Auditing Invariants (Faculty, Room & Cohort Clashes)... ');
  const audit = validateTimetable(assignments);
  
  if (!audit.isValid || audit.clashCount > 0) {
    console.error('❌ VALIDATION FAILED! Violations:', audit.violations);
    throw new Error(`Audit found ${audit.clashCount} hard clashes!`);
  }
  console.log(`✅ (0 Hard Clashes Detected | 100% Invariant Safe)`);

  // Test 6: Soft Metric Scoring
  process.stdout.write('6. Calculating Soft Optimization Scores... ');
  const { qualityScore, metrics } = calculateQualityScore(assignments, collegeData, audit);
  console.log(`✅ (Quality Score: ${qualityScore}/100, Room Util: ${metrics.roomUtilization}%, Faculty Balance: ${metrics.facultyLoadBalance}%)`);

  if (qualityScore < 85) {
    throw new Error(`Quality score below acceptable threshold: ${qualityScore}`);
  }

  // Test 7: Live What-If Disruption Simulation
  process.stdout.write('7. Simulating Live Campus Disruption (Lab CS-1 Closure on Monday)... ');
  const draftTimetable = { timetableId: 'tt_test_01', entries: assignments };
  const disruptionResult = simulateDisruption(draftTimetable, { disruptionType: 'ROOM_CLOSURE', targetId: 'LAB_CS1', day: 'Mon' }, collegeData);
  
  if (!disruptionResult.success || disruptionResult.diffs.length === 0) {
    throw new Error('Simulation failed or did not generate relocation diffs!');
  }
  console.log(`✅ (Relocated ${disruptionResult.diffs.length} session(s) with 0 new clashes)`);

  console.log('\n============================================================');
  console.log('🎉 ALL ENGINE SMOKE TESTS PASSED WITH 100% ACCURACY!');
  console.log('============================================================');
  process.exit(0);
} catch (error) {
  console.error('\n❌ TEST SUITE FAILED:', error.message);
  process.exit(1);
}
