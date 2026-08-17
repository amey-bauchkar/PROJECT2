import React, { useState, useMemo } from 'react';
import { GraduationCap, BookOpen, CheckCircle2, AlertTriangle, Layers, UserCheck } from 'lucide-react';
import { useTimetableData } from '../hooks/useTimetableData';
import TimetableGrid from '../components/TimetableGrid';
import '../components/janhaviStyles.css';

const MAJOR_COHORTS = [
  { id: 'COHORT_CS_Y1', name: 'Computer Science (B.Tech Year 1)', code: 'CS' },
  { id: 'COHORT_PHYS_Y1', name: 'Physics (B.Sc Year 1)', code: 'PHYS' },
  { id: 'COHORT_ECON_Y1', name: 'Economics (B.A. Year 1)', code: 'ECON' },
  { id: 'COHORT_LIT_Y1', name: 'English Literature (B.A. Year 1)', code: 'LIT' }
];

const MINOR_ELECTIVES = [
  { id: 'ALL', name: 'All Minor Electives' },
  { id: 'ECON_MIN_01', name: 'Macroeconomics for Policy (Minor)', dept: 'ECON' },
  { id: 'CS_MIN_01', name: 'Data Literacy & Coding (Minor)', dept: 'CS' },
  { id: 'PHYS_MIN_01', name: 'Applied Optics (Minor)', dept: 'PHYS' },
  { id: 'LIT_MIN_01', name: 'Creative Writing (Minor)', dept: 'LIT' }
];

/**
 * StudentTimetableView - Personalized student schedule explorer allowing dynamic Major + Minor basket selection.
 * Verifies collision-free elective band synchronization.
 */
export function StudentTimetableView() {
  const { timetable, loading, error } = useTimetableData();

  const [selectedMajor, setSelectedMajor] = useState('COHORT_CS_Y1');
  const [selectedMinor, setSelectedMinor] = useState('ECON_MIN_01');

  // Filter entries for selected Major Cohort + chosen Minor elective + shared multidisciplinary courses
  const studentEntries = useMemo(() => {
    if (!timetable?.entries) return [];

    return timetable.entries.filter((entry) => {
      // 1. Direct cohort core major subjects
      if (entry.cohortId === selectedMajor) {
        // If it's a minor subject in their cohort, check if it matches chosen minor
        if (entry.category === 'Minor' && selectedMinor !== 'ALL') {
          return entry.courseId === selectedMinor || entry.courseName.toLowerCase().includes('minor');
        }
        return true;
      }

      // 2. Specific chosen minor course from another department basket
      if (selectedMinor !== 'ALL' && entry.courseId === selectedMinor) {
        return true;
      }

      return false;
    });
  }, [timetable, selectedMajor, selectedMinor]);

  const selectedMajorObj = MAJOR_COHORTS.find((m) => m.id === selectedMajor);
  const selectedMinorObj = MINOR_ELECTIVES.find((m) => m.id === selectedMinor);

  // Check for any potential slot collisions in this student's schedule
  const clashCount = useMemo(() => {
    const slotMap = new Set();
    let clashes = 0;
    studentEntries.forEach((e) => {
      const key = `${e.day}_${e.period}`;
      if (slotMap.has(key)) {
        clashes++;
      }
      slotMap.add(key);
    });
    return clashes;
  }, [studentEntries]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Student Selector Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap size={24} color="var(--primary-600)" />
              <span>Personalized Student Schedule Explorer</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Select any Major cohort and Minor elective combination to preview an individualized, collision-free schedule.
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: clashCount === 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: clashCount === 0 ? 'var(--success-text)' : 'var(--danger-text)',
              border: `1px solid ${clashCount === 0 ? 'var(--success-border)' : 'var(--danger-border)'}`,
              fontSize: '0.84rem',
              fontWeight: 700
            }}
          >
            {clashCount === 0 ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{clashCount === 0 ? '0 Clashes in Student Path' : `${clashCount} Conflict(s) Detected`}</span>
          </div>
        </div>

        {/* Dropdown Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              1. Major Program Cohort (DSC)
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                background: '#ffffff'
              }}
            >
              {MAJOR_COHORTS.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              2. Minor Elective Basket (DSE)
            </label>
            <select
              value={selectedMinor}
              onChange={(e) => setSelectedMinor(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                background: '#ffffff'
              }}
            >
              {MINOR_ELECTIVES.map((elective) => (
                <option key={elective.id} value={elective.id}>
                  {elective.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Summary Banner */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '0.85rem' }}>
          <div>
            <strong>Active Enrollment:</strong> {selectedMajorObj?.name} +{' '}
            <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>{selectedMinorObj?.name}</span>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Total Weekly Credit Periods: <strong>{studentEntries.reduce((acc, e) => acc + (e.blockLength || 1), 0)} hrs</strong>
          </div>
        </div>
      </div>

      {/* Render Student Schedule Grid */}
      <div className="card">
        <TimetableGrid
          entries={studentEntries}
          emptyMessage={`No scheduled sessions found for ${selectedMajorObj?.name} with ${selectedMinorObj?.name}.`}
        />
      </div>
    </div>
  );
}

export default StudentTimetableView;
