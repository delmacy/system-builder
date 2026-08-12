# Escopo — Action Engine

## Inclui
Action contracts, input/output validation, execution context, side effects, idempotency, permissions hooks, retries e observability.

## Não inclui
Orquestração de longa duração própria de Workflow ou policies escondidas dentro de handlers.

## Entradas
Action request, validated input, actor/context e dependencies.

## Saídas
Resultado tipado, efeitos/eventos e execution evidence.

## Critério de conclusão
Actions podem ser invocadas por UI/workflow/API sob o mesmo contrato e comportamento.