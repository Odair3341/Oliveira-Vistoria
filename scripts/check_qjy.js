import query from '../api/db.js';

async function checkInspection() {
  try {
    const result = await query("SELECT id, placa, origem, destino, km_deslocamento, valor_km, valor_total FROM vistorias WHERE placa = 'QJY-3266'");
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkInspection();
