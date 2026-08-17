import { useState, useEffect, useCallback } from 'react';
import { getActiveTimetable } from '../../src/api/apiClient';

export function useTimetableData() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimetable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveTimetable();
      setTimetable(data);
    } catch (err) {
      setError(err.message || 'Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  return { timetable, loading, error, refreshTimetable: fetchTimetable };
}

export default useTimetableData;
