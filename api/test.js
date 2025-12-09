
import query from './db.js';
import pg from 'pg';

export default async function handler(req, res) {
  try {
    const connectionString = process.env.DATABASE_URL || '';
    
    // Parse connection string manually to debug what Vercel sees
    let debugInfo = {
      length: connectionString.length,
      startsWithPostgres: connectionString.startsWith('postgres'),
      hasSslMode: connectionString.includes('sslmode'),
    };

    try {
        // Simple regex to extract user and host (avoiding password)
        const match = connectionString.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^/]+)/);
        if (match) {
            debugInfo.user = match[1];
            debugInfo.host = match[3];
            debugInfo.passwordFirstChar = match[2] ? match[2][0] : null;
            debugInfo.passwordLength = match[2] ? match[2].length : 0;
        }
    } catch (e) {
        debugInfo.parseError = e.message;
    }

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
      message: 'API Debug', 
      env: {
        hasDbUrl: hasUrl,
        nodeVersion: process.version,
      },
      connectionDebug: debugInfo,
      db: {
        status: dbStatus,
        error: dbError
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
