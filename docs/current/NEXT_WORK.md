# Next Work — G2-WP-04 Construction B / TASK-503 gate

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
G2-WP-01, G2-WP-02 and G2-WP-03 are CANONICALLY CLOSED. Construction A `G2-IDENTITY-AUTHORITY-FOUNDATION-01` is MATERIALIZED / EXECUTED / EXACT-HEAD VERIFIED / SPRINT REVIEW PASS. Fresh main is `2084ce0c52ae0f424827d0b2027597b544b8c724` after PR #625 integrated TASK-502.

## Active construction
G2-WP-04 Construction B `G2-TRUST-SECRETS-RECOVERY-QUALIFICATION-01` is COMMITTED / MATERIALIZED / ACTIVE with:

`TASK-500 -> TASK-501 -> TASK-502 -> TASK-503 -> TASK-504`

- TASK-500: integrated.
- TASK-501: integrated by PR #623.
- TASK-502: integrated by PR #625; cohort-aware rotation/revocation/adoption/drainage semantics are now on main.
- TASK-503: next dependency-safe task; degraded/recovery/fencing non-strengthening semantics.
- TASK-504: dependency-blocked on TASK-503.

## Next mandatory gate
First integrate the bounded repository-memory reconciliation that records the exact post-TASK-502 state. After that exact-head gate passes and the repair integrates, reconstruct fresh main, re-check blockers/reviews/mergeability and execute only TASK-503. Do not advance TASK-504 before its declared dependency and gates.

Do not absorb provider/SSO/CA/Vault/KMS SDK mechanics, provider admission/cutover, persistence, runtime topology, UI, workflow, deployment, Brownfield, trust-store/secret-storage implementation, raw secret/key material, key generation, certificate issuance, recovery execution, Production Readiness, physical actuation, causality or unrelated DEFER/DO_NOT_BUILD findings.