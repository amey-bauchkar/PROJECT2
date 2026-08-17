import React, { useState } from 'react';
import { FlaskConical, User, MapPin, Layers, Clock } from 'lucide-react';
import './janhaviStyles.css';

/**
 * LabBlockCard - Continuous multi-period practical lab session card spanning periods.
 */
export function LabBlockCard({ entry }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!entry) return null;

  const span = entry.blockLength || 2;

  return (
    <div
      className="lab-block-card"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      title={`${entry.courseName} (Practical Lab Block - ${span} Periods)`}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span className="lab-badge">
            <FlaskConical size={12} />
            <span>PRACTICAL LAB ({span}P)</span>
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f766e' }}>
            {entry.courseId}
          </span>
        </div>

        <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#134e4a', lineHeight: 1.25, marginBottom: '6px' }}>
          {entry.courseName}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.74rem', color: '#042f2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={12} color="#0d9488" />
          <span style={{ fontWeight: 600 }}>{entry.timeLabel || `Period ${entry.period} - ${entry.period + span - 1}`}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <User size={12} color="#0d9488" />
          <span>{entry.facultyName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={12} color="#0d9488" />
          <span style={{ fontWeight: 600 }}>{entry.roomNumber}</span>
          {entry.cohortId && (
            <>
              <span>•</span>
              <span>{entry.cohortId.replace('COHORT_', '')}</span>
            </>
          )}
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {showDetails && (
        <div
          style={{
            position: 'absolute',
            bottom: '105%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--text-main, #0f172a)',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '6px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
            zIndex: 50,
            width: '240px',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            lineHeight: 1.4
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px', color: '#5eead4' }}>
            🔬 {entry.courseName} (Practical Lab)
          </div>
          <div><strong>Duration:</strong> {span} Continuous Periods ({entry.timeLabel})</div>
          <div><strong>Lab Facility:</strong> {entry.roomNumber}</div>
          <div><strong>Faculty Lead:</strong> {entry.facultyName}</div>
          <div><strong>Assigned Cohort:</strong> {entry.cohortId}</div>
          <div><strong>Category:</strong> {entry.category}</div>
        </div>
      )}
    </div>
  );
}

export default LabBlockCard;
