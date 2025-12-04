import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

async function verifyKm() {
  try {
    await client.connect();
    const res = await client.query("SELECT placa, km_rodado FROM vistorias WHERE placa = 'QAE-6580'");
    console.log('KM Rodado no banco para QAE-6580:', res.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

verifyKm();
