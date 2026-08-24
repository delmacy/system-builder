# Project State

Date: 2026-08-23

## Repository
`delmacy/system-builder` is canonical. P12 and `P13-PACKAGE-01` are CLOSED. `P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience` is ACTIVE.

## Integrated maturity
- P1-P11: integrated.
- `P12-PACKAGE-01`: CLOSED.
- `P13-PACKAGE-01 — Autonomous Runtime Functional Execution`: CLOSED; WBS 13.1.1-13.1.3 SATISFIED/CLOSED. Its Construction B (TASK-221..230, Runtime services/bindings) is predecessor substrate and must not be recreated as P13-PACKAGE-02 work.
- `P13-PACKAGE-02` Planning & Materialization: INTEGRATED by PR #248; planning head `176abee72849747276a7176de09e2adcf990e057`, Deterministic CI #601 PASS and Heavy Product Tests #22 PASS.
- Documentation authority reconciliations: PR #249 integrated at `722a51eef6a0a19c5e1a69c12158122f6fb5d856`; PR #251 integrated at `169cdfc5ea4df8e5e5e4e30befa0ebd386314227`.
- `P13-RUNTIME-IDENTITY-SESSION-01` / Construction A / WBS 13.2.1: INTEGRATED by PR #250. Exact reviewed head `b149f823eddcc3e2589ba42e3794f01879f23629`; Deterministic CI #616 PASS; Heavy Product Tests #39 PASS; merge `adc739c1370df380a31ad196bf24fcdff4b0bf2d`.
- TASK-231..239 remain the nine authoritative Construction A TASK commits. `a60f1d818e77f1f8bc00e9533924a8916cda7de9` is the bounded verification-only correction; `b149f823eddcc3e2589ba42e3794f01879f23629` adds the required Sprint Report only.
- P13-PACKAGE-02 Construction B (WBS 13.2.2-13.2.3): FORECAST / BLOCKED PENDING BOUNDED L3 CHANGE CONTROL.
- P13-PACKAGE-02 Construction C: FORECAST / CONDITIONAL.
- P13-PACKAGE-02 Package Integration & Review: FORECAST.
- P13-PACKAGE-02 Documentation & Closure: FORECAST.
- `P13-PACKAGE-03`: FORECAST / NOT STARTED.

## Construction A integrated result
Construction A now carries explicit identity/auth-provider/session declarations through Compiler/Release/Deploy/Runtime, reuses the existing external EnvironmentProfile/SecretResolver reference-only boundary, authenticates an explicitly mapped active identity, issues/validates bounded sessions, propagates actor context on a representative Runtime action path, and fails closed for invalid/disabled/unmapped/expired/unauthenticated paths.

Authentication does not imply authorization. No roles, permission grants, policy decisions or generated views/forms were introduced by Construction A. EnvironmentProfile schema and Builder/Runtime ownership remain unchanged; no L4 architecture change was introduced.

## Fresh-main P13-PACKAGE-02 revalidation after Construction A
Revalidation base: `adc739c1370df380a31ad196bf24fcdff4b0bf2d`.

- WBS 13.2.1 identity/auth/session: SATISFIED by integrated Construction A.
- WBS 13.2.2 authorization: still MISSING as executable Runtime behavior.
- WBS 13.2.3 generated interaction: still MISSING as executable Runtime behavior.
- Canonical `SystemDefinition.permissions` remains only `role/resource/actions`; there is no executable actor-to-role/membership binding in the current Runtime model.
- Canonical `SystemDefinition.policies` remains an opaque free-text `statement`; executable policy semantics must not be inferred from text.
- Canonical `SystemDefinition.views` carries only view identity/kind/requirement references; it does not declare deterministic entity/field/action binding sufficient for generated interaction.
- Compiler/Runtime identity/session projection now exists, but permissions/policies/views are still not projected or executed.
- WBS 27 provides organization/role/authorization domain authority, but does not itself define the minimum executable shared-contract representation needed by Construction B.
- No new L4 requirement was identified by this revalidation.

Therefore Construction B remains necessary for the Package Goal, but current authority does not permit inventing the required additional shared-contract semantics. Before Construction B can be materialized/executed, a bounded L3 change-control decision must explicitly authorize the minimum additive backward-compatible representation for actor/role-membership linkage, deterministic permission/policy evaluation, and generated view/form binding. This must reuse existing `permissions`, `policies` and `views` rather than replace them.

## Security gate
- authentication must remain distinct from authorization;
- authorization must fail closed and must never infer privilege from identity names/order/defaults;
- free-text policy statements are not executable authority;
- Runtime ordinary operation must not require Builder or Observe;
- no resolved credential/provider/session secret/token/endpoint value enters immutable/durable evidence;
- no provider-specific mandatory IAM platform or silent privilege inference.

## Carried debt from P13 Package 01
- `TD-P13-01` HIGH before production/fleet claims — job overlap/retry/idempotency;
- `TD-P13-02` MEDIUM — HTTP integration timeout/response bounds;
- `TD-P13-03` MEDIUM — file realpath/symlink and binary/streaming hardening;
- `TD-P13-04` LOW/MEDIUM — generated Runtime maintainability.

These remain explicit debt and are not absorbed into P13-PACKAGE-02 without WBS/dependency authority.

## Current gate
Construction A is integrated. The next product gate is bounded L3 change control for P13-PACKAGE-02 Construction B. Do not materialize or execute Construction B until that authority is explicitly accepted. Construction C, Package Integration & Review, Documentation & Closure and P13-PACKAGE-03 remain forecast.

Any new bounded context, Builder/Runtime ownership change, release/environment ownership change, mandatory provider-specific IAM/UI topology or other L4 decision is an escalation and requires ADR.
