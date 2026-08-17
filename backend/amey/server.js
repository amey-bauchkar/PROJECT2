import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import apiRoutes from './src/routes/apiRoutes.js';

dotenv.config();

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

// Mount Main API Routes
app.use('/api', apiRoutes);

// Connect DB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 NEP 2020 Timetable Engine Backend running on http://localhost:${PORT}`);
    console.log(`📡 Endpoints available:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/config/demo-data`);
    console.log(`   - POST /api/timetable/generate`);
    console.log(`   - GET  /api/timetable/active`);
    console.log(`   - POST /api/timetable/simulate`);
    console.log(`   - POST /api/timetable/simulate/commit`);
    console.log(`   - GET  /api/diagnostics/explain/:timetableId`);
  });
});
