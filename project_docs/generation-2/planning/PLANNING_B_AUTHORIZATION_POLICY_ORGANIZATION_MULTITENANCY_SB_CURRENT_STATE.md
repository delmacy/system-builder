# Planning B — Authorization / Policy / Organization / Multitenancy — SB Current State

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Capability: Authorization / Policy / Organization / Multitenancy
Fresh main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact is repository archaeology only. It does not design target architecture, execute product code, materialize TASKs or Work Packages, start Construction, open a PR, or perform worker handoff.

## Current implementation evidence

Fresh main has an explicit bounded authority slice spanning SystemDefinition contracts, compiler normalization and runtime evaluation.

`packages/contracts/system-definition/authority-generated-interaction.schema.json` exposes `roleBindings`, `permissions` and `policies`. A role binding names a `roleRef` and exactly one `actorRef` or `membershipRef`. A permission binds `role + resource + actions` and may carry `organizationRef`, `membershipRef` and `policyRefs`. A structured policy can express `allow|deny` with role/resource/action filters and scalar `contextEquals`. These are explicit semantic declarations rather than provider policy IDs.

`packages/compiler/authority-projection.ts` validates and normalizes those declarations. It rejects duplicate/unknown resource, action, policy, actor and role references; rejects ambiguous role bindings; requires referenced policies to be executable structured policies; and keeps free-text policy statements out of compiled runtime policy output. `organizationRef` and `membershipRef` are preserved as permission context, but the compiler does not materialize first-class Organization, Tenant, Station, delegation-envelope or temporary-grant objects.

`packages/runtime-core/authority-resolution.ts` resolves authenticated identities and supplied memberships into deterministic role/binding sets. Missing, unknown, disabled or ambiguous identities/memberships/roles fail closed. Role acquisition is explicit through role bindings; authentication alone does not manufacture a role.

`packages/runtime-core/permission-evaluation.ts` evaluates resolved roles against resource/action permissions and optional structured policies. It is default-deny, checks membership/organization context, rejects unknown/ambiguous/mismatched policies, evaluates explicit deny effects, and emits a `RuntimePermissionDecision` with evidence containing role/resource/action plus membership/organization/policy references and a reason code. Product tests exercise allow/deny behavior through the generated interaction path and explicitly keep free-text policy material non-executable.

## Evidenced strengths and dispositions

- **KEEP** the structural separation between authenticated identity and authorization; roles are resolved only from explicit role bindings.
- **KEEP** explicit subject/role/resource/action semantics and deterministic compiler validation of authority references.
- **KEEP** default-deny runtime permission evaluation and fail-closed handling of unknown, ambiguous or disabled authority inputs.
- **KEEP** structured executable policy separate from free-text policy documentation; runtime output omits the free-text statement.
- **KEEP** decision evidence carrying role/resource/action plus relevant membership/organization/policy references and a deterministic reason.
- **HARDEN** organization/membership semantics because current references are tokens used during evaluation rather than revisioned canonical Organization/Tenant/Station relationship objects.
- **HARDEN** policy and authority lifecycle semantics because current declarations do not carry policy revision, activation/supersession, assignment revision, evidence currentness or residual-consumer state.
- **GENERALIZE** the bounded role/permission/policy mechanism only where Generation 2 requirements demand delegated, hierarchical, temporary or provider-qualified authority; no target model is inferred here.
- **INTEGRATE** with Identity/Auth/Federation, AGWS, Governance, Privacy, Provider/Binding and UCA rather than absorbing their semantic ownership.

No fresh-main evidence supports `REPLACE`, `PROVIDERIZE` of the canonical authorization semantics, or `DO_NOT_BUILD` for the capability.

## Gaps against Planning A boundaries

Current main does **not evidence**:

