
export interface Route {
  id: string;
  empresa: string;
  filial: string;
  cidade: string;
  distancia: number; // Distância de Naviraí (Base)
}

// Dados baseados na planilha e estimativas de distância a partir de Naviraí-MS
export const mockRoutes: Route[] = [
  { id: '1', empresa: 'Tratores', filial: 'Chapadão do Sul', cidade: 'Chapadão do Sul', distancia: 580 },
  { id: '2', empresa: 'Tratores', filial: 'Ponta Porã', cidade: 'Ponta Porã', distancia: 280 },
  { id: '3', empresa: 'Tratores', filial: 'Naviraí', cidade: 'Naviraí', distancia: 0 },
  { id: '4', empresa: 'Tratores', filial: 'São Gabriel do Oeste', cidade: 'São Gabriel do Oeste', distancia: 480 },
  { id: '5', empresa: 'Tratores', filial: 'Três Lagoas', cidade: 'Três Lagoas', distancia: 423 }, 
  
  { id: '6', empresa: 'Equagril', filial: 'Naviraí', cidade: 'Naviraí', distancia: 0 },
  { id: '7', empresa: 'Equagril', filial: 'Jardim', cidade: 'Jardim', distancia: 250 },
  { id: '8', empresa: 'Equagril', filial: 'Ponta Porã', cidade: 'Ponta Porã', distancia: 280 },
  
  { id: '9', empresa: 'Agricase', filial: 'Naviraí', cidade: 'Naviraí', distancia: 0 },
  { id: '10', empresa: 'Agricase', filial: 'Jardim', cidade: 'Jardim', distancia: 250 },
  { id: '11', empresa: 'Agricase', filial: 'Dourados', cidade: 'Dourados', distancia: 140 }, 
  { id: '12', empresa: 'Agricase', filial: 'Dourados 2', cidade: 'Dourados', distancia: 145 },
  
  { id: '13', empresa: 'Agriceise', filial: 'Dourados', cidade: 'Dourados', distancia: 140 },
  { id: '14', empresa: 'Agriceise', filial: 'Naviraí', cidade: 'Naviraí', distancia: 0 },
];

// Matriz de distâncias entre cidades (baseada nas anotações do usuário)
export const cityDistances: Record<string, Record<string, number>> = {
  'Naviraí': {
    'Três Lagoas': 423,
    'Dourados': 140,
    'Ponta Porã': 280, // Estimado ou mantido do mock se não houver link direto na nota (nota tem Ponta Porã -> Dourados 113, Dourados -> Naviraí 140. Soma = 253? Mock é 280. Mantendo mock ou ajustando?)
    // Nota: Dourados -> Naviraí = 140. Ponta Porã -> Dourados = 113. 
    // Naviraí -> Ponta Porã (direto) não está na rota da nota, mas está no mock como 280.
  },
  'Três Lagoas': {
    'Chapadão do Sul': 324,
    'Naviraí': 423
  },
  'Chapadão do Sul': {
    'São Gabriel do Oeste': 263,
    'Três Lagoas': 324
  },
  'São Gabriel do Oeste': {
    'Jardim': 385,
    'Chapadão do Sul': 263
  },
  'Jardim': {
    'Ponta Porã': 180,
    'São Gabriel do Oeste': 385
  },
  'Ponta Porã': {
    'Dourados': 113,
    'Jardim': 180
  },
  'Dourados': {
    'Naviraí': 140,
    'Ponta Porã': 113
  }
};
