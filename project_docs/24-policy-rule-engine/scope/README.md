# Escopo — Policy / Rule Engine

## Inclui
Rule/policy definitions, conditions, facts/context, deterministic evaluation, versioning, explanations e integration hooks.

## Não inclui
Workflow sequencing, authorization inteira ou inference probabilística disfarçada de regra.

## Entradas
Facts/context e rule/policy set materializado.

## Saídas
Decision/result determinístico e explanation/evidence.

## Critério de conclusão
Mesmos facts + mesma versão de regras produzem o mesmo resultado explicável.