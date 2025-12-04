export interface Filial {
  id: string;
  nome: string;
  empresa: string;
  cidade: string;
  estado: string;
  endereco: string;
  telefone: string;
  gestor: string;
  status: 'ativa' | 'inativa';
}

export const mockFiliais: Filial[] = [
  {
    id: '1',
    nome: 'Chapadão do Sul',
    empresa: 'Tratores',
    cidade: 'Chapadão do Sul',
    estado: 'MS',
    endereco: 'Av. Quatro, 1234',
    telefone: '(67) 3562-1234',
    gestor: 'Carlos Souza',
    status: 'ativa'
  },
  {
    id: '2',
    nome: 'Naviraí',
    empresa: 'Equagril',
    cidade: 'Naviraí',
    estado: 'MS',
    endereco: 'Av. Amélia Fukuda, 567',
    telefone: '(67) 3461-5678',
    gestor: 'Ana Oliveira',
    status: 'ativa'
  },
  {
    id: '3',
    nome: 'Ponta Porã',
    empresa: 'Tratores',
    cidade: 'Ponta Porã',
    estado: 'MS',
    endereco: 'Rua Marechal Floriano, 890',
    telefone: '(67) 3431-9012',
    gestor: 'Roberto Silva',
    status: 'ativa'
  },
  {
    id: '4',
    nome: 'Jardim',
    empresa: 'Agricase',
    cidade: 'Jardim',
    estado: 'MS',
    endereco: 'Av. Duque de Caxias, 345',
    telefone: '(67) 3251-3456',
    gestor: 'Fernanda Costa',
    status: 'ativa'
  },
  {
    id: '5',
    nome: 'Dourados 2',
    empresa: 'Agricase',
    cidade: 'Dourados',
    estado: 'MS',
    endereco: 'Rodovia BR-163, Km 267',
    telefone: '(67) 3411-7890',
    gestor: 'Paulo Santos',
    status: 'ativa'
  },
  {
    id: '6',
    nome: 'São Gabriel do Oeste',
    empresa: 'Tratores',
    cidade: 'São Gabriel do Oeste',
    estado: 'MS',
    endereco: 'Av. Getúlio Vargas, 1122',
    telefone: '(67) 3295-1122',
    gestor: 'Juliana Lima',
    status: 'ativa'
  },
  {
    id: '7',
    nome: 'Dourados',
    empresa: 'Agriceise',
    cidade: 'Dourados',
    estado: 'MS',
    endereco: 'Av. Marcelino Pires, 3500',
    telefone: '(67) 3422-1100',
    gestor: 'Marcos Oliveira',
    status: 'ativa'
  }
];
