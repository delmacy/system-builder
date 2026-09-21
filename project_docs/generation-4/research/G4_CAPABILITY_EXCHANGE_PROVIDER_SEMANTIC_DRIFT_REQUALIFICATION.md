# G4 Capability Exchange — Provider Semantic Drift Detection & Requalification

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select an IAM provider, scanner, policy engine, simulator, gateway, broker, adapter framework or implementation technology; it does not reopen G3 or authorize product work.

## 1. Research question

The prior semantic-mapping round established that heterogeneous delegation requires directional effective-authority containment and that a mapping proof is defeated when its provider permission universe or evaluation semantics materially change.

The remaining gap is operational: provider-managed roles, permission catalogs, resource-policy layers and authorization behavior can evolve without a System Builder artifact revision. An autonomous runtime therefore cannot equate `local mapping artifact unchanged` with `provider semantics unchanged`.

Core boundary:

`mapping artifact unchanged != provider semantic state unchanged`.

The research question is how a runtime can detect, classify and requalify provider semantic drift without treating provider documentation, a simulator, a changelog, a central scanner, or one observed request as an omniscient semantic oracle.

## 2. Evidence reviewed

Primary/current documentation:

- AWS IAM, choosing managed versus inline policies: AWS-managed policies are maintained by AWS and updates are automatically applied to attached principals. <https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-choosing-managed-or-inline.html>
- AWS IAM Access Analyzer policy validation: validation covers syntax/grammar, ARN format, action names and condition keys; existing policies can become invalid relative to later policy-engine updates. <https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_policy-validator.html>
- AWS IAM Access Analyzer: external-access analysis is Region-scoped for supported resources, so one analyzer is not global evidence for all Regions. <https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html>
- Google Cloud IAM role guidance and role overview: predefined roles are maintained by Google and automatically gain/change permissions as services evolve; Google recommends routinely checking predefined roles and exposes a permission change log. Predefined/basic-role ETags are not useful as a changing semantic version (`AA==`), unlike custom-role ETags. <https://cloud.google.com/iam/docs/choose-role-type> and <https://cloud.google.com/iam/docs/roles-overview>
- Google Cloud Policy Simulator: simulations replay recent access and can produce `unknown` results when information is missing; some policy constructs/resource types have limitations. <https://cloud.google.com/policy-intelligence/docs/simulate-iam-policies>
- Azure RBAC role definitions: role definitions expose Actions/NotActions/DataActions/NotDataActions plus `updatedOn`, demonstrating that role identity and current permission definition are separate facts. <https://learn.microsoft.com/azure/role-based-access-control/role-definitions>

Prior G4 evidence reused rather than reopened: semantic policy diff/proof; proof-carrying verification; distributed evidence caching/invalidation; multi-domain invalidation; effect-gate complete mediation; dynamic effect-path discovery; effect-capability privilege drift; offline delegation attenuation/revocation; heterogeneous delegation semantic-mapping proof.

These systems are benchmarks/failure evidence only; none is selected.

## 3. Material finding: provider semantics need evidence vectors, not a single revision

A provider may expose several imperfect signals:

- managed-role definition snapshots;
- permission/action/resource-type catalogs;
- policy-engine or service release notes;
- documented evaluation semantics;
- resource-policy/configuration snapshots;
- simulator/analyzer results;
- live allow/deny probes where safe;
- observed production authorization outcomes;
- provider attestations or signed metadata when available.

No single signal is generally complete. A provider changelog can omit service-specific behavior; a role snapshot may not expose resource-policy effects; a simulator may have unsupported cases; a live probe samples only the exercised principal/resource/context; one regional analyzer may not cover another region.

Candidate primitive:

`ProviderSemanticEvidenceVector = {catalog, roleDefinition, evaluationRules, resourcePolicy, analyzer, simulator, probe, observation, attestation}`.

Each element is independently qualified by scope, provenance, observation time, semantic profile, currentness horizon and known limitations.

Therefore:

`one fresh signal != provider semantics globally current`.

## 4. Managed-role identity is not semantic identity

AWS-managed policies are updated by AWS and the updates automatically affect attached principals. Google predefined roles are likewise maintained and updated automatically. Stable role names therefore cannot be treated as immutable authorization contracts.

Google adds a particularly useful adversarial: basic and predefined roles report a constant ETag (`AA==`), while custom-role ETags change on modification. A generic adapter that assumes `ETag changed iff semantics changed` would silently miss predefined-role drift.

Candidate rule:

`provider object identity/version field is semantic evidence only when its contract explicitly tracks every material semantic change in the proof scope`.

Otherwise the proof binds to a content/evidence snapshot plus declared provider semantics, not merely the provider's nominal role identifier.

