-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Filiais
CREATE TABLE IF NOT EXISTS filiais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    endereco TEXT,
    gestor_nome VARCHAR(255),
    telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255), -- Para futuro uso
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    filial_id UUID REFERENCES filiais(id),
    filial_nome VARCHAR(255), -- Desnormalizado para facilitar compatibilidade com mock atual
    status VARCHAR(20) DEFAULT 'ativo', -- 'ativo', 'inativo'
    ultimo_acesso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Veículos
CREATE TABLE IF NOT EXISTS veiculos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placa VARCHAR(10) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    ano INTEGER,
    cor VARCHAR(30),
    status VARCHAR(20) DEFAULT 'disponivel', -- 'disponivel', 'em_uso', 'manutencao'
    filial_id UUID REFERENCES filiais(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Vistorias
CREATE TABLE IF NOT EXISTS vistorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    veiculo_id UUID REFERENCES veiculos(id),
    usuario_id UUID REFERENCES usuarios(id), -- Quem realizou
    placa VARCHAR(10) NOT NULL, -- Desnormalizado
    marca VARCHAR(50),
    modelo VARCHAR(50),
    empresa VARCHAR(255),
    filial_nome VARCHAR(255),
    estado_uf VARCHAR(2),
    data_vistoria TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    km_rodado INTEGER,
    ano_veiculo INTEGER,
    valor_total NUMERIC(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'concluida', 'em_analise'
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais (Exemplos baseados no Mock)

-- Filial Matriz
INSERT INTO filiais (id, nome, cidade, estado, gestor_nome) 
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Matriz SP', 'São Paulo', 'SP', 'Carlos Silva')
ON CONFLICT (id) DO NOTHING;

-- Usuários
INSERT INTO usuarios (nome, email, cargo, departamento, filial_nome, status, ultimo_acesso)
VALUES 
('João Silva', 'joao.silva@oliveira.com.br', 'Vistoriador', 'Operações', 'Matriz SP', 'ativo', NOW()),
('Maria Santos', 'maria.santos@oliveira.com.br', 'Gerente', 'Administrativo', 'Matriz SP', 'ativo', NOW())
ON CONFLICT (email) DO NOTHING;

-- Veículos
INSERT INTO veiculos (placa, marca, modelo, ano, cor, status)
VALUES 
('ABC-1234', 'Fiat', 'Uno', 2020, 'Branco', 'disponivel'),
('XYZ-9876', 'Volkswagen', 'Gol', 2021, 'Prata', 'em_uso')
ON CONFLICT (placa) DO NOTHING;
