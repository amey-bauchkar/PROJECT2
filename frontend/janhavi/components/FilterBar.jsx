import React from 'react';
import { Search, X, Filter, Sparkles, Building2, BookOpen } from 'lucide-react';
import './janhaviStyles.css';

const DEPARTMENTS = [
  { id: 'ALL', label: 'All Departments' },
  { id: 'CS', label: 'CS & Engineering' },
  { id: 'PHYS', label: 'Physics' },
  { id: 'ECON', label: 'Economics' },
  { id: 'LIT', label: 'Literature' }
];

const CATEGORIES = [
  { id: 'ALL', label: 'All NEP Categories' },
  { id: 'Major', label: 'Major (DSC)' },
  { id: 'Minor', label: 'Minor (DSE)' },
  { id: 'MDC', label: 'MDC' },
  { id: 'AEC', label: 'AEC' },
  { id: 'SEC', label: 'SEC (Lab)' },
  { id: 'VAC', label: 'VAC' }
];

/**
 * FilterBar - Interactive search, department pills, and category selectors.
 */
export function FilterBar({
  searchQuery = '',
  onSearchChange,
  department = 'ALL',
  onDepartmentChange,
  category = 'ALL',
  onCategoryChange,
  onReset
}) {
  const hasActiveFilters = searchQuery.trim() !== '' || department !== 'ALL' || category !== 'ALL';

  return (
    <div className="filter-bar-container">
      {/* Search Input & Reset */}
      <div className="filter-row">
        <div className="search-input-wrapper">
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by course name, code, faculty, room (e.g. C++, Dr. Verma, LH-101)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onReset}
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            <X size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Department Quick Filter Pills */}
      <div className="filter-row" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Department:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              type="button"
              className={`filter-pill ${department === dept.id ? 'active' : ''}`}
              onClick={() => onDepartmentChange(dept.id)}
            >
              <Building2 size={13} />
              <span>{dept.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="filter-row" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          NEP Category:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-pill ${category === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              <BookOpen size={13} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
