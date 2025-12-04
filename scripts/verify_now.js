import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

async function verifyData() {
  try {
    await client.connect();
    console.log('--- VERIFICAÇÃO DE DADOS NO BANCO NEON ---');
    
    const tables = ['filiais', 'usuarios', 'veiculos', 'vistorias'];
    let totalRecords = 0;

    for (const table of tables) {
        const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(res.rows[0].count);
        console.log(`Tabela '${table}': ${count} registros.`);
        totalRecords += count;
        
        if (count > 0) {
            const sample = await client.query(`SELECT * FROM ${table} LIMIT 1`);
            console.log(`   Exemplo de registro em '${table}':`, JSON.stringify(sample.rows[0]).substring(0, 100) + '...');
        }
    }
    
    if (totalRecords === 0) {
        console.log('\nALERTA: O banco está VAZIO! O seed não persistiu ou foi apagado.');
    } else {
        console.log('\nSUCESSO: O banco contém dados. O problema de "tela zerada" deve ser no Frontend/API.');
    }

  } catch (err) {
    console.error('Erro ao conectar:', err);
  } finally {
    await client.end();
  }
}

verifyData();
