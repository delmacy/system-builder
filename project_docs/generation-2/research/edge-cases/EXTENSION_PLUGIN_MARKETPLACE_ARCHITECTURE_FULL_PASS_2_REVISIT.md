# Generation 2 — Extension / Plugin / Marketplace Architecture — Full Pass 2 Revisit

Status: ACTIVE / MATERIAL FINDINGS
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 2
Capability: Extension / Plugin / Marketplace Architecture
Mandatory cluster: Extension/Plugin × authority × provider trust × lifecycle
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. This revisit performs catalogue/classification/detection-candidate/future-remediation routing only.

## 1. Technique rotation and duplicate screen

This revisit used dependency-closure mutation, lifecycle cut analysis, ordering/registration nondeterminism, and cross-extension semantic-owner composition. It intentionally did not repeat the Full-Pass-1 package-identity/signature/permission-baseline review.

Duplicate-screen baseline: 115 reusable ConflictPatterns. The scenarios below map to existing permission-composition, revision-vector/currentness, residual-cohort, provider-qualification, semantic-ownership, temporal-ordering, resource-amplification, recovery/rollback and AI/low-code composition families. No genuinely new reusable ConflictPattern survived screening.

External evidence used as portable support, not target architecture prescription:

- VS Code documents explicit extension dependencies and extension packs, and remote extension dependencies can cross distinct extension hosts where an exported API is unavailable even though the dependency remains declared/activated. This supports treating dependency closure, execution locus and usable semantic surface as separate qualified facts.
- VS Code extension manifests distinguish extension identity, `extensionDependencies`, `extensionPack`, `extensionKind`, workspace capabilities and uninstall hooks; activation/deactivation are lifecycle events, not proof that all external or persisted effects have converged.
- VS Code Marketplace signature verification checks package integrity/source, while enterprise extension controls can be scoped by publisher, extension, version and platform. Authenticity and admission/current effective authority therefore remain distinct axes.
- Chrome extension APIs expose asynchronous lifecycle and cross-extension/native messaging surfaces, reinforcing that lifecycle/control-plane state and downstream effects can diverge temporally.

## 2. New local material scenarios

### G2-EDGE-EXTENSION-008 — dependency diamond resolves to a locally valid but jointly unqualified semantic surface

- Scenario: extension A depends on B and C; B and C independently require different compatible-looking revisions or semantic profiles of D. Host resolution selects one D revision/profile for the shared execution context.
- Preconditions / activation conditions: dependency diamond or shared host API; each edge passes local compatibility/admission; resolver performs deduplication, hoisting, singleton selection or provider substitution.
- Incompatible claims/actions/states: B claims D under profile/revision D1 while C claims D under D2, but runtime exposes only one effective D or a mixed surface.
- Why local validation may miss it: each extension and dependency edge is valid in isolation; incompatibility exists only in the realized N-wise closure and execution topology.
- Expected safe behavior / diagnostic expectation: qualify the realized dependency closure, execution locus and semantic support vector as a set; report `PARTIAL/INCONCLUSIVE` when no jointly compatible cut exists.
- Forbidden behavior: infer aggregate compatibility from pairwise package constraints, successful install, or resolver success.
- Effect/failure disposition: install may be `APPLIED`; aggregate activation/support remains `PARTIAL/INCONCLUSIVE` until closure is qualified.
- Detection candidate / stage: static dependency-closure constraint analysis; pre-activation realized-resolution diff; runtime effective-provider/API inventory.
- Owners: Extension Architecture + Build/Dependency + Standards/API Contracts + Provider/Binding + Lifecycle.
- Severity: HIGH; confidence: strongly supported; detectability: static + pre-execution + runtime; blast radius: host/process/system; reversibility: bounded migration/re-resolution; time-to-harm: immediate or latent; misuse likelihood: plausible accidental; evidence currentness: exact realized closure and host/provider generation required.
- False-positive risk: multiple D revisions may legitimately coexist in isolated execution contexts; detector must understand isolation topology rather than globally forbid diamonds.
- Recovery / future remediation disposition: pin, isolate, migrate or explicitly adopt a supported closure; do not auto-select a winner by nominal version precedence alone.
- Proof obligation: `EXTENSION-ADV-PROOF-008` — aggregate dependency admission proves a jointly qualified realized closure, or returns explicit partial/inconclusive status.

### G2-EDGE-EXTENSION-009 — hook/activation ordering changes effective semantic ownership without changing admitted components

