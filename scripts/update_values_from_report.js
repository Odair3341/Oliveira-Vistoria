import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

// Valores exatos do relatório PDF
const correctValues = [
  { placa: 'QAE-6580', total: 574.24 },
  { placa: 'QAM-0651', total: 641.34 },
  { placa: 'QAM-6763', total: 217.84 },
  { placa: 'BBT-5H62', total: 217.84 },
  { placa: 'QAH-5183', total: 217.84 },
  { placa: 'QIO-7756', total: 415.84 },
  { placa: 'QIQ-1024', total: 217.84 },
  { placa: 'QAQ-7235', total: 342.14 },
  { placa: 'EVA-4790', total: 507.14 },
  { placa: 'ETE-0314', total: 217.84 },
  { placa: 'QTM-3A04', total: 217.84 },
  { placa: 'QJY-3266', total: 217.84 },
  { placa: 'RAG-4166', total: 217.84 },
  { placa: 'QOK-7812', total: 683.14 },
  { placa: 'RMG-3I67', total: 217.84 },
  { placa: 'QAQ-0658', total: 217.84 },
  { placa: 'QAM-6764', total: 217.84 },
  { placa: 'QAL-0387', total: 218.16 }
];

async function updateValues() {
  try {
    await client.connect();
    console.log('Atualizando valores das vistorias no Neon...');

    let updatedCount = 0;

    for (const item of correctValues) {
        // A coluna no banco é 'valor_total' e 'total' (dependendo do schema).
        // No script de seed usamos 'total' na query, mas o banco pode ter criado 'valor_total'.
        // Vamos tentar atualizar 'total' (nome da coluna no INSERT foi total).
        // Ah, o erro anterior disse que "column 'total' does not exist".
        // Olhando o seed_full.js: 
        // INSERT INTO vistorias (... valor_total ...) VALUES ...
        // Então a coluna é valor_total.
        
        const res = await client.query(
            `UPDATE vistorias SET valor_total = $1 WHERE placa = $2 RETURNING id`,
            [item.total, item.placa]
        );
        
        if (res.rowCount > 0) {
            console.log(`Placa ${item.placa} atualizada para R$ ${item.total}`);
            updatedCount++;
        } else {
            console.warn(`AVISO: Placa ${item.placa} não encontrada no banco!`);
        }
    }

    console.log(`\nProcesso finalizado. ${updatedCount} vistorias atualizadas.`);
    
    // Verificar soma total
    const resSum = await client.query('SELECT SUM(valor_total) as total_sum FROM vistorias');
    console.log(`Nova soma total no banco: R$ ${resSum.rows[0].total_sum}`);
    console.log(`Soma esperada (PDF): R$ 5.778,24`);

  } catch (err) {
    console.error('Erro ao atualizar:', err);
  } finally {
    await client.end();
  }
}

updateValues();
