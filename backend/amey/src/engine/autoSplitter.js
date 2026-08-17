/**
 * Auto-Splitter Engine: Analyzes Elective Demand vs Room Capacity
 * and Automatically Partitions Oversubscribed Courses into Clash-Free Sections
 */

export function analyzeElectiveDemand(collegeData) {
  const { courses, cohorts, rooms, faculty } = collegeData;
  const facultyMap = new Map(faculty.map(f => [f.id, f]));
  const defaultMaxCapacity = 60; // Standard room threshold

  const demandReport = [];

  for (const course of courses) {
    // Calculate total enrolled students across all cohorts
    const enrolledCohorts = cohorts.filter(c => c.enrolledCourseIds.includes(course.id));
    const totalDemand = enrolledCohorts.reduce((sum, c) => sum + (c.studentCount || 0), 0);

    // Find the max capacity of compatible rooms
    const compatibleRooms = rooms.filter(r => {
      if (course.category.includes('SEC') || course.name.toLowerCase().includes('lab')) {
        return r.type.includes('Lab');
      }
      return r.type === 'LectureHall' || r.type === 'Auditorium';
    });

    const maxCompatibleRoomCapacity = compatibleRooms.length > 0
      ? Math.max(...compatibleRooms.map(r => r.capacity))
      : defaultMaxCapacity;

    const threshold = Math.min(60, maxCompatibleRoomCapacity);
    const isOversubscribed = totalDemand > threshold;
    const utilizationPercentage = Math.round((totalDemand / threshold) * 100);

    demandReport.push({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      category: course.category,
      departmentId: course.departmentId,
      facultyId: course.facultyId,
      facultyName: facultyMap.get(course.facultyId)?.name || 'Professor',
      totalDemand,
      maxRoomCapacity: threshold,
      isOversubscribed,
      utilizationPercentage,
      enrolledCohorts: enrolledCohorts.map(c => ({ id: c.id, name: c.name, studentCount: c.studentCount })),
      recommendedSplit: isOversubscribed ? {
        sectionCount: Math.ceil(totalDemand / threshold),
        sectionASize: threshold,
        sectionBSize: totalDemand - threshold
      } : null
    });
  }

  // Sort: oversubscribed first, then by demand descending
  demandReport.sort((a, b) => {
    if (a.isOversubscribed !== b.isOversubscribed) {
      return a.isOversubscribed ? -1 : 1;
    }
    return b.totalDemand - a.totalDemand;
  });

  return {
    courses: demandReport,
    stats: {
      totalCourses: courses.length,
      oversubscribedCount: demandReport.filter(c => c.isOversubscribed).length,
      standardCapacityThreshold: defaultMaxCapacity,
      highestDemandCourse: demandReport[0]?.courseName || 'None'
    }
  };
}

export function partitionCurriculumForSplit(collegeData, targetCourseIds = [], strategy = 'PARALLEL_ROOMS') {
  // Deep clone data
  const partitionedData = JSON.parse(JSON.stringify(collegeData));
  const splitDetails = [];

  for (const courseId of targetCourseIds) {
    const courseIndex = partitionedData.courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) continue;

    const origCourse = partitionedData.courses[courseIndex];
    const enrolledCohorts = partitionedData.cohorts.filter(c => c.enrolledCourseIds.includes(courseId));
    const totalStudents = enrolledCohorts.reduce((sum, c) => sum + (c.studentCount || 0), 0);

    if (totalStudents <= 60) continue; // No need to split

    // Section A (Cap at 60)
    const secACourse = {
      ...origCourse,
      id: `${origCourse.id}_SEC_A`,
      code: `${origCourse.code}-A`,
      name: `${origCourse.name} (Section A)`,
      section: 'A'
    };

    // Section B (Remaining students)
    // In PARALLEL_ROOMS strategy, if faculty is same, assign co-faculty or mark as parallel section
    const secBCourse = {
      ...origCourse,
      id: `${origCourse.id}_SEC_B`,
      code: `${origCourse.code}-B`,
      name: `${origCourse.name} (Section B)`,
      section: 'B',
      facultyId: strategy === 'PARALLEL_ROOMS' ? getAlternativeFacultyId(origCourse.facultyId, partitionedData.faculty) : origCourse.facultyId
    };

    // Replace original course with Section A & Section B
    partitionedData.courses.splice(courseIndex, 1, secACourse, secBCourse);

    // Split Cohort enrollments
    // Assign cohort 1 to Sec A, cohort 2 to Sec B
    let accumulated = 0;
    for (const cohort of partitionedData.cohorts) {
      if (cohort.enrolledCourseIds.includes(courseId)) {
        // Replace courseId with Sec A or Sec B
        cohort.enrolledCourseIds = cohort.enrolledCourseIds.filter(id => id !== courseId);
        if (accumulated + cohort.studentCount <= 60) {
          cohort.enrolledCourseIds.push(secACourse.id);
          accumulated += cohort.studentCount;
        } else {
          cohort.enrolledCourseIds.push(secBCourse.id);
        }
      }
    }

    splitDetails.push({
      originalCourseId: origCourse.id,
      courseName: origCourse.name,
      strategy,
      totalDemand: totalStudents,
      sectionA: { id: secACourse.id, name: secACourse.name, facultyId: secACourse.facultyId },
      sectionB: { id: secBCourse.id, name: secBCourse.name, facultyId: secBCourse.facultyId }
    });
  }

  return {
    partitionedCollegeData: partitionedData,
    splitDetails
  };
}

function getAlternativeFacultyId(currentFacultyId, facultyList) {
  // Find a faculty from same department or general who is not currentFacultyId
  const current = facultyList.find(f => f.id === currentFacultyId);
  const sameDept = facultyList.find(f => f.departmentId === current?.departmentId && f.id !== currentFacultyId);
  return sameDept?.id || facultyList.find(f => f.id !== currentFacultyId)?.id || currentFacultyId;
}
