# Generation 2 — Authorization / Policy / Organization / Multitenancy — Full Pass 2 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Authorization / Policy / Organization / Multitenancy
Pass: 2
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit method

This revisit intentionally used techniques materially different from Full Pass 1:

1. **policy-lattice mutation** — vary superior Enterprise constraints, Station restrictions, Role grants, Person exceptions, resource policies, session boundaries and external provider semantics to test whether individually valid allows/denies compose to a different effective authority;
2. **consistency-mode differential** — compare cache-minimizing versus stronger-consistency authorization checks immediately after grant/revoke/membership mutation and under replica/cache lag;
3. **model-revision pin fracture** — hold tuple/relationship data constant while switching authorization-model revision, then hold model constant while changing relationship state, to test whether a decision is incorrectly qualified by only one revision dimension;
4. **contextual-claim substitution** — inject external identity/group claims or request-scoped relationship evidence into otherwise valid checks and test whether evidence is silently promoted to canonical Role/Station/permission truth;
5. **shared-cache scope perturbation** — vary tenant, Station, principal, action, resource, policy revision and context while retaining superficially identical provider/cache keys to test cross-scope contamination;
6. **break-glass/delegation expiry race** — let emergency or delegated authority expire while work is queued/in-flight and compare request-time, decision-time and actuation-time authority;
7. **cross-process self-dealing mutation** — compose separate request, approve, grant, execute and review processes whose local role checks pass but whose combined responsibility graph violates SoD;
8. **provider error-semantics differential** — compare deny-dominant, additive, intersection and skip-on-error authorization systems under malformed/undefined policy branches;
9. **resource-pressure perturbation** — expand relationship/policy graphs, wildcard scopes and concurrent checks to test whether timeout/degradation becomes fail-open, stale-cache acceptance or unbounded cost;
10. **AI/low-code composition mutation** — compose individually admitted policies, groups, delegated actions and provider bindings into generated rules/workflows and test authority-delta amplification;
11. **duplicate-screen** against the authoritative 115 reusable `G2-CONFLICT-PATTERN-*` inventory before admitting any new material edge/conflict class.

All 12 mandatory clusters are already covered once in Full Pass 2. This was a local Authorization revisit, not a designated second cluster rotation; incidental interactions do not artificially advance cluster streaks.

## 2. Evidence refresh

Fresh official documentation reinforces mechanisms already represented by the existing catalogue:

- OpenFGA query consistency modes distinguish latency-minimizing cached reads from `HIGHER_CONSISTENCY`; immediately after tuple mutation, a cached check may not reflect the change. Portable inference: authorization currentness is an explicit decision qualification, not a property implied by a successful check. Source: https://openfga.dev/docs/interacting/consistency (accessed 2026-09-04).
- OpenFGA strongly recommends passing an immutable authorization model ID, because otherwise requests can use the latest model and production behavior can change during model evolution. Portable inference: relationship state and model revision must be qualified together for deterministic authorization semantics. Sources: https://openfga.dev/docs/getting-started/immutable-models and https://openfga.dev/docs/getting-started/tuples-api-best-practices (accessed 2026-09-04).
- OpenFGA contextual tuples can use identity-token/group information only for the request in which they are supplied. Portable inference: external claims are request-scoped evidence, not automatic canonical organization/Role truth. Source: https://openfga.dev/docs/interacting/contextual-tuples (accessed 2026-09-04).
- AWS IAM combines identity policies, permissions boundaries, Organizations controls, resource policies and session policies with explicit-deny/intersection semantics. Portable inference: a valid local allow does not establish effective authority without the full applicable policy context. Source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html (accessed 2026-09-04).
- Kubernetes RBAC distinguishes namespaced RoleBinding from cluster-wide binding and represents users/groups as strings supplied by authentication modules. Portable inference: provider group identity and binding scope are not canonical Enterprise/Station semantics merely because authorization accepts them. Source: https://kubernetes.io/docs/reference/access-authn-authz/rbac/ (accessed 2026-09-04).
- Cedar uses default deny and forbid-overrides-permit, while policy evaluation errors can be skipped and exposed diagnostically. Portable inference: feature-level "policy engine" equivalence does not prove equivalent deny/error semantics. Source: https://docs.cedarpolicy.com/auth/authorization.html (accessed 2026-09-04).

