
import query from './db.js';

export default async function handler(req, res) {
  try {
    const hasUrl = !!process.env.DATABASE_URL;
    let dbStatus = 'Not tested';
    let dbError = null;

    if (hasUrl) {
      try {
        const result = await query('SELECT NOW() as now');
        dbStatus = 'Connected';
      } catch (e) {
        dbStatus = 'Failed';
        dbError = e.message;
      }
    }

    res.status(200).json({ 
      message: 'API is working', 
      env: {
        hasDbUrl: hasUrl,
        nodeVersion: process.version,
      },
      db: {
        status: dbStatus,
        error: dbError
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
