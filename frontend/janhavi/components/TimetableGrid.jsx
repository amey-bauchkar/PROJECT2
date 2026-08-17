import React from 'react';
import TimeSlotCard from './TimeSlotCard';
import LabBlockCard from './LabBlockCard';
import './janhaviStyles.css';

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
 * TimetableGrid - 2D Day x Period schedule matrix renderer supporting single theory cards
 * and multi-period practical lab blocks.
 */
export function TimetableGrid({ entries = [], emptyMessage = 'No classes scheduled for this filter.' }) {
  // Build a lookup map: day -> period -> Array<entry>
  const gridMap = React.useMemo(() => {
    const map = {};
    DAYS.forEach((d) => {
      map[d] = {};
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((p) => {
        map[d][p] = [];
      });
    });

    // Track slots occupied by multi-period spans to prevent duplicate cell rendering
    const occupiedSpans = new Set();

    entries.forEach((entry) => {
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
  }, [entries]);

  return (
    <div className="janhavi-grid-wrapper">
      <div style={{ overflowX: 'auto' }}>
        <table className="janhavi-grid-table">
          <thead>
            <tr>
              <th className="day-header">Day</th>
              {PERIODS.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    background: col.isBreak ? '#f1f5f9' : undefined,
                    color: col.isBreak ? 'var(--text-muted)' : undefined,
                    width: col.isBreak ? '45px' : undefined
                  }}
                >
                  <div>{col.label}</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.75 }}>
                    {col.time}
                  </div>
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
                        <td key={cIdx} className="break-cell" title={col.label}>
                          {col.label === 'TEA BREAK' ? 'TEA' : 'LUNCH'}
                        </td>
                      );
                    }

                    const periodNum = col.id;
                    const slotKey = `${day}_${periodNum}`;

                    // Check if this cell is consumed by a prior multi-period span
                    if (gridMap.occupiedSpans.has(slotKey)) {
                      return null; // Skipped because parent cell used colSpan/rowSpan or rendered span
                    }

                    const cellEntries = gridMap.map[day]?.[periodNum] || [];
                    const labBlock = cellEntries.find((e) => e.blockLength && e.blockLength > 1);

                    if (labBlock) {
                      const span = labBlock.blockLength;
                      return (
                        <td
                          key={cIdx}
                          colSpan={span}
                          style={{
                            background: '#f0fdfa',
                            borderLeft: '2px solid #0d9488',
                            padding: '6px'
                          }}
                        >
                          <LabBlockCard entry={labBlock} />
                          {cellEntries.filter((e) => e.id !== labBlock.id).map((e) => (
                            <TimeSlotCard key={e.id} entry={e} />
                          ))}
                        </td>
                      );
                    }

                    return (
                      <td key={cIdx}>
                        {cellEntries.length > 0 ? (
                          cellEntries.map((entry) => (
                            <TimeSlotCard key={entry.id} entry={entry} />
                          ))
                        ) : (
                          <div style={{ height: '100%', minHeight: '40px' }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {entries.length === 0 && (
        <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>{emptyMessage}</p>
          <p style={{ fontSize: '0.84rem' }}>Try adjusting your search criteria or category filter.</p>
        </div>
      )}
    </div>
  );
}

export default TimetableGrid;
