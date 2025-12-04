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

async function checkInspection() {
  try {
    const client = await pool.connect();
    // Checking QJY-3266 as per screenshot
    const res = await client.query("SELECT * FROM vistorias WHERE placa = 'QJY-3266'");
    console.log('Inspection Data for QJY-3266:', res.rows[0]);
    
    if (res.rows.length > 0) {
        console.log('Filial no DB:', res.rows[0].filial_nome);
        console.log('Empresa no DB:', res.rows[0].empresa);
    } else {
        console.log('Nenhuma vistoria encontrada para QJY-3266');
    }
    
    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkInspection();