These sources strengthen existing patterns rather than defining System Builder architecture.

## 3. Duplicate-screen results

No genuinely new material local edge-case or reusable ConflictPattern survived the screen.

| Challenged mechanism | Existing authoritative coverage | Disposition |
| --- | --- | --- |
| lower-scope allow versus superior Enterprise/Station restriction | `G2-EDGE-AUTHZ-001`; `G2-CONFLICT-PATTERN-POLICY-PRECEDENCE-001` | DUPLICATE / NO NEW MATERIAL CLASS |
| cached authorization immediately after grant/revoke/membership mutation | `G2-EDGE-AUTHZ-002..003`; `G2-CONFLICT-PATTERN-AUTHORITY-CURRENTNESS-001`; residual-cohort/currentness families | DUPLICATE / NO NEW MATERIAL CLASS |
| model revision and relationship/tuple revision changing independently | `G2-EDGE-AUTHZ-006`; revision-vector/currentness/policy-precedence families | DUPLICATE / NO NEW MATERIAL CLASS |
| external IdP/group/token claims adopted directly as local Role/Station/grant | `G2-EDGE-AUTHZ-002,004`; multitenant-scope, identity-mapping, authority-currentness and semantic-ownership families | DUPLICATE / NO NEW MATERIAL CLASS |
| tenant/Station/resource/action mismatch through shared caches or provider IDs | `G2-EDGE-AUTHZ-004`; `G2-CONFLICT-PATTERN-MULTITENANT-SCOPE-001`; provider-identity/qualified-claim families | DUPLICATE / NO NEW MATERIAL CLASS |
| break-glass/delegation expiry while action is queued or in-flight | `G2-EDGE-AUTHZ-002,005,006`; authority-currentness and SoD-delegation families | DUPLICATE / NO NEW MATERIAL CLASS |
| request/approve/grant/use/review split across locally valid processes but same effective subject | `G2-EDGE-AUTHZ-005`; `G2-CONFLICT-PATTERN-SOD-DELEGATION-001`; cross-process authority families | DUPLICATE / NO NEW MATERIAL CLASS |
| provider-specific deny/intersection/additive/skip-on-error semantics | `G2-EDGE-AUTHZ-001,007`; policy-precedence, provider-qualification and standards/provider-downgrade families | DUPLICATE / NO NEW MATERIAL CLASS |
| PARTIAL/UNKNOWN propagation of distributed grants/revocations | `G2-EDGE-AUTHZ-003`; authority-currentness, adoption/convergence and residual-cohort families | DUPLICATE / NO NEW MATERIAL CLASS |
| offline authorization beyond evidence-currentness horizon | `G2-EDGE-AUTHZ-002`; authority-currentness, qualified-claim and offline-closure families | DUPLICATE / NO NEW MATERIAL CLASS |
| pathological policy/relationship graphs or wildcard expansion under load | `G2-EDGE-AUTHZ-007`; resource-exhaustion and authority-non-amplification families | DUPLICATE / NO NEW MATERIAL CLASS |
| AI/low-code composes individually valid grants into broader effective authority | `G2-EDGE-AUTHZ-005,007`; permission-composition, provider-composition-authority, SoD and AI/AGWS non-amplification families | DUPLICATE / NO NEW MATERIAL CLASS |

The absence of a new ID is saturation evidence only. It does not claim that these mechanisms are safe or bug-free; the existing scenarios, owners, severities, detection candidates, proof obligations and future remediation routes remain authoritative.

## 4. Processual / semantic conflict classification

All required conflict families were explicitly screened:

