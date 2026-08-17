/**
 * Conflict Matrix: Builds Graph G=(V,E) of Student & Faculty Contention
 */

export function buildConflictMatrix(events, cohorts) {
  const conflictMatrix = new Map();
  const degreeMap = new Map();

  // Initialize matrix
  for (const ev of events) {
    conflictMatrix.set(ev.eventId, new Set());
    degreeMap.set(ev.eventId, 0);
  }

  // Populate conflicts
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];

      let isConflicting = false;

      // 1. Same Faculty Contention
      if (a.facultyId === b.facultyId) {
        isConflicting = true;
      }

      // 2. Same Student Cohort Contention
      if (a.cohortId === b.cohortId) {
        isConflicting = true;
      }

      // 3. Same Course Repeat Contention (cannot schedule same course theory twice on the exact same day/time)
      if (a.courseId === b.courseId) {
        isConflicting = true;
      }

      if (isConflicting) {
        conflictMatrix.get(a.eventId).add(b.eventId);
        conflictMatrix.get(b.eventId).add(a.eventId);
      }
    }
  }

  // Calculate degrees (number of conflicting peers)
  for (const [eventId, neighbors] of conflictMatrix.entries()) {
    degreeMap.set(eventId, neighbors.size);
  }

  return {
    conflictMatrix,
    degreeMap,
    areConflicting: (idA, idB) => conflictMatrix.get(idA)?.has(idB) || false,
    getDegree: (id) => degreeMap.get(id) || 0
  };
}
