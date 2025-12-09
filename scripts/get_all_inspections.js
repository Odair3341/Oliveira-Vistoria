import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Load env manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
let connectionString = process.env.DATABASE_URL;

if (!connectionString && fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  const match = envConfig.match(/DATABASE_URL="?([^"\n]+)"?/);
  if (match) connectionString = match[1];
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function getAllInspections() {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT * FROM vistorias ORDER BY data_vistoria DESC");
    
    const formatted = res.rows.map(row => ({
        id: row.id,
        qtd: 1,
        placa: row.placa,
        kmRodado: Number(row.km_rodado) || 0,
        kmDeslocamento: Number(row.km_deslocamento) || 0,
        valorKm: Number(row.valor_km) || 0,
        ano: row.ano_veiculo,
        modelo: row.modelo,
        marca: row.marca,
        filial: row.filial_nome,
        empresa: row.empresa,
        estado: row.estado_uf,
        origem: row.origem || '',
        destino: row.destino || '',
        autoAvaliar: Number(row.auto_avaliar) || 0,
        caltelar: Number(row.caltelar) || 0,
        pedagio: Number(row.pedagio) || 0,
        total: Number(row.valor_total) || 0,
        dataVistoria: row.data_vistoria ? new Date(row.data_vistoria).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: row.status,
        veiculoId: row.veiculo_id,
        items: row.items || []
    }));

    console.log(JSON.stringify(formatted, null, 2));
    
    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

getAllInspections();