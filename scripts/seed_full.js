import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({ connectionString });

// Dados Mockados
const filiais = [
  { nome: 'Chapadão do Sul', empresa: 'Tratores', cidade: 'Chapadão do Sul', estado: 'MS', endereco: 'Av. Quatro, 1234', telefone: '(67) 3562-1234', gestor: 'Carlos Souza', status: 'ativa' },
  { nome: 'Naviraí', empresa: 'Equagril', cidade: 'Naviraí', estado: 'MS', endereco: 'Av. Amélia Fukuda, 567', telefone: '(67) 3461-5678', gestor: 'Ana Oliveira', status: 'ativa' },
  { nome: 'Ponta Porã', empresa: 'Tratores', cidade: 'Ponta Porã', estado: 'MS', endereco: 'Rua Marechal Floriano, 890', telefone: '(67) 3431-9012', gestor: 'Roberto Silva', status: 'ativa' },
  { nome: 'Jardim', empresa: 'Agricase', cidade: 'Jardim', estado: 'MS', endereco: 'Av. Duque de Caxias, 345', telefone: '(67) 3251-3456', gestor: 'Fernanda Costa', status: 'ativa' },
  { nome: 'Dourados 2', empresa: 'Agricase', cidade: 'Dourados', estado: 'MS', endereco: 'Rodovia BR-163, Km 267', telefone: '(67) 3411-7890', gestor: 'Paulo Santos', status: 'ativa' },
  { nome: 'São Gabriel do Oeste', empresa: 'Tratores', cidade: 'São Gabriel do Oeste', estado: 'MS', endereco: 'Av. Getúlio Vargas, 1122', telefone: '(67) 3295-1122', gestor: 'Juliana Lima', status: 'ativa' },
  { nome: 'Dourados', empresa: 'Agriceise', cidade: 'Dourados', estado: 'MS', endereco: 'Av. Marcelino Pires, 3500', telefone: '(67) 3422-1100', gestor: 'Marcos Oliveira', status: 'ativa' }
];

const usuarios = [
  { nome: 'João Silva', email: 'joao.silva@oliveira.com.br', cargo: 'Administrador', departamento: 'TI', filial: 'Matriz', status: 'ativo' },
  { nome: 'Maria Santos', email: 'maria.santos@oliveira.com.br', cargo: 'Gerente', departamento: 'Financeiro', filial: 'Matriz', status: 'ativo' },
  { nome: 'Carlos Souza', email: 'carlos.souza@oliveira.com.br', cargo: 'Gestor de Filial', departamento: 'Operações', filial: 'Chapadão do Sul', status: 'ativo' },
  { nome: 'Ana Oliveira', email: 'ana.oliveira@oliveira.com.br', cargo: 'Gestor de Filial', departamento: 'Operações', filial: 'Naviraí', status: 'ativo' },
  { nome: 'Roberto Silva', email: 'roberto.silva@oliveira.com.br', cargo: 'Vistoriador', departamento: 'Vistorias', filial: 'Ponta Porã', status: 'ativo' }
];

