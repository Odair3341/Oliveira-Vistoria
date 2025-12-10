
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-empty-forest-acjt0u7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updateInspection() {
  const client = await pool.connect();
  try {
    // Check current state of XYZ-9876
    const res = await client.query("SELECT * FROM vistorias WHERE placa = 'XYZ-9876'");
    if (res.rowCount === 0) {
      console.log('XYZ-9876 not found!');
      return;
    }
    
    const inspection = res.rows[0];
    console.log('Current XYZ-9876:', inspection);
    
    if (!inspection.veiculo_id) {
        console.log('XYZ-9876 is an orphan (no veiculo_id).');
        // We might need to assign it to a vehicle or create one?
        // But for now, let's just update the value.
    }

    // Update value to 371.52
    const updateRes = await client.query(
      "UPDATE vistorias SET valor_total = 371.52 WHERE placa = 'XYZ-9876'"
    );
    console.log('Updated rows:', updateRes.rowCount);
    
    // Verify new total
    const totalRes = await client.query('SELECT SUM(valor_total) as total FROM vistorias');
    console.log('New Total Value:', totalRes.rows[0].total);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

updateInspection();
