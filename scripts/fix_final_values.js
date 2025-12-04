import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

async function updateValues() {
  try {
    await client.connect();
    
    // QAE-6580 deve ser R$ 574.24
    // Taxas (217.84) + Deslocamento (324 * 1.10 = 356.40) + Pedágio (0) = 574.24
    await client.query(
      `UPDATE vistorias 
       SET valor_total = 574.24, km_deslocamento = 324, valor_km = 1.10, pedagio = 0, auto_avaliar = 108.92, caltelar = 108.92
       WHERE placa = 'QAE-6580'`
    );
    console.log('QAE-6580 atualizado para 574.24');

    // QIO-7756 deve ser R$ 415.84
    // Taxas (217.84) + Deslocamento (180 * 1.10 = 198.00) + Pedágio (0) = 415.84
    await client.query(
      `UPDATE vistorias 
       SET valor_total = 415.84, km_deslocamento = 180, valor_km = 1.10, pedagio = 0, auto_avaliar = 108.92, caltelar = 108.92
       WHERE placa = 'QIO-7756'`
    );
    console.log('QIO-7756 atualizado para 415.84');

    // QAQ-7235 deve ser R$ 342.14
    // Taxas (217.84) + Deslocamento (113 * 1.10 = 124.30) + Pedágio (0) = 342.14
    await client.query(
      `UPDATE vistorias 
       SET valor_total = 342.14, km_deslocamento = 113, valor_km = 1.10, pedagio = 0, auto_avaliar = 108.92, caltelar = 108.92
       WHERE placa = 'QAQ-7235'`
    );
    console.log('QAQ-7235 atualizado para 342.14');

    // EVA-4790 deve ser R$ 507.14
    // Taxas (217.84) + Deslocamento (263 * 1.10 = 289.30) + Pedágio (0) = 507.14
    await client.query(
      `UPDATE vistorias 
       SET valor_total = 507.14, km_deslocamento = 263, valor_km = 1.10, pedagio = 0, auto_avaliar = 108.92, caltelar = 108.92
       WHERE placa = 'EVA-4790'`
    );
    console.log('EVA-4790 atualizado para 507.14');

     // QAM-0651 deve ser R$ 641.34
    // Taxas (217.84) + Deslocamento (385 * 1.10 = 423.50) + Pedágio (0) = 641.34
    await client.query(
      `UPDATE vistorias 
       SET valor_total = 641.34, km_deslocamento = 385, valor_km = 1.10, pedagio = 0, auto_avaliar = 108.92, caltelar = 108.92
       WHERE placa = 'QAM-0651'`
    );
    console.log('QAM-0651 atualizado para 641.34');

     // QOK-7812 deve ser R$ 683.14
    // Taxas (217.84) + Deslocamento (423 * 1.10 = 465.30) + Pedágio (0) = 683.14
    await client.query(
      `UPDATE vistorias 
       SET valor_total = 683.14, km_deslocamento = 423, valor_km = 1.10, pedagio = 0, auto_avaliar = 108.92, caltelar = 108.92
       WHERE placa = 'QOK-7812'`
    );
    console.log('QOK-7812 atualizado para 683.14');


  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

updateValues();
