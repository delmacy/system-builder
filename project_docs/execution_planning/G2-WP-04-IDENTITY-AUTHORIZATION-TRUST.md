# G2-WP-04 — Identity, Authorization, Trust, Secrets & Recovery

Status: CONSTRUCTION A SPRINT REVIEW PASS / CONSTRUCTION B EXECUTED / EXACT-HEAD VERIFIED / REVIEW GATE
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
Fresh-main base: `9d77cd0f02728c5280c008658e6cb264c84741ff`

## Package goal
Bind identity/authentication/federation/authorization to trust/PKI/secrets/config/security/recovery without collapsing semantic ownership. Preserve `authentication != authorization`, exact revision/currentness/locality, bounded delegation, explicit residual cohorts and non-resurrection of stale authority.

## Dependency revalidation
G2-WP-01 and G2-WP-02 are canonically closed and satisfy WP-04 semantic/revision/locality plus evidence/authority-discovery prerequisites. WP-03 is not a prerequisite. WBS-03 authority semantics precede WBS-04 closure; WBS-04 may qualify authentication/session trust realization but cannot own authorization semantics. The WBS-04 -> WBS-03 trust edge is a realization qualification edge, not authority ownership or closure-precedence reversal.

## Construction horizon
Construction A `G2-IDENTITY-AUTHORITY-FOUNDATION-01` is MATERIALIZED / EXECUTED / EXACT-HEAD VERIFIED / SPRINT REVIEW PASS with TASK-495..499 integrated and review reconciliation integrated by PR #620.

Construction B `G2-TRUST-SECRETS-RECOVERY-QUALIFICATION-01` is COMMITTED / MATERIALIZED / EXECUTED / EXACT-HEAD VERIFIED with `TASK-500 -> TASK-501 -> TASK-502 -> TASK-503 -> TASK-504` integrated in dependency order. It covers only the minimum dependency-safe WBS-04 semantics: trust/PKI qualification; secret/config desired-versus-effective lineage and presence; rotation/revocation/adoption/drainage; degraded/recovery/fencing non-strengthening; and integrated Product Proof.

Construction C remains OPTIONAL / FORECAST and must be justified by Construction B Sprint Review findings rather than assumed.

## Product boundary
Additive public structural contracts under `packages/contracts/identity-authorization/**` plus focused `tests/product/g2-trust-secrets-recovery*.test.ts`. Existing runtime identity/session/permission behavior is predecessor evidence only and must not be silently redefined.

## Explicit exclusions
No provider/SSO/CA/Vault/KMS SDK selection, persistence, runtime topology, UI, workflow, Brownfield, deployment, physical actuation, Production Readiness implementation, provider admission/cutover, trust-store implementation, secret storage, raw secret/private-key material, key generation, certificate issuance, recovery execution, or DEFER/DO_NOT_BUILD absorption.

## Closure obligations carried
- `authentication != authorization`; `cryptographic validity != trust/authorization`; provider-issued/valid cannot manufacture authority.
- Trust domain/anchor/bundle/credential/status evidence is revision-, locality-, purpose- and currentness-qualified; `UNKNOWN/INCONCLUSIVE` never becomes trusted/allowed by omission.
- `secret reference != secret value`; durable evidence contains references/generation/currentness, never raw secret material.
- `ABSENT != null != DEFAULT != DELETE`; desired config != distributed/materialized config != consumer-effective config.
- Rotation/revocation is population convergence, not object replacement or provider acknowledgement; residual consumer/verifier/cache/offline/recovery cohorts remain explicit until drained/reconciled.
- Degraded mode has an authority ceiling; recovery/restore/failover cannot expand authority or resurrect stale revoked trust/config/credential state.
- Ambiguous unsafe external effects preserve `UNKNOWN -> reconcile-before-retry` unless duplicate safety is independently proven.
- Product Proof remains distinct from Production Readiness.

## Current gate
Construction B TASK-500..504 are integrated and exact-head verified; TASK-504 was integrated by PR #629 and repository memory was reconciled by PR #631. The next mandatory gate is Construction B Sprint Review across the authoritative TASK chain and proof obligations. Do not materialize or execute Construction C before that review passes and fresh-main revalidation proves it necessary for the Package Goal.
