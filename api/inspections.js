import query from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM vistorias ORDER BY data_vistoria DESC');
      
      const mapped = result.rows.map(row => ({
        id: row.id,
        qtd: 1, // Default
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
        autoAvaliar: Number(row.auto_avaliar) || 0,
        caltelar: Number(row.caltelar) || 0,
        pedagio: Number(row.pedagio) || 0,
        total: Number(row.valor_total) || 0,
        dataVistoria: row.data_vistoria ? new Date(row.data_vistoria).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: row.status,
        veiculoId: row.veiculo_id,
        items: row.items || []
      }));
      
      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      // Extrair campos camelCase do body
      const { 
        id, // Para update
        veiculoId, responsavel, dataVistoria, status, observacoes, items, 
        placa, modelo, marca, kmRodado, filial, empresa, ano,
        kmDeslocamento, valorKm, pedagio, autoAvaliar, caltelar, total
      } = req.body;

      // Se tiver ID, é update
      if (id) {
         await query(
            `UPDATE vistorias 
             SET km_rodado = $1, km_deslocamento = $2, valor_km = $3, pedagio = $4, 
                 auto_avaliar = $5, caltelar = $6, valor_total = $7, 
                 placa = $8, modelo = $9, marca = $10, ano_veiculo = $11,
                 filial_nome = $12, empresa = $13, status = $14
             WHERE id = $15`,
            [
                kmRodado || 0, kmDeslocamento || 0, valorKm || 0, pedagio || 0,
                autoAvaliar || 0, caltelar || 0, total || 0,
                placa, modelo, marca, ano,
                filial, empresa, status,
                id
            ]
         );
         return res.status(200).json({ success: true });
      }
      
      // Tentar mapear usuário se for UUID
      let usuarioId = null;
      if (responsavel && typeof responsavel === 'string' && responsavel.length > 30) {
         usuarioId = responsavel; 
      }

      const result = await query(
        `INSERT INTO vistorias (
            veiculo_id, usuario_id, data_vistoria, status, observacoes, items, 
            placa, modelo, marca, km_rodado, filial_nome, empresa, ano_veiculo, valor_total,
            km_deslocamento, valor_km, pedagio, auto_avaliar, caltelar
         ) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
        [
          veiculoId, usuarioId, dataVistoria, status, observacoes, JSON.stringify(items), 
          placa, modelo, marca, kmRodado || 0, filial, empresa, ano, total || 0,
          kmDeslocamento || 0, valorKm || 0, pedagio || 0, autoAvaliar || 0, caltelar || 0
        ]
      );
      
      const row = result.rows[0];
      return res.status(201).json({
        id: row.id,
        placa: row.placa,
        kmRodado: row.km_rodado,
        status: row.status,
      });
    }

    if (req.method === 'PUT') {
         const { 
            id, 
            placa, modelo, marca, kmRodado, filial, empresa, ano, status,
            kmDeslocamento, valorKm, pedagio, autoAvaliar, caltelar, total
          } = req.body;

         await query(
            `UPDATE vistorias 
             SET km_rodado = $1, km_deslocamento = $2, valor_km = $3, pedagio = $4, 
                 auto_avaliar = $5, caltelar = $6, valor_total = $7, 
                 placa = $8, modelo = $9, marca = $10, ano_veiculo = $11,
                 filial_nome = $12, empresa = $13, status = $14
             WHERE id = $15`,
            [
                kmRodado || 0, kmDeslocamento || 0, valorKm || 0, pedagio || 0,
                autoAvaliar || 0, caltelar || 0, total || 0,
                placa, modelo, marca, ano,
                filial, empresa, status,
                id
            ]
         );
         return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
