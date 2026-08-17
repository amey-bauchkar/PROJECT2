import { loadSeedData } from '../config/db.js';

export function getDemoData(req, res) {
  try {
    const data = loadSeedData();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load seed configuration', error: error.message });
  }
}

export function updateConfig(req, res) {
  try {
    // Allows dynamic modification of rooms / faculty
    const currentData = loadSeedData();
    const updatedData = { ...currentData, ...req.body };
    res.status(200).json({ success: true, message: 'Configuration updated', data: updatedData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update configuration', error: error.message });
  }
}
