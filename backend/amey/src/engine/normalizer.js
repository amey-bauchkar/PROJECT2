/**
 * Normalizer: Slices courses & cohorts into atomic Schedulable Events
 */

export function normalizeCurriculum(collegeData) {
  const { courses, faculty, cohorts } = collegeData;
  const facultyMap = new Map(faculty.map(f => [f.id, f]));
  const schedulableEvents = [];

  let eventCounter = 1;

  for (const cohort of cohorts) {
    const enrolledCourses = courses.filter(c => cohort.enrolledCourseIds.includes(c.id));

    for (const course of enrolledCourses) {
      const assignedFaculty = facultyMap.get(course.facultyId) || { name: 'Assigned Professor' };

      // 1. Normalize Theory Sessions (1 hour per session)
      const theoryHours = course.theoryHoursPerWeek || 0;
      for (let i = 1; i <= theoryHours; i++) {
        schedulableEvents.push({
          eventId: `ev_${eventCounter++}`,
          courseId: course.id,
          courseName: course.name,
          category: course.category,
          departmentId: course.departmentId,
          cohortId: cohort.id,
          cohortSize: cohort.studentCount,
          facultyId: course.facultyId,
          facultyName: assignedFaculty.name,
          requiredRoomType: course.requiredRoomType || 'LectureHall',
          sessionType: 'Theory',
          blockLength: 1,
          isLab: false,
          sessionIndex: i,
          totalSessions: theoryHours,
          basketId: course.basketId || null
        });
      }

      // 2. Normalize Practical Lab Sessions (Continuous 2-period block)
      const labHours = course.labHoursPerWeek || 0;
      if (labHours > 0) {
        schedulableEvents.push({
          eventId: `ev_${eventCounter++}`,
          courseId: `${course.id}_LAB`,
          courseName: `${course.name} Lab`,
          category: course.category,
          departmentId: course.departmentId,
          cohortId: cohort.id,
          cohortSize: cohort.studentCount,
          facultyId: course.facultyId,
          facultyName: assignedFaculty.name,
          requiredRoomType: course.requiredLabType || 'ComputerLab',
          sessionType: 'Practical',
          blockLength: 2,
          isLab: true,
          requiresConsecutive: true,
          basketId: null
        });
      }
    }
  }

  return schedulableEvents;
}
