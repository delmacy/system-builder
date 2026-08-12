# Escopo — Audit Trail

## Inclui
Actor, action, target, before/after references, timestamps, reason/context, correlation, integrity e retention/query hooks.

## Não inclui
Substituir logs técnicos nem permitir auditoria mutável pelo usuário comum.

## Entradas
Domain/runtime actions e security/process events.

## Saídas
Audit records consultáveis e exportáveis conforme policy.

## Critério de conclusão
Uma alteração crítica pode ser reconstruída com ator, ação, contexto e estado associado.