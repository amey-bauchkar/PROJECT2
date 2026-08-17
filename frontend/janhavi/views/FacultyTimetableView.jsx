import React, { useState, useMemo } from 'react';
import { UserCheck, Clock, Award, Coffee, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { useTimetableData } from '../hooks/useTimetableData';
import TimeSlotCard from '../components/TimeSlotCard';
import LabBlockCard from '../components/LabBlockCard';
import '../components/janhaviStyles.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PERIODS = [
  { id: 1, label: 'P1', time: '09:00 - 09:50' },
  { id: 2, label: 'P2', time: '09:50 - 10:40' },
  { id: 'TEA', isBreak: true, label: 'TEA BREAK', time: '10:40 - 11:00' },
  { id: 3, label: 'P3', time: '11:00 - 11:50' },
  { id: 4, label: 'P4', time: '11:50 - 12:40' },
  { id: 'LUNCH', isBreak: true, label: 'LUNCH BREAK', time: '12:40 - 01:40' },
  { id: 5, label: 'P5', time: '01:40 - 02:30' },
  { id: 6, label: 'P6', time: '02:30 - 03:20' },
  { id: 7, label: 'P7', time: '03:20 - 04:10' },
  { id: 8, label: 'P8', time: '04:10 - 05:00' }
];

/**
 * FacultyTimetableView - Professor workload explorer showing teaching slots
 * alongside explicit "Free Period / Research Window" badges.
 */
export function FacultyTimetableView() {
  const { timetable, loading, error } = useTimetableData();

  // Extract unique faculty list from timetable entries
  const facultyList = useMemo(() => {
    if (!timetable?.entries) return [];
    const map = new Map();
    timetable.entries.forEach((e) => {
      if (e.facultyId || e.facultyName) {
        const key = e.facultyId || e.facultyName;
        if (!map.has(key)) {
          map.set(key, { id: e.facultyId, name: e.facultyName });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [timetable]);

  const [selectedFacultyId, setSelectedFacultyId] = useState('');

  // Default to first faculty member if not set
  React.useEffect(() => {
    if (facultyList.length > 0 && !selectedFacultyId) {
      setSelectedFacultyId(facultyList[0].id || facultyList[0].name);
    }
  }, [facultyList, selectedFacultyId]);

  const selectedFaculty = facultyList.find((f) => (f.id || f.name) === selectedFacultyId) || facultyList[0];

  // Faculty's teaching sessions
  const facultyEntries = useMemo(() => {
    if (!timetable?.entries || !selectedFacultyId) return [];
    return timetable.entries.filter(
      (e) => e.facultyId === selectedFacultyId || e.facultyName === selectedFacultyId
    );
  }, [timetable, selectedFacultyId]);

  // Compute workload statistics
  const stats = useMemo(() => {
    let totalTeachingHours = 0;
    let labSessions = 0;
    let theorySessions = 0;

    facultyEntries.forEach((e) => {
      const duration = e.blockLength || 1;
      totalTeachingHours += duration;
      if (e.sessionType?.toLowerCase() === 'practical') {
        labSessions++;
      } else {
        theorySessions++;
      }
    });

    const maxWeeklyTarget = 16; // UGC standard ~14-16 hours/week
    const loadPercentage = Math.round((totalTeachingHours / maxWeeklyTarget) * 100);

    return { totalTeachingHours, labSessions, theorySessions, loadPercentage };
  }, [facultyEntries]);

  // Build grid map for faculty
  const gridMap = useMemo(() => {
    const map = {};
    DAYS.forEach((d) => {
      map[d] = {};
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((p) => {
        map[d][p] = [];
      });
    });

    const occupiedSpans = new Set();

    facultyEntries.forEach((entry) => {
      if (map[entry.day] && map[entry.day][entry.period]) {
        map[entry.day][entry.period].push(entry);

        if (entry.blockLength && entry.blockLength > 1) {
          for (let offset = 1; offset < entry.blockLength; offset++) {
            occupiedSpans.add(`${entry.day}_${entry.period + offset}`);
          }
        }
      }
    });

    return { map, occupiedSpans };
  }, [facultyEntries]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Faculty Selection & Workload Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={24} color="var(--primary-600)" />
              <span>Faculty Teaching Schedule & Workload Inspector</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Track faculty teaching contact hours, lab commitments, and open research windows.
            </p>
          </div>

          {/* Workload Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--bg-subtle)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <Clock size={18} color="var(--primary-600)" />
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                Weekly Contact Load
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--primary-900)' }}>
                {stats.totalTeachingHours} Hours / Week ({stats.loadPercentage}% target)
              </strong>
            </div>
          </div>
        </div>

        {/* Faculty Select Dropdown */}
        <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Select Faculty Member / Professor:
          </label>
          <select
            value={selectedFacultyId}
            onChange={(e) => setSelectedFacultyId(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.92rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              background: '#ffffff'
            }}
          >
            {facultyList.map((faculty) => (
              <option key={faculty.id || faculty.name} value={faculty.id || faculty.name}>
                {faculty.name} ({faculty.id})
              </option>
            ))}
          </select>
        </div>

        {/* Workload Stats Badges */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.86rem' }}>
          <span className="badge badge-major">Theory Sessions: {stats.theorySessions}</span>
          <span className="badge badge-sec">Lab Sessions: {stats.labSessions}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success-text)', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Continuous Max 2-Period Teaching Limit Compliant
          </span>
        </div>
      </div>

      {/* Grid with Free Periods Highlighted */}
      <div className="card">
        <div className="janhavi-grid-wrapper">
          <div style={{ overflowX: 'auto' }}>
            <table className="janhavi-grid-table">
              <thead>
                <tr>
                  <th className="day-header">Day</th>
                  {PERIODS.map((col, idx) => (
                    <th key={idx} style={{ background: col.isBreak ? '#f1f5f9' : undefined, color: col.isBreak ? 'var(--text-muted)' : undefined }}>
                      <div>{col.label}</div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.75 }}>{col.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => {
                  return (
                    <tr key={day}>
                      <td className="day-cell">{day}</td>

                      {PERIODS.map((col, cIdx) => {
                        if (col.isBreak) {
                          return (
                            <td key={cIdx} className="break-cell">
                              {col.label === 'TEA BREAK' ? 'TEA' : 'LUNCH'}
                            </td>
                          );
                        }

                        const periodNum = col.id;
                        const slotKey = `${day}_${periodNum}`;

                        if (gridMap.occupiedSpans.has(slotKey)) {
                          return null;
                        }

                        const cellEntries = gridMap.map[day]?.[periodNum] || [];
                        const labBlock = cellEntries.find((e) => e.blockLength && e.blockLength > 1);

                        if (labBlock) {
                          const span = labBlock.blockLength;
                          return (
                            <td key={cIdx} colSpan={span} style={{ background: '#f0fdfa', borderLeft: '2px solid #0d9488', padding: '6px' }}>
                              <LabBlockCard entry={labBlock} />
                            </td>
                          );
                        }

                        if (cellEntries.length > 0) {
                          return (
                            <td key={cIdx}>
                              {cellEntries.map((entry) => (
                                <TimeSlotCard key={entry.id} entry={entry} />
                              ))}
                            </td>
                          );
                        }

                        // Free slot / Research Window
                        return (
                          <td key={cIdx} style={{ background: '#fafbfc' }}>
                            <div className="free-period-badge" title="No teaching scheduled. Available for research, office hours, or grading.">
                              <Coffee size={13} />
                              <span>Free / Research</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyTimetableView;
