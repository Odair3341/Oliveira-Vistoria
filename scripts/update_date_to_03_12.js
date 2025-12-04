import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Load env manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
let connectionString = process.env.DATABASE_URL;

if (!connectionString && fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  const match = envConfig.match(/DATABASE_URL="?([^"\n]+)"?/);
  if (match) connectionString = match[1];
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function updateDates() {
  try {
    const client = await pool.connect();
    
    // Set all inspection dates to 2025-12-03
    const query = "UPDATE vistorias SET data_vistoria = '2025-12-03'";
    const res = await client.query(query);
    
    console.log(`Updated ${res.rowCount} rows to 2025-12-03`);
    
    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

updateDates();
