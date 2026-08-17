import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DepartmentModel,
  RoomModel,
  FacultyModel,
  CourseModel,
  CohortModel
} from '../models/CollegeModels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Fallback State Store
let inMemoryActiveTimetable = null;
let inMemoryConfigData = null;

export function loadSeedData() {
  if (!inMemoryConfigData) {
    const dataPath = path.join(__dirname, '..', 'data', 'sampleCollege.json');
    let rawData = fs.readFileSync(dataPath, 'utf8');
    if (rawData.charCodeAt(0) === 0xFEFF) {
      rawData = rawData.slice(1);
    }
    inMemoryConfigData = JSON.parse(rawData);
  }
  return inMemoryConfigData;
}

export function getActiveTimetableState() {
  return inMemoryActiveTimetable;
}

export function setActiveTimetableState(timetable) {
  inMemoryActiveTimetable = timetable;
  return inMemoryActiveTimetable;
}

export async function seedInstitutionalDatabase() {
  try {
    const seedData = loadSeedData();

    // 1. Seed Departments
    const deptCount = await DepartmentModel.countDocuments();
    if (deptCount === 0 && seedData.departments) {
      await DepartmentModel.insertMany(seedData.departments);
      console.log(`🍃 Seeded ${seedData.departments.length} departments into MongoDB Atlas.`);
    }

    // 2. Seed Rooms
    const roomCount = await RoomModel.countDocuments();
    if (roomCount === 0 && seedData.rooms) {
      await RoomModel.insertMany(seedData.rooms);
      console.log(`🍃 Seeded ${seedData.rooms.length} rooms into MongoDB Atlas.`);
    }

    // 3. Seed Faculty
    const facCount = await FacultyModel.countDocuments();
    if (facCount === 0 && seedData.faculty) {
      await FacultyModel.insertMany(seedData.faculty);
      console.log(`🍃 Seeded ${seedData.faculty.length} faculty into MongoDB Atlas.`);
    }

    // 4. Seed Courses
    const courseCount = await CourseModel.countDocuments();
    if (courseCount === 0 && seedData.courses) {
      await CourseModel.insertMany(seedData.courses);
      console.log(`🍃 Seeded ${seedData.courses.length} courses into MongoDB Atlas.`);
    }

    // 5. Seed Cohorts
    const cohortCount = await CohortModel.countDocuments();
    if (cohortCount === 0 && seedData.cohorts) {
      await CohortModel.insertMany(seedData.cohorts);
      console.log(`🍃 Seeded ${seedData.cohorts.length} cohorts into MongoDB Atlas.`);
    }
  } catch (err) {
    console.warn('MongoDB Atlas Seeding Warning:', err.message);
  }
}

export async function getInstitutionalData() {
  if (mongoose.connection.readyState === 1) {
    try {
      const [departments, rooms, faculty, courses, cohorts] = await Promise.all([
        DepartmentModel.find().lean(),
        RoomModel.find().lean(),
        FacultyModel.find().lean(),
        CourseModel.find().lean(),
        CohortModel.find().lean()
      ]);

      if (departments.length > 0 && rooms.length > 0) {
        return {
          institution: {
            name: "Government Degree College, J&K",
            code: "GDC-JK-01",
            nepPolicyYear: 2020,
            academicYear: "2026-2027",
            term: "Odd Semester"
          },
          departments,
          rooms,
          faculty,
          courses,
          cohorts
        };
      }
    } catch (err) {
      console.warn('MongoDB read error, using local seed fallback:', err.message);
    }
  }
  return loadSeedData();
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('📦 MongoDB URI not specified. Operating in Resilient In-Memory JSON mode.');
    loadSeedData();
    return { isConnected: false, mode: 'in-memory' };
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
    loadSeedData();
    // Auto-seed collections
    await seedInstitutionalDatabase();
    return { isConnected: true, mode: 'mongodb' };
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed (${error.message}). Falling back to In-Memory JSON mode.`);
    loadSeedData();
    return { isConnected: false, mode: 'in-memory-fallback' };
  }
}
