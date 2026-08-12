# Requirements Management & Traceability

## Cadeia obrigatória
`Vision/ADR → Requirement → WBS element → Work Package → public contract/interface → acceptance criterion → test/evidence → release`.

## Tipos
- Business/vision requirement
- Functional requirement
- Non-functional requirement
- Architecture invariant
- Compliance/security requirement
- Operability/support requirement

## Requirement ID
`REQ-<domain>-NNN`.

## Regra
Nenhum Work Package NOW pode chegar a execução sem requisito/origem identificável ou justificativa explícita de infraestrutura habilitadora. Mudança de requisito após Scope Baseline gera análise de impacto.

## Matriz mínima
| Requirement | Source | WBS/WP | Contract | Acceptance/Evidence | Status |
|---|---|---|---|---|---|

A matriz será preenchida progressivamente durante o refinamento dos Work Packages, não inventada pelo executor.
