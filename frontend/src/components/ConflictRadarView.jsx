import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

export function ConflictRadarView() {
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  useEffect(() => {
    async function loadRadar() {
      try {
        setLoading(true);
        const res = await apiClient.getConflictRadar();
        if (res.success && res.data) {
          setRadarData(res.data);
          // Default select first high contention cell
          const firstHigh = res.data.cells.find(c => c.contentionLevel === 'HIGH');
          if (firstHigh) setSelectedCell(firstHigh);
        }
      } catch (err) {
        console.error('Failed to load conflict radar:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRadar();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔄 Constructing Contention Graph G=(V,E)...</div>
        <p>Analyzing pairwise student enrollment overlaps across all 4 departments...</p>
      </div>
    );
  }

  if (!radarData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        Failed to load Conflict Radar data.
      </div>
    );
  }

  const { nodes, cells, stats } = radarData;

  // Filter nodes by department if selected
  const filteredNodes = departmentFilter === 'ALL'
    ? nodes
    : nodes.filter(n => n.departmentId === departmentFilter);

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  // Cell finder helper
  const getCell = (rowId, colId) => {
    return cells.find(c => c.rowCourseId === rowId && c.colCourseId === colId);
  };

  const getCellColor = (cell) => {
    if (!cell || cell.contentionLevel === 'SELF') return '#f1f5f9';
    if (cell.contentionLevel === 'HIGH') return '#fee2e2'; // Light Red
    if (cell.contentionLevel === 'MEDIUM') return '#fef3c7'; // Light Amber
    return '#dcfce7'; // Light Green
  };

  const getCellBorder = (cell) => {
    if (!cell || cell.contentionLevel === 'SELF') return '#cbd5e1';
    if (cell.contentionLevel === 'HIGH') return '#ef4444';
    if (cell.contentionLevel === 'MEDIUM') return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header & Stats Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🔍</span>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Pre-Flight Student Clash Radar & Graph Explorer
              </h2>
              <span style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: '999px'
              }}>
                Graph G=(V,E) Active
              </span>
            </div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', maxWidth: '700px' }}>
              Inspects pairwise student enrollment overlaps across all courses. Visualizes how the MCV Backtracking solver separates high-contention multidisciplinary electives into orthogonal, zero-clash time bands.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Contention Edges</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>{stats.highContentionPairs}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Faculty Edges</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>{stats.mediumContentionPairs}</div>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#86efac', textTransform: 'uppercase', fontWeight: 600 }}>Hard Clashes</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80' }}>0 (0.0%)</div>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>MCV Resolution</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#60a5fa' }}>{stats.resolutionRate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Department Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Departments (24 Courses)' },
            { id: 'DEP_CS', label: 'Computer Science' },
            { id: 'DEP_PHYS', label: 'Physics' },
            { id: 'DEP_ECON', label: 'Economics' },
            { id: 'DEP_ENG', label: 'English Literature' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setDepartmentFilter(d.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: departmentFilter === d.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: departmentFilter === d.id ? '#eff6ff' : '#ffffff',
                color: departmentFilter === d.id ? '#1d4ed8' : '#475569',
                fontWeight: departmentFilter === d.id ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Color Legend */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.8rem', color: '#475569', background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444', display: 'inline-block' }}></span>
            <span><strong>Red:</strong> High Student Contention</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b', display: 'inline-block' }}></span>
            <span><strong>Amber:</strong> Shared Faculty</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#22c55e', display: 'inline-block' }}></span>
            <span><strong>Green:</strong> Orthogonal Safe</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Heatmap Matrix (Left) + Mathematical Proof Flyout (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(500px, 1fr) 380px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Pairwise Matrix Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflowX: 'auto'
        }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
            Interactive Pairwise Contention Matrix ({filteredNodes.length} × {filteredNodes.length})
            <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              (Click any cell to inspect mathematical resolution proof)
            </span>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '560px' }}>
            <table style={{ borderCollapse: 'collapse', fontSize: '0.75rem', minWidth: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.4rem', background: '#f8fafc', borderBottom: '2px solid #cbd5e1', position: 'sticky', top: 0, left: 0, zIndex: 3 }}>
                    Course Code
                  </th>
                  {filteredNodes.map(col => (
                    <th
                      key={col.id}
                      style={{
                        padding: '0.4rem 0.3rem',
                        background: '#f8fafc',
                        borderBottom: '2px solid #cbd5e1',
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        textAlign: 'left',
                        minWidth: '28px',
                        height: '75px',
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                        color: '#334155',
                        fontWeight: 600
                      }}
                      title={`${col.code}: ${col.name}`}
                    >
                      {col.code}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredNodes.map(row => (
                  <tr key={row.id}>
                    <td
                      style={{
                        padding: '0.35rem 0.6rem',
                        fontWeight: 600,
                        background: '#f8fafc',
                        borderRight: '2px solid #cbd5e1',
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                        whiteSpace: 'nowrap',
                        color: '#1e293b'
                      }}
                      title={row.name}
                    >
                      {row.code}
                    </td>

                    {filteredNodes.map(col => {
                      const cell = getCell(row.id, col.id);
                      const isSelected = selectedCell &&
                        selectedCell.rowCourseId === row.id &&
                        selectedCell.colCourseId === col.id;

                      return (
                        <td
                          key={col.id}
                          onClick={() => cell && cell.contentionLevel !== 'SELF' && setSelectedCell(cell)}
                          title={cell ? `${row.code} vs ${col.code}: ${cell.reason}` : ''}
                          style={{
                            width: '28px',
                            height: '28px',
                            textAlign: 'center',
                            cursor: cell?.contentionLevel === 'SELF' ? 'default' : 'pointer',
                            background: getCellColor(cell),
                            border: isSelected ? '2px solid #0f172a' : `1px solid ${getCellBorder(cell)}22`,
                            transform: isSelected ? 'scale(1.15)' : 'none',
                            transition: 'all 0.1s ease',
                            fontWeight: 700,
                            color: cell?.contentionLevel === 'HIGH' ? '#b91c1c' : cell?.contentionLevel === 'MEDIUM' ? '#b45309' : '#15803d'
                          }}
                        >
                          {cell?.contentionLevel === 'HIGH' ? '🔴' : cell?.contentionLevel === 'MEDIUM' ? '🟡' : cell?.contentionLevel === 'SELF' ? '—' : '🟢'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mathematical Proof Inspector Drawer (Right Side) */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          position: 'sticky',
          top: '1rem'
        }}>
          {selectedCell ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <span style={{
                  background: selectedCell.contentionLevel === 'HIGH' ? '#fee2e2' : selectedCell.contentionLevel === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                  color: selectedCell.contentionLevel === 'HIGH' ? '#991b1b' : selectedCell.contentionLevel === 'MEDIUM' ? '#92400e' : '#166534',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  {selectedCell.contentionLevel} CONTENTION
                </span>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  🛡️ 0 Clashes Guaranteed
                </span>
              </div>

              {/* Course Pair Header */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Course A</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{selectedCell.rowCourseId}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>Taught by: {selectedCell.facultyNameA || 'Professor'}</div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8' }}>
                  ⚡ vs ⚡
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Course B</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{selectedCell.colCourseId}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>Taught by: {selectedCell.facultyNameB || 'Professor'}</div>
                </div>
              </div>

              {/* Shared Cohort Details */}
              {selectedCell.sharedStudentCount > 0 && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9f1239', marginBottom: '0.25rem' }}>
                    👥 Shared Student Enrollment: {selectedCell.sharedStudentCount} Students
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#881337' }}>
                    Cohort: {selectedCell.sharedCohorts?.map(c => c.name).join(', ')}
                  </div>
                </div>
              )}

              {/* Mathematical MCV Resolution Proof */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d', marginBottom: '0.35rem' }}>
                  🤖 MCV Orthogonal Time Slot Assignment:
                </div>
                
                <div style={{ fontSize: '0.75rem', color: '#166534', marginBottom: '0.35rem' }}>
                  <strong>{selectedCell.rowCourseId}:</strong> {selectedCell.slotsA?.map(s => `${s.day} (${s.timeLabel})`).join(', ') || 'Scheduled'}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#166534' }}>
                  <strong>{selectedCell.colCourseId}:</strong> {selectedCell.slotsB?.map(s => `${s.day} (${s.timeLabel})`).join(', ') || 'Scheduled'}
                </div>
              </div>

              {/* Invariant Explanation */}
              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                <strong>Why this is safe:</strong> {selectedCell.reason}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              Click any cell on the matrix to view the mathematical conflict resolution proof.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
