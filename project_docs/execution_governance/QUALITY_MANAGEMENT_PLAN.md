# Quality Management Plan

Quality is defined before execution and verified independently from generation wherever practical.

## Quality layers
1. **Static** — formatting/lint/type safety/build integrity as applicable.
2. **Unit** — deterministic behavior of bounded components.
3. **Contract/schema** — public interfaces, artifact envelopes and compatibility.
4. **Integration** — producer/consumer gates and migrations.
5. **System/vertical slice** — representative end-to-end behavior.
6. **Architecture fitness** — dependency boundaries, ownership and forbidden coupling.
7. **Security/data** — applicable trust, secret, auth and destructive-change checks.
8. **Reproducibility** — deterministic artifacts/build/release where required.

## Rules
- The coding executor must not be sole authority for acceptance.
- Tests required by the task pack are immutable to the executor unless modification is explicitly part of scope.
- Removing assertions, skipping tests or weakening validators to make CI pass is a failure unless approved by a change decision.
- Public contract changes require contract/compatibility evidence.
- A regression discovered later creates a corrective item linked to original task/evidence.

## Quality gates

```yaml
quality_gate:
  id: QG-...
  required_checks: []
  required_evidence: []
  independent_review: true
  status: UNSATISFIED | SATISFIED | WAIVED
```

## Metrics
Track first-pass acceptance, CI failure rate, escaped defects, dependency-related rework, review effort, retries, contract regressions and corrective effort. Optimize accepted delivery, not raw generated code volume.
