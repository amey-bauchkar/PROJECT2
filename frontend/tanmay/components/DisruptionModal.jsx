import React, { useState } from 'react';
import { X, AlertTriangle, Building, Users, Calendar, Sparkles, Loader2 } from 'lucide-react';
import './tanmay.css';

export default function DisruptionModal({ isOpen, onClose, onSimulate, isSimulating }) {
  const [disruptionType, setDisruptionType] = useState('ROOM_CLOSURE'); // 'ROOM_CLOSURE' | 'FACULTY_LEAVE'
  const [targetId, setTargetId] = useState('LAB_CS1');
  const [day, setDay] = useState('Wed');
  const [reason, setReason] = useState('Emergency server and electrical maintenance');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSimulate({
      disruptionType,
      targetId,
      day,
      reason
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#fef3c7',
              color: '#d97706',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Simulate Campus Disruption</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                Test timetable resilience against sudden resource unavailability
              </p>
            </div>
          </div>
          <button
            className="btn btn-outline"
            style={{ padding: '6px', borderRadius: '50%' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Disruption Type Selector */}
          <div className="form-group">
            <label className="form-label">Disruption Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${disruptionType === 'ROOM_CLOSURE' ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', fontSize: '0.86rem', padding: '10px' }}
                onClick={() => {
                  setDisruptionType('ROOM_CLOSURE');
                  setTargetId('LAB_CS1');
                }}
              >
                <Building size={16} />
                <span>Room Closure</span>
              </button>

              <button
                type="button"
                className={`btn ${disruptionType === 'FACULTY_LEAVE' ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', fontSize: '0.86rem', padding: '10px' }}
                onClick={() => {
                  setDisruptionType('FACULTY_LEAVE');
                  setTargetId('FAC_01');
                }}
              >
                <Users size={16} />
                <span>Faculty Leave</span>
              </button>
            </div>
          </div>

          {/* Target Resource Selector */}
          {disruptionType === 'ROOM_CLOSURE' ? (
            <div className="form-group">
              <label className="form-label">Affected Physical Venue</label>
              <select
                className="form-select"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              >
                <option value="LAB_CS1">Lab CS-1 (Computing Center - 35 Seats)</option>
                <option value="LAB_CS2">Lab CS-2 (Computing Center - 35 Seats)</option>
                <option value="LAB_PHYS1">Physics Lab 1 (Science Complex)</option>
                <option value="LH_101">LH-101 (Academic Block A - 70 Seats)</option>
                <option value="LH_201">LH-201 (Academic Block A - 60 Seats)</option>
                <option value="AUD_01">Main Auditorium (Central Block - 150 Seats)</option>
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Professor on Leave</label>
              <select
                className="form-select"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              >
                <option value="FAC_01">Dr. A. Verma (Professor & HOD, CS)</option>
                <option value="FAC_02">Prof. N. Gupta (Associate Prof, CS)</option>
                <option value="FAC_05">Dr. S. Sharma (Professor & HOD, Physics)</option>
                <option value="FAC_09">Dr. M. Koul (Professor & HOD, Economics)</option>
                <option value="FAC_13">Dr. R. Dhar (Professor & HOD, English Lit)</option>
              </select>
            </div>
          )}

          {/* Day Selector */}
          <div className="form-group">
            <label className="form-label">Disruption Day</label>
            <select
              className="form-select"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="Mon">Monday</option>
              <option value="Tue">Tuesday</option>
              <option value="Wed">Wednesday</option>
              <option value="Thu">Thursday</option>
              <option value="Fri">Friday</option>
            </select>
          </div>

          {/* Context Reason */}
          <div className="form-group">
            <label className="form-label">Operational Note / Reason</label>
            <input
              type="text"
              className="form-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Renovation work / Conference attendance"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSimulating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSimulating}
            >
              {isSimulating ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Re-Routing Slots...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Run AI Re-Route Simulation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
