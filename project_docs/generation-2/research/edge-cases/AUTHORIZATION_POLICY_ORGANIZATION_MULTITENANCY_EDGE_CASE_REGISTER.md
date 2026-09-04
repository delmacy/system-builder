# Generation 2 — Authorization / Policy / Organization / Multitenancy Edge-Case Register

Status: ACTIVE RESEARCH
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 1
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: authentication evidence is not authorization; provider/external group IDs are non-canonical; `Enterprise → Station → Role → Person` is monotonic authority context, not a provider-group shortcut; AI/AGWS cannot amplify authority; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; ambiguous mutating effects require reconciliation before unsafe retry.

## Evidence ledger

1. AWS IAM policy evaluation: default deny, explicit deny overrides allows, and effective permissions can be intersections of identity policies, permissions boundaries, SCP/RCP and session policy. Sources: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html and https://docs.aws.amazon.com/IAM/latest/UserGuide/access.html (accessed 2026-09-04).
2. Cedar authorization: default deny, forbid-overrides-permit, diagnostics for determining/error policies; policy validation is distinct from request evaluation and schema changes can invalidate previously valid policies. Sources: https://docs.cedarpolicy.com/auth/authorization.html and https://docs.cedarpolicy.com/policies/validation.html (accessed 2026-09-04).
3. Kubernetes RBAC: permissions are additive; Role/RoleBinding are namespace-scoped while ClusterRole/ClusterRoleBinding can be cluster-scoped; RoleBinding can bind a ClusterRole only within its namespace. Source: https://kubernetes.io/docs/reference/access-authn-authz/rbac/ (accessed 2026-09-04).
4. Open Policy Agent/Rego: policy decisions are separated from enforcement; complete rules must not produce conflicting outputs, and malformed runtime data can produce undefined/error behavior depending on evaluation context. Sources: https://www.openpolicyagent.org/docs and https://www.openpolicyagent.org/docs/errors/eval-conflict-error/complete-rules-must-not-produce-multiple-outputs (accessed 2026-09-04).
5. OpenFGA guidance recommends pinning authorization model IDs for consistent behavior during model evolution, evidencing that relationship data and model revision must be qualified together. Source: https://openfga.dev/docs/getting-started/tuples-api-best-practices (accessed 2026-09-04).

Provider divergence is itself a material research result: a feature label such as RBAC/policy does not establish shared precedence, deny semantics, hierarchy, currentness, revision pinning or error behavior.

## Local material edge cases

### G2-EDGE-AUTHZ-001 — inherited constraint is weakened by local allow
- Scenario: a Station/Role-level allow is interpreted as overriding a stricter Enterprise constraint, or provider semantics compose additive grants where canonical semantics require superior-scope restriction.
- Preconditions/activation: multiple policy scopes/revisions apply to the same principal/action/resource; at least one lower scope broadens authority.
- Expected safe behavior: effective authority remains bounded by the current superior-scope constraint and the applicable policy-composition semantics are explicit/evidenced.
- Forbidden behavior: arbitrary rule order, provider default, or local configuration silently widens inherited authority.
- Failure/effect disposition: `DENY` or `INCONCLUSIVE` when applicable superior constraints/currentness cannot be established.
- Owners: Authorization/Policy semantic owner + Organization/Station scope owner.
- Evidence/currentness: current policy revisions, scope lineage, subject/role membership revision, resource/action identity.
- Recovery/reconciliation: refresh applicable policy/scope evidence and re-evaluate; do not reuse a stale allow.
- Blast radius: Station → enterprise. Severity: CRITICAL. Misuse likelihood: plausible/likely. Reversibility: potentially difficult after protected side effects. Time-to-harm: immediate.
- Proof obligation: demonstrate monotonic enforcement of inherited constraints across all supported provider realizations and policy-revision combinations.

### G2-EDGE-AUTHZ-002 — stale membership, delegation or session authority
- Scenario: an authenticated subject retains cached Role/Station/group/delegation evidence after revocation, transfer or delegation expiry.
- Activation: long-lived session/cache or offline operation crosses authority revision.
- Expected safe behavior: authorization decision qualifies evidence currentness against the required risk horizon; stale evidence cannot silently count as current grant.
- Forbidden behavior: successful authentication or previously valid membership is treated as perpetual authorization.
- Disposition: `DENY/INCONCLUSIVE` when currentness is required but unavailable; bounded offline behavior only under explicit policy.
- Owners: Identity currentness + Authorization/Organization authority owner.
- Detection candidates: revision-vector mismatch, expired delegation horizon, residual grant/cache inventory.
- Blast radius: task → enterprise. Severity: CRITICAL. Misuse likelihood: likely. Reversibility: potentially irreversible for privileged actions.
- Proof obligation: revocation/currentness tests across sessions, caches, offline surfaces and provider boundaries.

