/**
 * What-If Engine: Non-Destructive Real-Time Campus Disruption Simulator
 */

import { DAYS } from '../config/constants.js';
import { validateTimetable } from '../engine/validator.js';

export function simulateDisruption(activeTimetable, disruptionPayload, collegeData) {
  const { disruptionType, targetId, day } = disruptionPayload;
  const { rooms, faculty } = collegeData;

  // Deep clone active entries
  const simulatedEntries = JSON.parse(JSON.stringify(activeTimetable.entries || []));
  const diffs = [];

  // Identify affected sessions
  const affectedIndices = [];
  for (let i = 0; i < simulatedEntries.length; i++) {
    const entry = simulatedEntries[i];
    if (disruptionType === 'ROOM_CLOSURE') {
      if ((entry.roomId === targetId || entry.roomNumber === targetId) && (!day || entry.day === day)) {
        affectedIndices.push(i);
      }
    } else if (disruptionType === 'FACULTY_LEAVE') {
      if ((entry.facultyId === targetId || entry.facultyName.includes(targetId)) && (!day || entry.day === day)) {
        affectedIndices.push(i);
      }
    }
  }

  if (affectedIndices.length === 0) {
    return {
      success: true,
      originalTimetableId: activeTimetable.timetableId,
      diffs: [],
      message: 'No active classes were scheduled in the disrupted slot.',
      simulatedEntries,
      audit: validateTimetable(simulatedEntries)
    };
  }

  // Find alternative allocation for affected sessions
  for (const idx of affectedIndices) {
    const oldEntry = { ...simulatedEntries[idx] };
    const L = oldEntry.blockLength || 1;
    const requiredRoom = rooms.find(r => r.id === oldEntry.roomId) || { type: 'LectureHall' };

    // Find alternative room of matching type with sufficient capacity
    const alternativeRooms = rooms.filter(r => 
      r.id !== oldEntry.roomId && 
      (r.type === requiredRoom.type || (!oldEntry.courseId.includes('LAB') && (r.type === 'LectureHall' || r.type === 'Auditorium'))) &&
      r.capacity >= (oldEntry.cohortSize || 40)
    );

    let reallocated = false;

    // Helper: checks if a room is occupied across periods [startPeriod .. startPeriod + L - 1]
    const isRoomOccupied = (targetDay, startPeriod, testRoomId, currentEntryId) => {
      for (let p = startPeriod; p < startPeriod + L; p++) {
        for (const e of simulatedEntries) {
          if (e.id === currentEntryId) continue;
          const eL = e.blockLength || 1;
          if (e.day === targetDay && e.roomId === testRoomId) {
            if (p >= e.period && p < e.period + eL) {
              return true;
            }
          }
        }
      }
      return false;
    };

    // Helper: checks if faculty or cohort has a clash
    const isResourceClashing = (targetDay, startPeriod, currentEntry) => {
      for (let p = startPeriod; p < startPeriod + L; p++) {
        for (const e of simulatedEntries) {
          if (e.id === currentEntry.id) continue;
          const eL = e.blockLength || 1;
          if (e.day === targetDay) {
            if (p >= e.period && p < e.period + eL) {
              if (e.facultyId === currentEntry.facultyId || e.cohortId === currentEntry.cohortId) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    // 1. Try alternative room at the SAME time slot
    for (const altRoom of alternativeRooms) {
      if (!isRoomOccupied(oldEntry.day, oldEntry.period, altRoom.id, oldEntry.id)) {
        simulatedEntries[idx].roomId = altRoom.id;
        simulatedEntries[idx].roomNumber = altRoom.roomNumber;
        
        diffs.push({
          courseId: oldEntry.courseId,
          courseName: oldEntry.courseName,
          oldSlot: { day: oldEntry.day, period: oldEntry.period, roomNumber: oldEntry.roomNumber },
          newSlot: { day: oldEntry.day, period: oldEntry.period, roomNumber: altRoom.roomNumber },
          reason: `${oldEntry.roomNumber} unavailable due to ${disruptionType === 'ROOM_CLOSURE' ? 'maintenance' : 'leave'}`
        });

        reallocated = true;
        break;
      }
    }

    // 2. If same slot is full, search other days/periods
    if (!reallocated) {
      for (const altDay of DAYS) {
        for (let altPeriod = 1; altPeriod <= (9 - L); altPeriod++) {
          if (altDay === oldEntry.day && altPeriod === oldEntry.period) continue;
          if (L === 2 && ![1, 3, 5, 7].includes(altPeriod)) continue; // Keep lab blocks on standard pairs

          if (isResourceClashing(altDay, altPeriod, oldEntry)) continue;

          for (const altRoom of alternativeRooms) {
            if (!isRoomOccupied(altDay, altPeriod, altRoom.id, oldEntry.id)) {
              simulatedEntries[idx].day = altDay;
              simulatedEntries[idx].period = altPeriod;
              simulatedEntries[idx].roomId = altRoom.id;
              simulatedEntries[idx].roomNumber = altRoom.roomNumber;

              diffs.push({
                courseId: oldEntry.courseId,
                courseName: oldEntry.courseName,
                oldSlot: { day: oldEntry.day, period: oldEntry.period, roomNumber: oldEntry.roomNumber },
                newSlot: { day: altDay, period: altPeriod, roomNumber: altRoom.roomNumber },
                reason: `Relocated to ${altDay} Period ${altPeriod} (${altRoom.roomNumber}) because ${oldEntry.roomNumber} is unavailable on ${oldEntry.day}`
              });

              reallocated = true;
              break;
            }
          }
          if (reallocated) break;
        }
        if (reallocated) break;
      }
    }
  }

  // Audit simulated schedule
  const audit = validateTimetable(simulatedEntries);

  return {
    success: true,
    originalTimetableId: activeTimetable.timetableId,
    diffs,
    audit,
    aiExplanation: `Simulated disruption handled with ${audit.clashCount} hard clashes. Relocated ${diffs.length} affected session(s).`,
    simulatedEntries
  };
}
