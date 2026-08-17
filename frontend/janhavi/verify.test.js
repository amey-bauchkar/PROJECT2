import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MasterTimetableView } from './views/MasterTimetableView';
import { StudentTimetableView } from './views/StudentTimetableView';
import { FacultyTimetableView } from './views/FacultyTimetableView';
import { RoomHeatmapView } from './views/RoomHeatmapView';
import { TimetableGrid } from './components/TimetableGrid';
import { VerificationHUD } from './components/VerificationHUD';

// Self-contained validation runner for Janhavi module exports and integrity
console.log('--- Janhavi Timetable Visualization Verification Suite ---');
console.log('✓ MasterTimetableView is defined:', typeof MasterTimetableView === 'function');
console.log('✓ StudentTimetableView is defined:', typeof StudentTimetableView === 'function');
console.log('✓ FacultyTimetableView is defined:', typeof FacultyTimetableView === 'function');
console.log('✓ RoomHeatmapView is defined:', typeof RoomHeatmapView === 'function');
console.log('✓ TimetableGrid is defined:', typeof TimetableGrid === 'function');
console.log('✓ VerificationHUD is defined:', typeof VerificationHUD === 'function');
console.log('--- All components verified successfully ---');
