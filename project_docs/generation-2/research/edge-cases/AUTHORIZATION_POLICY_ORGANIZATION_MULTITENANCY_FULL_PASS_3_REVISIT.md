# Generation 2 — Authorization / Policy / Organization / Multitenancy — Full Pass 3 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Authorization / Policy / Organization / Multitenancy
Pass: 3
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit method

This revisit deliberately used techniques different from Full Passes 1 and 2:

1. **presence-semantics policy metamorphism** — mutate policy attributes, obligations, scope selectors and exceptions across ABSENT, explicit null, empty, defaulted and removed representations and compare allow/deny/effect semantics;
2. **authority-cut braid** — interleave principal membership, delegation, policy/model revision, resource/action identity and enforcement-point adoption so each dimension can be locally current while the composed authorization cut is not jointly compatible;
3. **scope-intersection mutation** — vary Enterprise, Station, Role, Person, tenant, resource and provider scopes while preserving locally valid grants to expose accidental union or scope aliasing;
4. **ephemeral-evidence shadowing** — inject request-scoped external group/context evidence that is valid for a single check and challenge silent promotion into canonical Role/Station/grant truth or precedence over durable evidence;
5. **grant/revoke/use permutation with delayed enforcement** — reorder grant, revoke, queued work, actuation and distributed cache/enforcer convergence under `PARTIAL/UNKNOWN` state;
6. **long-running authority lease mutation** — let work cross delegation/break-glass expiry, policy revision and membership change while distinguishing admission authority from current consequential actuation authority;
7. **shared-provider/cache key collision mutation** — hold provider-local identifiers equal while varying canonical tenant/Station/action/resource identity and policy revision;
8. **SoD cross-process graph folding** — compose request, approval, grant, execution and review paths that are individually valid but collapse to one effective subject through nested roles, delegation or emergency authority;
9. **pathological policy-graph/resource subtraction** — increase nesting, wildcard reachability, contextual evidence and concurrent evaluation while removing fresh consistency/currentness evidence to challenge fail-open or stale acceptance;
10. **AI/low-code authority-delta mutation** — compose individually permitted grants, contexts, provider bindings and generated policies and compare effective authority before/after composition;
11. **duplicate-screen** against all 116 authoritative reusable `G2-CONFLICT-PATTERN-*`, explicitly including `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`.

All 12 mandatory clusters are already explicitly covered in Full Pass 3. This is a local Authorization revisit only; incidental overlap with `Identity × Authorization × Station × AGWS × AI` does not increment any mandatory-cluster streak.

## 2. Evidence refresh

Fresh official evidence reinforces mechanisms already represented by the catalogue:

- OpenFGA contextual tuples are ephemeral request-scoped relationships. When a contextual tuple has the same user/relation/object as a stored tuple, the contextual tuple takes precedence for that request; token-derived contextual claims may remain usable until token expiry even if underlying group membership changes. Portable inference: request-scoped evidence can shadow durable evidence without becoming canonical organizational truth, and its currentness horizon remains qualification material. Source: https://openfga.dev/docs/interacting/contextual-tuples (updated 2026-08-24; accessed 2026-09-05).
- AWS IAM evaluates applicable policy types jointly: default deny applies, explicit deny overrides allows, and permissions boundaries / Organizations policies / session policies can constrain an otherwise valid allow. Portable inference: a locally valid grant is not equivalent to effective authority outside the full applicable policy context. Sources: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html and https://docs.aws.amazon.com/IAM/latest/UserGuide/access.html (accessed 2026-09-05).
- AWS also documents that superficially similar principal forms can interact differently with boundaries/session policies in resource-based policy evaluation. Portable inference: resource/principal identity form is semantic authorization input, not interchangeable syntax. Source: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html (accessed 2026-09-05).

These sources do not define System Builder architecture. They strengthen existing policy-precedence, authority-currentness, multitenant-scope, semantic-ownership, presence-semantics and provider-qualification patterns.

## 3. Duplicate-screen results

No genuinely new material local edge case, cross-capability scenario or reusable ConflictPattern survived.

| Challenged mechanism | Existing authoritative coverage | Disposition |
| --- | --- | --- |
| ABSENT/null/empty/default/remove changes policy-attribute or obligation meaning | `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`; policy-precedence and qualified-claim families | DUPLICATE / NO NEW MATERIAL CLASS |
| locally current principal/membership/policy/resource dimensions do not form one jointly compatible authority cut | `G2-EDGE-AUTHZ-002,003,006`; authority-currentness, revision-vector and qualified-claim families | DUPLICATE / NO NEW MATERIAL CLASS |
| lower-scope allow broadens superior Enterprise/Station restriction | `G2-EDGE-AUTHZ-001`; `G2-CONFLICT-PATTERN-POLICY-PRECEDENCE-001` | DUPLICATE / NO NEW MATERIAL CLASS |
| request-scoped contextual/group evidence shadows durable evidence or is promoted into canonical Role/Station/grant truth | `G2-EDGE-AUTHZ-002,004`; authority-currentness, semantic-ownership, identity-mapping and multitenant-scope families | DUPLICATE / NO NEW MATERIAL CLASS |
| grant/revoke/use races with distributed `PARTIAL/UNKNOWN` enforcement | `G2-EDGE-AUTHZ-003`; authority-currentness, adoption/convergence and residual-cohort families | DUPLICATE / NO NEW MATERIAL CLASS |
| long-running work crosses delegation/break-glass/policy expiry | `G2-EDGE-AUTHZ-002,005,006`; authority-currentness and SoD-delegation families | DUPLICATE / NO NEW MATERIAL CLASS |
| provider/cache key matches while canonical tenant/Station/action/resource identity differs | `G2-EDGE-AUTHZ-004`; `G2-CONFLICT-PATTERN-MULTITENANT-SCOPE-001`; effective-identity/provider qualification families | DUPLICATE / NO NEW MATERIAL CLASS |
| individually valid request/approve/grant/use/review paths collapse into self-dealing | `G2-EDGE-AUTHZ-005`; `G2-CONFLICT-PATTERN-SOD-DELEGATION-001` | DUPLICATE / NO NEW MATERIAL CLASS |
| pathological nested/wildcard/context policy graph under stale/limited evaluation evidence | `G2-EDGE-AUTHZ-007`; resource-boundedness and authority-currentness families | DUPLICATE / NO NEW MATERIAL CLASS |
| AI/low-code composes permitted fragments into greater effective authority | `G2-EDGE-AUTHZ-005,007`; permission-composition, SoD, provider-composition-authority and AI/AGWS non-amplification families | DUPLICATE / NO NEW MATERIAL CLASS |

