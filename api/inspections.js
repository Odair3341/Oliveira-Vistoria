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
        veiculoId, responsavel, dataVistoria, status, observacoes, items, 
        placa, modelo, marca, kmRodado, filial, empresa, ano 
      } = req.body;
      
      // Tentar mapear usuário se for UUID
      let usuarioId = null;
      if (responsavel && typeof responsavel === 'string' && responsavel.length > 30) {
         // Assumindo que se for longo é UUID, se curto é nome. 
         // Na verdade, o ideal é validar UUID.
         usuarioId = responsavel; 
      }

      const result = await query(
        `INSERT INTO vistorias (
            veiculo_id, usuario_id, data_vistoria, status, observacoes, items, 
            placa, modelo, marca, km_rodado, filial_nome, empresa, ano_veiculo, valor_total
         ) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0) RETURNING *`,
        [
          veiculoId, usuarioId, dataVistoria, status, observacoes, JSON.stringify(items), 
          placa, modelo, marca, kmRodado || 0, filial, empresa, ano
        ]
      );
      
      const row = result.rows[0];
      // Retornar objeto mapeado
      return res.status(201).json({
        id: row.id,
        placa: row.placa,
        kmRodado: row.km_rodado,
        status: row.status,
        // ... outros campos simplificados para a resposta de criação
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
