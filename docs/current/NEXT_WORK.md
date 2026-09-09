# Next Work — G2-WP-04 Construction B / TASK-500 gate

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
G2-WP-01, G2-WP-02 and G2-WP-03 are CANONICALLY CLOSED. Construction A `G2-IDENTITY-AUTHORITY-FOUNDATION-01` is MATERIALIZED / EXECUTED / EXACT-HEAD VERIFIED / SPRINT REVIEW PASS. Fresh main at materialization entry is `ef992caa9a4bfe4ca33869e82af46be6be78580f` after PR #620.

## Active materialization
G2-WP-04 Construction B `G2-TRUST-SECRETS-RECOVERY-QUALIFICATION-01` is COMMITTED / MATERIALIZED / NOT EXECUTED with:

`TASK-500 -> TASK-501 -> TASK-502 -> TASK-503 -> TASK-504`

- TASK-500: trust-domain, anchor/bundle, credential/status/currentness qualification without authorization promotion.
- TASK-501: secret/config reference, desired/materialized/consumer-effective lineage and presence semantics without secret-value persistence.
- TASK-502: cohort-aware rotation/revocation/adoption/drainage across trust and secret/config generations.
- TASK-503: degraded/recovery/fencing semantics that cannot expand or resurrect stale authority/trust/config state.
- TASK-504: integrated positive/negative/adversarial/recovery Product Proof.

## Next mandatory gate
Do not execute TASK-500 until the Planning & Materialization head passes exact-head repository gates and is integrated. After integration, reconstruct fresh main, re-check blockers/reviews/mergeability, then execute only TASK-500. Subsequent tasks remain blocked by their declared dependency chain.

Do not absorb provider/SSO/CA/Vault/KMS SDK mechanics, provider admission/cutover, persistence, runtime topology, UI, workflow, deployment, Brownfield, trust-store/secret-storage implementation, raw secret/key material, key generation, certificate issuance, recovery execution, Production Readiness, physical actuation, causality or unrelated DEFER/DO_NOT_BUILD findings.