- Scenario: two individually admitted extensions register hooks, interceptors, handlers, transforms or policy-like callbacks on the same semantic event/fact. Registration or activation order changes which output/effect becomes effective.
- Preconditions / activation conditions: shared extension point; multiple valid handlers; ordering unspecified, provider-dependent, concurrency-sensitive or changed by restart/update.
- Incompatible claims/actions/states: extension X and Y each produce locally valid but incompatible mutations/interpretations; effective winner depends on incidental order rather than declared semantic ownership/precedence.
- Why local validation may miss it: each handler passes local schema, authority and compatibility checks; conflict appears only when both are active in a particular order/cohort.
- Expected safe behavior / diagnostic expectation: expose ambiguous or competing semantic ownership/precedence; where composition is intentionally multi-handler, preserve explicit merge/ordering semantics and evidence.
- Forbidden behavior: first-loaded/last-loaded/provider callback order silently becomes canonical business precedence.
- Effect/failure disposition: activation can be `APPLIED` while composition qualification is `INCONCLUSIVE`; downstream mutations with ambiguous ownership require reconciliation before destructive retry/compensation.
- Detection candidate / stage: static extension-point ownership/precedence graph; pre-execution collision analysis; runtime handler-order/effect lineage; post-effect divergence audit.
- Owners: Extension Architecture + affected semantic owner(s) + Workflow/Integration where applicable + Lifecycle.
- Severity: HIGH–CRITICAL; confidence: supported; detectability: static + runtime + post-effect; blast radius: workflow/process/system/external parties; reversibility: bounded compensation to potentially migration-required; time-to-harm: immediate; misuse likelihood: plausible accidental and low-code induced; evidence currentness: active handler set, order/profile and owner revisions required.
- False-positive risk: intentionally composable handlers may be order-independent or have explicit merge algebra; detector must not reject declared safe composition.
- Recovery / future remediation disposition: require owner/precedence selection, explicit composition semantics, isolation, or human reconciliation when a concrete instance is signalled.
- Proof obligation: `EXTENSION-ADV-PROOF-009` — incidental activation/registration order cannot silently determine canonical semantic ownership for incompatible effects.

## 3. Mandatory-cluster material scenario

### G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-005 — admitted dependency closure changes after admission without an authority/trust requalification cut

- Scenario: extension graph G1 is admitted under publisher/trust, permission and lifecycle evidence. A dynamic/optional dependency, marketplace/provider substitution, extension-pack update or host-side resolution produces graph G2 while the root extension identity remains unchanged and active.
- Preconditions / activation conditions: mutable dependency/provider closure; long-lived active extension; current grant/trust/admission bound only to root identity or stale G1 closure.
- Incompatible claims/actions/states: control plane claims root extension remains admitted under G1, while runtime effective graph G2 contains a dependency/revision/provider with different permission, trust, containment or lifecycle state.
- Why local validation may miss it: the root extension itself did not change; each newly selected dependency may be valid independently; no component alone observes the admission cut becoming stale.
- Expected safe behavior / diagnostic expectation: dependency/provider closure changes invalidate or requalify the affected admission/authority/trust claim before newly reachable effects are treated as authorized.
- Forbidden behavior: stable root extension ID or previously successful admission authorizes arbitrary future transitive graph members.
- Effect/failure disposition: existing root lifecycle may remain `APPLIED`; aggregate authorization/trust becomes `PARTIAL/INCONCLUSIVE` until G2 is qualified; residual G1/G2 cohorts must be explicit.
- Detection candidate / stage: dependency-closure fingerprint/revision vector at admission; pre-execution effective-graph comparison; runtime cohort/credential inventory; post-effect lineage audit.
- Owners: Extension Architecture + Authorization + Trust/PKI + Provider/Binding + Lifecycle + Runtime.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution + runtime + audit; blast radius: station/system/enterprise/external parties; reversibility: bounded fencing to migration-required; time-to-harm: immediate; misuse likelihood: plausible accidental/adversarial; evidence currentness: current effective graph, publisher/trust state, grants and provider generation required.
- False-positive risk: graph changes that are proven semantically/authority-equivalent under an explicit compatibility profile need not force full re-admission; equivalence itself must be qualified evidence.
- Recovery / future remediation disposition: fence newly unqualified paths, requalify graph, drain/revoke residual authority, reconcile prior `UNKNOWN/PARTIAL` external effects; do not auto-rollback unless currently eligible.
- Proof obligation: `XEXTENSION-ADV-PROOF-005` — current effective dependency/provider closure is within the exact authority/trust/admission envelope that authorizes its effects.

## 4. Conflict classification disposition

No new `G2-CONFLICT-PATTERN-*` is added. `G2-EDGE-EXTENSION-008` maps primarily to existing structural/dependency closure, qualification-join, revision-vector and provider-qualification patterns. `G2-EDGE-EXTENSION-009` maps to semantic-ownership, temporal/ordering and state-transition conflict families. `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-005` maps to permission-composition, currentness/revision-vector, trust-authority, provider-substitution and residual-cohort families.

The correct research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No ConflictInstance is asserted and no preventive implementation is authorized.

## 5. Saturation result

- New local material scenarios: 2 (`G2-EDGE-EXTENSION-008..009`).
- New mandatory-cluster material scenarios: 1 (`G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-005`).
- New reusable ConflictPatterns: 0 after duplicate screening against 115 patterns.
- Extension local no-material streak: reset/remains 0.
- Extension/Plugin × authority × provider trust × lifecycle cluster no-material streak: reset/remains 0.
- HIGH/CRITICAL new scenarios without owner/proof/detection route: 0.
- Planning C remains blocked.
