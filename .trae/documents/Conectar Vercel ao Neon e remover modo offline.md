## Diagnóstico Atual
- A API usa `process.env.DATABASE_URL` em `api/db.js`; local `.env` contém a URL do Neon.
- O deploy na Vercel provavelmente não tem a variável `DATABASE_URL` configurada, por isso o app está em "modo offline".
- O projeto Neon existe (id: `fancy-moon-91857252`) e não bloqueia conexões públicas.

## Plano de Correção
### 1) Segurança e Senha do Banco
- Rotacionar a senha do usuário `neondb_owner` no Neon (porque a credencial está no repositório).
- Gerar uma nova `DATABASE_URL` segura.

### 2) Variáveis de Ambiente na Vercel
- Adicionar `DATABASE_URL` nas variáveis de ambiente do projeto Vercel (Production e Preview).
- Opcional: adicionar `VERCEL_REGION=sa-east-1` para reduzir latência.

### 3) API Health Check
- Criar endpoint `/api/health` que executa `SELECT 1` para validar conectividade e devolver `{ ok: true }`.
- Testar `/api/inspections` no deploy para confirmar retorno JSON com 19 vistorias.

### 4) Comportamento em Produção
- Desabilitar fallback de mocks em produção (usar sempre API; se falhar, exibir erro claro em vez de dados antigos).
- Manter fallback apenas em desenvolvimento.

### 5) Higiene do Repositório
- Remover `.env` do repositório e manter apenas `.env.example` sem segredos.
- Auditar scripts que contém strings de conexão e parametrizar via `process.env`.

### 6) Verificação Final
- Reimplantar o projeto na Vercel.
- Conferir no desktop e celular que:
  - Contagem: 19 vistorias
  - Valor total: `R$ 6.149,76`
  - Nenhum indicador de "modo offline"

## Solicitação
- Autoriza rotacionar a senha no Neon e configurar `DATABASE_URL` na Vercel? Com isso executo as alterações e reimplanto imediatamente.