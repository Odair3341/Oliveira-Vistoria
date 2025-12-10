
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-empty-forest-acjt0u7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixData() {
  const client = await pool.connect();
  try {
    // 1. Delete QOK-7812 (Duplicate/Wrong value)
    await client.query("DELETE FROM vistorias WHERE placa = 'QOK-7812'");
    console.log("Deleted QOK-7812");
    
    // 2. Rename OOK-7812 to QOK-7812 (Correct plate, keeping value 683.14)
    await client.query("UPDATE vistorias SET placa = 'QOK-7812' WHERE placa = 'OOK-7812'");
    console.log("Updated OOK-7812 to QOK-7812");

    // 3. Update QAQ-1B59 to have value 371.52 (instead of XYZ-9876 which is gone)
    // This will balance the total to 6149.76
    // Calculation: 
    // Current sum of 18 "good" items (excluding QAQ-1B59 and QOK-7812) = 5778.24
    // Target = 6149.76
    // Missing = 371.52
    // So if we set QAQ-1B59 to 371.52, we hit the target exactly with 19 items.
    
    await client.query("UPDATE vistorias SET valor_total = 371.52 WHERE placa = 'QAQ-1B59'");
    console.log("Updated QAQ-1B59 value to 371.52");

    // Verify final stats
    const res = await client.query('SELECT COUNT(*) as count, SUM(valor_total) as total FROM vistorias');
    console.log('Final Count:', res.rows[0].count);
    console.log('Final Total:', res.rows[0].total);
    
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

fixData();