## 5. Drift is typed, not boolean

Candidate drift classes:

1. `GRANT_SET_DRIFT` — role/policy gains or loses direct permissions;
2. `RESOURCE_UNIVERSE_DRIFT` — new resource types, hierarchy, aliases or applicability broaden/narrow reach;
3. `CONDITION_SEMANTICS_DRIFT` — condition keys, evaluation, error handling or context availability change;
4. `DENY_BOUNDARY_DRIFT` — deny, boundary, session/resource-policy or inheritance composition changes;
5. `META_CAPABILITY_DRIFT` — new impersonate/bind/mint/escalate/acquisition path changes reachable effects;
6. `EFFECT_PATH_DRIFT` — service/API adds a new path to an already protected business effect;
7. `ANALYSIS_COVERAGE_DRIFT` — simulator/analyzer/catalog coverage changes, including newly unsupported or newly modeled cases;
8. `OBSERVED_BEHAVIOR_DRIFT` — live behavior contradicts the proof's modeled expectation;
9. `OPAQUE_DRIFT` — evidence establishes that something material changed but cannot qualify its semantic direction.

Drift direction matters. Removing a target permission can break required functionality without violating attenuation; adding a permission can violate attenuation; changing an unknown/error rule can affect both safety and liveness.

`change detected != proof necessarily unsafe`, but `material unclassified change != proof still proven`.

## 6. Selective proof defeat and dependency lineage

A provider change should not cause a global platform invalidation. Mapping proofs already name protected effects, resources, principals, conditions and provider-semantic dependencies. Drift evidence should be matched to that lineage.

Candidate relation:

`MaterialTo(proof, drift) -> requalify or lower disposition`.

If the changed permission/resource/predicate cannot participate in the proof's protected effect or acquisition closure, the proof can remain current with evidence explaining non-materiality. If materiality cannot be established because provider semantics are opaque, the affected dimension becomes `UNKNOWN` rather than globally guessed safe.

This extends the existing rule:

`dependency changed != global cache flush`.

## 7. Detection is multi-channel and disagreement is evidence

Candidate detection strategy is implementation-independent and combines complementary channels:

- **catalog/definition diff** for known provider objects;
- **release/change-feed observation** as a hint that requalification may be needed;
- **differential simulator/analyzer runs** over a purpose-qualified corpus;
- **safe differential probes** over representative effect/resource/context cases where side-effect-free checks exist;
- **runtime outcome monitoring** for allow/deny behavior inconsistent with the qualified model;
- **periodic bounded refresh** for providers without push/change feeds;
- **local monotonic floors** so a stale refresh cannot roll a runtime back below a previously observed material provider-semantic/security floor.

Signals do not vote by simple majority. A catalog saying unchanged while a live negative control unexpectedly succeeds is a semantic conflict requiring qualification.

`signal disagreement != majority truth`.

Candidate dispositions: `CURRENT`, `CURRENT_WITH_LIMITATIONS`, `REQUALIFICATION_REQUIRED`, `PARTIAL`, `UNKNOWN`, `INCOMPATIBLE`, `CONTESTED`.

## 8. Simulators and analyzers are bounded evidence

Google Policy Simulator explicitly reports unknown/error cases and relies on retrievable policies, group membership and recent access history. AWS Access Analyzer has resource/type and regional coverage boundaries. AWS policy validation checks important structural facts but is not an effective-authority equivalence proof.

Therefore:

`simulator clean != semantic mapping proof current`;

`analyzer no finding != no reachable authority`;

`policy validates != effect contract preserved`.

A simulator/analyzer result must bind its provider, region/scope, resource/principal/context corpus, supported policy types, observation window and errors/unknowns. Newly expanded analyzer coverage may improve evidence but must not rewrite what an older result proved historically.

## 9. Runtime autonomy without a central semantic oracle

A central research/scanner service may discover provider drift efficiently, but published runtimes must not require Builder availability for every authorization decision.

Candidate autonomy model:

- runtime carries the mapping proof and its material provider-semantic dependency fingerprints/evidence;
- runtime retains monotonic minimum floors for high-risk semantic/security changes it has observed;
- signed/qualified drift notices may accelerate local defeat, but absence of a notice is not proof of no drift;
- provider-specific evidence has explicit refresh/currentness horizons;
- when online evidence is unavailable, the contract declares which operations may continue under bounded stale evidence, which may queue without effect, and which must fail/defer;
- reconciliation after reconnect requalifies only affected proofs/obligations.

`central scanner unavailable != all runtime operation stops`.

`central scanner silent != provider unchanged`.

## 10. Conservative floors and monotonic observations