1. first-class revisioned `PolicyIdentity/PolicyRevision` or an authorization decision identity/currentness horizon;
2. canonical Organization, Tenant or Station entities/relations as authorization-owned scope truth rather than string references;
3. the full `Enterprise → Station → Role → Person` delegated-authority hierarchy, delegation envelopes, monotonic inherited constraints or explicit subdelegation eligibility;
4. Station capability-exposure authority distinct from generic role/resource permissions and distinct from AGWS surface composition;
5. temporary/delegated/emergency/break-glass grants with issuer, scope, start/expiry/revocation and provenance;
6. mandatory inherited constraints versus delegable/override-eligible policy dimensions;
7. an explicit `ALLOW / DENY / INCONCLUSIVE` decision contract. Runtime currently has `allowed: boolean` plus fail-closed reason codes, so stale/partial/insufficient evidence cannot be represented distinctly from deny;
8. policy/evidence revisions, evaluation time, assurance/currentness inputs, provider/binding provenance or replay against producing revisions in decision evidence;
9. authority lifecycle propagation and residual-authority cohort drainage across sessions, tokens, caches, workers, replicas or subordinate evaluators after revocation/supersession;
10. offline/degraded authorization closure with bounded retained policy/currentness horizons and reconnect requalification;
11. explicit provider/external role/group/tenant claim adoption semantics. Current canonical declarations contain no external-claim mapping layer, which avoids implicit adoption but does not model governed adoption/requalification;
12. cross-tenant/cross-Station access semantics and isolation proofs beyond optional organization/membership context matching;
13. policy/provider substitution support qualification, ambiguous remote policy mutation `UNKNOWN` reconciliation, or provider decision provenance;
14. explicit tests proving AI/AGWS cannot create grants, broaden Station exposure, weaken inherited constraints or turn provider/group claims into canonical authority.

## Boundary preservation

Identity / Authentication / Federation remains owner of subject identity and authentication evidence. Current runtime is positive evidence for the boundary because an authenticated identity receives no role unless a separate authorization role binding resolves it.

AGWS remains owner of governed surface composition, not permission creation. Current generated interaction tests consume the authority decision path rather than deriving permission from a rendered action. Planning B finds no evidence that UI presence alone grants authority.

Governance / Compliance / Audit remains owner of obligations, controls, assessments, waivers and audit semantics; current authorization policy objects are executable permission constraints, not governance truth.

Provider / Binding remains owner of provider admission, qualification, binding and cutover. Current authorization contracts are local/provider-neutral declarations and do not justify treating external IdP groups, provider tenant IDs or policy-engine IDs as canonical authority.

Privacy / Data Governance remains independent: an authorization `ALLOW` is not evidence that a use is privacy-permissible.

UCA remains reusable infrastructure for qualified evidence/currentness, ambiguity and residual-cohort semantics; it must not become a global policy owner.

## Enterprise → Station → Role → Person assessment

Fresh main positively evidences only a bounded portion of the hierarchy: authenticated identity → explicit role binding → role-based permission/policy evaluation. It does not evidence canonical Enterprise, Station, Person assignment hierarchy, superior delegation envelopes, Station capability exposure, inherited mandatory denies or governed subdelegation.

Therefore the Planning A invariant remains a Generation 2 gap, not a claim about existing implementation. Nothing in current main proves authority amplification through AI/AGWS, but nothing yet structurally proves the complete monotonic non-amplification chain either.

## Maturity / portability / providerability assessment

The current authorization slice is **implemented and product-tested as a deterministic bounded runtime role/permission/structured-policy mechanism**. It is stronger than a placeholder: compiler validation, ambiguity rejection, default deny, explicit role resolution, structured policy evaluation and decision evidence are present.

Portability is currently favorable at the declaration/runtime-model layer because authorization is not expressed as a provider-specific DSL. Providerability is not yet qualified: there is no evidence of semantic support vectors, provider-policy mapping, external claim adoption, substitution/cutover, revocation propagation or residual cohort drainage.

Organization/multitenancy maturity is partial. `organizationRef`/`membershipRef` can constrain permission evaluation, but no first-class tenant/Station lifecycle, containment, cross-scope delegation or isolation model is evidenced.

## Planning B result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main provides a useful and tested authorization foundation: explicit role bindings, role/resource/action permissions, structured allow/deny policies, compiler-level reference and ambiguity validation, default-deny evaluation, organization/membership context checks, deterministic role resolution and decision evidence. The material Generation 2 gaps are revisioned policy/decision truth, first-class Organization/Tenant/Station authority scope, `Enterprise → Station → Role → Person` delegation, inherited constraints and override eligibility, Station capability exposure, temporary/break-glass authority, `INCONCLUSIVE`/currentness/provenance, residual-authority drainage, offline/reconnect qualification, provider/external claim adoption and semantic provider substitution. The evidenced direction is predominantly **KEEP + HARDEN + GENERALIZE + INTEGRATE**; no replacement decision is supported in Planning B.