### G2-EDGE-AUTHZ-003 — concurrent grant/revoke/use race produces ambiguous authority
- Scenario: grant or revoke races with an action already authorized or queued; distribution to enforcement points is partial/UNKNOWN.
- Activation: concurrent authority mutation and protected actuation.
- Expected safe behavior: decision records the policy/membership revision and enforcement evidence used; post-revoke residual cohorts are observable and bounded; ambiguous distribution is not reported as converged.
- Forbidden behavior: control-plane acknowledgement is equated with all enforcement points having revoked/granted authority.
- Disposition: policy distribution/effect may be `PARTIAL/UNKNOWN`; protected actuation follows owner policy rather than optimistic success.
- Owners: Authorization owner + distribution/provider realization owner.
- Detection: decision-to-revision lineage, enforcement-point convergence/currentness evidence.
- Blast radius: action → enterprise. Severity: HIGH/CRITICAL. Misuse likelihood: plausible. Time-to-harm: immediate.
- Proof obligation: race tests for grant/revoke/use and explicit residual-cohort semantics.

### G2-EDGE-AUTHZ-004 — tenant/Station/resource identity ambiguity leaks authority
- Scenario: resource, action, tenant or Station identity is missing, provider-native, aliased or colliding, so a valid grant matches the wrong canonical subject/resource scope.
- Activation: non-canonical IDs, incomplete tenancy context, alias reuse, migration or federation mapping.
- Expected safe behavior: authorization requires canonical principal/action/resource/scope identity or an explicit qualified adoption/mapping.
- Forbidden behavior: provider tenant/group/project/namespace identifier is accepted as canonical authorization scope solely because it is present.
- Disposition: `DENY/INCONCLUSIVE` on identity ambiguity.
- Owners: canonical identity + Authorization + Multitenancy/Organization scope owner.
- Detection: mapping uniqueness, tenant-bound resource identity, collision and cross-scope relationship checks.
- Blast radius: cross-tenant/enterprise. Severity: CRITICAL. Misuse likelihood: plausible/adversarial. Reversibility: potentially irreversible.
- Proof obligation: negative tests for cross-tenant/cross-Station alias and identifier collision.

### G2-EDGE-AUTHZ-005 — separation-of-duty and emergency authority compose into self-dealing
- Scenario: request/approve, grant/use, or break-glass/review functions are each valid but become executable by the same subject through overlapping roles, delegation or emergency paths.
- Activation: multiple roles/delegations/emergency grants satisfy individually valid policy fragments.
- Expected safe behavior: SoD/current responsibility constraints are evaluated as composition constraints, with explicit emergency lineage and review obligation.
- Forbidden behavior: union of individually valid grants silently defeats SoD or lets a subject authorize its own authority expansion.
- Disposition: `DENY` unless an explicit current exception owner authorizes the composition.
- Owners: Authorization/Organization responsibility owner + governance/compliance owner.
- Detection: role overlap graph, requester/approver identity comparison, delegation lineage, break-glass scope/time review.
- Blast radius: workflow → enterprise. Severity: CRITICAL. Misuse likelihood: likely/adversarial.
- Proof obligation: SoD property tests including delegation, nested groups and emergency paths.

### G2-EDGE-AUTHZ-006 — policy/model revision skew changes meaning mid-workflow
- Scenario: long-running work was admitted under one policy/model revision but later authorization checkpoints evaluate another revision without declared coexistence semantics.
- Activation: policy/schema/organization model changes while work remains in flight.
- Expected safe behavior: each authorization checkpoint declares whether it uses current policy, pinned policy or an explicitly migrated compatibility rule; historical decision evidence preserves producing revision.
- Forbidden behavior: silently recomputing past authorization as if the new policy had always applied, or silently grandfathering current privileged actuation from an obsolete policy.
- Disposition: `DENY/INCONCLUSIVE` where compatibility/currentness is unresolved.
- Owners: Authorization owner + lifecycle/versioning owner + workflow owner for checkpoint timing.
- Detection: decision revision lineage, model ID pinning, residual in-flight cohort inventory.
- Blast radius: workflow/process. Severity: HIGH. Misuse likelihood: plausible. Time-to-harm: delayed/latent.
- Proof obligation: version-skew matrix across in-flight work and policy/model migration.