For protected effects, some provider changes should establish a local floor that stale evidence cannot erase. Examples include discovery that a managed role gained a dangerous permission, a provider changed evaluation semantics, or a prior mediation assumption no longer completely covers the effect path.

Candidate rule:

`observed material semantic/security floor cannot be rolled back by an older catalog snapshot, restored cache, runtime rollback or delayed scanner message without explicit successor/reconciliation evidence`.

This is not a global provider revision. Floors remain provider/domain/effect/proof scoped.

## 11. Provider attestation is provenance, not semantic omniscience

A provider could expose signed catalogs, changelogs or versioned permission metadata. Cryptographic authenticity would improve provenance and anti-tampering but would not prove that the artifact fully models service authorization behavior.

`provider-signed != semantically complete`.

An attestation can strengthen a declared claim such as "role R contained permission set P at time T". It cannot silently prove unrelated claims about resource policies, undocumented effect paths, propagation, or actual business effect semantics.

## 12. Proof artifact refinement

Candidate refinement to `DelegationSemanticMappingProofRef`:

```text
ProviderSemanticDependencySet
  providerRef
  permissionUniverseEvidenceRef
  managedRoleEvidenceRefs[]
  evaluationSemanticsEvidenceRefs[]
  resourcePolicyEvidenceRefs[]
  effectPathEvidenceRef
  metaCapabilityClosureEvidenceRef
  analyzerSimulatorEvidenceRefs[]
  observationProbeEvidenceRefs[]
  semanticFloors[]
  currentnessVectorRef
  changeTriggers[]
  knownCoverageGaps[]
  conflictRefs[]
```

Candidate `ProviderSemanticDriftEvidence`:

```text
ProviderSemanticDriftEvidence
  providerRef
  observedAt
  sourceKind
  sourceScope
  beforeEvidenceRef
  afterEvidenceRef
  driftClass
  affectedPermissionResourcePredicateSet
  materialityAssessmentRef
  confidenceAndLimitations
  resultingDisposition
  requalificationRefs[]
```

These are research vocabulary candidates, not schemas/API commitments.

## 13. Requalification decision rule

For a mapping proof `P` and newly observed provider evidence `E`:

1. authenticate/qualify provenance of `E` without treating provenance as semantic completeness;
2. determine the evidence scope and known coverage gaps;
3. classify the drift dimension(s);
4. intersect drift scope with `P`'s protected-effect/resource/context/meta-capability dependency lineage;
5. if provably non-material, retain `P` and attach non-materiality evidence;
6. if material and fully modelable, recompute/reverify directional containment and required mediation;
7. if material but opaque/unsupported, lower the affected disposition to `PARTIAL/UNKNOWN/CONTESTED` or `INCOMPATIBLE` according to the contract;
8. update scoped monotonic floors where the new evidence defeats older safe assumptions;
9. propagate proof defeat/requalification only to dependent obligations/caches;
10. preserve historical evidence showing which semantic snapshot qualified past effects.

No step grants implementation authority.

## 14. Proof obligations

1. **Managed-role mutability:** stable provider role/policy identity never substitutes for current semantic contents.
2. **Evidence-vector scope:** every drift signal declares provider/domain/region/resource/principal/context/coverage limits where material.
3. **No single-oracle assumption:** changelog, catalog, simulator, analyzer, probe, runtime observation or scanner alone is not assumed complete unless a provider contract proves that scope.
4. **Selective materiality:** unrelated provider changes do not force global invalidation.
5. **Unknown preservation:** opaque material drift cannot retain `PROVEN_ATTENUATED` by default.
6. **Directional re-proof:** material changes are rechecked against target-reachable-effect containment, not only schema/action-name diff.
7. **Meta-capability closure:** drift in acquisition/impersonation/bind/mint paths defeats proofs that depend on their absence.
8. **Effect-path closure:** newly reachable API/resource paths to a protected effect are material even if old action names are unchanged.
9. **Deny/condition completeness:** changes to deny, boundary, inheritance, condition/error semantics remain first-class.
10. **Analyzer limitation visibility:** unsupported policy/resource/region cases remain explicit.
11. **Probe limitation visibility:** sampled behavior never becomes universal proof beyond its declared universe.
12. **Conflict representability:** contradictory evidence is `CONTESTED`, not normalized into whichever source is preferred operationally.
13. **Monotonic floor:** stale cache/rollback cannot erase a locally observed material semantic/security floor.
14. **Historical binding:** past effect evidence remains bound to the provider-semantic evidence qualified at the effect time.
15. **No false currentness:** evidence freshness and semantic completeness are independent dimensions.
16. **Runtime autonomy:** no mandatory online Builder/central scanner is introduced for every effect decision.
17. **Bounded offline behavior:** autonomous operation under stale provider evidence is explicitly operation/effect scoped and horizon bounded.
18. **Reconciliation:** reconnect/recovery requalifies affected queued/in-flight obligations before protected effects where required.
19. **Attestation scope:** signed provider evidence proves only its declared claim/provenance, not undocumented semantic completeness.
20. **No provider business ownership:** provider IAM semantics remain external authorization evidence, not canonical System Builder business authority.
21. **No adapter strengthening:** adapter/driver/gateway cannot convert missing drift evidence into equivalence.
22. **Portability:** drift/requalification obligations are provider-independent even when evidence acquisition is provider-specific.
23. **Change-feed loss tolerance:** correctness does not depend exclusively on receiving every provider notification/changelog entry.
24. **No synthetic global revision:** independent provider/service/region evidence is not collapsed into one fabricated platform revision.

