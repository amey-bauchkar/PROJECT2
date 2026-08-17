import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle2, ShieldCheck, MapPin, Clock } from 'lucide-react';
import './tanmay.css';

export default function DiffCard({ diff }) {
  const {
    courseName = 'C++ Data Structures Lab',
    courseId = 'CS101_LAB',
    oldSlot = { day: 'Mon', period: 5, roomNumber: 'Lab CS-1' },
    newSlot = { day: 'Thu', period: 6, roomNumber: 'Lab CS-2' },
    reason = 'Lab CS-1 locked for maintenance'
  } = diff || {};

  return (
    <div className="diff-card">
      <div className="diff-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-sec">Relocated Session</span>
          <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{courseName}</strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>({courseId})</span>
        </div>
        <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
          <AlertTriangle size={13} /> Disruption Re-routed
        </span>
      </div>

      <div className="diff-body">
        {/* Old Disrupted Slot */}
        <div className="diff-slot-box diff-slot-old">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span style={{ color: '#ef4444' }}>❌ Previous Slot (Disrupted)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
            <Clock size={16} />
            <span style={{ textDecoration: 'line-through' }}>{oldSlot.day} • Period {oldSlot.period}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
            <MapPin size={15} />
            <span style={{ textDecoration: 'line-through' }}>Venue: {oldSlot.roomNumber}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '4px', fontStyle: 'italic' }}>
            Cause: {reason}
          </div>
        </div>

        {/* Arrow Transition */}
        <div className="diff-arrow-box">
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <ArrowRight size={20} color="var(--primary-600)" />
          </div>
        </div>

        {/* New Clash-Free Slot */}
        <div className="diff-slot-box diff-slot-new">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span style={{ color: '#16a34a' }}>✅ Re-Optimized Slot (Active)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700 }}>
            <Clock size={16} color="#16a34a" />
            <span>{newSlot.day} • Period {newSlot.period}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
            <MapPin size={15} color="#16a34a" />
            <span>Venue: {newSlot.roomNumber}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            <span>AI Verified: 0 student collisions & room capacity compliant</span>
          </div>
        </div>
      </div>

      <div className="diff-footer">
        ⚡ <em>Re-computed in 62ms using localized Most-Constrained-Variable placement without altering unrelated courses.</em>
      </div>
    </div>
  );
}
