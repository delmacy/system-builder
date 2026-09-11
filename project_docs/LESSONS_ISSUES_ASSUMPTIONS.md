# Assumptions, Issues & Lessons Registers

## Assumptions
Registrar hipótese que afeta planejamento e sua condição de validação. Ex.: capacidade de GitHub Actions, provider substituível, runtime target.

## Issues
Problema atual com owner, impacto, bloqueios e resolução esperada.

No unresolved G2-WP-06 issue remains inside the Package Goal at Documentation & Closure. Concrete provider/device realization, operational enforcement, safety qualification and Production Readiness are exclusions/future obligations, not hidden closure issues.

## Lessons learned
Após sprint/review/milestone registrar: hipótese, resultado, evidência e mudança recomendada. Lição que altera regra durável deve virar ADR/doc/fitness function, não permanecer somente neste registro.

### G2-WP-06 — Provider/Brownfield/Physical-Peripheral — 2026-09-11
- **Hypothesis:** provider/API/feature parity could be treated as a useful support shortcut. **Result:** rejected; support must remain multidimensional and owner/revision/currentness/locality qualified. **Evidence:** Construction A+B Product Proof and Package Integration & Review. **Carry-forward:** successor packages must consume provider qualification without promoting parity to semantic equivalence, trust or authority.
- **Hypothesis:** green repository CI alone would be enough for integration review. **Result:** rejected; semantic review found locality/currentness and recovery-proof inconsistencies that deterministic gates alone did not establish as semantically safe. **Carry-forward:** exact-head CI remains necessary evidence, never a substitute for semantic predecessor-to-successor review.
- **Hypothesis:** reconnect/rebinding success could imply convergence. **Result:** rejected; stale authority, conflicting canonical truth and residual cohorts require explicit authoritative reconciliation/drainage. **Carry-forward:** `UNKNOWN -> reconcile-before-retry`, canonical-source uniqueness and visible residual cohorts remain proof obligations in durable execution/storage/messaging successors.
- **Hypothesis:** physical connectivity/capability could imply operational authority or confirmed effect. **Result:** rejected; connectivity, intent, owning-domain authorization, telemetry and confirmed physical effect remain separate facts. **Carry-forward:** no successor may inherit generic physical actuation authority from WP-06.