## 15. Adversarial cases

1. AWS-managed policy keeps its ARN/name but gains a new permission automatically.
2. Google predefined role changes while its ETag remains `AA==`; generic ETag watcher reports no drift.
3. Provider changelog announces a permission but omits a resource-policy evaluation change.
4. Changelog is delayed or missed; runtime sees changed behavior first.
5. Catalog adds an action whose business effect aliases an already protected effect under a new API path.
6. Managed role loses permission: attenuation remains safe but required functionality silently fails.
7. Managed role gains `impersonate`/`pass role`/bind capability rather than the protected action directly.
8. Resource hierarchy expands and an unchanged wildcard role reaches a new resource class.
9. Condition key becomes available on more resources, changing predicate meaning.
10. Provider changes unknown-condition handling from deny-like to permissive behavior.
11. Simulator corpus has no historical access for the newly introduced path and reports no changed accesses.
12. Simulator returns unknown/error but adapter interprets absence of a deny as allow.
13. AWS Access Analyzer in one Region is treated as proof for resources in another Region.
14. Analyzer does not support a resource type that becomes reachable by the role.
15. Policy validator accepts syntax and valid action names; runtime promotes that to semantic equivalence.
16. Central scanner observes new provider state but one runtime misses the invalidation message.
17. Offline runtime restarts from an older cache below a previously observed provider-semantic floor.
18. Delayed provider snapshot arrives after a newer observation and rolls local evidence backward.
19. Live probe passes because tested resource lacks a resource policy that broadens another resource.
20. Live probe fails due to transient outage and is misclassified as authorization revocation.
21. One negative control unexpectedly succeeds while catalog and simulator still claim deny; majority vote hides the conflict.
22. Provider-signed role catalog is authentic but incomplete for service-specific authorization side effects.
23. Adapter pins role contents but not permission-to-business-effect mapping; provider redefines an operation's effect.
24. Background path bypasses the monitored gateway and exercises a newly granted provider capability.
25. Custom role is stable but a referenced resource policy changes independently.
26. Permission universe grows while mapping artifact and credential bytes remain identical.
27. Requalification globally invalidates every tenant/provider proof, causing avoidable outage despite narrow materiality.
28. To avoid outage, runtime keeps old `PROVEN_ATTENUATED` disposition despite unclassified material drift.

## 16. Technology-independent synthesis

The material synthesis is:

`mapping proof currentness = proof semantics + provider-semantic dependency evidence + scoped currentness/floors`, not `mapping file version`.

Provider-managed authorization must be treated as an evolving external semantic dependency. Safe maintenance combines multiple bounded evidence channels, preserves disagreements and unknowns, selectively defeats proofs through dependency lineage, and supports runtime-local bounded operation without creating a central semantic IAM oracle.

The Shared Semantic Kernel may eventually need stable refs for provider-semantic evidence/currentness/floors, while the Capability Exchange Plane may transport drift/requalification evidence. Neither owns provider IAM semantics or capability business authority.

## 17. Deduplication / non-decisions

This round does **not** reopen generic cache invalidation, generic provider health, policy proof semantics, complete mediation, effect-path discovery, privilege-envelope modeling or offline delegation. It specializes their interaction at the boundary where an external provider changes authorization semantics without a local SB artifact revision.

No AWS IAM, Google Cloud IAM, Azure RBAC, scanner, simulator, policy engine, solver, gateway, broker, service mesh or central exchange service is selected.

## 18. Maturity and next gap

Material delta exists. This subfront remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

Highest-value next gap: **provider semantic rollout skew and effect-locus currentness** — when a provider semantic change is real but propagates asynchronously across regions/accounts/endpoints/control-plane/data-plane caches, determine how a mapping proof names where/when the semantics are actually effective, how revocation/deny changes establish conservative floors, and how failover/routing avoids converting mixed provider generations into false success without requiring a global provider oracle.
