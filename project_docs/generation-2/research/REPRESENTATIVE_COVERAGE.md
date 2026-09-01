# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Secrets / Configuration / Environment Portability coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| HashiCorp Vault | DEEP | Dynamic credentials, lease identity, TTL, renewal/revocation and agent materialization expose lifecycle that static key/value abstractions lose. | Namespaces/policy portability, response wrapping and failure/recovery of renewal paths. |
| Kubernetes Secrets + External Secrets Operator | DEEP | Separates provider-backed source refs, target materialization, refresh policy, target ownership and sync status. | Provider replacement, immutable target migration and failure evidence across refresh modes. |
| AWS Secrets Manager | DEEP | Explicit version/rotation stages and create/set/test/finish lifecycle demonstrate rotation as governed transition rather than value overwrite. | Cross-region/cross-account portability, staged alias semantics and rollback evidence. |
| SOPS | PARTIAL | Provides encrypted configuration artifact and external key-recipient boundary distinct from online secret authority. | Key groups/recipients, rotation, MAC/integrity and recovery semantics. |
| Twelve-Factor Config | DEEP | Establishes deploy-varying config outside code and orthogonal per-deploy values; useful portability baseline. | Boundaries where env-var transport becomes insufficient for leases, versions, sensitivity and audit. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
