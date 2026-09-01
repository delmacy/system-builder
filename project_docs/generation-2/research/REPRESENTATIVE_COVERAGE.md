# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Lifecycle / Versioning / Evolution / Migration coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| Kubernetes API lifecycle | DEEP | Explicit multi-version serving, round-trip conversion, storage/preferred version staging, stability-qualified deprecation windows and observable deprecated use. | Conversion evidence ownership, stored-version migration and cross-capability sunset policy. |
| Stripe API lifecycle | DEEP | Request/account/webhook version binding, backward-compatible monthly evolution, breaking major versions, testable explicit version selection and bounded rollback. | Historical-event semantics, consumer-specific compatibility evidence and sunset governance. |
| PostgreSQL 18 lifecycle | DEEP | Distinguishes minor update from major migration and exposes pg_upgrade, dump/restore and logical-replication paths with transition-specific prerequisites. | Irreversible/data-coupled transition proof, restore/roll-forward and application compatibility. |
| OpenTofu state/provider evolution | DEEP | Separates constraints, selected/locked provider revision, state lineage/serial and explicit provider replacement with mandatory backup. | State schema evolution, provider migration compatibility and trust/provenance of replacement. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
