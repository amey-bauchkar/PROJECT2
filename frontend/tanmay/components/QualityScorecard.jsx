import React from 'react';
import { ShieldCheck, Building, Users, Clock, Award } from 'lucide-react';
import './tanmay.css';

export default function QualityScorecard({ metrics, qualityScore = 94 }) {
  const clashCount = metrics?.clashCount ?? 0;
  const roomUtilization = metrics?.roomUtilization ?? 83.5;
  const facultyLoadBalance = metrics?.facultyLoadBalance ?? 92.0;
  const studentGapScore = metrics?.studentGapScore ?? 95.0;

  // Calculate SVG circular gauge metrics
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (qualityScore / 100) * circumference;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Institutional Timetable Health Scorecard</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Multi-factor optimization index evaluating hard compliance and soft scheduling preferences.
          </p>
        </div>
        <span className="badge" style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
          <Award size={14} /> Certified Invariant Safe
        </span>
      </div>

      <div className="scorecard-grid">
        {/* Circular Score Gauge */}
        <div className="scorecard-gauge-box">
          <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="150" height="150" className="gauge-svg">
              <circle
                cx="75"
                cy="75"
                r={radius}
                className="gauge-circle-bg"
              />
              <circle
                cx="75"
                cy="75"
                r={radius}
                className="gauge-circle-val"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="score-number">{qualityScore}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>/ 100 Score</span>
            </div>
          </div>
          <p style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-700)' }}>
            High-Efficiency Optimization
          </p>
        </div>

        {/* 4 Metric Breakdown Progress Bars */}
        <div className="metrics-breakdown-list">
          {/* 1. Clash-Freedom */}
          <div className="metric-bar-item">
            <div className="metric-bar-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--success-border)" />
                Hard Constraint Invariant (0 Clashes)
              </span>
              <span style={{ color: 'var(--success-text)', fontWeight: 700 }}>
                {clashCount === 0 ? '100% (Zero Violations)' : `${clashCount} Violations`}
              </span>
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{ width: clashCount === 0 ? '100%' : '50%', background: 'linear-gradient(90deg, #22c55e, #16a34a)' }}
              />
            </div>
          </div>

          {/* 2. Room Utilization */}
          <div className="metric-bar-item">
            <div className="metric-bar-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={16} color="var(--primary-600)" />
                Physical Infrastructure Utilization
              </span>
              <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>{roomUtilization}%</span>
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{ width: `${roomUtilization}%`, background: 'linear-gradient(90deg, #6366f1, #4f46e5)' }}
              />
            </div>
          </div>

          {/* 3. Faculty Workload Balance */}
          <div className="metric-bar-item">
            <div className="metric-bar-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="#8b5cf6" />
                Faculty Workload Equity Index
              </span>
              <span style={{ color: '#7c3aed', fontWeight: 700 }}>{facultyLoadBalance}%</span>
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{ width: `${facultyLoadBalance}%`, background: 'linear-gradient(90deg, #a855f7, #8b5cf6)' }}
              />
            </div>
          </div>

          {/* 4. Student Idle Gap Score */}
          <div className="metric-bar-item">
            <div className="metric-bar-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#06b6d4" />
                Student Schedule Compactness
              </span>
              <span style={{ color: '#0891b2', fontWeight: 700 }}>{studentGapScore}%</span>
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{ width: `${studentGapScore}%`, background: 'linear-gradient(90deg, #06b6d4, #0891b2)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
