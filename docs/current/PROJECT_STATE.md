# Project State

Date: 2026-08-23

## Repository
`delmacy/system-builder` is canonical. P12 and `P13-PACKAGE-01` are CLOSED. `P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience` is ACTIVE in Planning & Materialization.

## Integrated maturity
- P1-P11: integrated.
- `P12-PACKAGE-01`: CLOSED.
- `P13-PACKAGE-01 — Autonomous Runtime Functional Execution`: CLOSED.
- P13 Runtime Core WBS 13.1.1-13.1.3: SATISFIED/CLOSED.
- `P13-PACKAGE-02`: ACTIVE / PLANNING & MATERIALIZATION COMPLETE on planning branch; Construction A materialized only.
- `P13-RUNTIME-IDENTITY-SESSION-01`: COMMITTED / MATERIALIZED, TASK-231..239, NOT EXECUTED.
- P13-PACKAGE-02 Construction B: FORECAST.
- P13-PACKAGE-02 Construction C: FORECAST / CONDITIONAL.
- P13-PACKAGE-02 Package Integration & Review: FORECAST.
- P13-PACKAGE-02 Documentation & Closure: FORECAST.
- `P13-PACKAGE-03`: FORECAST / NOT STARTED.

## P13 Package 02 fresh-main planning findings
Planning base: `2186f2ffa32e00d06dbe2230498a3d748a5d6533`, tree `9644bcc20ac5d6f2eeb5e97fa1f7ea2ae4b82265`.

- generated identity/auth/session execution: MISSING;
- WBS 27 Person/Actor/User-ServiceIdentity and auth-provider binding: authoritative domain model, not yet executable Runtime implementation;
- existing `SystemDefinition.permissions`, `policies`, `views`: REUSE declarative inputs, not currently projected/executed by Runtime;
- existing external EnvironmentProfile/SecretResolver no-value-leak boundary: REUSE;
- no generated Runtime view/form renderer found;
- no required L4 architecture change identified.

Construction A therefore targets only WBS 13.2.1 identity/session. It explicitly authorizes the minimum additive backward-compatible SystemDefinition identity/auth-provider/session L3 semantics in TASK-231 and carries them through Compiler/Release/Deploy/Runtime to an authenticated actor context proof.

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
Integrate only the Planning & Materialization Sprint after exact-head Deterministic CI + Heavy Product Tests and review confirm planning-only scope. After merge, reconstruct fresh `main` and stop before Construction A execution unless separately authorized under repository policy.

Any required second shared-contract family change, new bounded context, Builder/Runtime ownership change, release/environment ownership change or other L4 decision is an escalation; L4 requires ADR.