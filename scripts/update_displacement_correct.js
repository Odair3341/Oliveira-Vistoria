import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

const updates = [
  { placa: 'QOK-7812', km: 423, rate: 1.10 }, // Três Lagoas
  { placa: 'QAE-6580', km: 324, rate: 1.10 }, // Chapadão do Sul
  { placa: 'EVA-4790', km: 263, rate: 1.10 }, // São Gabriel do Oeste
  { placa: 'QAM-0651', km: 385, rate: 1.10 }, // Jardim
  { placa: 'QIO-7756', km: 180, rate: 1.10 }, // Ponta Porã
  { placa: 'QAQ-7235', km: 113, rate: 1.10 }, // Dourados
];

async function updateDisplacement() {
  try {
    await client.connect();
    console.log('Atualizando KM de deslocamento e taxa de 1.10...');

    for (const item of updates) {
      // Calcular novo pedágio (deve ser zero se a conta bater exata, mas vamos garantir)
      // Total = Taxas(217.84) + (Km * Rate) + Pedagio
      // Pedagio = Total - 217.84 - (Km * Rate)
      
      const res = await client.query('SELECT valor_total FROM vistorias WHERE placa = $1', [item.placa]);
      
      if (res.rows.length > 0) {
          const total = parseFloat(res.rows[0].valor_total);
          const taxas = 217.84;
          const deslocamento = item.km * item.rate;
          
          let pedagio = total - taxas - deslocamento;
          // Arredondar para evitar flutuação
          pedagio = Math.round(pedagio * 100) / 100;
          
          if (Math.abs(pedagio) < 0.05) pedagio = 0;

          await client.query(
            `UPDATE vistorias 
             SET km_deslocamento = $1, valor_km = $2, pedagio = $3, auto_avaliar = 108.92, caltelar = 108.92
             WHERE placa = $4`,
            [item.km, item.rate, pedagio, item.placa]
          );
          
          console.log(`Placa ${item.placa}: KM Desloc. ${item.km} | Rate ${item.rate} | Pedágio ${pedagio} | Total ${total}`);
      } else {
          console.warn(`Placa ${item.placa} não encontrada.`);
      }
    }

    console.log('Atualização concluída!');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

updateDisplacement();
