
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-empty-forest-acjt0u7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkInspections() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT id, placa, valor_total FROM vistorias ORDER BY created_at');
    console.log('Count:', res.rows.length);
    console.log('Inspections:', JSON.stringify(res.rows, null, 2));
    
    const totalRes = await client.query('SELECT SUM(valor_total) as total FROM vistorias');
    console.log('Total Value:', totalRes.rows[0].total);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

checkInspections();
