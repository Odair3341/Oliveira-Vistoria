-- Atualização da tabela Vistorias para incluir km de deslocamento e pedágio
ALTER TABLE vistorias 
ADD COLUMN IF NOT EXISTS km_deslocamento INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pedagio NUMERIC(10, 2) DEFAULT 0;
