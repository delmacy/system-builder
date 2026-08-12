# Risk Management

## Risk record

```yaml
risk:
  id: RISK-...
  description: ...
  cause: ...
  probability: LOW | MEDIUM | HIGH
  impact: LOW | MEDIUM | HIGH | CRITICAL
  exposure: ...
  triggers: []
  mitigation: []
  contingency: []
  owner_role: ...
  affected_wp_ids: []
  status: OPEN | MITIGATED | OCCURRED | CLOSED
```

## Default elevated risks
- public contract/schema changes;
- destructive or irreversible migration;
- authentication/authorization/secrets/trust boundary changes;
- release/deployment/rollback behavior;
- architectural ownership/boundary changes;
- external dependency/API behavior uncertainty;
- concurrent modification of authoritative contracts;
- low-confidence requirement or dependency;
- repeated executor/CI failure;
- evaluator/test modification.

## Risk response
Low-risk mechanical work may use cheap execution with deterministic gates. Increased exposure raises review/model tier and may require architecture, security, data or human approval gates.

A risk occurrence becomes an issue and can block only affected DAG paths unless evidence shows systemic impact.

## Review
Review risks at task readiness, sprint commitment, contract changes, integration review and after significant execution variance. Risk history calibrates future model routing and decomposition.
