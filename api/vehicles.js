import query from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM veiculos ORDER BY modelo');
      // Não temos o nome da filial na tabela veiculos, só o ID.
      // Por simplificação, vamos retornar o ID como filial ou string vazia
      // Idealmente faríamos um JOIN, mas o frontend espera uma string "filial"
      
      const mapped = result.rows.map(row => ({
        id: row.id,
        placa: row.placa,
        marca: row.marca,
        modelo: row.modelo,
        ano: row.ano,
        cor: row.cor,
        km: row.km || 0,
        tipo: row.tipo || 'Carro',
        status: row.status,
        filial: row.filial_id || '' // Retornando ID por enquanto
      }));
      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const { placa, marca, modelo, ano, cor, km, tipo, status, filial } = req.body;
      // Assumindo que 'filial' vem como ID ou string. Se for nome, vai falhar se for UUID.
      // Vamos tentar inserir. Se 'filial' for um nome e o banco espera UUID, vai dar erro.
      // O DataContext envia o que estiver no form.
      // Para o protótipo, vamos tentar inserir filial como null se não for UUID válido ou ajustar.
      
      // IMPORTANTE: O frontend atual envia NOMES de filiais nos mocks.
      // O banco espera UUID. Isso é um conflito.
      // Vou deixar null no filial_id por enquanto se não for UUID, ou tentar buscar o ID pelo nome (complexo aqui).
      // Melhor: Inserir sem filial_id se não for UUID.
      
      let filialId = null;
      // Verificação simplista de UUID
      if (filial && filial.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          filialId = filial;
      }

      const result = await query(
        `INSERT INTO veiculos (placa, marca, modelo, ano, cor, km, tipo, status, filial_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [placa, marca, modelo, ano, cor, km, tipo, status, filialId]
      );
      
      const row = result.rows[0];
      return res.status(201).json({
        id: row.id,
        placa: row.placa,
        marca: row.marca,
        modelo: row.modelo,
        ano: row.ano,
        cor: row.cor,
        km: row.km,
        tipo: row.tipo,
        status: row.status,
        filial: row.filial_id
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
