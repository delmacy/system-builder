# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Extension / Plugin / Marketplace Architecture coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| Backstage backend plugins/modules | DEEP | Capability-owned extension points, bounded module ownership and ordered initialization. | Frontend extension configuration, deprecation and package provenance. |
| VS Code extensions | DEEP | Portable manifest contrast: identity, host compatibility, contributions, activation, dependencies, runtime placement and trust restrictions. | Permission granularity, update/rollback evidence and private-marketplace portability. |
| Kubernetes CRDs/operators | DEEP | Typed/versioned API extension, served/storage version coexistence, conversion and host RBAC/audit boundaries. | CRD/operator packaging, admission authority and failure/isolation evidence. |
| OSGi | DEEP | Requirements/capabilities with version ranges plus explicit installed-bundle lifecycle and resolver semantics. | Service dynamics, update/refresh semantics and persisted-state migration. |
| WordPress plugins/hooks | PARTIAL | Clear procedural extension points and activation/deactivation/uninstall separation as a contrasting ecosystem. | Dependency-resolution depth, provenance/trust and practical isolation limitations. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
