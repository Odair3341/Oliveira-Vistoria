export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  filial: string;
  status: 'ativo' | 'inativo';
  ultimoAcesso: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@oliveira.com.br',
    cargo: 'Administrador',
    departamento: 'TI',
    filial: 'Matriz',
    status: 'ativo',
    ultimoAcesso: '2024-12-04 08:30'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@oliveira.com.br',
    cargo: 'Gerente',
    departamento: 'Financeiro',
    filial: 'Matriz',
    status: 'ativo',
    ultimoAcesso: '2024-12-04 09:15'
  },
  {
    id: '3',
    nome: 'Carlos Souza',
    email: 'carlos.souza@oliveira.com.br',
    cargo: 'Gestor de Filial',
    departamento: 'Operações',
    filial: 'Chapadão do Sul',
    status: 'ativo',
    ultimoAcesso: '2024-12-03 17:45'
  },
  {
    id: '4',
    nome: 'Ana Oliveira',
    email: 'ana.oliveira@oliveira.com.br',
    cargo: 'Gestor de Filial',
    departamento: 'Operações',
    filial: 'Naviraí',
    status: 'ativo',
    ultimoAcesso: '2024-12-04 07:50'
  },
  {
    id: '5',
    nome: 'Roberto Silva',
    email: 'roberto.silva@oliveira.com.br',
    cargo: 'Vistoriador',
    departamento: 'Vistorias',
    filial: 'Ponta Porã',
    status: 'ativo',
    ultimoAcesso: '2024-12-04 10:20'
  }
];
