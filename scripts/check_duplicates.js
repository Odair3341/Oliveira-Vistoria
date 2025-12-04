import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

async function checkDuplicates() {
  try {
    await client.connect();
    console.log('Verificando duplicatas...');

    const res = await client.query(`
      SELECT placa, COUNT(*) as qtd
      FROM vistorias
      GROUP BY placa
      HAVING COUNT(*) > 1
    `);

    if (res.rows.length > 0) {
      console.log('Placas duplicadas encontradas nas vistorias:');
      res.rows.forEach(r => console.log(`${r.placa}: ${r.qtd} vezes`));
      
      // Detalhar as duplicatas
      for (const r of res.rows) {
          const details = await client.query(`SELECT id, data_vistoria, km_rodado FROM vistorias WHERE placa = $1`, [r.placa]);
          console.log(`Detalhes para ${r.placa}:`, details.rows);
      }

    } else {
      console.log('Nenhuma duplicata encontrada.');
    }
    
    const countV = await client.query('SELECT COUNT(*) FROM veiculos');
    const countI = await client.query('SELECT COUNT(*) FROM vistorias');
    console.log(`Total Veículos: ${countV.rows[0].count}`);
    console.log(`Total Vistorias: ${countI.rows[0].count}`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkDuplicates();
