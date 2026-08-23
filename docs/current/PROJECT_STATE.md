# Project State

Date: 2026-08-23

## Repository
`delmacy/system-builder` is canonical. P12 and `P13-PACKAGE-01` are CLOSED. `P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience` is ACTIVE. Its Planning & Materialization Sprint is integrated; Construction A is committed/materialized but not executed.

## Integrated maturity
- P1-P11: integrated.
- `P12-PACKAGE-01`: CLOSED.
- `P13-PACKAGE-01 — Autonomous Runtime Functional Execution`: CLOSED.
- P13 Runtime Core WBS 13.1.1-13.1.3: SATISFIED/CLOSED.
- `P13-PACKAGE-02` Planning & Materialization: INTEGRATED by PR #248; planning head `176abee72849747276a7176de09e2adcf990e057`, Deterministic CI #601 PASS and Heavy Product Tests #22 PASS.
- Post-planning documentation-guideline reconciliation: INTEGRATED by PR #249 at merge `722a51eef6a0a19c5e1a69c12158122f6fb5d856`; reviewed head `532630889bf7b9553fde211d54c1ec411608deed`, Deterministic CI #602 PASS and Heavy Product Tests #24 PASS; merge tree equals reviewed-head tree `ef03c16dcd821e02301c5824d303d22ae6224fd9`.
- `P13-RUNTIME-IDENTITY-SESSION-01`: COMMITTED / MATERIALIZED, TASK-231..239, NOT EXECUTED.
- P13-PACKAGE-02 Construction B: FORECAST.
- P13-PACKAGE-02 Construction C: FORECAST / CONDITIONAL.
- P13-PACKAGE-02 Package Integration & Review: FORECAST.
- P13-PACKAGE-02 Documentation & Closure: FORECAST.
- `P13-PACKAGE-03`: FORECAST / NOT STARTED.

## P13 Package 02 planning findings
- generated identity/auth/session execution: MISSING before Construction A;
- WBS 27 Person/Actor/User-ServiceIdentity and auth-provider binding: authoritative domain model, not yet executable Runtime implementation;
- existing `SystemDefinition.permissions`, `policies`, `views`: REUSE declarative inputs, not currently projected/executed by Runtime;
- existing external EnvironmentProfile/SecretResolver no-value-leak boundary: REUSE;
- no generated Runtime view/form renderer found;
- no required L4 architecture change identified.

Construction A targets only WBS 13.2.1 identity/session. TASK-231 carries explicit bounded L3 authority for the minimum additive backward-compatible SystemDefinition identity/auth-provider/session semantics and carries them through Compiler/Release/Deploy/Runtime to an authenticated actor-context proof.

Authorization roles/permissions/policies and generated views/forms remain Construction B forecast and must not be pulled into Construction A.

## Security gate
- authentication must fail closed for unknown/disabled/malformed identity state;
- missing/incompatible auth binding fails closed;
- invalid/expired session fails closed;
- authentication does not imply authorization;
- no resolved credential/provider/session secret/token/endpoint value enters immutable/durable evidence;
- Runtime ordinary operation must not require Builder or Observe;
- no provider-specific mandatory IAM platform or silent privilege inference.

## Carried debt from P13 Package 01
- `TD-P13-01` HIGH before production/fleet claims — job overlap/retry/idempotency;
- `TD-P13-02` MEDIUM — HTTP integration timeout/response bounds;
- `TD-P13-03` MEDIUM — file realpath/symlink and binary/streaming hardening;
- `TD-P13-04` LOW/MEDIUM — generated Runtime maintainability.

These remain explicit debt and are not absorbed into P13-PACKAGE-02 without WBS/dependency authority.

## Current gate
Repository authority is now on post-PR-249 `main`. `P13-RUNTIME-IDENTITY-SESSION-01` is the first committed product Sprint but remains NOT EXECUTED. Do not execute it merely because planning is integrated; execution requires explicit authorization under repository policy. Construction B/C, Package Review/Closure and P13-PACKAGE-03 remain forecast and require fresh predecessor revalidation.

Any required second shared-contract family change, new bounded context, Builder/Runtime ownership change, release/environment ownership change or other L4 decision is an escalation; L4 requires ADR.