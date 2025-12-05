## Problemas Identificados
- Exclusão não efetiva: item volta após atualizar.
- Edição de placa não aceita e gera duplicidades.
- Campo Destino/Origem volta para "Naviraí" após salvar.
- Título do modal mostra "PROVA DEPLOY" (cabeçalho antigo).

## Correções de Backend (API)
1. Normalizar IDs em `api/inspections.js`:
- Mapear `id: String(row.id)` para evitar conflitos número vs string.
- Garantir que o `DELETE /api/inspections?id=...` aceite id string/numérico e logue operações.

2. Persistência completa no `PUT`:
- Confirmar atualização de `origem` e `destino` sem sobrescrever valores.
- Manter atualização opcional do veículo vinculado (`veiculoId`) apenas quando presente.

## Correções de Frontend
1. `DataContext.deleteInspection`:
- Usar `await fetch('/api/inspections?id=ID', { method: 'DELETE' })` e atualizar estado local.
- Recarregar lista após sucesso quando em ambientes com cache.

2. `EditInspectionDialog.tsx`:
- Remover qualquer rótulo temporário de título (garantir: "Editar Vistoria - {placa}").
- Fixar seleção manual de Origem/Destino: não resetar para "Naviraí" quando empresa/filial mudam.
- Persistir `origem/destino/kmDeslocamento` no submit e refletir ao reabrir.

3. `Vistorias.tsx` (Gerar Pendentes):
- Evitar criar pendentes se já existe vistoria para a placa (usar placa normalizada).

## Verificação
- Teste excluir uma vistoria e confirmar que não reaparece após refresh.
- Teste editar a placa e salvar; não deve duplicar nem reverter status.
- Teste mudar Destino para "Ponta Porã" e salvar; ao reabrir, Destino permanece e KM é recalculado.
- Hard refresh no app para eliminar cache; validar que o título do modal não mostra "PROVA DEPLOY".

## Entregáveis
- Código ajustado em API e frontend.
- Commit com mensagem clara.
- Instrução de reinício do backend local (ou rebuild/deploy na Vercel, caso use funções serverless).

Confirma que posso aplicar essas mudanças agora?