The absence of a new ID is saturation evidence only. It does not establish absence of defects or authorize implementation.

## 4. Processual / semantic conflict classification

All required conflict families were explicitly screened:

- **structural graph:** nested role/relationship reachability, cyclic delegation and wildcard expansion remain covered by authority graph and resource-boundedness families;
- **state-transition:** grant/revoke/use, emergency close and delegation expiry remain currentness/convergence conflicts;
- **semantic ownership:** IdP/provider/context claims remain evidence, not canonical Role/Station/permission truth;
- **rule/formula/condition:** allow/deny overlap plus ABSENT/null/default condition semantics remain policy-precedence/presence-semantics concerns;
- **temporal/ordering:** current local dimensions without a jointly compatible cut remain revision/currentness concerns;
- **resource/capacity:** graph expansion, cache pressure and evaluation limits remain resource-boundedness concerns;
- **authority/responsibility/SoD:** overlapping responsibilities and delegated/emergency paths remain SoD-delegation concerns;
- **policy/compliance:** superior inherited constraints cannot be weakened by lower-scope provider/local semantics without owner-qualified exception;
- **data/consistency:** relationship/model/cache revision mismatch remains currentness/revision-vector qualified;
- **provider/integration:** provider success and feature labels do not universalize deny, scope, identity-form or consistency semantics;
- **version/migration/coexistence:** residual grants, caches, sessions and old policy cohorts remain explicit coexistence/currentness concerns;
- **exception/compensation/recovery:** break-glass/recovery cannot silently revive withdrawn authority;
- **human-procedure/instruction:** operator intent cannot substitute for current authority/SoD evidence;
- **cross-process:** locally valid workflows can compose into self-dealing, already catalogued;
- **objective/optimization:** latency/cache availability cannot silently override currentness, isolation or inherited restrictions;
- **AI/low-code composition:** generated policy composition cannot widen effective authority beyond the delegating envelope.

No unowned new `ConflictPattern` emerged. No new preventive invariant candidate is elevated.

## 5. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- Authorization / Policy / Organization / Multitenancy eligible no-material streak: **1 → 2**;
- mandatory-cluster streaks: **unchanged**;
- material edge scenario inventory: **281**;
- reusable ConflictPattern inventory: **116**;
- combined material findings: **397**;
- HIGH/CRITICAL findings without owner/proof/detection route: **0**;
- Full Pass 3 local coverage after this revisit: **17/28**;
- Full Pass 3 mandatory-cluster coverage: **12/12**;
- completed full passes: **2/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

Authorization now has two consecutive eligible no-material revisits across Full Passes 2 and 3. This satisfies the local streak criterion for this capability only; campaign-wide saturation remains blocked by incomplete Full Pass 3, remaining local streaks, cluster streaks and the final negative-space review.

## 6. Research-only consequence candidates retained

No target architecture is selected. Existing later-phase candidates remain sufficient: qualify consequential authorization by canonical principal/action/resource/scope plus applicable policy/model/relationship/exception currentness; preserve superior Enterprise/Station constraints and SoD; distinguish request-scoped/external evidence from canonical organization authority; preserve presence semantics when omission/null/default changes policy meaning; maintain residual grants/caches/offline cohorts as non-converged until evidenced; and require AI/low-code authority-delta non-amplification.

## 7. Next rotation candidate

Continue Full Pass 3 with **Governance / Compliance / Audit**. Use techniques materially different from Full Passes 1 and 2 and duplicate-screen against all 116 ConflictPatterns, including presence semantics. Challenge control/obligation applicability and precedence; audit/evidence provenance, completeness, ordering and currentness; waiver/exception scope and expiry; remediation acknowledgement versus effective closure; control/policy revision products; inherited Enterprise/Station constraints and review SoD; provider compliance claims versus canonical evidence; ABSENT/null/default semantics in obligations/evidence; `PARTIAL/UNKNOWN` distributed enforcement; residual noncompliant/offline cohorts; evidence-cardinality/resource pressure; cross-process objective conflicts; and AI/low-code that bypasses, fabricates or mis-scopes controls. Do not enter Planning C.