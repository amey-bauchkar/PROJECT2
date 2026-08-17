import React from 'react';
import { Zap, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import './tanmay.css';

export default function GeneratorHUD({ solverControls }) {
  const {
    isGenerating,
    status,
    currentPhase,
    currentPhaseIndex,
    allPhases,
    progressPercent,
    result,
    handleGenerate
  } = solverControls;

  return (
    <div className="generator-hud-card">
      <div className="hud-header">
        <div className="hud-title">
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={26} color="#fbbf24" />
          </div>
          <div>
            <h3>One-Click AI Timetable Generator</h3>
            <p>Deterministic Constraint Solver & NEP 2020 Multi-Track Harmonizer</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {result && status === 'idle' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#86efac',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: 600
            }}>
              <ShieldCheck size={16} />
              <span>⚡ Solved in {result.executionTimeMs}ms • 0 Hard Clashes</span>
            </div>
          )}

          <button
            className="hud-btn-generate"
            onClick={() => handleGenerate()}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Solving Constraints...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate AI Timetable</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5-Phase Animated Progress Section */}
      {isGenerating && (
        <div className="hud-progress-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.86rem', color: '#c7d2fe' }}>
            <span>{currentPhase?.label || 'Processing...'}</span>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>{progressPercent}%</span>
          </div>

          <div className="hud-progress-bar-track">
            <div
              className="hud-progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="hud-phase-stepper">
            {allPhases.map((phase, idx) => {
              const isDone = idx < currentPhaseIndex;
              const isActive = idx === currentPhaseIndex;
              return (
                <div
                  key={phase.id}
                  className={`hud-phase-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} color="#4ade80" />
                  ) : (
                    <div className="hud-phase-dot" />
                  )}
                  <span>Phase {phase.id}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
