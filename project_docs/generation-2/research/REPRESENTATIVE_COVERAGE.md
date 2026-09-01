# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state history; this ledger is append-oriented as research advances.

## Security / Resilience / Failure Recovery coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| NIST Cybersecurity Framework 2.0 | DEEP | Separates Govern/Identify/Protect/Detect/Respond/Recover and provides outcome taxonomy without pretending to own implementation. | Machine-readable control/recovery mapping and SB authority boundaries. |
| NIST SSDF / SP 800-218 family | DEEP | Separates secure-development risk reduction from runtime resilience/recovery execution. | Supply-chain/security evidence linkage to artifact/release proof. |
| AWS Well-Architected Reliability | DEEP | RTO/RPO, DR strategy, recovery testing, configuration drift and automated recovery. | Provider-neutral objective/proof model and multi-provider comparison. |
| Kubernetes disruption semantics | DEEP | Voluntary vs involuntary disruption, PDB constraints and graceful termination demonstrate bounded continuity semantics. | Stateful disruption, failover semantics and runtime-specific degradation. |
| AWS retry/circuit-breaker guidance | DEEP | Distinguishes transient retry/backoff/idempotency from fail-fast circuit containment. | Concrete SB action/integration retry ownership during repo archaeology. |
| PostgreSQL 18 PITR | DEEP | Concrete backup/WAL continuity, restore targets, archive failure and recovery timeline lineage. | Restore proof, backup lineage and portability boundaries across data providers. |

Historical representative coverage for prior capabilities is preserved in prior dossiers/state; no earlier status is superseded by this compact ledger update.
