# WBS — 13 Autonomous Runtime

## 13.0 Autonomous Runtime
Status: IN PROGRESS

### 13.1 Runtime Core — SATISFIED / CLOSED by `P13-PACKAGE-01`
- **13.1.1** Executar entidades, API, actions e workflows materializados. — SATISFIED
- **13.1.2** Executar jobs, events, files e integrations. — SATISFIED
- **13.1.3** Carregar configuration externa sem dependência do Builder. — SATISFIED

Closure evidence: `P13-PACKAGE-01`, its Construction A/B integration, `P13-PACKAGE-INTEGRATION-REVIEW-01`, and `P13-PACKAGE-DOCUMENTATION-CLOSURE-01`. Construction C was NOT JUSTIFIED.

### 13.2 Experiência e autoridade — IN PROGRESS / `P13-PACKAGE-02`
- **13.2.1** Implementar auth/session/identity bindings. — SATISFIED / INTEGRATED by `P13-RUNTIME-IDENTITY-SESSION-01`, PR #250, merge `adc739c1370df380a31ad196bf24fcdff4b0bf2d`.
- **13.2.2** Aplicar roles, permissions e policies materializadas. — MISSING / FORECAST / BLOCKED PENDING BOUNDED L3 CHANGE CONTROL.
- **13.2.3** Renderizar views/forms e interações geradas. — MISSING / FORECAST / BLOCKED PENDING BOUNDED L3 CHANGE CONTROL.

Fresh-main post-Construction-A evidence confirms existing `SystemDefinition.permissions`, `policies` and `views` remain declarative and are not sufficient by themselves for executable actor/role membership, safe policy evaluation or deterministic generated view/form binding. A minimum additive backward-compatible L3 authority decision is required before Construction B may be materialized. No L4 requirement is currently identified.

### 13.3 Autonomia operacional — FORECAST / NOT STARTED
- **13.3.1** Provar startup/operation com Builder indisponível.
- **13.3.2** Expor health/telemetry sem tornar Observe obrigatório.
- **13.3.3** Suportar upgrade/rollback conforme release/deploy contracts.

Primary forecast: `P13-PACKAGE-03`. Existing predecessor evidence may satisfy part of this WBS and must be revalidated rather than rebuilt when its Planning Sprint is authorized.
