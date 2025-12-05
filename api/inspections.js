import query from './db.js';

export default async function handler(req, res) {
  try {
    const mapRow = (row) => ({
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
    });

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const result = await query('SELECT * FROM vistorias ORDER BY data_vistoria DESC');
      
      const mapped = result.rows.map(row => ({
      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      // Extrair campos camelCase do body
      let { 
        veiculoId, responsavel, dataVistoria, status, observacoes, items, 
        placa, modelo, marca, kmRodado, filial, empresa, ano,
        origem, destino, kmDeslocamento, valorKm, pedagio, autoAvaliar, caltelar, total
      } = req.body;
      
      // Tentar mapear usuário se for UUID
      let usuarioId = null;
      if (responsavel && typeof responsavel === 'string' && responsavel.length > 30) {
         usuarioId = responsavel; 
      }

      // Lógica para garantir veiculoId
      if (!veiculoId && placa) {
          const findVehicle = await query('SELECT id FROM veiculos WHERE placa = $1', [placa]);
          if (findVehicle.rows.length > 0) {
              veiculoId = findVehicle.rows[0].id;
          } else {
              console.log(`Veículo não encontrado para placa ${placa}. Criando novo...`);
              const createVehicle = await query(
                  `INSERT INTO veiculos (placa, marca, modelo, ano, km, status) 
                   VALUES ($1, $2, $3, $4, $5, 'ativo') RETURNING id`,
                  [placa, marca || 'N/A', modelo || 'N/A', ano || new Date().getFullYear(), kmRodado || 0]
              );
              veiculoId = createVehicle.rows[0].id;
          }
      }

      const result = await query(
        `INSERT INTO vistorias (
            veiculo_id, usuario_id, data_vistoria, status, observacoes, items, 
            placa, modelo, marca, km_rodado, filial_nome, empresa, ano_veiculo, 
            origem, destino, km_deslocamento, valor_km, pedagio, auto_avaliar, caltelar, valor_total
         ) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
        [
          veiculoId, usuarioId, dataVistoria, status, observacoes, JSON.stringify(items), 
          placa, modelo, marca, kmRodado || 0, filial, empresa, ano,
          origem || '', destino || '', kmDeslocamento || 0, valorKm || 0, pedagio || 0, autoAvaliar || 0, caltelar || 0, total || 0
        ]
      );
      
      return res.status(201).json(mapRow(result.rows[0]));
    }

    if (req.method === 'PUT') {
        const { 
            id, veiculoId, responsavel, dataVistoria, status, observacoes, items, 
            placa, modelo, marca, kmRodado, filial, empresa, ano,
            origem, destino, kmDeslocamento, valorKm, pedagio, autoAvaliar, caltelar, total
        } = req.body;

        console.log('PUT request received for ID:', id);

        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const result = await query(
            `UPDATE vistorias SET 
                placa = $1, 
                modelo = $2, 
                marca = $3, 
                km_rodado = $4, 
                filial_nome = $5, 
                empresa = $6, 
                ano_veiculo = $7,
                origem = $8,
                destino = $9,
                km_deslocamento = $10,
                valor_km = $11,
                pedagio = $12,
                auto_avaliar = $13,
                caltelar = $14,
                valor_total = $15,
                status = $16,
                data_vistoria = $17
             WHERE id = $18 RETURNING *`,
            [
                placa, modelo, marca, kmRodado || 0, filial, empresa, ano, 
                origem || '', destino || '', kmDeslocamento || 0, valorKm || 0, pedagio || 0, 
                autoAvaliar || 0, caltelar || 0, total || 0, status, dataVistoria,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inspection not found' });
        }

        return res.status(200).json(mapRow(result.rows[0]));
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        const targetId = id || req.body.id;

        if (!targetId) {
            return res.status(400).json({ error: 'ID is required for deletion' });
        }

        console.log('DELETE request for ID:', targetId);

        const result = await query('DELETE FROM vistorias WHERE id = $1 RETURNING id', [targetId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Inspection not found' });
        }

        return res.status(200).json({ message: 'Inspection deleted successfully', id: targetId });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
