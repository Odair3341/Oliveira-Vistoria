import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

async function updateSchema() {
  try {
    await client.connect();
    console.log('Conectado para atualização de schema...');

    // Veiculos
    await client.query("ALTER TABLE veiculos ADD COLUMN IF NOT EXISTS km INTEGER DEFAULT 0");
    await client.query("ALTER TABLE veiculos ADD COLUMN IF NOT EXISTS tipo VARCHAR(50) DEFAULT 'Carro'");
    
    // Filiais
    await client.query("ALTER TABLE filiais ADD COLUMN IF NOT EXISTS empresa VARCHAR(255)");

    // Vistorias
    await client.query("ALTER TABLE vistorias ADD COLUMN IF NOT EXISTS items JSONB");
    await client.query("ALTER TABLE vistorias ADD COLUMN IF NOT EXISTS observacoes TEXT");

    console.log('Schema atualizado com sucesso!');

  } catch (err) {
    console.error('Erro ao atualizar schema:', err);
  } finally {
    await client.end();
  }
}

updateSchema();
