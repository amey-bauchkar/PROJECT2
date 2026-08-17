import mongoose from 'mongoose';

// 1. Department Schema
const DepartmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  hod: { type: String }
}, { timestamps: true, strict: false });

// 2. Room Schema
const RoomSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  roomNumber: { type: String, required: true },
  name: { type: String },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  building: { type: String },
  floor: { type: Number, default: 1 },
  hasProjector: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

// 3. Faculty Schema
const UnavailableSlotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  period: { type: Number, required: true },
  reason: { type: String }
}, { _id: false });

const FacultySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  departmentId: { type: String, required: true },
  designation: { type: String },
  email: { type: String },
  maxHoursPerWeek: { type: Number, default: 16 },
  unavailableSlots: [UnavailableSlotSchema]
}, { timestamps: true, strict: false });

// 4. Course Schema
const CourseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  departmentId: { type: String, required: true },
  category: { type: String, required: true },
  credits: { type: Number, required: true },
  theoryHoursPerWeek: { type: Number, default: 0 },
  labHoursPerWeek: { type: Number, default: 0 },
  facultyId: { type: String, required: true },
  requiredRoomType: { type: String, default: 'LectureHall' },
  requiredLabType: { type: String },
  basketId: { type: String }
}, { timestamps: true, strict: false });

// 5. Cohort Schema
const CohortSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  departmentId: { type: String, required: true },
  studentCount: { type: Number, required: true },
  enrolledCourseIds: [{ type: String }]
}, { timestamps: true, strict: false });

export const DepartmentModel = mongoose.model('Department', DepartmentSchema);
export const RoomModel = mongoose.model('Room', RoomSchema);
export const FacultyModel = mongoose.model('Faculty', FacultySchema);
export const CourseModel = mongoose.model('Course', CourseSchema);
export const CohortModel = mongoose.model('Cohort', CohortSchema);
