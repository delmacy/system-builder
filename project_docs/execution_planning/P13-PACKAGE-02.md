# P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience

Status: FORECAST
Milestone: M13
Primary WBS: 13.2.1-13.2.3
Predecessor: P13-PACKAGE-01 CLOSED or equivalent Runtime Core readiness proven by its Planning/Review authority

## Package goal
Make the autonomous client runtime actor-aware and usable: authenticate/session-bind identities, enforce materialized roles/permissions/policies, and render generated views/forms/interactions without consulting the Builder during normal operation.

## Baseline authority
Primary scope is exactly:
- 13.2.1 auth/session/identity bindings;
- 13.2.2 roles, permissions and materialized policies;
- 13.2.3 generated views/forms/interactions.

The Planning Sprint must reconcile this WBS with the baseline Work Package families `WP-R01 Runtime identity/security minimum` and `WP-R02 Action/policy execution`, plus any already integrated identity/policy/UI contracts. Existing capabilities are predecessor evidence, not work to recreate.

## Sprint 0 — Planning & Materialization
Goal: inventory actual identity/auth/session/policy/view materialization capabilities on fresh `main`, identify exact WBS 13.2 gaps, confirm public contract and security boundaries, define package growing proof, and materialize only Construction A.

Required outputs:
- delivered-vs-gap matrix for Subject/User/Organization, credentials/session/authentication, authorization/policy and generated UI interaction;
- security/threat boundary and negative-path expectations;
- reuse classification for existing runtime/action/policy/UI contracts;
- Construction A/B goals and optional C candidate;
- no product implementation.

## Construction A — Identity and session binding
FORECAST.

Candidate goal: close the missing autonomous Runtime identity/session path using materialized/external runtime configuration and existing public contracts.

Exit proof candidate: generated/deployed Runtime authenticates a representative subject/session, preserves deterministic/reference-only immutable artifacts, rejects malformed/invalid/expired or unauthorized identity state, and performs no Builder lookup during normal operation.

## Construction B — Authorization and generated interaction
FORECAST.

Candidate goal: enforce materialized roles/permissions/policies across representative action/API behavior and render a representative generated view/form interaction against the same runtime authority.

Exit proof candidate: one actor is permitted, one actor is denied deterministically, the UI/API/action paths agree on authority, and the proof uses actual compiled/runtime artifacts rather than test-only hand-authored policy outcomes.

## Optional Construction C — security/interaction completeness only if justified
FORECAST / CONDITIONAL.

Promote only when post-Construction-B fresh-main evidence shows a bounded WBS 13.2 gap remains necessary for the Package Goal, for example an unproven session lifecycle or generated-interaction authority edge. Do not use as generic security hardening outside WBS 13.2.

## Package Integration & Review
FORECAST.

Regress identity -> session -> authorization/policy -> generated interaction across actual Runtime APIs. Inspect security boundaries, privilege drift, contract compatibility, denial/failure behavior, no-value-leakage and dependency accuracy. Missing functionality returns to explicit construction/change control.

## Documentation & Closure
FORECAST.

Reconcile current-state docs, WBS/package coverage, auth/security/runtime/UI documentation, risks and successor readiness. No new behavior is introduced here.

## Boundaries
- Runtime authority must not require Builder availability.
- No silent privilege elevation or permissive fallback.
- No resolved credential/secret material in immutable artifacts/evidence beyond authorized references.
- No new identity/security L4 architecture without ADR.
- No package/Sprint becomes executable from this forecast alone.