// Veículos baseados nas vistorias (já que mockVehicles estava vazio)
const veiculos = [
  { placa: 'QAE-6580', marca: 'FIAT', modelo: 'STRADA HD WK CC', ano: 2017, cor: 'Branca', status: 'ativo', filial: 'Chapadão do Sul', km: 152535 },
  { placa: 'QIQ-1024', marca: 'FIAT', modelo: 'MOBI WAY', ano: 2018, cor: 'Branca', status: 'ativo', filial: 'Naviraí', km: 119683 },
  { placa: 'QIO-7756', marca: 'FIAT', modelo: 'PALIO ATTRACTIV 1.4', ano: 2017, cor: 'Prata', status: 'ativo', filial: 'Ponta Porã', km: 127264 },
  { placa: 'QAH-5183', marca: 'FIAT', modelo: 'STRADA HD WK CC E', ano: 2018, cor: 'Branca', status: 'ativo', filial: 'Naviraí', km: 150458 },
  { placa: 'BBT-5H62', marca: 'FIAT', modelo: 'STRADA HD WK CC E', ano: 2008, cor: 'Prata', status: 'manutencao', filial: 'Naviraí', km: 190406 },
  { placa: 'QAM-6763', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2019, cor: 'Vermelha', status: 'ativo', filial: 'Naviraí', km: 163292 },
  { placa: 'QAM-0651', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2019, cor: 'Branca', status: 'ativo', filial: 'Jardim', km: 140687 },
  { placa: 'QAQ-7235', marca: 'FIAT', modelo: 'STRADA HD WK CC E', ano: 2019, cor: 'Branca', status: 'ativo', filial: 'Dourados 2', km: 105393 },
  { placa: 'EVA-4790', marca: 'FIAT', modelo: 'SIENA ATTRACTIVE 1.4', ano: 2019, cor: 'Prata', status: 'ativo', filial: 'São Gabriel do Oeste', km: 155422 },
  { placa: 'ETE-0314', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Ponta Porã', km: 132781 },
  { placa: 'QTM-3A04', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Naviraí', km: 182849 },
  { placa: 'QJY-3266', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Jardim', km: 124575 },
  { placa: 'RAG-4166', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Ponta Porã', km: 206934 },
  { placa: 'QOK-7812', marca: 'FIAT', modelo: 'UNO VIVACE 1.0', ano: 2014, cor: 'Prata', status: 'ativo', filial: 'Três Lagoas', km: 154224 },
  { placa: 'RMG-3I67', marca: 'VOLKSWAGEN', modelo: 'VOYAGEN 1.6', ano: 2022, cor: 'Branca', status: 'ativo', filial: 'Ponta Porã', km: 0 },
  { placa: 'QAQ-0658', marca: 'FIAT', modelo: 'UNO ATRACTV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Dourados', km: 169075 },
  { placa: 'QAL-0387', marca: 'FIAT', modelo: 'MOBI WAY', ano: 2019, cor: 'Branca', status: 'ativo', filial: 'Dourados', km: 150635 },
  { placa: 'QAM-6764', marca: 'FIAT', modelo: 'UNO ATRACTV 1.0', ano: 2019, cor: 'Vermelha', status: 'ativo', filial: 'Naviraí', km: 144640 }
];

async function seed() {
  try {
    await client.connect();
    console.log('Conectado para seeding...');

    // 1. Limpar tabelas (opcional, mas bom para evitar duplicatas em testes)
    // await client.query('TRUNCATE TABLE vistorias, veiculos, usuarios, filiais CASCADE');
    console.log('Limpando dados antigos...');
    await client.query('DELETE FROM vistorias');
    await client.query('DELETE FROM veiculos');
    await client.query('DELETE FROM usuarios');
    await client.query('DELETE FROM filiais');

    // 2. Inserir Filiais
    console.log('Inserindo filiais...');
    const filialMap = new Map(); // Nome -> ID
    
    for (const f of filiais) {
      const res = await client.query(
        `INSERT INTO filiais (nome, empresa, cidade, estado, endereco, telefone, gestor_nome)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nome`,
        [f.nome, f.empresa, f.cidade, f.estado, f.endereco, f.telefone, f.gestor]
      );
      filialMap.set(res.rows[0].nome, res.rows[0].id);
    }

    // 3. Inserir Usuários
    console.log('Inserindo usuários...');
    const userMap = new Map(); // Nome -> ID

    for (const u of usuarios) {
        // Tenta achar ID da filial pelo nome, senão deixa null
        const filialId = filialMap.get(u.filial) || null;
        
        const res = await client.query(
            `INSERT INTO usuarios (nome, email, cargo, departamento, filial_id, filial_nome, status, ultimo_acesso)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id, nome`,
            [u.nome, u.email, u.cargo, u.departamento, filialId, u.filial, u.status]
        );
        userMap.set(res.rows[0].nome, res.rows[0].id);
    }

    // 4. Inserir Veículos
    console.log('Inserindo veículos...');
    const veiculoMap = new Map(); // Placa -> ID

    for (const v of veiculos) {
        const filialId = filialMap.get(v.filial) || null;

        const res = await client.query(
            `INSERT INTO veiculos (placa, marca, modelo, ano, cor, status, filial_id, km, tipo)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Carro') RETURNING id, placa`,
            [v.placa, v.marca, v.modelo, v.ano, v.cor, v.status, filialId, v.km]
        );
        veiculoMap.set(res.rows[0].placa, res.rows[0].id);
    }

    // 5. Inserir Vistorias (usando os dados do seed_real_data.sql mas adaptado)
    console.log('Inserindo vistorias...');
    // Dados manuais do SQL anterior
    const vistoriasData = [
        ['QAE-6580', 152535, 0, 0, 2017, 'STRADA HD WK CC', 'FIAT', 'Tratores', 'Chapadão do Sul', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QIQ-1024', 119683, 0, 0, 2018, 'MOBI WAY', 'FIAT', 'Equagril', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QIO-7756', 127264, 0, 0, 2017, 'PALIO ATTRACTIV 1.4', 'FIAT', 'Tratores', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QAH-5183', 150458, 0, 0, 2018, 'STRADA HD WK CC E', 'FIAT', 'Equagril', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['BBT-5H62', 190406, 0, 0, 2008, 'STRADA HD WK CC E', 'FIAT', 'Tratores', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QAM-6763', 163292, 0, 0, 2019, 'UNO ATTRACTIV 1.0', 'FIAT', 'Agricase', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QAM-0651', 140687, 0, 0, 2019, 'UNO ATTRACTIV 1.0', 'FIAT', 'Agricase', 'Jardim', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QAQ-7235', 105393, 0, 0, 2019, 'STRADA HD WK CC E', 'FIAT', 'Agricase', 'Dourados 2', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['EVA-4790', 155422, 0, 0, 2019, 'SIENA ATTRACTIVE 1.4', 'FIAT', 'Tratores', 'São Gabriel do Oeste', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['ETE-0314', 132781, 0, 0, 2020, 'UNO ATTRACTIV 1.0', 'FIAT', 'Tratores', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QTM-3A04', 182849, 0, 0, 2020, 'UNO ATTRACTIV 1.0', 'FIAT', 'Equagril', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QJY-3266', 124575, 0, 0, 2020, 'UNO ATTRACTIV 1.0', 'FIAT', 'Equagril', 'Jardim', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['RAG-4166', 206934, 0, 0, 2020, 'UNO ATTRACTIV 1.0', 'FIAT', 'Equagril', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QOK-7812', 154224, 0, 0, 2014, 'UNO VIVACE 1.0', 'FIAT', 'Tratores', 'Três Lagoas', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['RMG-3I67', 0, 0, 0, 2022, 'VOYAGEN 1.6', 'VOLKSWAGEN', 'Tratores', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QIO-7756', 160002, 0, 0, 2017, 'PALIO ATTRACTIV 1.4', 'FIAT', 'Tratores', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QAQ-0658', 169075, 0, 0, 2020, 'UNO ATRACTV 1.0', 'FIAT', 'Agriceise', 'Dourados', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QAL-0387', 150635, 0, 0, 2019, 'MOBI WAY', 'FIAT', 'Agriceise', 'Dourados', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'],
        ['QAM-6764', 144640, 0, 0, 2019, 'UNO ATRACTV 1.0', 'FIAT', 'Agriceise', 'Navirai', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida']
    ];

    for (const row of vistoriasData) {
        const [placa, km, kmDesl, valKm, ano, modelo, marca, empresa, filial, estado, auto, cautelar, pedagio, total, data, status] = row;
        
        const veiculoId = veiculoMap.get(placa);
        const filialId = filialMap.get(filial); // Opcional usar ID da filial se quiser normalizar
        
        // Escolher um usuário aleatório para ser responsável
        // (Em um cenário real, isso viria do log de quem fez)
        // Como não temos, pegamos o primeiro ou null
        
        await client.query(
            `INSERT INTO vistorias (
                placa, km_rodado, km_deslocamento, valor_km, ano_veiculo, modelo, marca,
                empresa, filial_nome, estado_uf, valor_total, data_vistoria, status,
                veiculo_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [placa, km, kmDesl, valKm, ano, modelo, marca, empresa, filial, estado, total, data, status, veiculoId]
        );
    }

    console.log('Seed concluído com sucesso!');

  } catch (err) {
    console.error('Erro no seed:', err);
  } finally {
    await client.end();
  }
}

seed();
