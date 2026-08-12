# Escopo — Integration Layer

## Inclui
Connector contracts, adapters, API/webhook/queue/file/database patterns, mapping, retries, idempotency, credentials references e health/error semantics.

## Não inclui
Forçar substituição de sistemas legados ou expor provider specifics nos contratos de negócio.

## Entradas
Integration definitions, credentials refs e external endpoints/schemas.

## Saídas
Integrações operacionais, mappings, events/results e diagnostics.

## Critério de conclusão
Um provider/sistema externo pode ser trocado ou coexistir sem reescrever o modelo de negócio.