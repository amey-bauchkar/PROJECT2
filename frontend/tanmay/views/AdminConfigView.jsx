import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  CheckCircle, 
  Sliders, 
  Database, 
  Settings2,
  Cpu
} from 'lucide-react';
import { getDemoConfig } from '../../src/api/apiClient';
import GeneratorHUD from '../components/GeneratorHUD';
import '../components/tanmay.css';

export default function AdminConfigView({ solverControls, onTimetableUpdated }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getDemoConfig();
        setConfig(data);
      } catch (err) {
        console.error('Failed to load demo config', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const departments = config?.departments || [
    { id: 'DEP_CS', code: 'CS', name: 'Computer Science & Engineering', hod: 'Dr. A. Verma' },
    { id: 'DEP_PHYS', code: 'PHYS', name: 'Department of Physics', hod: 'Dr. S. Sharma' },
    { id: 'DEP_ECON', code: 'ECON', name: 'Department of Economics', hod: 'Dr. M. Koul' },
    { id: 'DEP_LIT', code: 'LIT', name: 'Department of English & Modern Languages', hod: 'Dr. R. Dhar' }
  ];

  return (
    <div className="tanmay-container">
      {/* Primary Generator Trigger */}
      <GeneratorHUD solverControls={solverControls} />

      {/* Institutional Template & Configuration Summary */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3>Active Institutional Dataset: NEP 2020 Multidisciplinary Model</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Government Degree College, Jammu & Kashmir • Academic Year 2026-2027 (Semester 1)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge" style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
              <Database size={13} /> JSON & Mongo In-Sync
            </span>
            <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' }}>
              <Cpu size={13} /> MCV Engine Ready
            </span>
          </div>
        </div>

        {/* 4 Core Resource Cards */}
        <div className="resource-grid">
          <div className="resource-card">
            <div className="resource-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Building size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>4</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Academic Departments</div>
            </div>
          </div>

          <div className="resource-card">
            <div className="resource-icon-box" style={{ background: '#faf5ff', color: '#9333ea' }}>
              <Settings2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>12</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Physical Venues (6 LH, 5 Labs, 1 Aud)</div>
            </div>
          </div>

          <div className="resource-card">
            <div className="resource-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>18</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Faculty Registry (14-16 hrs max)</div>
            </div>
          </div>

          <div className="resource-card">
            <div className="resource-icon-box" style={{ background: '#fffbeb', color: '#d97706' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>28</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>NEP Course Offerings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments & Cohort Distribution Table */}
      <div className="card">
        <h4 style={{ fontSize: '1.05rem', marginBottom: '14px' }}>Departmental Overview & Cohort Distribution</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Department</th>
                <th style={{ padding: '10px 14px' }}>Code</th>
                <th style={{ padding: '10px 14px' }}>Head of Department</th>
                <th style={{ padding: '10px 14px' }}>Major Cohort</th>
                <th style={{ padding: '10px 14px' }}>Enrolled Students</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-main)' }}>{dept.name}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>{dept.code}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{dept.hod || 'Appointed'}</td>
                  <td style={{ padding: '12px 14px' }}>B.Sc. / B.A. {dept.code} Y1</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>45 - 60 Students</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge" style={{ background: '#f0fdf4', color: '#15803d' }}>
                      <CheckCircle size={12} /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
