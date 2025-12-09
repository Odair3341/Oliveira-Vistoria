import pg from 'pg';
import dotenv from 'dotenv';

// Load .env file for scripts
dotenv.config();

const { Pool } = pg;

// Log to check if DATABASE_URL is loaded
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL is set. Starts with:', process.env.DATABASE_URL.substring(0, 30));
} else {
  console.error('DATABASE_URL is NOT set.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false,
  },
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
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
