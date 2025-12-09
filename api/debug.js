import pg from 'pg';

export default async function handler(req, res) {
  const { Pool } = pg;
  const connectionString = process.env.DATABASE_URL;

  res.setHeader('Cache-Control', 'no-store');

  if (!connectionString) {
    return res.status(500).json({
      status: 'error',
      message: 'DATABASE_URL environment variable is not set.',
      timestamp: new Date().toISOString(),
    });
  }

  // Redact the password for security
  const redactedConnectionString = connectionString.replace(/:([^:]+)@/, ':REDACTED@');

  const pool = new Pool({
    connectionString,
  });

  try {
    const start = Date.now();
    const client = await pool.connect();
    const result = await client.query('SELECT NOW();');
    const duration = Date.now() - start;
    client.release();
    
    return res.status(200).json({
      status: 'success',
      message: 'Database connection successful.',
      db_response: result.rows[0],
      latency_ms: duration,
      redacted_connection_string: redactedConnectionString,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed.',
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack, // This will give us the full trace
      redacted_connection_string: redactedConnectionString,
      timestamp: new Date().toISOString(),
    });
  } finally {
    await pool.end();
  }
}
