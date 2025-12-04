const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function backfillRoutes() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados.');

    const res = await client.query('SELECT id, filial_nome, origem, destino FROM vistorias');
    const inspections = res.rows;

    console.log(`Encontradas ${inspections.length} vistorias.`);

    for (const insp of inspections) {
      // Lógica de backfill
      // Se origem já existe, pula
      if (insp.origem && insp.destino) continue;

      let origem = 'Naviraí';
      let destino = insp.filial_nome || 'Naviraí';

      // Se a filial for Naviraí, origem e destino são Naviraí
      if (destino === 'Naviraí') {
          origem = 'Naviraí';
      }
      
      // Se já tem um dos dois, preserva? 
      // Simplificação: sobrescreve se estiver nulo/vazio
      
      await client.query(
        `UPDATE vistorias SET origem = $1, destino = $2 WHERE id = $3`,
        [origem, destino, insp.id]
      );
      
      console.log(`Atualizado ID ${insp.id}: ${origem} -> ${destino}`);
    }

    console.log('Backfill concluído.');
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    await client.end();
  }
}

backfillRoutes();
