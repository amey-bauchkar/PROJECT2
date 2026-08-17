import mongoose from 'mongoose';

const TimetableEntrySchema = new mongoose.Schema({
  id: { type: String, required: true },
  day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], required: true },
  period: { type: Number, min: 1, max: 8, required: true },
  timeLabel: { type: String, required: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  category: { type: String, enum: ['Major', 'Minor', 'MDC', 'AEC', 'SEC', 'VAC'], required: true },
  facultyId: { type: String, required: true },
  facultyName: { type: String, required: true },
  roomId: { type: String, required: true },
  roomNumber: { type: String, required: true },
  cohortId: { type: String, required: true },
  sessionType: { type: String, enum: ['Theory', 'Practical'], required: true },
  blockLength: { type: Number, default: 1 }
});

const TimetableSchema = new mongoose.Schema({
  timetableId: { type: String, required: true, unique: true },
  generatedAt: { type: Date, default: Date.now },
  executionTimeMs: { type: Number, required: true },
  qualityScore: { type: Number, required: true },
  metrics: {
    clashCount: { type: Number, default: 0 },
    roomUtilization: { type: Number, required: true },
    facultyLoadBalance: { type: Number, required: true },
    studentGapScore: { type: Number, required: true }
  },
  aiSummary: { type: String },
  recommendations: [{ type: String }],
  entries: [TimetableEntrySchema],
  isSimulated: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const TimetableModel = mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);
