# G2-IDENTITY-AUTHORITY-FOUNDATION-01

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: G2-WP-04
Base: `358b5b61616ab72d556505d330c1c9552bdb7d6b`

## Goal
Establish the minimum portable identity/authentication/authorization constitution before trust/secrets/recovery realization.

## TASK DAG
`TASK-495 -> TASK-496 -> TASK-497 -> TASK-498 -> TASK-499`

- TASK-495: revision-pinned identity, authentication evidence and actor-context boundary.
- TASK-496: deterministic authorization request/decision envelope with locality and explicit authority revision.
- TASK-497: delegation and break-glass non-amplification constraints.
- TASK-498: revocation/deprovision state and explicit residual authority cohorts.
- TASK-499: integrated/adversarial Product Proof.

## Allowed product boundary
`packages/contracts/identity-authorization/**`, focused `tests/product/g2-identity-authorization*.test.ts`, and the active TASK spec.

## Forbidden scope
Runtime implementation, persistence, provider/SSO mechanics, trust-store/PKI/secrets/config implementation, UI, workflow, deployment, Brownfield, Production Readiness and unrelated findings.

## Proof constitution
Positive and adversarial proof must preserve exact revisions, source evidence/currentness/locality, `authentication != authorization`, no implicit role/permission grant, no delegation/break-glass amplification, no stale-authority resurrection, and explicit residual cohorts.