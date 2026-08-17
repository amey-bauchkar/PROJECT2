/**
 * Validator: Invariant Hard-Constraint Auditor (Guarantees 0 Hard Clashes)
 */

export function validateTimetable(entries) {
  const facultySlots = new Map(); // `${facultyId}_${day}_${period}` -> entry
  const roomSlots = new Map();    // `${roomId}_${day}_${period}` -> entry
  const cohortSlots = new Map();  // `${cohortId}_${day}_${period}` -> entry

  const violations = [];
  let facultyClashes = 0;
  let roomClashes = 0;
  let cohortClashes = 0;

  for (const entry of entries) {
    const L = entry.blockLength || 1;

    for (let p = entry.period; p < entry.period + L; p++) {
      // 1. Faculty Collision Check
      const facKey = `${entry.facultyId}_${entry.day}_${p}`;
      if (facultySlots.has(facKey)) {
        facultyClashes++;
        violations.push({
          type: 'FACULTY_DOUBLE_BOOKING',
          facultyId: entry.facultyId,
          facultyName: entry.facultyName,
          day: entry.day,
          period: p,
          conflictingEntryA: facultySlots.get(facKey).id,
          conflictingEntryB: entry.id
        });
      } else {
        facultySlots.set(facKey, entry);
      }

      // 2. Room Collision Check
      const roomKey = `${entry.roomId}_${entry.day}_${p}`;
      if (roomSlots.has(roomKey)) {
        roomClashes++;
        violations.push({
          type: 'ROOM_DOUBLE_BOOKING',
          roomId: entry.roomId,
          roomNumber: entry.roomNumber,
          day: entry.day,
          period: p,
          conflictingEntryA: roomSlots.get(roomKey).id,
          conflictingEntryB: entry.id
        });
      } else {
        roomSlots.set(roomKey, entry);
      }

      // 3. Cohort Collision Check
      const cohortKey = `${entry.cohortId}_${entry.day}_${p}`;
      if (cohortSlots.has(cohortKey)) {
        cohortClashes++;
        violations.push({
          type: 'COHORT_COLLISION',
          cohortId: entry.cohortId,
          day: entry.day,
          period: p,
          conflictingEntryA: cohortSlots.get(cohortKey).id,
          conflictingEntryB: entry.id
        });
      } else {
        cohortSlots.set(cohortKey, entry);
      }
    }
  }

  const clashCount = facultyClashes + roomClashes + cohortClashes;

  return {
    isValid: clashCount === 0,
    clashCount,
    facultyClashes,
    roomClashes,
    cohortClashes,
    violations
  };
}
