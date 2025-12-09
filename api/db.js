import pg from 'pg';
import dotenv from 'dotenv';

// Load .env file for scripts
dotenv.config();

const { Pool } = pg;

// Log to check if DATABASE_URL is loaded (safely)
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL is set.');
} else {
  console.error('CRITICAL: DATABASE_URL is NOT set.');
}

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost')
    ? false
    : { rejectUnauthorized: true },
});

// Listener for unexpected errors on idle interactions
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export default async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', {
      text,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
