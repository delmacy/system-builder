# Escopo — Workflow Engine

## Inclui
States/transitions, tasks, waits, timers, approvals, escalation, compensation, events, human handoffs e lifecycle de instances.

## Não inclui
Interpretar BusinessRecipe livremente no runtime ou decidir políticas que pertencem ao Rule Engine.

## Entradas
Workflow definitions materializadas e runtime events/actions.

## Saídas
Workflow instances, state transitions, tasks/events e audit hooks.

## Critério de conclusão
Um workflow é reproduzível/testável contra sua definição e mantém estado consistente sob retry/failure.