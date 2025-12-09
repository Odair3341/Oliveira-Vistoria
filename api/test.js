
import query from './db.js';
import pg from 'pg';

export default async function handler(req, res) {
  try {
    const { Pool } = pg;
    // Hardcoded string from db.js logic (replicated here for independent verification)
    const hardcodedString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-empty-forest-acjt0u7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

    let directTest = 'Not attempted';
    let directError = null;

    try {
        const pool2 = new Pool({
            connectionString: hardcodedString,
            ssl: { rejectUnauthorized: true }
        });
        const r2 = await pool2.query('SELECT NOW() as now');
        await pool2.end();
        directTest = 'Success: ' + r2.rows[0].now;
    } catch (e) {
        directTest = 'Failed';
        directError = e.message;
    }

    const hasUrl = !!process.env.DATABASE_URL;
    let dbStatus = 'Not tested';
    let dbError = null;

    if (true) { // Always try query from db.js
      try {
        const result = await query('SELECT NOW() as now');
        dbStatus = 'Connected';
      } catch (e) {
        dbStatus = 'Failed';
        dbError = e.message;
      }
    }

    res.status(200).json({ 
      message: 'API Debug V2', 
      directConnectionTest: {
          status: directTest,
          error: directError
      },
      dbJsTest: {
        status: dbStatus,
        error: dbError
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
