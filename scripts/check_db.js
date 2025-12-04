import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({
  connectionString,
});

async function checkDb() {
  try {
    await client.connect();
    console.log('Conectado com sucesso!');
    
    // Listar tabelas
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tabelas encontradas:', res.rows.map(r => r.table_name));

    // Contar registros em cada tabela
    for (const row of res.rows) {
        const tableName = row.table_name;
        const countRes = await client.query(`SELECT COUNT(*) FROM "${tableName}"`);
        console.log(`Tabela ${tableName}: ${countRes.rows[0].count} registros`);
    }

  } catch (err) {
    console.error('Erro de conexão:', err);
  } finally {
    await client.end();
  }
}

checkDb();
