/**
 * Constraint Solver: Most-Constrained-Variable (MCV) Backtracking Engine
 */

import { DAYS, PERIODS, SOLVER_CONFIG } from '../config/constants.js';
import { getBasketRestrictedSlots } from './basketOptimizer.js';

export function solveTimetable(events, collegeData, conflictInfo) {
  const { rooms, faculty } = collegeData;
  const startTime = Date.now();

  const facultyMap = new Map(faculty.map(f => [f.id, f]));
  const roomMap = new Map(rooms.map(r => [r.id, r]));

  // 1. Sort Events by Most-Constrained-Variable (MCV) Difficulty Score
  const sortedEvents = [...events].sort((a, b) => {
    const degA = conflictInfo.getDegree(a.eventId);
    const degB = conflictInfo.getDegree(b.eventId);

    const unavailA = facultyMap.get(a.facultyId)?.unavailableSlots?.length || 0;
    const unavailB = facultyMap.get(b.facultyId)?.unavailableSlots?.length || 0;

    const scoreA = (a.blockLength * 100) + (a.isLab ? 50 : 0) + (degA * 10) + (unavailA * 5);
    const scoreB = (b.blockLength * 100) + (b.isLab ? 50 : 0) + (degB * 10) + (unavailB * 5);

    return scoreB - scoreA; // Descending: hardest to place first
  });

  // Occupancy Tracking Maps: key = `${day}_${period}` -> Set of occupied resource IDs
  const facultyOccupancy = new Map();
  const roomOccupancy = new Map();
  const cohortOccupancy = new Map();
  const courseDayCount = new Map(); // `${cohortId}_${courseId}_${day}` -> count

  for (const day of DAYS) {
    for (let p = 1; p <= 8; p++) {
      const slotKey = `${day}_${p}`;
      facultyOccupancy.set(slotKey, new Set());
      roomOccupancy.set(slotKey, new Set());
      cohortOccupancy.set(slotKey, new Set());
    }
  }

  // Pre-populate Faculty Unavailability constraints
  for (const fac of faculty) {
    if (fac.unavailableSlots && Array.isArray(fac.unavailableSlots)) {
      for (const slot of fac.unavailableSlots) {
        const slotKey = `${slot.day}_${slot.period}`;
        facultyOccupancy.get(slotKey)?.add(fac.id);
      }
    }
  }

  // Solution assignment array
  const assignments = [];

  // 2. Recursive Backtracking Function
  function backtrack(eventIndex) {
    // Watchdog check
    if (Date.now() - startTime > SOLVER_CONFIG.MAX_EXECUTION_TIME_MS) {
      throw new Error(`Solver timeout exceeded ${SOLVER_CONFIG.MAX_EXECUTION_TIME_MS}ms`);
    }

    // Base Case: All events placed successfully
    if (eventIndex >= sortedEvents.length) {
      return true;
    }

    const event = sortedEvents[eventIndex];
    const matchingRooms = rooms.filter(r => {
      if (event.isLab) {
        return r.type === event.requiredRoomType && r.capacity >= event.cohortSize;
      }
      return (r.type === 'LectureHall' || r.type === 'Auditorium') && r.capacity >= event.cohortSize;
    });

    // Build Candidate Slots
    let candidateSlots = [];
    const basketSlots = getBasketRestrictedSlots(event.basketId);

    if (basketSlots && !event.isLab) {
      // Prioritize basket-synchronized slots
      candidateSlots = [...basketSlots];
      // Append secondary slots if needed
      for (const day of DAYS) {
        for (let p = 1; p <= 8; p++) {
          if (!candidateSlots.some(s => s.day === day && s.period === p)) {
            candidateSlots.push({ day, period: p });
          }
        }
      }
    } else {
      for (const day of DAYS) {
        if (event.blockLength === 2) {
          // Continuous Lab Blocks: 1-2, 3-4, 5-6, 7-8
          candidateSlots.push({ day, period: 5 });
          candidateSlots.push({ day, period: 1 });
          candidateSlots.push({ day, period: 3 });
          candidateSlots.push({ day, period: 7 });
        } else {
          // Spread theory across morning and early afternoon
          candidateSlots.push({ day, period: 1 });
          candidateSlots.push({ day, period: 2 });
          candidateSlots.push({ day, period: 3 });
          candidateSlots.push({ day, period: 4 });
          candidateSlots.push({ day, period: 5 });
          candidateSlots.push({ day, period: 6 });
          candidateSlots.push({ day, period: 7 });
          candidateSlots.push({ day, period: 8 });
        }
      }
    }

    // Try candidate slots
    for (const slot of candidateSlots) {
      const { day, period } = slot;
      const L = event.blockLength;

      // Check max period overflow
      if (period + L - 1 > 8) continue;

      // Check if all periods [period .. period + L - 1] are free for Faculty & Cohort
      let isSlotFree = true;
      for (let p = period; p < period + L; p++) {
        const slotKey = `${day}_${p}`;
        if (facultyOccupancy.get(slotKey)?.has(event.facultyId) ||
            cohortOccupancy.get(slotKey)?.has(event.cohortId)) {
          isSlotFree = false;
          break;
        }
      }
      if (!isSlotFree) continue;

      // Find an available room matching requirements
      for (const room of matchingRooms) {
        let isRoomFree = true;
        for (let p = period; p < period + L; p++) {
          const slotKey = `${day}_${p}`;
          if (roomOccupancy.get(slotKey)?.has(room.id)) {
            isRoomFree = false;
            break;
          }
        }
        if (!isRoomFree) continue;

        // --- FORWARD CHECKING / STATE MUTATION ---
        for (let p = period; p < period + L; p++) {
          const slotKey = `${day}_${p}`;
          facultyOccupancy.get(slotKey).add(event.facultyId);
          roomOccupancy.get(slotKey).add(room.id);
          cohortOccupancy.get(slotKey).add(event.cohortId);
        }

        const periodInfo = PERIODS.find(p => p.periodNumber === period) || { timeLabel: `Period ${period}` };
        const assignmentEntry = {
          id: `entry_${event.eventId}`,
          day,
          period,
          timeLabel: periodInfo.timeLabel,
          courseId: event.courseId,
          courseName: event.courseName,
          category: event.category,
          facultyId: event.facultyId,
          facultyName: event.facultyName,
          roomId: room.id,
          roomNumber: room.roomNumber,
          cohortId: event.cohortId,
          sessionType: event.sessionType,
          blockLength: event.blockLength
        };

        assignments.push(assignmentEntry);

        // Recurse to next event
        if (backtrack(eventIndex + 1)) {
          return true;
        }

        // --- BACKTRACK / REVERT STATE ---
        assignments.pop();
        for (let p = period; p < period + L; p++) {
          const slotKey = `${day}_${p}`;
          facultyOccupancy.get(slotKey).delete(event.facultyId);
          roomOccupancy.get(slotKey).delete(room.id);
          cohortOccupancy.get(slotKey).delete(event.cohortId);
        }
      }
    }

    return false; // Backtrack
  }

  // Execute solver
  const success = backtrack(0);
  const executionTimeMs = Date.now() - startTime;

  if (!success) {
    throw new Error('Constraint Satisfaction Problem is infeasible under current capacity.');
  }

  return {
    assignments,
    executionTimeMs
  };
}
