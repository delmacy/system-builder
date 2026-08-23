# P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience

Status: ACTIVE / PLANNING & MATERIALIZATION COMPLETE / CONSTRUCTION A COMMITTED-MATERIALIZED
Milestone: M13
Primary WBS: 13.2.1-13.2.3
Predecessor: P13-PACKAGE-01 CLOSED
Planning Sprint: `P13-AUTONOMOUS-RUNTIME-IDENTITY-AUTHORITY-PLANNING-01`

## Package goal
Make the autonomous client runtime actor-aware and usable: authenticate/session-bind identities, enforce materialized roles/permissions/policies, and render generated views/forms/interactions without consulting the Builder during normal operation.

## Fresh-main planning base
Base: `2186f2ffa32e00d06dbe2230498a3d748a5d6533`
Tree: `9644bcc20ac5d6f2eeb5e97fa1f7ea2ae4b82265`

`P13-PACKAGE-01` is CLOSED. Its generated Runtime Core is predecessor evidence and must not be recreated.

Planning inventory found:
- identity/auth/session executable path: MISSING;
- WBS 27 identity/organization/authorization model: documented authority, not executable Runtime implementation;
- `SystemDefinition.permissions`, `policies` and `views`: already declared and therefore REUSE inputs, but current Compiler Runtime projection/model does not project or execute them;
- EnvironmentProfile/SecretResolver external reference/no-value-leak machinery: REUSE;
- no generated Runtime view/form renderer found;
- no required L4 boundary change found.

See `P13-AUTONOMOUS-RUNTIME-IDENTITY-AUTHORITY-PLANNING-01.report.md` for the full delivered-vs-gap and security analysis.

## Construction A — Identity and session binding
Sprint: `P13-RUNTIME-IDENTITY-SESSION-01`
Status: COMMITTED / MATERIALIZED
Tasks: TASK-231..239
Primary WBS: 13.2.1

Goal: carry explicit identity/auth-provider/session declarations through the actual SystemDefinition -> Compiler -> Release -> Deploy -> autonomous Runtime chain and prove authentication, bounded session validity/expiry and actor context without Builder/Observe dependency.

Explicit L3 authority is limited to the minimum additive backward-compatible `SystemDefinition` identity/auth-provider/session semantics in TASK-231. Provider credentials/tokens/session secrets/resolved endpoints remain runtime-only values. Existing EnvironmentProfile bindings must be reused when sufficient; another shared-contract family change requires explicit change control.

Construction A must not implement roles/permissions/policy authorization or generated views/forms.

Exit proof:
`real SystemDefinition -> Catalog/Assembly -> Validation -> Compiler -> Release -> Deploy + external auth binding -> autonomous Runtime -> authenticate active identity -> session -> actor context -> representative authenticated Runtime request`, with invalid/disabled/expired/missing-binding negative paths and no-value-leak evidence.

## Construction B — Authorization and generated interaction
Status: FORECAST
Primary WBS: 13.2.2-13.2.3

Candidate goal: project/enforce materialized roles/permissions/policies across representative API/action behavior and render a representative generated view/form interaction against the same Runtime authority.

Fresh-main revalidation after Construction A is mandatory. Existing `SystemDefinition.permissions`, `policies` and `views` must be reused; if their current declarative shapes are insufficient for executable role membership, policy evaluation or generated interaction, only the minimum additive L3 change may be proposed under explicit Construction B authority. Do not infer executable policy from free-text statements or infer view binding from names.

Candidate exit proof: one actor permitted, one actor denied deterministically, UI/API/action paths agree on authority, and the proof uses actual compiled/runtime artifacts rather than test-only hand-authored outcomes.

## Optional Construction C — security/interaction completeness only if justified
Status: FORECAST / CONDITIONAL

Promote only when post-Construction-B fresh-main evidence shows a bounded WBS 13.2 Package Goal gap remains, for example an unproven session lifecycle edge, role/membership edge or generated-interaction authority edge. Do not use as generic security hardening outside WBS 13.2.

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
- No resolved credential/secret/session/provider value in immutable/durable artifacts/evidence beyond authorized references.
- Person/Actor/User-ServiceIdentity distinctions from WBS 27 must not be collapsed.
- No mandatory provider-specific IAM/SSO framework.
- No new identity/security L4 architecture without ADR.
- `P13-PACKAGE-03` remains NOT STARTED.
- Planning materializes Construction A only; this document does not authorize Construction A execution automatically.