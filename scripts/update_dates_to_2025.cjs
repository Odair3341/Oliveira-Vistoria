const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function updateDates() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados.');

    // Update all records from 2024 to 2025
    // Specifically targeting the known date 2024-11-30 -> 2025-11-29 (to match the screenshot's 29/11/2025 preference if strict)
    // The user screenshot showed 29/11/2024. If I change to 2025, it will be 29/11/2025.
    
    const query = `
      UPDATE vistorias 
      SET data_vistoria = data_vistoria + interval '1 year'
      WHERE EXTRACT(YEAR FROM data_vistoria) = 2024;
    `;

    const res = await client.query(query);
    console.log(`Atualizados ${res.rowCount} registros para o ano de 2025.`);

  } catch (err) {
    console.error('Erro ao atualizar datas:', err);
  } finally {
    await client.end();
  }
}

updateDates();
