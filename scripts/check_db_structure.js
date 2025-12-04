import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

async function check() {
  try {
    await client.connect();
    console.log('Verificando estrutura da tabela vistorias...');
    
    // Listar colunas
    const resCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vistorias'
    `);
    
    console.log('Colunas encontradas:');
    resCols.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`));

    // Pegar um registro de exemplo
    const resRows = await client.query('SELECT * FROM vistorias LIMIT 1');
    console.log('\nRegistro de exemplo:', resRows.rows[0]);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();
