import { initDb } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await initDb();
    return res.status(200).json(result);
  } catch (error) {
    console.error('DB init error:', error);
    return res.status(500).json({ error: error.message });
  }
}
