export interface Vehicle {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  kmAtual: number;
  status: 'ativo' | 'manutencao' | 'inativo';
  filial: string;
  empresa: string;
}

export const mockVehicles: Vehicle[] = [];
