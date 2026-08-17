import React, { useState } from 'react';
import { BookOpen, User, MapPin, Users, Layers, Sparkles } from 'lucide-react';
import './janhaviStyles.css';

/**
 * Maps NEP 2020 course category to appropriate scoped class.
 */
function getCategoryClass(category = '') {
  switch (category.toLowerCase()) {
    case 'major':
    case 'dsc':
      return 'slot-major';
    case 'minor':
    case 'dse':
      return 'slot-minor';
    case 'mdc':
      return 'slot-mdc';
    case 'aec':
      return 'slot-aec';
    case 'sec':
      return 'slot-sec';
    case 'vac':
      return 'slot-vac';
    default:
      return 'slot-major';
  }
}

/**
 * TimeSlotCard - Individual theory or 1-period slot card with tooltip and details.
 */
export function TimeSlotCard({ entry }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!entry) return null;

  const categoryClass = getCategoryClass(entry.category);

  return (
    <div
      className={`slot-card ${categoryClass}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      title={`${entry.courseName} (${entry.category})`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
        <span
          className={`badge badge-${entry.category?.toLowerCase() || 'major'}`}
          style={{ fontSize: '0.65rem', padding: '1px 6px', lineHeight: 1.2 }}
        >
          {entry.category}
        </span>
        <span style={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.8 }}>
          {entry.courseId}
        </span>
      </div>

      <div style={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.2, margin: '2px 0' }}>
        {entry.courseName}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.72rem', opacity: 0.9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <User size={12} />
          <span>{entry.facultyName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} />
          <span>{entry.roomNumber}</span>
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
            width: '220px',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            lineHeight: 1.4
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px' }}>
            {entry.courseName} ({entry.courseId})
          </div>
          <div><strong>Category:</strong> {entry.category}</div>
          <div><strong>Instructor:</strong> {entry.facultyName}</div>
          <div><strong>Location:</strong> {entry.roomNumber}</div>
          <div><strong>Cohort:</strong> {entry.cohortId}</div>
          <div><strong>Time:</strong> {entry.timeLabel || `Period ${entry.period}`}</div>
        </div>
      )}
    </div>
  );
}

export default TimeSlotCard;
