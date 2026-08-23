# Next Work — P13 Package 02 Construction A Execution Gate

The repository is authoritative.

## Integrated predecessor
P13-PACKAGE-02 Planning & Materialization is integrated. The follow-up scheduling-guideline reconciliation is also integrated by PR #249 at merge `722a51eef6a0a19c5e1a69c12158122f6fb5d856`; the reviewed head and merge share tree `ef03c16dcd821e02301c5824d303d22ae6224fd9`.

## First committed product Sprint
`P13-RUNTIME-IDENTITY-SESSION-01` — TASK-231..239 — COMMITTED / MATERIALIZED / NOT EXECUTED.

Construction A scope is WBS 13.2.1 identity/auth/session only. Its proof must extend the actual P13-01 Runtime chain through external auth binding -> authentication -> session -> actor context -> representative authenticated Runtime request.

Existing `SystemDefinition.permissions`, `policies` and `views` are predecessor declarations to reuse later; they are not currently projected/executed and are explicitly outside Construction A.

## Required next action
1. Keep this documentation reconciliation isolated from product implementation.
2. Review/validate/integrate the documentation-only branch under normal repository gates.
3. Reconstruct fresh `main` after that integration.
4. If Construction A execution is explicitly authorized, execute only `P13-RUNTIME-IDENTITY-SESSION-01` TASK-231..239 according to dependency order, TASK contracts and Sprint policy.
5. If Construction A execution is not explicitly authorized, stop.

## Successor forecast
Construction B (authorization + generated interaction), optional Construction C, Package Integration & Review and Documentation & Closure remain FORECAST and require fresh predecessor revalidation. `P13-PACKAGE-03` remains FORECAST / NOT STARTED.

## Carried debt
Preserve `TD-P13-01..04`; do not silently absorb them into P13-PACKAGE-02.

## Stop conditions
- no product implementation inside this documentation reconciliation;
- no P13-PACKAGE-03 execution;
- no authorization/policy/view execution inside Construction A;
- no second shared-contract family change without explicit change control;
- no mandatory provider-specific IAM/SSO topology;
- no credential/token/session secret/resolved endpoint value in immutable/durable artifacts;
- stop for ADR on any new bounded context, Builder/Runtime relation, release/environment ownership, suite topology or other L4 change.