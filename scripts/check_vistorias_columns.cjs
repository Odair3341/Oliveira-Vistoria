
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-empty-forest-acjt0u7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkColumns() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vistorias'
      ORDER BY column_name;
    `);
    console.log('Columns in vistorias table:');
    res.rows.forEach(row => {
      console.log(`${row.column_name} (${row.data_type})`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

checkColumns();
