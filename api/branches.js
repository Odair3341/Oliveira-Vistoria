import query from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM filiais ORDER BY nome');
      
      // Mapear para o formato do frontend se necessário
      const mapped = result.rows.map(row => ({
        id: row.id,
        nome: row.nome,
        cidade: row.cidade,
        estado: row.estado,
        empresa: row.empresa || '',
        gestor: row.gestor_nome, // Mapping gestor_nome -> gestor
        telefone: row.telefone,
        endereco: row.endereco,
        status: 'ativa' // Default, já que não tem status no banco ainda? (vou assumir ativa)
      }));

      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const { nome, cidade, estado, empresa, gestor, telefone, endereco, status } = req.body;
      const result = await query(
        `INSERT INTO filiais (nome, cidade, estado, empresa, gestor_nome, telefone, endereco) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [nome, cidade, estado, empresa, gestor, telefone, endereco]
      );
      
      const row = result.rows[0];
      return res.status(201).json({
        id: row.id,
        nome: row.nome,
        cidade: row.cidade,
        estado: row.estado,
        empresa: row.empresa,
        gestor: row.gestor_nome,
        telefone: row.telefone,
        endereco: row.endereco,
        status: 'ativa'
      });
    }
    
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