### G2-EDGE-AUTHZ-007 — pathological policy graph or AI/low-code composition widens authority
- Scenario: nested groups/relationships, recursive conditions, broad wildcard/resource patterns, generated policies or low-code composition create extreme evaluation cost or authority broader than the user intended.
- Activation: large/recursive relationship graph, broad matching, generated policy, provider-specific semantics or implicit defaults.
- Expected safe behavior: evaluation is resource-bounded, scope-expansion is explainable, and AI/low-code output remains inside the delegating subject's authority envelope.
- Forbidden behavior: syntactic validity, model generation success or provider acceptance is treated as proof of bounded authority or safe computational cost.
- Disposition: `DENY/INCONCLUSIVE` on exceeded bounds or unresolved scope; signal for human review does not equal confirmed conflict.
- Owners: Authorization semantic owner + AI/AGWS/low-code authority owner + provider realization owner.
- Detection: expansion cardinality/cost bounds, wildcard/relationship reachability analysis, authority-delta explanation, generated-policy diff.
- Blast radius: system/enterprise. Severity: HIGH/CRITICAL. Misuse likelihood: likely. Reversibility: mixed.
- Proof obligation: pathological graph/resource-limit corpus plus authority-non-amplification tests.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-POLICY-PRECEDENCE-001 — incompatible policy-composition semantics
- Family: policy / semantic / provider.
- Activation: two or more applicable policy sources/scopes/providers have different allow/deny/intersection/additive semantics.
- Incompatible claims: locally valid allow versus superior forbid/boundary, or additive provider grant versus canonical inherited restriction.
- Why local validation misses it: each policy can be valid in its own language/store.
- Detection candidates: effective-policy composition trace; explicit precedence/intersection contract; provider semantic-conformance comparison.
- Owners: Authorization semantic owner, Organization scope owner, provider binding owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution/runtime; blast radius: Station/enterprise; reversibility: potentially difficult; time-to-harm: immediate; misuse: plausible; evidence currentness: current required.
- False-positive risk: deliberate provider-specific semantics may be valid if explicitly bounded and adopted.
- Future remediation disposition: require owner-qualified composition/precedence evidence; otherwise deny/inconclusive. No implementation prescribed here.

### G2-CONFLICT-PATTERN-AUTHORITY-CURRENTNESS-001 — valid old grant conflicts with current authority state
- Family: authority / temporal / version.
- Activation: session/cache/offline client or in-flight work carries authority evidence across membership, delegation, policy or Station revision.
- Incompatible claims: prior grant says allowed; current owner state says revoked/changed/unknown.
- Detection candidates: revision-vector/currentness horizon comparison, residual authority-cohort inventory.
- Owners: Identity currentness + Authorization/Organization owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution/runtime; blast radius: action→enterprise; reversibility: potentially irreversible; time-to-harm: immediate; misuse: likely; evidence currentness: critical.
- False-positive risk: explicitly grandfathered historical steps may be legitimate; current privileged actuation is a separate question.
- Future remediation disposition: currentness requalification or explicit grandfathering semantics; catalogue only.

### G2-CONFLICT-PATTERN-MULTITENANT-SCOPE-001 — canonical scope and external/provider scope diverge
- Family: semantic ownership / data / authority / provider.
- Activation: tenant, Station, project, namespace, account, group or resource aliases map incompletely or non-uniquely.
- Incompatible claims: provider-local scope says match; canonical organization/multitenancy scope says different subject/resource boundary.
- Detection candidates: canonical mapping lineage, uniqueness/collision checks, cross-tenant negative authorization tests.
- Owners: Multitenancy/Organization + Identity + Authorization + provider binding owner.
- Severity: CRITICAL; confidence: supported/strongly supported; detectability: static/pre-execution/runtime; blast radius: cross-tenant/enterprise; reversibility: potentially irreversible; time-to-harm: immediate; misuse: plausible/adversarial; evidence currentness: current.
- False-positive risk: explicit one-to-many mappings may be legitimate if owner-qualified.
- Future remediation disposition: require explicit canonical scope adoption/mapping before grant applicability.

### G2-CONFLICT-PATTERN-SOD-DELEGATION-001 — individually valid grants compose into prohibited self-dealing
- Family: authority / responsibility / separation-of-duty / human-procedure.
- Activation: overlapping roles, nested group membership, delegation or break-glass grants let one subject occupy mutually constrained responsibilities.
- Incompatible claims/actions: request+approve, grant+use, execute+review, or emergency-use+self-attestation.
- Detection candidates: role/responsibility graph, subject equality/relationship checks, delegation lineage and exception horizon.
- Owners: Authorization/Organization + governance/compliance owner.
- Severity: CRITICAL; confidence: supported; detectability: static/pre-execution/runtime; blast radius: workflow→enterprise; reversibility: bounded to potentially irreversible; time-to-harm: immediate; misuse: likely/adversarial; evidence currentness: current.
- False-positive risk: small organizations may explicitly authorize dual control exceptions; those require explicit owner exception rather than silent composition.
- Future remediation disposition: route to owner-qualified exception or reject observed instance; no pre-emptive implementation asserted.

## Cross-capability deepening

This visit does not add a 13th mandatory cluster. It materially deepens:

- `Identity × Authorization × Station × AGWS × AI`: stale identity/role evidence, canonical scope ambiguity, SoD/delegation composition and AI-generated policy expansion;
- `Provider/Binding × external realizations`: provider authorization semantics cannot be substituted by feature name alone; precedence, revision pinning, error semantics and tenant-scope mapping require qualification;
- `Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution`: authentication/trust validity does not establish current authorization, and provider migration can leave residual grants/caches authoritative.

## Saturation result

Material findings were discovered. Local saturation streak for Authorization / Policy / Organization / Multitenancy resets/remains `0`. All affected mandatory-cluster streaks remain `0`. No `ConflictInstance` is claimed. No remediation, product code, Work Package, TASK or Construction is authorized by this register.
