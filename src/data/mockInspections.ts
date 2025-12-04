export interface Inspection {
  id: string;
  qtd: number;
  placa: string;
  kmRodado: number;
  kmDeslocamento?: number;
  valorKm: number;
  ano: number;
  modelo: string;
  marca: string;
  filial: string;
  empresa: string;
  estado: string;
  autoAvaliar: number;
  caltelar: number;
  pedagio?: number;
  total: number;
  dataVistoria: string;
  status: 'concluida' | 'pendente' | 'em_analise';
}

// Função para parsear a filial
function parseFilial(filialStr: string): { empresa: string; cidade: string; estado: string } {
  const parts = filialStr.split(' - ');
  if (parts.length >= 3) {
    return {
      empresa: parts[0].trim(),
      cidade: parts[1].trim(),
      estado: parts[2].trim()
    };
  }
  // Tenta outro formato "AGRICEISE - DOURADOS" ou "TRATORES PONTA PORÃ"
  const parts2 = filialStr.split(' - ');
  if (parts2.length === 2) {
     return {
      empresa: parts2[0].trim(),
      cidade: parts2[1].trim(),
      estado: 'MS' // Padrão MS conforme imagem
    };
  }
  
  // Caso "TRATORES PONTA PORÃ"
  return { empresa: filialStr, cidade: filialStr, estado: 'MS' };
}

// Dados reais extraídos da planilha
export const mockInspections: Inspection[] = [];
