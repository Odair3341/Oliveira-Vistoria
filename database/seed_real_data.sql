-- Seed Data for Vistorias
-- This script populates the vistorias table with real data from the provided spreadsheet.
-- First, it clears the existing data to ensure a clean state.

TRUNCATE TABLE vistorias;

INSERT INTO vistorias (
  placa, km_rodado, km_deslocamento, valor_km, ano, modelo, marca, 
  empresa, filial, estado, auto_avaliar, caltelar, pedagio, total, 
  data_vistoria, status
) VALUES 
('QAE-6580', 152535, 0, 0, 2017, 'STRADA HD WK CC', 'FIAT', 'Tratores', 'Chapadão do Sul', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QIQ-1024', 119683, 0, 0, 2018, 'MOBI WAY', 'FIAT', 'Equagril', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QIO-7756', 127264, 0, 0, 2017, 'PALIO ATTRACTIV 1.4', 'FIAT', 'Tratores', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QAH-5183', 150458, 0, 0, 2018, 'STRADA HD WK CC E', 'FIAT', 'Equagril', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('BBT-5H62', 190406, 0, 0, 2008, 'STRADA HD WK CC E', 'FIAT', 'Tratores', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QAM-6763', 163292, 0, 0, 2019, 'UNO ATTRACTIV 1.0', 'FIAT', 'Agricase', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QAM-0651', 140687, 0, 0, 2019, 'UNO ATTRACTIV 1.0', 'FIAT', 'Agricase', 'Jardim', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QAQ-7235', 105393, 0, 0, 2019, 'STRADA HD WK CC E', 'FIAT', 'Agricase', 'Dourados 2', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('EVA-4790', 155422, 0, 0, 2019, 'SIENA ATTRACTIVE 1.4', 'FIAT', 'Tratores', 'São Gabriel do Oeste', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('ETE-0314', 132781, 0, 0, 2020, 'UNO ATTRACTIV 1.0', 'FIAT', 'Tratores', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QTM-3A04', 182849, 0, 0, 2020, 'UNO ATTRACTIV 1.0', 'FIAT', 'Equagril', 'Naviraí', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QJY-3266', 124575, 0, 0, 2020, 'UNO ATTRACTIV 1.0', 'FIAT', 'Equagril', 'Jardim', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('RAG-4166', 206934, 0, 0, 2020, 'UNO ATTRACTIV 1.0', 'FIAT', 'Equagril', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QOK-7812', 154224, 0, 0, 2014, 'UNO VIVACE 1.0', 'FIAT', 'Tratores', 'Três Lagoas', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('RMG-3I67', 0, 0, 0, 2022, 'VOYAGEN 1.6', 'VOLKSWAGEN', 'Tratores', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QIO-7756', 160002, 0, 0, 2017, 'PALIO ATTRACTIV 1.4', 'FIAT', 'Tratores', 'Ponta Porã', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QAQ-0658', 169075, 0, 0, 2020, 'UNO ATRACTV 1.0', 'FIAT', 'Agriceise', 'Dourados', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QAL-0387', 150635, 0, 0, 2019, 'MOBI WAY', 'FIAT', 'Agriceise', 'Dourados', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida'),
('QAM-6764', 144640, 0, 0, 2019, 'UNO ATRACTV 1.0', 'FIAT', 'Agriceise', 'Navirai', 'MS', 108.92, 108.92, 0, 217.84, '2024-11-30', 'concluida');
