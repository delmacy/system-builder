# P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience

Status: ACTIVE / CONSTRUCTION A INTEGRATED / CONSTRUCTION B BLOCKED PENDING L3 CHANGE CONTROL
Milestone: M13
Primary WBS: 13.2.1-13.2.3
Predecessor: P13-PACKAGE-01 CLOSED
Planning Sprint: `P13-AUTONOMOUS-RUNTIME-IDENTITY-AUTHORITY-PLANNING-01`

## Package goal
Make the autonomous client runtime actor-aware and usable: authenticate/session-bind identities, enforce materialized roles/permissions/policies, and render generated views/forms/interactions without consulting the Builder during normal operation.

## Planning basis
Planning & Materialization was integrated by PR #248 from planning base `2186f2ffa32e00d06dbe2230498a3d748a5d6533`, tree `9644bcc20ac5d6f2eeb5e97fa1f7ea2ae4b82265`.

`P13-PACKAGE-01` is CLOSED. Its generated Runtime Core, including its own Construction B TASK-221..230 for jobs/events/files/integrations and external bindings, is predecessor evidence and must not be recreated as P13-PACKAGE-02 Construction B.

## Construction A — Identity and session binding
Sprint: `P13-RUNTIME-IDENTITY-SESSION-01`
Status: INTEGRATED
Tasks: TASK-231..239
Primary WBS: 13.2.1

Integrated evidence:
- PR #250;
- exact reviewed head `b149f823eddcc3e2589ba42e3794f01879f23629`;
- Deterministic CI #616 PASS;
- Heavy Product Tests #39 PASS;
- merge `adc739c1370df380a31ad196bf24fcdff4b0bf2d`.

TASK-231..239 remain the nine authoritative Construction A commits. `a60f1d818e77f1f8bc00e9533924a8916cda7de9` is a bounded verification-only correction and `b149f823eddcc3e2589ba42e3794f01879f23629` adds the repository-required Sprint Report; neither expands product scope.

Delivered result: explicit identity/auth-provider/session declarations are carried through the real SystemDefinition -> Compiler -> Release -> Deploy -> autonomous Runtime chain; external auth binding is reused; active identities authenticate; bounded sessions issue/validate/expire; actor context reaches a representative authenticated Runtime action; invalid/disabled/unmapped/expired/unauthenticated paths fail closed.

Authentication does not imply authorization. No role/permission/policy grant or generated view/form execution was introduced. EnvironmentProfile is unchanged and no L4 boundary change was required.

WBS 13.2.1: SATISFIED on integrated `main`.

## Post-Construction-A fresh-main revalidation
Revalidation base: `adc739c1370df380a31ad196bf24fcdff4b0bf2d`.

Actual gap after Construction A:
- WBS 13.2.2 remains MISSING as executable Runtime authorization;
- WBS 13.2.3 remains MISSING as generated Runtime interaction;
- existing `SystemDefinition.permissions` remains `role/resource/actions` without executable identity/member-to-role linkage;
- existing `SystemDefinition.policies` remains opaque free-text `statement`; executable policy behavior must not be inferred from prose;
- existing `SystemDefinition.views` remains id/kind/requirement references without deterministic entity/field/action binding;
- Compiler/Runtime now projects identity/session, but still does not project/evaluate authorization or generated-view semantics;
- WBS 27 remains the domain authority for organizations, memberships, roles and contextual authorization, but does not itself define the minimum executable shared-contract representation.

No new L4 boundary, new bounded context, Builder/Runtime ownership shift, release/environment ownership shift or provider-specific IAM/UI topology was identified as necessary.

## Construction B — Authorization and generated interaction
Status: FORECAST / BLOCKED PENDING BOUNDED L3 CHANGE CONTROL
Primary WBS: 13.2.2-13.2.3

Construction B remains necessary for the Package Goal. It cannot yet be materialized or executed because the minimum executable semantics require an additional public/shared-contract decision beyond TASK-231 authority.

The bounded L3 change-control decision must preserve and reuse existing concepts rather than replace them. It may authorize only the minimum additive backward-compatible semantics necessary for:
- explicit actor/identity membership or role linkage;
- deterministic permission evaluation;
- a bounded non-free-text policy representation only where permission-only semantics are insufficient;
- deterministic view/form binding to existing Runtime entities/actions;
- an auditable allow/deny outcome that fails closed and never infers privilege from identity names/order/defaults.

After that L3 authority is accepted and integrated, reconstruct fresh `main`, revalidate the exact accepted contract boundary and materialize at most one Construction B Sprint. Product implementation must remain separate from the change-control/revalidation step.

Candidate growing proof remains:
`integrated identity/session actor -> explicit role/membership -> permission/policy decision -> allowed representative API/action -> denied representative API/action -> generated view/form interaction under the same authority`, using actual compiled/runtime artifacts rather than test-only outcomes.

## Optional Construction C — security/interaction completeness only if justified
Status: FORECAST / CONDITIONAL

Promote only when post-Construction-B fresh-main evidence shows a bounded WBS 13.2 Package Goal gap remains. Do not use as generic security hardening outside WBS 13.2.

## Package Integration & Review
Status: FORECAST

Regress identity -> session -> authorization/policy -> generated interaction across actual Runtime APIs. Inspect security boundaries, privilege drift, contract compatibility, denial/failure behavior, no-value-leakage and dependency accuracy. Missing functionality returns to explicit Construction/change control.

## Documentation & Closure
Status: FORECAST

Reconcile current-state docs, WBS/package coverage, auth/security/runtime/UI documentation, risks/debt and successor readiness. No new behavior.

## Carried debt outside package scope unless explicitly re-ranked
- `TD-P13-01` job overlap/retry/idempotency;
- `TD-P13-02` HTTP integration timeout/response bounds;
- `TD-P13-03` file realpath/symlink and binary/streaming hardening;
- `TD-P13-04` generated Runtime maintainability.

Do not silently absorb these into P13-PACKAGE-02 construction.

## Boundaries
- Runtime authority must not require Builder availability.
- Authentication does not imply authorization.
- No silent privilege elevation or permissive fallback.
- Free-text policy statements are not executable authority.
- No resolved credential/secret/session/provider value in immutable/durable artifacts/evidence beyond authorized references.
- Person/Actor/User-ServiceIdentity distinctions from WBS 27 must not be collapsed.
- No mandatory provider-specific IAM/SSO or UI framework.
- No new identity/security L4 architecture without ADR.
- `P13-PACKAGE-03` remains NOT STARTED.
