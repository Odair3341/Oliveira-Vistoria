import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

async function removeDuplicate() {
  try {
    await client.connect();
    console.log('Removendo duplicata da placa QIO-7756...');

    // 1. Identificar IDs das vistorias duplicadas
    const res = await client.query(`
      SELECT id, km_rodado, created_at 
      FROM vistorias 
      WHERE placa = 'QIO-7756' 
      ORDER BY created_at DESC
    `);

    if (res.rows.length > 1) {
        console.log('Encontradas duplicatas:', res.rows);
        // Manter a primeira (mais recente ou com dados mais corretos?)
        // A lista do usuário tinha km 127264. A outra tinha 160002.
        // Na lista colada pelo usuário: QIO-7756 127264
        // Então vamos manter a que tem 127264 e apagar as outras.
        
        const keepKm = 127264;
        const toDelete = res.rows.filter(r => r.km_rodado !== keepKm);
        
        for (const row of toDelete) {
            await client.query('DELETE FROM vistorias WHERE id = $1', [row.id]);
            console.log(`Vistoria deletada: ${row.id} (KM ${row.km_rodado})`);
        }

        // Verificar se há duplicidade em VEÍCULOS também (caso a constraint não existisse)
        const resV = await client.query(`SELECT id FROM veiculos WHERE placa = 'QIO-7756'`);
        if (resV.rows.length > 1) {
            console.log('Veículos duplicados encontrados. Limpando...');
            // Deletar todos menos o primeiro
            const [keep, ...remove] = resV.rows;
            for (const r of remove) {
                // Precisa atualizar vistorias antes de deletar veículo se houver FK
                // Mas como acabamos de limpar vistorias duplicadas, talvez ok.
                // Melhor garantir que a vistoria restante aponte para o veículo que fica.
                await client.query('UPDATE vistorias SET veiculo_id = $1 WHERE placa = $2', [keep.id, 'QIO-7756']);
                await client.query('DELETE FROM veiculos WHERE id = $1', [r.id]);
                console.log(`Veículo deletado: ${r.id}`);
            }
        }

    } else {
        console.log('Nenhuma duplicata encontrada para QIO-7756.');
    }

    const count = await client.query('SELECT COUNT(*) FROM vistorias');
    console.log(`Total atual de vistorias: ${count.rows[0].count}`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

removeDuplicate();
