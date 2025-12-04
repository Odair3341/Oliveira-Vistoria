import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

async function fixDetails() {
  try {
    await client.connect();
    console.log('Corrigindo detalhes das vistorias...');

    // Buscar todas as vistorias
    const res = await client.query('SELECT id, placa, valor_total FROM vistorias');
    
    for (const row of res.rows) {
      const total = parseFloat(row.valor_total);
      
      let autoAvaliar = 108.92;
      let caltelar = 108.92;
      let taxas = autoAvaliar + caltelar; // 217.84
      
      let valorKm = 0;
      let kmDeslocamento = 0;
      let pedagio = 0;

      if (total < taxas) {
        // Se o total for menor que as taxas padrão, ajusta proporcionalmente ou zera
        if (total > 0) {
            autoAvaliar = total / 2;
            caltelar = total / 2;
        } else {
            autoAvaliar = 0;
            caltelar = 0;
        }
      } else {
        // Sobra para deslocamento/pedágio
        const diff = total - taxas;
        
        if (diff > 0.01) {
           // Tentar usar valor por km = 2.00
           valorKm = 2.00;
           kmDeslocamento = Math.floor(diff / valorKm);
           const custoKm = kmDeslocamento * valorKm;
           
           // O que sobrar vai para pedágio
           pedagio = diff - custoKm;
        }
      }

      // Arredondar valores para 2 casas decimais para evitar problemas de float
      pedagio = Math.round(pedagio * 100) / 100;
      autoAvaliar = Math.round(autoAvaliar * 100) / 100;
      caltelar = Math.round(caltelar * 100) / 100;

      await client.query(
        `UPDATE vistorias 
         SET auto_avaliar = $1, caltelar = $2, valor_km = $3, km_deslocamento = $4, pedagio = $5
         WHERE id = $6`,
        [autoAvaliar, caltelar, valorKm, kmDeslocamento, pedagio, row.id]
      );
      
      console.log(`Placa ${row.placa}: Total ${total} -> Taxas ${autoAvaliar+caltelar} + Km ${kmDeslocamento}x${valorKm} + Pedágio ${pedagio}`);
    }

    console.log('Correção concluída!');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

fixDetails();
