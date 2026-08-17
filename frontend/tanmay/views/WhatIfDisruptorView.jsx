import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Check, 
  X, 
  Play, 
  Building, 
  Users, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import DisruptionModal from '../components/DisruptionModal';
import DiffCard from '../components/DiffCard';
import '../components/tanmay.css';

export default function WhatIfDisruptorView({ simulationControls, onTimetableUpdated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    isSimulating,
    isCommitting,
    simulationResult,
    error,
    commitMessage,
    runSimulation,
    applySimulation,
    discardSimulation
  } = simulationControls;

  const handleSimulateSubmit = async (payload) => {
    try {
      await runSimulation(payload);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Simulation failed', err);
    }
  };

  const handleApply = async () => {
    await applySimulation();
    if (onTimetableUpdated) {
      onTimetableUpdated();
    }
  };

  return (
    <div className="tanmay-container">
      {/* Standout Feature Introduction Banner */}
      <div className="disruptor-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge" style={{ background: '#f59e0b', color: '#ffffff' }}>
              <Flame size={13} /> Standout Hackathon Feature
            </span>
            <h3 style={{ margin: 0, color: '#78350f' }}>Live Campus Disruptor & Real-Time Re-Router</h3>
          </div>
          <p style={{ margin: 0, color: '#92400e', fontSize: '0.88rem', maxWidth: '850px' }}>
            Simulate sudden physical room closures or faculty leaves. The engine performs targeted Most-Constrained-Variable relocation without altering unrelated timetable slots, proving reactive schedule resilience.
          </p>
        </div>

        <button
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)' }}
          onClick={() => setIsModalOpen(true)}
        >
          <SlidersHorizontal size={18} />
          <span>Launch Disruption Simulator</span>
        </button>
      </div>

      {/* Commit Success Notification */}
      {commitMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          color: '#15803d',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} color="#22c55e" />
          <span>{commitMessage} Master Timetable is now live with updated slots!</span>
        </div>
      )}

      {/* Active Simulation View with Diffs */}
      {simulationResult ? (
        <div className="card" style={{ border: '2px solid #f59e0b', background: '#fffdfa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                  Previewing Simulated Schedule
                </span>
                <h3 style={{ margin: 0 }}>Targeted Relocation Diff Analysis</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '2px' }}>
                {simulationResult.aiExplanation || '1 practical lab session re-routed into available computer lab with 0 student collisions.'}
              </p>
            </div>

            {/* Commit & Discard Action Controls */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-outline"
                onClick={discardSimulation}
                disabled={isCommitting}
                style={{ borderColor: '#f87171', color: '#dc2626' }}
              >
                <X size={16} />
                <span>Discard Simulation</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={handleApply}
                disabled={isCommitting}
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)' }}
              >
                <Check size={16} />
                <span>{isCommitting ? 'Applying to Live...' : 'Apply Changes to Live Timetable'}</span>
              </button>
            </div>
          </div>

          {/* Diffs List */}
          <div className="diff-card-grid">
            {simulationResult.diffs?.map((diff, index) => (
              <DiffCard key={index} diff={diff} />
            ))}
          </div>
        </div>
      ) : (
        /* Ready State with Quick Test Presets */
        <div className="card">
          <h4 style={{ marginBottom: '12px' }}>Quick Scenario Presets</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
            Choose a quick scenario below to trigger real-time AI schedule re-routing:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div
              className="card"
              style={{ background: 'var(--bg-subtle)', cursor: 'pointer', borderColor: '#e2e8f0' }}
              onClick={() => handleSimulateSubmit({ disruptionType: 'ROOM_CLOSURE', targetId: 'LAB_CS1', day: 'Wed', reason: 'Scheduled Computing Center maintenance' })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Building size={20} color="var(--primary-600)" />
                <strong>Close Lab CS-1 (Wednesday)</strong>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                Relocates C++ Data Structures Lab to alternate Computer Lab 2 without moving student theory classes.
              </p>
            </div>

            <div
              className="card"
              style={{ background: 'var(--bg-subtle)', cursor: 'pointer', borderColor: '#e2e8f0' }}
              onClick={() => handleSimulateSubmit({ disruptionType: 'FACULTY_LEAVE', targetId: 'FAC_01', day: 'Thu', reason: 'Conference duty in Srinagar' })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Users size={20} color="#8b5cf6" />
                <strong>Dr. A. Verma on Leave (Thursday)</strong>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                Swaps Thursday Major lecture with available Friday slot while maintaining zero student gaps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disruption Configuration Modal */}
      <DisruptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSimulate={handleSimulateSubmit}
        isSimulating={isSimulating}
      />
    </div>
  );
}
