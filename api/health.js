import query from './db.js';

export default async function handler(req, res) {
  try {
    const result = await query('SELECT 1 as ok');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: !!result?.rows?.[0]?.ok });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ ok: false, error: 'db_unreachable' });
  }
}

