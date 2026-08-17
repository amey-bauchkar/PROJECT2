import { useState } from 'react';
import { simulateDisruption, commitSimulation } from '../../src/api/apiClient';

export function useWhatIfSimulation(onCommitSuccess) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);
  const [commitMessage, setCommitMessage] = useState(null);

  const runSimulation = async (disruptionPayload) => {
    setIsSimulating(true);
    setError(null);
    setCommitMessage(null);
    try {
      const result = await simulateDisruption(disruptionPayload);
      setSimulationResult(result);
      return result;
    } catch (err) {
      setError(err.message || 'Simulation failed');
      throw err;
    } finally {
      setIsSimulating(false);
    }
  };

  const applySimulation = async () => {
    setIsCommitting(true);
    setError(null);
    try {
      const response = await commitSimulation();
      setCommitMessage(response.message || 'Simulated schedule promoted to active timetable.');
      setSimulationResult(null);
      if (onCommitSuccess) {
        onCommitSuccess();
      }
      setTimeout(() => setCommitMessage(null), 4000);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to commit simulation');
      throw err;
    } finally {
      setIsCommitting(false);
    }
  };

  const discardSimulation = () => {
    setSimulationResult(null);
    setError(null);
  };

  return {
    isSimulating,
    isCommitting,
    simulationResult,
    error,
    commitMessage,
    runSimulation,
    applySimulation,
    discardSimulation
  };
}
