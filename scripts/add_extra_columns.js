import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

async function addMissingColumns() {
  try {
    await client.connect();
    console.log('Adicionando colunas faltantes...');
    
    // Adicionar km_deslocamento
    await client.query("ALTER TABLE vistorias ADD COLUMN IF NOT EXISTS km_deslocamento INTEGER DEFAULT 0");
    
    // Adicionar outras que possam faltar
    await client.query("ALTER TABLE vistorias ADD COLUMN IF NOT EXISTS pedagio NUMERIC(10, 2) DEFAULT 0");
    await client.query("ALTER TABLE vistorias ADD COLUMN IF NOT EXISTS auto_avaliar NUMERIC(10, 2) DEFAULT 0");
    await client.query("ALTER TABLE vistorias ADD COLUMN IF NOT EXISTS caltelar NUMERIC(10, 2) DEFAULT 0"); // Mantendo nome do mock (typo?)
    
    console.log('Schema atualizado!');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

addMissingColumns();
