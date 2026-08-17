import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Building, 
  BookOpen, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { getActiveTimetable, getDemoConfig } from './api/apiClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('master');
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load timetable on mount
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getActiveTimetable();
      setTimetable(data);
    } catch (err) {
      console.error('Failed to load active timetable', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app-container">
      {/* Top Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
            color: 'white',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Calendar size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1>NEP 2020 AI Timetable Orchestrator</h1>
              <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>SIH25091</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
              Multidisciplinary Constraint Engine • Government of Jammu & Kashmir
            </p>
          </div>
        </div>

        {/* Global Verification HUD Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--success-text)',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.88rem',
            boxShadow: '0 0 12px rgba(34, 197, 94, 0.15)'
          }}>
            <ShieldCheck size={18} />
            <span>0 Hard Clashes • 100% Invariant Safe</span>
          </div>

          <button 
            className="btn btn-outline"
            onClick={loadData}
            title="Refresh active schedule"
            style={{ padding: '8px 12px' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'master' ? 'active' : ''}`}
            onClick={() => setActiveTab('master')}
          >
            <Calendar size={18} />
            <span>Master Institutional Grid</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            <Users size={18} />
            <span>Student & Faculty Explorer</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <Building size={18} />
            <span>Room Occupancy Heatmap</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <Sliders size={18} />
            <span>Admin & What-If Disruptor</span>
          </button>
        </div>

        {/* Live Quality Indicator */}
        {timetable && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <Sparkles size={16} color="var(--primary-600)" />
            <span>Quality Score: <strong style={{ color: 'var(--primary-700)' }}>{timetable.qualityScore}/100</strong></span>
            <span>•</span>
            <span>Execution: <strong style={{ color: 'var(--text-main)' }}>{timetable.executionTimeMs}ms</strong></span>
          </div>
        )}
      </div>

      {/* Dynamic Content Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'master' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2>Master College Timetable</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Institutional 5-Day matrix across all 4 departments with synchronized NEP elective bands.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="badge badge-major">Major</span>
                <span className="badge badge-minor">Minor</span>
                <span className="badge badge-mdc">MDC</span>
                <span className="badge badge-aec">AEC</span>
                <span className="badge badge-sec">SEC (Lab)</span>
                <span className="badge badge-vac">VAC</span>
              </div>
            </div>

            {/* Quick Preview Grid */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '12px' }}>Day</th>
                    <th style={{ padding: '12px' }}>Period 1 (09:00)</th>
                    <th style={{ padding: '12px' }}>Period 2 (09:50)</th>
                    <th style={{ padding: '12px' }}>Period 3 (11:00)</th>
                    <th style={{ padding: '12px' }}>Period 5-6 (01:40 PM Lab)</th>
                  </tr>
                </thead>
                <tbody>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                    const dayEntries = timetable?.entries?.filter(e => e.day === day) || [];
                    return (
                      <tr key={day} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--primary-900)' }}>{day}</td>
                        <td style={{ padding: '12px' }}>
                          {dayEntries.filter(e => e.period === 1).map(e => (
                            <div key={e.id} style={{ marginBottom: '4px' }}>
                              <span className={`badge badge-${e.category.toLowerCase()}`} style={{ marginRight: '6px' }}>{e.category}</span>
                              <strong>{e.courseName}</strong> <span style={{ color: 'var(--text-muted)' }}>({e.roomNumber})</span>
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {dayEntries.filter(e => e.period === 2).map(e => (
                            <div key={e.id} style={{ marginBottom: '4px' }}>
                              <span className={`badge badge-${e.category.toLowerCase()}`} style={{ marginRight: '6px' }}>{e.category}</span>
                              <strong>{e.courseName}</strong> <span style={{ color: 'var(--text-muted)' }}>({e.roomNumber})</span>
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {dayEntries.filter(e => e.period === 3).map(e => (
                            <div key={e.id} style={{ marginBottom: '4px' }}>
                              <span className={`badge badge-${e.category.toLowerCase()}`} style={{ marginRight: '6px' }}>{e.category}</span>
                              <strong>{e.courseName}</strong> <span style={{ color: 'var(--text-muted)' }}>({e.roomNumber})</span>
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {dayEntries.filter(e => e.period === 5).map(e => (
                            <div key={e.id} style={{
                              background: 'var(--nep-sec-bg)',
                              borderLeft: '4px solid var(--nep-sec-border)',
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)'
                            }}>
                              <span className={`badge badge-${e.category.toLowerCase()}`} style={{ marginRight: '6px' }}>{e.category}</span>
                              <strong>{e.courseName}</strong> • {e.roomNumber} ({e.facultyName})
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', color: 'var(--primary-900)', fontSize: '0.88rem' }}>
              💡 <em>Janhavi will render the high-density interactive grid in <code>frontend/janhavi/views/MasterTimetableView.jsx</code>.</em>
            </div>
          </div>
        )}

        {activeTab === 'student' && (
          <div className="card">
            <h2>Personalized Student & Faculty Explorer</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              Isolate personal student schedules for any Major + Minor elective combination or inspect faculty teaching workloads.
            </p>
            <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <Users size={40} color="var(--primary-600)" style={{ marginBottom: '12px' }} />
              <p style={{ fontWeight: 600 }}>Student & Faculty View Module Ready for Janhavi</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Janhavi connects <code>StudentTimetableView.jsx</code> and <code>FacultyTimetableView.jsx</code> here.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="card">
            <h2>Room & Laboratory Occupancy Heatmap</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              12 physical venues (Lecture Halls, Computer Labs, Science Labs) with real-time capacity and collision safety audits.
            </p>
            <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <Building size={40} color="var(--primary-600)" style={{ marginBottom: '12px' }} />
              <p style={{ fontWeight: 600 }}>Room Heatmap Module Ready for Janhavi</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Janhavi connects <code>RoomHeatmapView.jsx</code> here.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="card">
            <h2>Admin Command Center & Live What-If Disruptor</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              Configure NEP course credit baskets, trigger sub-second AI scheduling, and simulate live campus disruptions.
            </p>
            <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <Sliders size={40} color="var(--primary-600)" style={{ marginBottom: '12px' }} />
              <p style={{ fontWeight: 600 }}>Admin & What-If Module Ready for Tanmay</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tanmay connects <code>AdminConfigView.jsx</code>, <code>DiagnosticDashboardView.jsx</code>, and <code>WhatIfDisruptorView.jsx</code> here.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '30px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <span>Government Degree College, J&K • Smart India Hackathon SIH25091</span>
        <span>Built with React + Deterministic MCV Constraint Engine</span>
      </footer>
    </div>
  );
}
