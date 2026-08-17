import React, { useState } from 'react';
import { 
  Sliders, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Building,
  Sparkles,
  Zap
} from 'lucide-react';
import AdminConfigView from './views/AdminConfigView';
import BasketManagerView from './views/BasketManagerView';
import DiagnosticDashboardView from './views/DiagnosticDashboardView';
import WhatIfDisruptorView from './views/WhatIfDisruptorView';
import { useSolverControls } from './hooks/useSolverControls';
import { useWhatIfSimulation } from './hooks/useWhatIfSimulation';
import './components/tanmay.css';

export default function TanmayAdminHub({ timetable, onTimetableUpdated }) {
  const [adminSubTab, setAdminSubTab] = useState('config'); // 'config' | 'baskets' | 'diagnostics' | 'whatif'

  const solverControls = useSolverControls(onTimetableUpdated);
  const simulationControls = useWhatIfSimulation(onTimetableUpdated);

  return (
    <div className="tanmay-container">
      {/* Sub-Navigation Navigation Bar */}
      <div className="tanmay-nav">
        <button
          className={`tanmay-nav-btn ${adminSubTab === 'config' ? 'active' : ''}`}
          onClick={() => setAdminSubTab('config')}
        >
          <Building size={16} />
          <span>Overview & Resources</span>
        </button>

        <button
          className={`tanmay-nav-btn ${adminSubTab === 'baskets' ? 'active' : ''}`}
          onClick={() => setAdminSubTab('baskets')}
        >
          <Layers size={16} />
          <span>NEP 2020 Basket Manager</span>
        </button>

        <button
          className={`tanmay-nav-btn ${adminSubTab === 'diagnostics' ? 'active' : ''}`}
          onClick={() => setAdminSubTab('diagnostics')}
        >
          <Activity size={16} />
          <span>AI Health Scorecard</span>
        </button>

        <button
          className={`tanmay-nav-btn ${adminSubTab === 'whatif' ? 'active' : ''}`}
          onClick={() => setAdminSubTab('whatif')}
        >
          <AlertTriangle size={16} />
          <span>What-If Disruptor Console</span>
        </button>
      </div>

      {/* Sub-Tab View Switching */}
      {adminSubTab === 'config' && (
        <AdminConfigView
          solverControls={solverControls}
          onTimetableUpdated={onTimetableUpdated}
        />
      )}

      {adminSubTab === 'baskets' && (
        <BasketManagerView />
      )}

      {adminSubTab === 'diagnostics' && (
        <DiagnosticDashboardView
          timetable={timetable}
        />
      )}

      {adminSubTab === 'whatif' && (
        <WhatIfDisruptorView
          simulationControls={simulationControls}
          onTimetableUpdated={onTimetableUpdated}
        />
      )}
    </div>
  );
}
