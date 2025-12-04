import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

async function check() {
  try {
    await client.connect();
    const res = await client.query("SELECT * FROM vistorias WHERE placa = 'QIO-7756'");
    console.log(res.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();
