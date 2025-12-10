import query from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM usuarios ORDER BY nome');
      const mapped = result.rows.map(row => ({
        id: row.id,
        nome: row.nome,
        email: row.email,
        cargo: row.cargo,
        departamento: row.departamento,
        filial: row.filial_nome, // Mapping
        status: row.status,
        ultimoAcesso: row.ultimo_acesso // Mapping
      }));
      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const { nome, email, cargo, departamento, filial, status } = req.body;
      const result = await query(
        `INSERT INTO usuarios (nome, email, cargo, departamento, filial_nome, status, ultimo_acesso) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
        [nome, email, cargo, departamento, filial, status]
      );
      const row = result.rows[0];
      return res.status(201).json({
        id: row.id,
        nome: row.nome,
        email: row.email,
        cargo: row.cargo,
        departamento: row.departamento,
        filial: row.filial_nome,
        status: row.status,
        ultimoAcesso: row.ultimo_acesso
      });
    }

    if (req.method === 'PUT') {
      const { id, nome, email, cargo, departamento, filial, status } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const result = await query(
        `UPDATE usuarios SET 
           nome = $1, 
           email = $2, 
           cargo = $3, 
           departamento = $4, 
           filial_nome = $5, 
           status = $6 
         WHERE id = $7 RETURNING *`,
        [nome, email, cargo, departamento, filial, status, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const row = result.rows[0];
      return res.status(200).json({
        id: row.id,
        nome: row.nome,
        email: row.email,
        cargo: row.cargo,
        departamento: row.departamento,
        filial: row.filial_nome,
        status: row.status,
        ultimoAcesso: row.ultimo_acesso
      });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
