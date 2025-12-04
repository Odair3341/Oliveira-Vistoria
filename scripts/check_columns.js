import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

async function checkColumns() {
  try {
    await client.connect();
    
    const tables = ['veiculos', 'usuarios', 'filiais', 'vistorias'];
    
    for (const table of tables) {
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = '${table}'
        `);
        console.log(`\nColunas em ${table}:`);
        res.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkColumns();
