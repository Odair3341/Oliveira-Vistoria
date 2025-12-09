import query from './db.js';

export default async function handler(req, res) {
  try {
    const start = Date.now();
    const result = await query('SELECT 1 as ok');
    const duration = Date.now() - start;

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      status: 'healthy',
      db: 'connected',
      latency_ms: duration,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'unhealthy',
      db: 'disconnected',
      error: error.message
    });
  }
}

