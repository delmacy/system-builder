# G2-WP-04 — Identity, Authorization, Trust, Secrets & Recovery

Status: CONSTRUCTION A SPRINT REVIEW PASS / CONSTRUCTION B FORECAST
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
Fresh-main base: `73a5de3cfa6fb2af057c1797a8cdf1ac5d3b98fe`

## Package goal
Bind identity/authentication/federation/authorization to trust/PKI/secrets/config/security/recovery without collapsing semantic ownership. Preserve `authentication != authorization`, exact revision/currentness/locality, bounded delegation, explicit residual cohorts and non-resurrection of stale authority.

## Dependency revalidation
G2-WP-01 and G2-WP-02 are canonically closed and satisfy WP-04 semantic/revision/locality plus evidence/authority-discovery prerequisites. WP-03 is not a prerequisite. WBS-03 authority semantics precede WBS-04 trust/config closure; WBS-04 may qualify authentication/session trust but cannot own authorization semantics.

## Construction horizon
Construction A `G2-IDENTITY-AUTHORITY-FOUNDATION-01` is MATERIALIZED / EXECUTED / EXACT-HEAD VERIFIED / SPRINT REVIEW PASS with TASK-495..499 integrated in dependency order and Sprint Review integrated by PR #619. Construction B remains FORECAST for trust/PKI/secrets/config/recovery qualification and rotation/recovery behavior. Construction C remains OPTIONAL / FORECAST.

## Proposed product boundary
Additive public structural contracts under `packages/contracts/identity-authorization/**` plus focused Product Proof. Existing runtime identity/session/permission behavior is predecessor evidence only and must not be silently redefined.

## Explicit exclusions
No provider/SSO SDK selection, persistence, runtime topology, UI, workflow, Brownfield, deployment, physical actuation, Production Readiness implementation, trust-store implementation, secret storage, key generation, certificate issuance, recovery execution, or DEFER/DO_NOT_BUILD absorption.

## Closure obligations carried
No authority amplification through authentication, delegation, break-glass or provider mapping; exact identity/authority revisions; locality-qualified decisions; revocation/deprovision leaves explicit residual session/token/cache/offline cohorts; desired trust/config state remains distinct from consumer-effective state; rotation/recovery cannot resurrect stale authority.

## Current gate
Revalidate the integrated Construction A review against fresh `main@73a5de3cfa6fb2af057c1797a8cdf1ac5d3b98fe` and the pinned Generation 2 state/WBS/dependency graph/Work Package Design/Ready for Worker Handoff. If no blocker or drift remains, Planning & Materialization may promote only the minimum dependency-safe Construction B slice already forecast. Construction B product execution remains forbidden until that materialization is integrated and exact-head verified.