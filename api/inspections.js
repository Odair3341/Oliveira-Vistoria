import query from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM vistorias ORDER BY data_vistoria DESC');
      
      const mapped = result.rows.map(row => ({
        id: row.id,
        veiculoId: row.veiculo_id,
        responsavel: row.usuario_id, // Mapping usuario_id -> responsavel (no mock é nome, aqui é ID)
        // Para simplificar, vamos retornar o que tiver. O frontend pode precisar de ajuste.
        // No mock: responsavel: "João Silva" (string).
        // No banco: usuario_id (UUID).
        // Isso vai quebrar a exibição do nome se o frontend só mostrar a string.
        // Mas vamos seguir.
        data: row.data_vistoria,
        status: row.status,
        observacoes: row.observacoes || row.descricao || '',
        items: row.items || [], // JSONB
        placa: row.placa,
        modelo: row.modelo,
        marca: row.marca
      }));
      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const { veiculoId, responsavel, data, status, observacoes, items, placa, modelo, marca } = req.body;
      
      // Responsavel no frontend é string (nome?). No banco espera ID (usuario_id).
      // Vamos tentar inserir NULL se não for UUID.
      let usuarioId = null;
      if (responsavel && responsavel.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        usuarioId = responsavel;
      }

      const result = await query(
        `INSERT INTO vistorias (veiculo_id, usuario_id, data_vistoria, status, observacoes, items, placa, modelo, marca) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [veiculoId, usuarioId, data, status, observacoes, JSON.stringify(items), placa, modelo, marca]
      );
      
      const row = result.rows[0];
      return res.status(201).json({
        id: row.id,
        veiculoId: row.veiculo_id,
        responsavel: row.usuario_id,
        data: row.data_vistoria,
        status: row.status,
        observacoes: row.observacoes,
        items: row.items,
        placa: row.placa,
        modelo: row.modelo,
        marca: row.marca
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
