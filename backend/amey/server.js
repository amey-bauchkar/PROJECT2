import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'NEP 2020 Timetable Engine Backend'
  });
});

// Demo Data Endpoint
app.get('/api/config/demo-data', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'src', 'data', 'sampleCollege.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load seed data', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 NEP 2020 Timetable Backend running on http://localhost:${PORT}`);
});
