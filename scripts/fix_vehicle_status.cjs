const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function fixVehicleStatus() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados.');

    // Update BBT-5H62 from 'manutencao' to 'ativo'
    await client.query(`
      UPDATE veiculos 
      SET status = 'ativo'
      WHERE placa = 'BBT-5H62'
    `);
    console.log('Status do veículo BBT-5H62 atualizado para "ativo".');

  } catch (err) {
    console.error('Erro ao atualizar status do veículo:', err);
  } finally {
    await client.end();
  }
}

fixVehicleStatus();