- **structural graph:** nested roles/relationships and policy inheritance can create cycles or broad reachability, already covered by policy-graph/resource-exhaustion and authority-scope families;
- **state-transition:** grant/revoke/use, delegation expiry and break-glass closure races map to authority-currentness and residual-cohort/convergence;
- **semantic ownership:** external group/provider IDs remain evidence or realization identifiers, not canonical Enterprise/Station/Role/Person authority facts;
- **rule/formula/condition:** overlapping allow/deny conditions and policy-error behavior map to policy-precedence/provider-qualification;
- **temporal/ordering:** stale cache, policy-model rollout and long-running work crossing revisions map to authority-currentness/revision-vector;
- **resource/capacity:** relationship explosion and shared-cache pressure map to resource-exhaustion and scope-qualified evaluation;
- **authority/responsibility/SoD:** request/approve/grant/use/review composition maps to SoD-delegation and current responsibility evidence;
- **policy/compliance:** superior inherited constraints and emergency exceptions require explicit owner-qualified precedence, already catalogued;
- **data/consistency:** relationship/model/cache revision mismatch maps to currentness and revision-vector families;
- **provider/integration:** additive, deny-dominant, intersection and skip-on-error semantics remain provider-qualified, not portable by feature label;
- **version/migration/coexistence:** old/new policy models and residual grants/caches remain explicit coexistence/currentness concerns;
- **exception/compensation/recovery:** break-glass or recovery cannot revive withdrawn authority without current owner evidence;
- **human-procedure/instruction:** operator/admin intent to grant or approve does not replace current authority/SoD evidence;
- **cross-process:** independently valid workflows can compose into self-dealing, already covered by SoD and cross-process authority families;
- **objective/optimization:** latency/cache efficiency cannot silently override required currentness or isolation;
- **AI/low-code composition:** generated policy composition cannot widen authority beyond the delegating envelope.

No unowned new `ConflictPattern` emerged. `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict` remain preserved. No new preventive invariant candidate is proposed.

## 5. Cross-capability disposition

No new cross-capability scenario is admitted. The strongest interactions remain covered by existing mandatory clusters, especially:

- Identity × Authorization × Station × AGWS × AI;
- Provider/Binding × external realizations;
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution;
- Observability × Security/Recovery × runtime truth.

Because this visit is a local capability revisit and not a designated second cluster rotation, mandatory-cluster streaks remain unchanged. In particular, `Identity × Authorization × Station × AGWS × AI` remains at eligible no-material streak **1**, not **2**.

## 6. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- Authorization / Policy / Organization / Multitenancy eligible no-material streak: **1**;
- mandatory-cluster streaks: **unchanged**;
- material edge scenario inventory: **278**;
- reusable ConflictPattern inventory: **115**;
- combined material findings: **393**;
- HIGH/CRITICAL findings without owner/proof/detection route: **0**;
- Full Pass 2 local coverage after this revisit: **17/28**;
- Full Pass 2 mandatory-cluster coverage: **12/12**;
- completed full passes: **1/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

This is one eligible no-material revisit only. Authorization still requires another consecutive eligible revisit with no new material finding in a later pass, as do campaign-wide capability and high-risk-cluster streak requirements.

## 7. Research-only consequence candidates retained for later phases

No target architecture is selected. Existing research consequences remain sufficient:

1. preserve authentication evidence separately from authorization and canonical organization authority;
2. qualify consequential authorization by principal/action/resource/scope, applicable policy/model revisions, relationship/membership revision, exception/delegation state and required currentness horizon;
3. preserve `Enterprise → Station → Role → Person` constraints and explicit SoD rather than provider-group shortcuts;
4. treat provider policy semantics, cache consistency and external groups as realization evidence requiring qualification, never universal semantics by feature name;
5. preserve residual grants, sessions, caches and offline cohorts until effective-state evidence supports currentness/convergence;
6. preserve AI/AGWS/low-code non-amplification and explicit authority-delta reasoning.

## 8. Next rotation candidate

Continue Full Pass 2 with **Governance / Compliance / Audit** using techniques materially different from Full Pass 1 and duplicate-screen against the 115 reusable ConflictPatterns. Challenge control/obligation applicability and precedence; evidence provenance/currentness/completeness; waiver/exception expiry and scope; audit ordering/completeness/tamper evidence; remediation acknowledgement versus effective closure; control/policy revision skew; Enterprise/Station inherited constraints and SoD of approval/review; provider compliance claims versus canonical evidence; PARTIAL/UNKNOWN distributed enforcement; residual noncompliant cohorts/offline governance; evidence-cardinality/resource exhaustion; cross-process objective conflict; and AI/low-code that bypasses, fabricates or mis-scopes controls. Do not enter Planning C.