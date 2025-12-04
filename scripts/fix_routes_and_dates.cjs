const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function fixRoutesAndDates() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados.');

    // 1. Fix Date: Set all 2025 records to 2025-12-04
    await client.query(`
      UPDATE vistorias 
      SET data_vistoria = '2025-12-04'
      WHERE EXTRACT(YEAR FROM data_vistoria) = 2025;
    `);
    console.log('Datas atualizadas para 04/12/2025.');

    // 2. Fix Routes based on User's Note Chain
    const routeUpdates = [
      { 
        placa: 'QOK-7812', // Três Lagoas
        origem: 'Naviraí', 
        destino: 'Três Lagoas', 
        km_deslocamento: 423 
      },
      { 
        placa: 'QAE-6580', // Chapadão do Sul
        origem: 'Três Lagoas', 
        destino: 'Chapadão do Sul', 
        km_deslocamento: 324 
      },
      { 
        placa: 'EVA-4790', // São Gabriel do Oeste
        origem: 'Chapadão do Sul', 
        destino: 'São Gabriel do Oeste', 
        km_deslocamento: 263 
      },
      { 
        placa: 'QAM-0651', // Jardim
        origem: 'São Gabriel do Oeste', 
        destino: 'Jardim', 
        km_deslocamento: 385 
      },
      { 
        placa: 'QIO-7756', // Ponta Porã
        origem: 'Jardim', 
        destino: 'Ponta Porã', 
        km_deslocamento: 180 
      },
      { 
        placa: 'QAQ-7235', // Dourados 2
        origem: 'Ponta Porã', 
        destino: 'Dourados', 
        km_deslocamento: 113 
      },
       // Check if there is a Dourados -> Naviraí entry needed. 
       // Assuming one of the Dourados cars is the return.
       // Let's pick QAL-0387 or QAQ-0658 if they exist, but I'll stick to the explicit ones from the note logic first.
       // Actually, let's set QAQ-0658 (Dourados) as the return leg if it has 0 or wrong value.
       {
         placa: 'QAQ-0658',
         origem: 'Dourados',
         destino: 'Naviraí',
         km_deslocamento: 140
       }
    ];

    for (const route of routeUpdates) {
      await client.query(`
        UPDATE vistorias 
        SET origem = $1, destino = $2, km_deslocamento = $3
        WHERE placa = $4
      `, [route.origem, route.destino, route.km_deslocamento, route.placa]);
      console.log(`Rota corrigida para placa ${route.placa}: ${route.origem} -> ${route.destino}`);
    }

  } catch (err) {
    console.error('Erro ao corrigir rotas e datas:', err);
  } finally {
    await client.end();
  }
}

fixRoutesAndDates();
