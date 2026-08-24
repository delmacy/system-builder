# Next Work — P13 Package 02 Construction B L3 Change-Control Gate

The repository is authoritative.

## Integrated predecessor
`P13-RUNTIME-IDENTITY-SESSION-01` Construction A / WBS 13.2.1 is integrated by PR #250 at merge `adc739c1370df380a31ad196bf24fcdff4b0bf2d` from exact reviewed head `b149f823eddcc3e2589ba42e3794f01879f23629`.

Exact-head evidence:
- Deterministic CI #616 — PASS.
- Heavy Product Tests #39 — PASS.

TASK-231..239 remain the authoritative Construction A task chain. Authentication/session/actor context is integrated and must be reused rather than recreated.

## Fresh-main revalidation result
P13-PACKAGE-02 Construction B remains required for WBS 13.2.2-13.2.3, but is BLOCKED before materialization by bounded L3 change control.

Current contract evidence:
- `permissions` already declares `role/resource/actions`, but no executable identity/member -> role linkage exists;
- `policies` is free-text `statement` and must not be interpreted as executable policy language;
- `views` already declares view identity/kind but lacks deterministic entity/field/action binding for generated Runtime interaction;
- Compiler/Runtime currently projects identity/session but not authorization or generated-view semantics.

WBS 27 establishes organization/roles/contextual authorization domain authority, but it does not by itself authorize a new executable shared-contract shape. No L4 requirement is currently identified.

## Required next action
1. Keep Construction B `FORECAST / BLOCKED` until explicit bounded L3 change control is accepted.
2. The change-control decision must define only the minimum additive backward-compatible semantics required to reuse existing `SystemDefinition.permissions`, `policies` and `views` for:
   - explicit actor/identity membership or role linkage;
   - deterministic permission evaluation and a bounded non-free-text policy representation where necessary;
   - deterministic view/form binding to existing Runtime entities/actions;
   - auditable allow/deny result without silent privilege inference.
3. Preserve authentication != authorization and fail closed for missing/ambiguous membership, permission or policy state.
4. After L3 authority is accepted and integrated, reconstruct fresh `main`, revalidate once more, and only then materialize at most one Construction B Sprint with committed TASKs.
5. Do not execute Construction B merely from this repository-memory reconciliation.

## Distinguish predecessor work
The already integrated `P13-PACKAGE-01` Construction B / TASK-221..230 covers Runtime jobs/events/files/integrations and external bindings. It is predecessor substrate and must not be recreated or treated as P13-PACKAGE-02 Construction B.

## Successor forecast
- P13-PACKAGE-02 Construction B: FORECAST / BLOCKED PENDING L3 CHANGE CONTROL.
- Construction C: FORECAST / CONDITIONAL.
- Package Integration & Review: FORECAST.
- Documentation & Closure: FORECAST.
- `P13-PACKAGE-03`: FORECAST / NOT STARTED.

## Carried debt
Preserve `TD-P13-01..04`; do not silently absorb them into P13-PACKAGE-02.

## Stop conditions
- no Construction B product implementation before accepted L3 authority and subsequent materialization;
- no inferred authorization from successful authentication;
- no executable interpretation of free-text policies;
- no provider-specific IAM/SSO framework or mandatory UI framework;
- no credential/token/session secret/resolved endpoint value in immutable/durable artifacts;
- stop for ADR on any new bounded context, Builder/Runtime relation, release/environment ownership, suite topology or other L4 change.
