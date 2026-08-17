import React, { useState, useMemo } from 'react';
import { Building, Layers, CheckCircle2, Clock, Info, Activity } from 'lucide-react';
import { useTimetableData } from '../hooks/useTimetableData';
import '../components/janhaviStyles.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PERIODS = [
  { id: 1, label: 'P1', time: '09:00 - 09:50' },
  { id: 2, label: 'P2', time: '09:50 - 10:40' },
  { id: 3, label: 'P3', time: '11:00 - 11:50' },
  { id: 4, label: 'P4', time: '11:50 - 12:40' },
  { id: 5, label: 'P5', time: '01:40 - 02:30' },
  { id: 6, label: 'P6', time: '02:30 - 03:20' },
  { id: 7, label: 'P7', time: '03:20 - 04:10' },
  { id: 8, label: 'P8', time: '04:10 - 05:00' }
];

// 12 Standard Campus Rooms
const ALL_ROOMS = [
  { id: 'LH_101', number: 'LH-101', type: 'Lecture Hall', capacity: 60, dept: 'CS / Common' },
  { id: 'LH_102', number: 'LH-102', type: 'Lecture Hall', capacity: 60, dept: 'Physics' },
  { id: 'LH_201', number: 'LH-201', type: 'Lecture Hall', capacity: 50, dept: 'Economics' },
  { id: 'LH_202', number: 'LH-202', type: 'Lecture Hall', capacity: 50, dept: 'Literature' },
  { id: 'LH_301', number: 'LH-301', type: 'Lecture Hall', capacity: 45, dept: 'General' },
  { id: 'LH_302', number: 'LH-302', type: 'Lecture Hall', capacity: 45, dept: 'General' },
  { id: 'LAB_CS1', number: 'Lab CS-1', type: 'Computer Lab', capacity: 30, dept: 'Computer Science' },
  { id: 'LAB_CS2', number: 'Lab CS-2', type: 'Computer Lab', capacity: 30, dept: 'Computer Science' },
  { id: 'LAB_PHYS1', number: 'Physics Lab 1', type: 'Science Lab', capacity: 25, dept: 'Physics' },
  { id: 'LAB_PHYS2', number: 'Physics Lab 2', type: 'Science Lab', capacity: 25, dept: 'Physics' },
  { id: 'SEM_HALL', number: 'Seminar Hall', type: 'Seminar Hall', capacity: 100, dept: 'Institutional' },
  { id: 'AUD_01', number: 'Main Auditorium', type: 'Auditorium', capacity: 250, dept: 'Institutional' }
];

/**
 * RoomHeatmapView - Room occupancy & capacity matrix across all 12 rooms vs time periods.
 * Color-graded occupancy states: Green = Vacant, Blue = Theory, Purple = Lab.
 */
export function RoomHeatmapView() {
  const { timetable } = useTimetableData();
  const [selectedDay, setSelectedDay] = useState('Mon');

  // Build room lookup: roomId/number -> period -> entry
  const roomScheduleMap = useMemo(() => {
    const map = {};
    ALL_ROOMS.forEach((r) => {
      map[r.number] = {};
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((p) => {
        map[r.number][p] = null;
      });
    });

    if (timetable?.entries) {
      const dayEntries = timetable.entries.filter((e) => e.day === selectedDay);

      dayEntries.forEach((entry) => {
        const roomKey = entry.roomNumber;
        if (!map[roomKey]) {
          map[roomKey] = {};
        }

        const span = entry.blockLength || 1;
        for (let i = 0; i < span; i++) {
          const p = entry.period + i;
          map[roomKey][p] = entry;
        }
      });
    }

    return map;
  }, [timetable, selectedDay]);

  // Calculate day utilization stats
  const utilizationStats = useMemo(() => {
    let totalSlots = ALL_ROOMS.length * PERIODS.length;
    let occupiedSlots = 0;
    let labSlots = 0;
    let theorySlots = 0;

    ALL_ROOMS.forEach((room) => {
      PERIODS.forEach((p) => {
        const entry = roomScheduleMap[room.number]?.[p.id];
        if (entry) {
          occupiedSlots++;
          if (entry.sessionType?.toLowerCase() === 'practical') {
            labSlots++;
          } else {
            theorySlots++;
          }
        }
      });
    });

    const percent = Math.round((occupiedSlots / totalSlots) * 100);
    return { percent, occupiedSlots, vacantSlots: totalSlots - occupiedSlots, labSlots, theorySlots };
  }, [roomScheduleMap]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Controls */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={24} color="var(--primary-600)" />
              <span>Campus Room Occupancy & Heatmap Matrix</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              12 Institutional venues mapped against daily periods. Real-time vacancy and capacity tracker.
            </p>
          </div>

          {/* Utilization Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--nep-mdc-bg)',
              color: 'var(--nep-mdc-text)',
              border: '1px solid var(--nep-mdc-border)',
              fontSize: '0.84rem',
              fontWeight: 700
            }}
          >
            <Activity size={16} />
            <span>{selectedDay} Campus Utilization: {utilizationStats.percent}%</span>
          </div>
        </div>

        {/* Day Selector & Heatmap Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
          {/* Day Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Select Day:
            </span>
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                className={`filter-pill ${selectedDay === day ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
                style={{ padding: '6px 16px' }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Color Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#bbf7d0', border: '1px solid #86efac' }} />
              <span>Vacant ({utilizationStats.vacantSlots})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#bfdbfe', border: '1px solid #93c5fd' }} />
              <span>Theory ({utilizationStats.theorySlots})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e9d5ff', border: '1px solid #d8b4fe' }} />
              <span>Lab Block ({utilizationStats.labSlots})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="card">
        <div className="janhavi-grid-wrapper">
          <div style={{ overflowX: 'auto' }}>
            <table className="janhavi-grid-table">
              <thead>
                <tr>
                  <th style={{ width: '180px', textAlign: 'left', paddingLeft: '14px' }}>Venue / Room</th>
                  <th style={{ width: '70px' }}>Cap</th>
                  {PERIODS.map((col) => (
                    <th key={col.id}>
                      <div>{col.label}</div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.75 }}>{col.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_ROOMS.map((room) => {
                  return (
                    <tr key={room.id}>
                      <td style={{ padding: '10px 14px', background: '#f8fafc', fontWeight: 600 }}>
                        <div style={{ color: 'var(--primary-900)', fontSize: '0.88rem' }}>{room.number}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{room.type}</div>
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {room.capacity}
                      </td>

                      {PERIODS.map((p) => {
                        const entry = roomScheduleMap[room.number]?.[p.id];

                        if (!entry) {
                          return (
                            <td key={p.id} style={{ padding: '6px' }}>
                              <div className="heatmap-cell heatmap-vacant" title="Room is vacant and available">
                                <span>VACANT</span>
                              </div>
                            </td>
                          );
                        }

                        const isLab = entry.sessionType?.toLowerCase() === 'practical';

                        return (
                          <td key={p.id} style={{ padding: '6px' }}>
                            <div
                              className={`heatmap-cell ${isLab ? 'heatmap-lab' : 'heatmap-theory'}`}
                              title={`${entry.courseName} | ${entry.facultyName} (${entry.cohortId})`}
                            >
                              <div style={{ fontWeight: 700, fontSize: '0.74rem' }}>{entry.courseId}</div>
                              <div style={{ fontSize: '0.68rem', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
                                {entry.facultyName}
                              </div>
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

export default RoomHeatmapView;
