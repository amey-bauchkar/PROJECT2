import { useState } from 'react';
import { generateTimetable } from '../../src/api/apiClient';

const GENERATION_PHASES = [
  { id: 1, label: 'Normalizing NEP Curricula & Slicing Lab Blocks...' },
  { id: 2, label: 'Constructing Cohort Conflict Graph G=(V,E)...' },
  { id: 3, label: 'Synchronizing Minor & MDC Elective Baskets...' },
  { id: 4, label: 'Executing MCV Backtracking Solver...' },
  { id: 5, label: 'Auditing Hard Invariants (0 Faculty/Room Clashes)...' }
];

export function useSolverControls(onTimetableUpdated) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'generating' | 'success' | 'error'
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (options = {}) => {
    setStatus('generating');
    setCurrentPhaseIndex(0);
    setProgressPercent(10);
    setError(null);

    // Progressive step simulation for the 5 phases
    const phaseInterval = setInterval(() => {
      setCurrentPhaseIndex(prev => {
        const next = prev + 1;
        if (next < GENERATION_PHASES.length) {
          setProgressPercent(Math.min(90, (next + 1) * 18));
          return next;
        }
        return prev;
      });
    }, 280);

    try {
      const generatedData = await generateTimetable(options);
      clearInterval(phaseInterval);
      setCurrentPhaseIndex(GENERATION_PHASES.length - 1);
      setProgressPercent(100);
      setResult(generatedData);
      setStatus('success');

      if (onTimetableUpdated) {
        onTimetableUpdated(generatedData);
      }

      // Reset back to idle status after 4 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 4000);

      return generatedData;
    } catch (err) {
      clearInterval(phaseInterval);
      setError(err.message || 'Generation failed');
      setStatus('error');
      throw err;
    }
  };

  return {
    status,
    isGenerating: status === 'generating',
    currentPhase: GENERATION_PHASES[currentPhaseIndex],
    currentPhaseIndex,
    allPhases: GENERATION_PHASES,
    progressPercent,
    result,
    error,
    handleGenerate
  };
}
