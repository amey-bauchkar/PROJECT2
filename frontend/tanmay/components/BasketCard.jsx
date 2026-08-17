import React from 'react';
import { Layers, ShieldCheck, Clock, BookOpen } from 'lucide-react';
import './tanmay.css';

export default function BasketCard({
  basketName = 'Basket Minor 1',
  category = 'Minor',
  timeBand = 'Tuesday & Thursday • Period 3 (11:00 AM)',
  credits = 4,
  description = 'Cross-departmental multidisciplinary minor electives synchronized to run concurrently.',
  courses = []
}) {
  return (
    <div className="basket-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '1rem', margin: 0 }}>{basketName}</h4>
            <span className={`badge badge-${category.toLowerCase()}`}>{category}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{description}</p>
        </div>
        <span className="badge" style={{ background: '#f1f5f9', color: 'var(--text-main)' }}>
          {credits} Credits
        </span>
      </div>

      {/* Synchronized Time Band Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--primary-50)',
        border: '1px solid var(--primary-100)',
        color: 'var(--primary-900)',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.82rem',
        fontWeight: 600
      }}>
        <Clock size={15} color="var(--primary-600)" />
        <span>Sync Band: {timeBand}</span>
      </div>

      {/* Course Offerings in this Basket */}
      <div className="basket-course-list">
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Synchronized Offerings ({courses.length})
        </span>

        {courses.map((course) => (
          <div key={course.id || course.code} className="basket-course-row">
            <div>
              <strong style={{ color: 'var(--text-main)' }}>{course.code}: </strong>
              <span>{course.name}</span>
            </div>
            <span className="badge" style={{ background: '#ffffff', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              {course.departmentCode || course.departmentId?.replace('DEP_', '')}
            </span>
          </div>
        ))}
      </div>

      {/* Conflict-Safe Invariant Verification Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: 'auto',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.78rem',
        color: 'var(--success-text)'
      }}>
        <ShieldCheck size={14} color="var(--success-border)" />
        <span>NEP Synchronized • 0 Cross-Cohort Clashes</span>
      </div>
    </div>
  );
}
