
import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-empty-forest-acjt0u7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: true }
});

async function restoreConstraint() {
  try {
    const client = await pool.connect();
    
    // We need to re-link inspections to new vehicle IDs based on Plate
    console.log('Relinking inspections to new vehicle IDs...');
    
    // First, set invalid veiculo_id to NULL to avoid constraint violation
    await client.query(`UPDATE vistorias SET veiculo_id = NULL`);

    await client.query(`
        UPDATE vistorias v
        SET veiculo_id = ve.id
        FROM veiculos ve
        WHERE v.placa = ve.placa
    `);
    
    console.log('Restoring Foreign Key Constraint...');
    // Only add constraint if all IDs match (they should now)
    await client.query(`
        ALTER TABLE vistorias 
        ADD CONSTRAINT vistorias_veiculo_id_fkey 
        FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
        ON DELETE SET NULL
    `);

    console.log('Done!');
    client.release();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await pool.end();
  }
}

restoreConstraint();
