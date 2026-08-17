/**
 * NEP 2020 System Constants & Time Structure
 */

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const PERIODS = [
  { periodNumber: 1, timeLabel: '09:00 - 09:50', isMorning: true },
  { periodNumber: 2, timeLabel: '09:50 - 10:40', isMorning: true },
  { periodNumber: 3, timeLabel: '11:00 - 11:50', isMorning: true },
  { periodNumber: 4, timeLabel: '11:50 - 12:40', isMorning: true },
  { periodNumber: 5, timeLabel: '01:40 - 02:30', isAfternoon: true },
  { periodNumber: 6, timeLabel: '02:30 - 03:20', isAfternoon: true },
  { periodNumber: 7, timeLabel: '03:20 - 04:10', isAfternoon: true },
  { periodNumber: 8, timeLabel: '04:10 - 05:00', isAfternoon: true }
];

export const NEP_CATEGORIES = {
  MAJOR: 'Major',
  MINOR: 'Minor',
  MDC: 'MDC',
  AEC: 'AEC',
  SEC: 'SEC',
  VAC: 'VAC'
};

export const ROOM_TYPES = {
  LECTURE_HALL: 'LectureHall',
  AUDITORIUM: 'Auditorium',
  COMPUTER_LAB: 'ComputerLab',
  SCIENCE_LAB: 'ScienceLab',
  LANGUAGE_LAB: 'LanguageLab'
};

export const SOLVER_CONFIG = {
  MAX_EXECUTION_TIME_MS: 3000,
  TARGET_QUALITY_SCORE: 90,
  LAB_BLOCK_DEFAULT_LENGTH: 2
};
