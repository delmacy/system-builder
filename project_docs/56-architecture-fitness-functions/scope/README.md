# Escopo — Architecture Fitness Functions

## Inclui
Dependency/boundary tests, Builder↔Runtime isolation, contract-only dependencies, determinism checks, portability/security assertions e CI enforcement.

## Não inclui
Confiar apenas em documentação ou impedir evolução arquitetural aprovada por ADR.

## Entradas
Architecture rules, source/dependency graph, contracts e build/test evidence.

## Saídas
Fitness test results e architecture violation findings.

## Critério de conclusão
Invariantes de alto custo para mudar possuem testes executáveis onde tecnicamente possível.