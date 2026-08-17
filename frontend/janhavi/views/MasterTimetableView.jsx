import React, { useState } from 'react';
import { Calendar, RefreshCw, AlertCircle, Sparkles, Filter, Download } from 'lucide-react';
import { useTimetableData } from '../hooks/useTimetableData';
import { useFilteredTimetable } from '../hooks/useFilteredTimetable';
import TimetableGrid from '../components/TimetableGrid';
import FilterBar from '../components/FilterBar';
import VerificationHUD from '../components/VerificationHUD';
import '../components/janhaviStyles.css';

/**
 * MasterTimetableView - Top-level full institutional schedule matrix with live filtering
 * and NEP 0-hard-clash verification HUD.
 */
export function MasterTimetableView() {
  const { timetable, loading, error, refreshTimetable } = useTimetableData();

  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [category, setCategory] = useState('ALL');

  const { filteredEntries, totalCount, filteredCount } = useFilteredTimetable(
    timetable?.entries || [],
    { searchQuery, department, category }
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setDepartment('ALL');
    setCategory('ALL');
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <RefreshCw size={36} color="var(--primary-600)" className="hud-pulse-dot" style={{ margin: '0 auto 16px auto', display: 'block' }} />
        <h3 style={{ marginBottom: '8px' }}>Loading Master Timetable...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Validating NEP 2020 constraint matrix and multi-department bands.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ padding: '40px', borderLeft: '5px solid var(--danger-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger-text)', marginBottom: '12px' }}>
          <AlertCircle size={24} />
          <h3 style={{ margin: 0 }}>Unable to Load Master Timetable</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{error}</p>
        <button type="button" className="btn btn-primary" onClick={refreshTimetable}>
          <RefreshCw size={16} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Verification HUD Banner */}
      <VerificationHUD
        metrics={timetable?.metrics}
        qualityScore={timetable?.qualityScore}
        generatedAt={timetable?.generatedAt}
      />

      {/* 2. Header & Controls */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={24} color="var(--primary-600)" />
              <span>Master College Timetable</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Institutional 5-Day synchronized grid across all 4 departments with NEP 2020 elective baskets.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredCount} of {totalCount} sessions
            </span>
            <button
              type="button"
              className="btn btn-outline"
              onClick={refreshTimetable}
              title="Refresh Timetable"
            >
              <RefreshCw size={14} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* 3. Multi-Dimensional Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          department={department}
          onDepartmentChange={setDepartment}
          category={category}
          onCategoryChange={setCategory}
          onReset={handleResetFilters}
        />

        {/* 4. Interactive 2D Timetable Grid */}
        <TimetableGrid
          entries={filteredEntries}
          emptyMessage="No timetable entries match the selected filters."
        />
      </div>
    </div>
  );
}

export default MasterTimetableView;
