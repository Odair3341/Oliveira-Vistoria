-- Atualização da tabela Vistorias para incluir valor do KM
ALTER TABLE vistorias 
ADD COLUMN IF NOT EXISTS valor_km NUMERIC(10, 2) DEFAULT 0;

-- O valor_total já existe, mas a lógica agora será valor_total = km_rodado * valor_km
-- Se houver dados existentes, podemos querer atualizar, mas como é um ambiente novo, vamos deixar assim.
