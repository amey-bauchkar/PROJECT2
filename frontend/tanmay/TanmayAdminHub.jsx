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
import SahayakBroadcastHubView from './views/SahayakBroadcastHubView';
import OfficialGovLetterheadExport from './components/OfficialGovLetterheadExport';
import { useSolverControls } from './hooks/useSolverControls';
import { useWhatIfSimulation } from './hooks/useWhatIfSimulation';
import { Smartphone, FileText, Printer } from 'lucide-react';
import './components/tanmay.css';

export default function TanmayAdminHub({ timetable, onTimetableUpdated }) {
  const [adminSubTab, setAdminSubTab] = useState('config'); // 'config' | 'baskets' | 'diagnostics' | 'whatif' | 'sahayak'
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

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

        <button
          className={`tanmay-nav-btn ${adminSubTab === 'sahayak' ? 'active' : ''}`}
          onClick={() => setAdminSubTab('sahayak')}
          style={{
            background: adminSubTab === 'sahayak' ? '#ecfdf5' : undefined,
            borderColor: adminSubTab === 'sahayak' ? '#a7f3d0' : undefined,
            color: adminSubTab === 'sahayak' ? '#065f46' : undefined
          }}
        >
          <Smartphone size={16} color="#10b981" />
          <span>📱 Sahayak & WhatsApp Hub</span>
        </button>

        <button
          className="tanmay-nav-btn"
          onClick={() => setIsPdfModalOpen(true)}
          style={{
            marginLeft: 'auto',
            background: 'linear-gradient(135deg, #0f172a, #334155)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)'
          }}
          title="Print official letterhead circular with HOD & Principal signatures"
        >
          <FileText size={16} />
          <span>📄 1-Click Gov PDF Export</span>
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

      {adminSubTab === 'sahayak' && (
        <SahayakBroadcastHubView
          simulationControls={simulationControls}
          onTimetableUpdated={onTimetableUpdated}
        />
      )}

      {/* Official Government Letterhead PDF Export Modal */}
      <OfficialGovLetterheadExport
        timetable={timetable}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
}
