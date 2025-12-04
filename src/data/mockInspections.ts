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

export const mockInspections: Inspection[] = [
  { id: '1', qtd: 1, placa: 'QAE-6580', kmRodado: 152535, kmDeslocamento: 324, valorKm: 1.10, ano: 2017, modelo: 'STRADA HD WK CC', marca: 'FIAT', filial: 'Chapadão do Sul', empresa: 'Tratores', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 574.24, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '2', qtd: 1, placa: 'QIQ-1024', kmRodado: 119683, kmDeslocamento: 0, valorKm: 0, ano: 2018, modelo: 'MOBI WAY', marca: 'FIAT', filial: 'Naviraí', empresa: 'Equagril', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '3', qtd: 1, placa: 'QIO-7756', kmRodado: 127264, kmDeslocamento: 180, valorKm: 1.10, ano: 2017, modelo: 'PALIO ATTRACTIV 1.4', marca: 'FIAT', filial: 'Ponta Porã', empresa: 'Tratores', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 415.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '4', qtd: 1, placa: 'QAH-5183', kmRodado: 150458, kmDeslocamento: 0, valorKm: 0, ano: 2018, modelo: 'STRADA HD WK CC E', marca: 'FIAT', filial: 'Naviraí', empresa: 'Equagril', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '5', qtd: 1, placa: 'BBT-5H62', kmRodado: 190406, kmDeslocamento: 0, valorKm: 0, ano: 2008, modelo: 'STRADA HD WK CC E', marca: 'FIAT', filial: 'Naviraí', empresa: 'Tratores', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '6', qtd: 1, placa: 'QAM-6763', kmRodado: 163292, kmDeslocamento: 0, valorKm: 0, ano: 2019, modelo: 'UNO ATTRACTIV 1.0', marca: 'FIAT', filial: 'Naviraí', empresa: 'Agricase', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '7', qtd: 1, placa: 'QAM-0651', kmRodado: 140687, kmDeslocamento: 385, valorKm: 1.10, ano: 2019, modelo: 'UNO ATTRACTIV 1.0', marca: 'FIAT', filial: 'Jardim', empresa: 'Agricase', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 641.34, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '8', qtd: 1, placa: 'QAQ-7235', kmRodado: 105393, kmDeslocamento: 113, valorKm: 1.10, ano: 2019, modelo: 'STRADA HD WK CC E', marca: 'FIAT', filial: 'Dourados 2', empresa: 'Agricase', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 342.14, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '9', qtd: 1, placa: 'EVA-4790', kmRodado: 155422, kmDeslocamento: 263, valorKm: 1.10, ano: 2019, modelo: 'SIENA ATTRACTIVE 1.4', marca: 'FIAT', filial: 'São Gabriel do Oeste', empresa: 'Tratores', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 507.14, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '10', qtd: 1, placa: 'ETE-0314', kmRodado: 132781, kmDeslocamento: 0, valorKm: 0, ano: 2020, modelo: 'UNO ATTRACTIV 1.0', marca: 'FIAT', filial: 'Ponta Porã', empresa: 'Tratores', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '11', qtd: 1, placa: 'QTM-3A04', kmRodado: 182849, kmDeslocamento: 0, valorKm: 0, ano: 2020, modelo: 'UNO ATTRACTIV 1.0', marca: 'FIAT', filial: 'Naviraí', empresa: 'Equagril', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '12', qtd: 1, placa: 'QJY-3266', kmRodado: 124575, kmDeslocamento: 0, valorKm: 0, ano: 2020, modelo: 'UNO ATTRACTIV 1.0', marca: 'FIAT', filial: 'Jardim', empresa: 'Equagril', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '13', qtd: 1, placa: 'RAG-4166', kmRodado: 206934, kmDeslocamento: 0, valorKm: 0, ano: 2020, modelo: 'UNO ATTRACTIV 1.0', marca: 'FIAT', filial: 'Ponta Porã', empresa: 'Equagril', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '14', qtd: 1, placa: 'QOK-7812', kmRodado: 154224, kmDeslocamento: 423, valorKm: 1.10, ano: 2014, modelo: 'UNO VIVACE 1.0', marca: 'FIAT', filial: 'Três Lagoas', empresa: 'Tratores', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 683.14, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '15', qtd: 1, placa: 'RMG-3I67', kmRodado: 0, kmDeslocamento: 0, valorKm: 0, ano: 2022, modelo: 'VOYAGEN 1.6', marca: 'VOLKSWAGEN', filial: 'Ponta Porã', empresa: 'Tratores', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '16', qtd: 1, placa: 'QAQ-0658', kmRodado: 169075, kmDeslocamento: 0, valorKm: 0, ano: 2020, modelo: 'UNO ATRACTV 1.0', marca: 'FIAT', filial: 'Dourados', empresa: 'Agriceise', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '17', qtd: 1, placa: 'QAL-0387', kmRodado: 150635, kmDeslocamento: 0, valorKm: 0, ano: 2019, modelo: 'MOBI WAY', marca: 'FIAT', filial: 'Dourados', empresa: 'Agriceise', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 218.16, dataVistoria: '2024-11-30', status: 'concluida' },
  { id: '18', qtd: 1, placa: 'QAM-6764', kmRodado: 144640, kmDeslocamento: 0, valorKm: 0, ano: 2019, modelo: 'UNO ATRACTV 1.0', marca: 'FIAT', filial: 'Navirai', empresa: 'Agriceise', estado: 'MS', autoAvaliar: 108.92, caltelar: 108.92, pedagio: 0, total: 217.84, dataVistoria: '2024-11-30', status: 'concluida' }
];
