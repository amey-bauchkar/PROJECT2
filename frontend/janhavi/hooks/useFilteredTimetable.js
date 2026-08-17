import { useMemo } from 'react';

/**
 * Custom hook for client-side multi-dimensional filtering of timetable entries.
 * Supports searching by text query, department/cohort, category, day, faculty, and room.
 */
export function useFilteredTimetable(entries = [], filters = {}) {
  const filteredEntries = useMemo(() => {
    if (!entries || !Array.isArray(entries)) return [];

    const {
      searchQuery = '',
      department = 'ALL',
      category = 'ALL',
      day = 'ALL',
      facultyId = 'ALL',
      roomId = 'ALL',
      sessionType = 'ALL',
      cohortId = 'ALL',
    } = filters;

    const normalizedQuery = searchQuery.trim().toLowerCase();

    return entries.filter((entry) => {
      // 1. Text Search across Course Name, Code, Room, Faculty, Category
      if (normalizedQuery) {
        const matchesQuery =
          (entry.courseName && entry.courseName.toLowerCase().includes(normalizedQuery)) ||
          (entry.courseId && entry.courseId.toLowerCase().includes(normalizedQuery)) ||
          (entry.facultyName && entry.facultyName.toLowerCase().includes(normalizedQuery)) ||
          (entry.roomNumber && entry.roomNumber.toLowerCase().includes(normalizedQuery)) ||
          (entry.category && entry.category.toLowerCase().includes(normalizedQuery)) ||
          (entry.cohortId && entry.cohortId.toLowerCase().includes(normalizedQuery));

        if (!matchesQuery) return false;
      }

      // 2. Department / Cohort Filter
      if (department !== 'ALL') {
        const matchesDept =
          (entry.cohortId && entry.cohortId.toUpperCase().includes(department.toUpperCase())) ||
          (entry.courseId && entry.courseId.toUpperCase().startsWith(department.toUpperCase()));
        if (!matchesDept) return false;
      }

      // 3. NEP Category Filter (Major, Minor, MDC, AEC, SEC, VAC)
      if (category !== 'ALL') {
        if (entry.category?.toLowerCase() !== category.toLowerCase()) {
          return false;
        }
      }

      // 4. Day Filter
      if (day !== 'ALL' && entry.day !== day) {
        return false;
      }

      // 5. Faculty Filter
      if (facultyId !== 'ALL' && entry.facultyId !== facultyId && entry.facultyName !== facultyId) {
        return false;
      }

      // 6. Room Filter
      if (roomId !== 'ALL' && entry.roomId !== roomId && entry.roomNumber !== roomId) {
        return false;
      }

      // 7. Session Type (Theory vs Practical)
      if (sessionType !== 'ALL' && entry.sessionType?.toLowerCase() !== sessionType.toLowerCase()) {
        return false;
      }

      // 8. Cohort ID Filter
      if (cohortId !== 'ALL' && entry.cohortId !== cohortId) {
        return false;
      }

      return true;
    });
  }, [entries, filters]);

  // Derive unique metadata lists for quick filter dropdowns
  const filterOptions = useMemo(() => {
    if (!entries || !Array.isArray(entries)) {
      return { categories: [], faculties: [], rooms: [], cohorts: [], departments: [] };
    }

    const categories = Array.from(new Set(entries.map((e) => e.category).filter(Boolean)));
    const faculties = Array.from(
      new Map(entries.map((e) => [e.facultyId || e.facultyName, { id: e.facultyId, name: e.facultyName }])).values()
    ).filter(f => f.name);
    const rooms = Array.from(
      new Map(entries.map((e) => [e.roomId || e.roomNumber, { id: e.roomId, number: e.roomNumber }])).values()
    ).filter(r => r.number);
    const cohorts = Array.from(new Set(entries.map((e) => e.cohortId).filter(Boolean)));

    return { categories, faculties, rooms, cohorts };
  }, [entries]);

  return { filteredEntries, filterOptions, totalCount: entries?.length || 0, filteredCount: filteredEntries.length };
}

export default useFilteredTimetable;
