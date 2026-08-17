import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Fallback State Store
let inMemoryActiveTimetable = null;
let inMemoryConfigData = null;

export function loadSeedData() {
  if (!inMemoryConfigData) {
    const dataPath = path.join(__dirname, '..', 'data', 'sampleCollege.json');
    let rawData = fs.readFileSync(dataPath, 'utf8');
    // Strip UTF-8 BOM if present
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

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('📦 MongoDB URI not specified. Operating in Resilient In-Memory JSON mode.');
    loadSeedData();
    return { isConnected: false, mode: 'in-memory' };
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
    loadSeedData();
    return { isConnected: true, mode: 'mongodb' };
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed (${error.message}). Falling back to In-Memory JSON mode.`);
    loadSeedData();
    return { isConnected: false, mode: 'in-memory-fallback' };
  }
}
