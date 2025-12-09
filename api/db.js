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
  ssl: connectionString && connectionString.includes('localhost')
    ? false
    : { rejectUnauthorized: false } // Neon often works best with this, or true depending on CA availability in Vercel. 
  // 'false' allows connection without setting up the specific CA, usually safe enough for this context if transport is encrypted.
  // Given the query string has sslmode=require, this helps avoiding 'self signed certificate' errors.
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
