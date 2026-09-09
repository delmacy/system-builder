# G2-WP04-PLANNING-MATERIALIZATION-01 — Sprint Report

Status: PLANNING COMPLETE / REVIEW PR TO BE OPENED / EXACT-HEAD CI PENDING
Date: 2026-09-09
Fresh-main base: `358b5b61616ab72d556505d330c1c9552bdb7d6b`
Branch: `sprint/G2-WP04-PLANNING-MATERIALIZATION-01`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`

## Outcome
DAG revalidation selected `G2-WP-04 — Identity, Authorization, Trust, Secrets & Recovery` as the first dependency-safe successor. WP-01 and WP-02 are canonically closed; WP-03 is closed but is not a typed prerequisite of WP-04.

Planning materialized only Construction A `G2-IDENTITY-AUTHORITY-FOUNDATION-01` with `TASK-495 -> TASK-496 -> TASK-497 -> TASK-498 -> TASK-499`. No product implementation occurred.

## Boundary
The proposed additive L3 product surface is `packages/contracts/identity-authorization/**` plus focused Product Proof. Existing P13 runtime identity/session/permission work remains coexistence/predecessor evidence and is not silently rewritten.

Construction A owns identity/authentication separation, revision-pinned authorization, bounded delegation/break-glass, revocation/deprovision residual cohorts and integrated proof. Construction B remains FORECAST for trust/PKI/secrets/config/recovery qualification and rotation/recovery. Construction C remains OPTIONAL / FORECAST.

## Proof obligations
Preserve exact identity/authority/source revisions, evidence/currentness/locality, `authentication != authorization`, UNKNOWN/PARTIAL, no authority amplification, explicit residual session/token/cache/offline cohorts and `acknowledgement != convergence`. Reject latest substitution, authenticated=>allowed promotion, scope expansion, hidden cohorts and stale-authority resurrection.

## Exclusions
No provider/SSO mechanics, persistence, runtime topology, UI, workflow, deployment, Brownfield, trust-store/PKI/secret storage implementation, recovery execution, Production Readiness or unrelated DEFER/DO_NOT_BUILD findings.

## Next gate
This Planning & Materialization branch must pass exact-head CI/review and integrate before TASK-495 product mutation. Reconstruct fresh main after merge and execute only the dependency-safe TASK chain in order.