import { getInstitutionalData, loadSeedData } from '../config/db.js';

export async function getDemoData(req, res) {
  try {
    const data = await getInstitutionalData();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load configuration', error: error.message });
  }
}

export function updateConfig(req, res) {
  try {
    const currentData = loadSeedData();
    const updatedData = { ...currentData, ...req.body };
    res.status(200).json({ success: true, message: 'Configuration updated', data: updatedData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update configuration', error: error.message });
  }
}
