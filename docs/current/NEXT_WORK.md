# Next Work — G2-WP-04 Construction B / TASK-504 gate

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
G2-WP-01, G2-WP-02 and G2-WP-03 are CANONICALLY CLOSED. Construction A `G2-IDENTITY-AUTHORITY-FOUNDATION-01` is MATERIALIZED / EXECUTED / EXACT-HEAD VERIFIED / SPRINT REVIEW PASS. Fresh main is `4fad8dbe61265139577fef1f181bfe161d0ba531` after PR #627 integrated TASK-503.

## Active construction
G2-WP-04 Construction B `G2-TRUST-SECRETS-RECOVERY-QUALIFICATION-01` is COMMITTED / MATERIALIZED / ACTIVE with:

`TASK-500 -> TASK-501 -> TASK-502 -> TASK-503 -> TASK-504`

- TASK-500: integrated.
- TASK-501: integrated by PR #623.
- TASK-502: integrated by PR #625; cohort-aware rotation/revocation/adoption/drainage semantics are on main.
- TASK-503: integrated by PR #627; degraded/recovery/fencing non-strengthening semantics and explicit residual recovery cohorts are on main.
- TASK-504: next dependency-safe task; integrated Product Proof and Construction B closure evidence.

## Next mandatory gate
First integrate the bounded repository-memory reconciliation that records the exact post-TASK-503 state. After that exact-head gate passes and the repair integrates, reconstruct fresh main, re-check blockers/reviews/mergeability and execute only TASK-504. TASK-504 must prove the integrated Construction B semantics without acquiring new semantic ownership or turning Product Proof into Production Readiness.

Do not absorb provider/SSO/CA/Vault/KMS SDK mechanics, provider admission/cutover, persistence, runtime topology, UI, workflow, deployment, Brownfield, trust-store/secret-storage implementation, raw secret/key material, key generation, certificate issuance, recovery execution, Production Readiness, physical actuation, causality or unrelated DEFER/DO_NOT_BUILD findings.