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
  tipo?: string;
}

export const mockVehicles: Vehicle[] = [
  { id: '1', placa: 'QAE-6580', marca: 'FIAT', modelo: 'STRADA HD WK CC', ano: 2017, cor: 'Branca', status: 'ativo', filial: 'Chapadão do Sul', empresa: 'Tratores', kmAtual: 152535, tipo: 'Carro' },
  { id: '2', placa: 'QIQ-1024', marca: 'FIAT', modelo: 'MOBI WAY', ano: 2018, cor: 'Branca', status: 'ativo', filial: 'Naviraí', empresa: 'Equagril', kmAtual: 119683, tipo: 'Carro' },
  { id: '3', placa: 'QIO-7756', marca: 'FIAT', modelo: 'PALIO ATTRACTIV 1.4', ano: 2017, cor: 'Prata', status: 'ativo', filial: 'Ponta Porã', empresa: 'Tratores', kmAtual: 127264, tipo: 'Carro' },
  { id: '4', placa: 'QAH-5183', marca: 'FIAT', modelo: 'STRADA HD WK CC E', ano: 2018, cor: 'Branca', status: 'ativo', filial: 'Naviraí', empresa: 'Equagril', kmAtual: 150458, tipo: 'Carro' },
  { id: '5', placa: 'BBT-5H62', marca: 'FIAT', modelo: 'STRADA HD WK CC E', ano: 2008, cor: 'Prata', status: 'ativo', filial: 'Naviraí', empresa: 'Tratores', kmAtual: 190406, tipo: 'Carro' },
  { id: '6', placa: 'QAM-6763', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2019, cor: 'Vermelha', status: 'ativo', filial: 'Naviraí', empresa: 'Agricase', kmAtual: 163292, tipo: 'Carro' },
  { id: '7', placa: 'QAM-0651', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2019, cor: 'Branca', status: 'ativo', filial: 'Jardim', empresa: 'Agricase', kmAtual: 140687, tipo: 'Carro' },
  { id: '8', placa: 'QAQ-7235', marca: 'FIAT', modelo: 'STRADA HD WK CC E', ano: 2019, cor: 'Branca', status: 'ativo', filial: 'Dourados 2', empresa: 'Agricase', kmAtual: 105393, tipo: 'Carro' },
  { id: '9', placa: 'EVA-4790', marca: 'FIAT', modelo: 'SIENA ATTRACTIVE 1.4', ano: 2019, cor: 'Prata', status: 'ativo', filial: 'São Gabriel do Oeste', empresa: 'Tratores', kmAtual: 155422, tipo: 'Carro' },
  { id: '10', placa: 'ETE-0314', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Ponta Porã', empresa: 'Tratores', kmAtual: 132781, tipo: 'Carro' },
  { id: '11', placa: 'QTM-3A04', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Naviraí', empresa: 'Equagril', kmAtual: 182849, tipo: 'Carro' },
  { id: '12', placa: 'QJY-3266', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Jardim', empresa: 'Equagril', kmAtual: 124575, tipo: 'Carro' },
  { id: '13', placa: 'RAG-4166', marca: 'FIAT', modelo: 'UNO ATTRACTIV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Ponta Porã', empresa: 'Equagril', kmAtual: 206934, tipo: 'Carro' },
  { id: '14', placa: 'QOK-7812', marca: 'FIAT', modelo: 'UNO VIVACE 1.0', ano: 2014, cor: 'Prata', status: 'ativo', filial: 'Três Lagoas', empresa: 'Tratores', kmAtual: 154224, tipo: 'Carro' },
  { id: '15', placa: 'RMG-3I67', marca: 'VOLKSWAGEN', modelo: 'VOYAGEN 1.6', ano: 2022, cor: 'Branca', status: 'ativo', filial: 'Ponta Porã', empresa: 'Tratores', kmAtual: 0, tipo: 'Carro' },
  { id: '16', placa: 'QAQ-0658', marca: 'FIAT', modelo: 'UNO ATRACTV 1.0', ano: 2020, cor: 'Branca', status: 'ativo', filial: 'Dourados', empresa: 'Agriceise', kmAtual: 169075, tipo: 'Carro' },
  { id: '17', placa: 'QAL-0387', marca: 'FIAT', modelo: 'MOBI WAY', ano: 2019, cor: 'Branca', status: 'ativo', filial: 'Dourados', empresa: 'Agriceise', kmAtual: 150635, tipo: 'Carro' },
  { id: '18', placa: 'QAM-6764', marca: 'FIAT', modelo: 'UNO ATRACTV 1.0', ano: 2019, cor: 'Vermelha', status: 'ativo', filial: 'Naviraí', empresa: 'Agriceise', kmAtual: 144640, tipo: 'Carro' }
];
