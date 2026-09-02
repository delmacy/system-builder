# G2 Capability Dossier — Universal Capability Architecture — Revisit 4

Status: MATERIAL_NEW_FINDINGS / NOT SATURATED
Research cycle: 5

## Research question
After cycle 4 converged on revision-bound realization/evidence lineage, evidence qualification, qualified local closure, non-actuating/faceted authority and governed transitions, which concepts survive a stricter cycle-5 universality test without erasing semantic owners? In particular: how should generation-qualified observation, attempted/applied/effective/healthy distinctions, ambiguous actuation, authorized observation-to-desired normalization, convergence lag, obligation dependencies/INCONCLUSIVE propagation, Adaptive Governed Work Surfaces and the four mandatory research hypotheses constrain the universal layer?

## Representatives and evidence/source ledger
1. **Kubernetes declarative API / Server-Side Apply** — desired resource versions are conflict-controlled; field ownership is explicit and conflicting managers are surfaced rather than silently merged. This is evidence that concurrent desired-state authorship needs ownership/conflict semantics, not only revision numbers. Sources: https://kubernetes.io/docs/reference/using-api/api-concepts ; https://kubernetes.io/docs/reference/using-api/server-side-apply/
2. **Crossplane managed resources** — external identity is distinct from managed-resource identity; create-pending/succeeded/failed annotations exist because an external create can succeed while acknowledgement/persistence is lost. Crossplane deliberately stops reconciliation when creation outcome is ambiguous to avoid duplicate/leaked resources. Source: https://docs.crossplane.io/latest/managed-resources/managed-resources/
3. **OpenFeature specification** — provider status includes READY, STALE, ERROR, FATAL and RECONCILING; provider events distinguish context invalidation/reconciliation from successful readiness. Provider implementations translate stable evaluation APIs to vendor/local realizations. Sources: https://openfeature.dev/specification/sections/providers/ ; https://openfeature.dev/specification/sections/events/ ; https://openfeature.dev/specification/sections/evaluation-context/
4. **OpenTelemetry Entity model** — semantic entity identity is minimally sufficient, stable over entity lifespan and repeatable across independent observers; descriptive attributes are mutable but not identity. Sources: https://opentelemetry.io/docs/specs/otel/entities/data-model/ ; https://opentelemetry.io/docs/specs/semconv/how-to-write-conventions/resource-and-entities/
5. **OASIS TOSCA 2.0** — requirements, capabilities and relationships separate need, offer and fulfillment; requirements may be resolved by orchestration across service-template/inventory boundaries. This remains strong evidence for requirement/offer/binding separation without implying one universal execution engine. Source: https://docs.oasis-open.org/tosca/TOSCA/v2.0/TOSCA-v2.0.html
6. **Flux reconciliation semantics** — retained from the immediately preceding Architecture Reconciliation revisit as cross-capability evidence for attempted/applied revision, conditions, inventory and reconciliation freshness. Universalization here is limited to lineage/evidence vocabulary; GitOps mechanics remain product-specific.
7. **Architecture conformance/erosion literature** — retained from the immediately preceding revisit as evidence that obligation dependencies and incomplete extraction can invalidate downstream conclusions. Universalization is limited to dependency-qualified evidence and `INCONCLUSIVE`, not a universal conformance engine.

Coverage judgment: Kubernetes declarative/conflict semantics `DEEP`; Crossplane ambiguous external actuation `DEEP`; OpenFeature provider/context lifecycle `DEEP`; OpenTelemetry entity identity `DEEP`; TOSCA requirement/capability matching `DEEP`; Flux reconciliation semantics `DEEP` from prior evidence; architecture-conformance literature `DEEP` from prior evidence.

## Source of truth and identity
Universal architecture must not nominate one storage mechanism as source of truth. It defines typed identities and relations whose semantic owners remain capability-specific. A semantic subject has stable identity/lifespan; revisions identify immutable or causally ordered semantic states; realizations identify provider/runtime manifestations; observations identify evidence about a particular subject/revision/realization.

OpenTelemetry strengthens the identity rule: identifying attributes must remain stable over lifespan and be repeatable across observers. Therefore provider IDs, deployment UIDs, cache keys or telemetry labels cannot silently become canonical semantic identity merely because they are observable.

## Lifecycle, versioning and generation qualification
Cycle 5 sharpens the earlier lineage into a vector rather than a single `currentRevision`:

`SemanticIntent@revision/generation → Resolution/Binding@revision → Attempt@id → Applied/EffectiveRealization@revision → Health/Postcondition@revision/time → Observation/Evidence@revision/time`

A newer attempt does not prove newer effective state; a newer effective state does not prove health; a recent observation does not prove it observed the current semantic generation. Generation/revision qualification is therefore a universal relation between evidence and subject state, not an Architecture-Reconciliation-only concern.

## Failure semantics
Universal failure vocabulary must include at least `FAILED`, `DEGRADED`, `STALE`, `INCONCLUSIVE` and `OUTCOME_UNKNOWN` where applicable. Crossplane demonstrates why `OUTCOME_UNKNOWN` is materially different from ordinary failure: blind retry after an ambiguous create can duplicate external side effects. OpenFeature demonstrates that `STALE` differs from `ERROR` and `RECONCILING`.

The universal layer should define the state/evidence semantics, while each capability owns what recovery, retry, quarantine or compensation means.

## Extensibility and provider boundaries
Provider-neutrality remains semantic-contract stability plus replaceable bindings. TOSCA need/offer/relationship and OpenFeature provider translation both reject a lowest-common-denominator architecture. Optional provider-native features may exist, but they must be explicit capability/profile extensions and cannot silently alter portable semantics.

Provider discovery or technical support never grants admission or actuation authority. Provider replacement creates new binding/realization/evidence lineage and, where stateful, a governed transition.

## Governance and authority
Cycle 5 generalizes authority from a binary `decision vs execution` split into **faceted authority**. At minimum, architecture must be able to distinguish observe/evaluate/propose/normalize/approve/create/update/delete/recover or equivalent capability-specific facets. A provider supporting an operation is not evidence that the caller is authorized to perform it.

Normalization deserves explicit treatment: provider-observed defaults or brownfield facts may become desired/canonical state only through an authorized, provenance-bearing transition. Observation is evidence; it is not self-authorizing desired-state mutation.

## Observability and evidence qualification
Evidence must be qualified by subject identity, subject revision/generation, producer, scope/profile, observed realization, observation time, freshness policy, coverage/trust and dependency status. `INCONCLUSIVE` is mandatory when required upstream evidence is absent, stale, structurally unparseable or authority/trust qualification is insufficient.

Freshness is multi-dimensional. Architecture reconciliation showed queue/attempt/apply/health lag; OpenFeature shows context reconciliation and stale provider state. A single timestamp cannot prove convergence.

## Portability, local closure and lock-in
Qualified local closure remains a profile-scoped claim: all artifacts, interpreters, contracts, policies/configuration, trust material, provider realizations, migration/recovery metadata and evidence verifiers required for a declared operation must be locally available. Closure must include the evidence needed to prove that the local realization is still authorized and semantically valid, not only executable bytes.

This avoids both vendor lock-in and false portability claims. A portable definition that cannot be interpreted, authorized, validated or recovered without an unavailable remote dependency is not closed for that operation profile.

## Product-specific mechanism vs universal primitive
Do not universalize Kubernetes `managedFields`, Crossplane annotations, OpenFeature event names, TOSCA orchestration grammar, Flux inventory/conditions or OpenTelemetry attribute taxonomies.

Candidate universal primitives after this revisit:
- `SemanticIdentity` + `LifespanContract`
- `RevisionRef` / `GenerationRef`
- `Requirement` / `CapabilityOffer` / `CapabilityExposure`
- `CompatibilityProfile` / tri-state `CompatibilityDecision`
- `BindingDecision` / `EffectiveResolution`
- `AttemptRef`
- `RealizationRef`
- `PostconditionRef`
- `EvidenceRecord` + `EvidenceQualification`
- `EvidenceDependencyRef`
- `AuthorityFacet` / `AuthorityConstraint`
- `NormalizationTransition`
- `GovernedTransitionLineage`
- `AmbiguousOutcomeDisposition`
- `ClosureProfile` / `ClosureManifest`
- `ArchitectureObligationRef`

These remain synthesis candidates, not implementation decisions.

## Convergent patterns
1. Semantic identity, semantic revision, provider realization and observation are separate.
2. Attempted, applied/effective and healthy are separate facts.
3. Evidence must name the generation/revision it qualifies.
4. Ambiguous side-effect outcome requires quarantine/reconciliation, not blind retry.
5. Observation-to-desired normalization requires explicit authority and provenance.
6. Authority is faceted and non-amplifying.
7. Evidence dependencies propagate incomplete/`INCONCLUSIVE` status.
8. Freshness includes convergence lag, not timestamp alone.
9. Provider-neutrality preserves semantic contracts while bindings/realizations vary.
10. Local autonomy is a qualified closure claim over dependencies and proof material.

## Divergent patterns / negative evidence
The representatives deliberately disagree on execution: Kubernetes reconciles declarative resources, Crossplane controls external resources, OpenFeature evaluates flags, TOSCA resolves topology requirements, OpenTelemetry observes entities and Flux reconciles GitOps state. This is negative evidence against a universal execution/orchestration engine. The universal layer should standardize contracts/evidence/authority/transition semantics, not force one runtime.

## Mandatory hypothesis stress test
### Executable Capability Composition & Cumulative Context
Universal architecture may own typed requirements/offers/bindings, context layers, authority constraints and evidence lineage. It must not own workflow/control-flow semantics. Composition requires explicit cumulative context and authorized projections; provider output cannot silently become authority-bearing context.

### Transaction / Consistency / Concurrency
Kubernetes conflict/resource-version semantics show that revision identity alone is insufficient under concurrent mutation. Universal architecture needs a way to reference ownership/conflict/precondition evidence, but transaction isolation, compensation and domain invariants remain owned by Data/Workflow/Security or the dedicated mandatory hypothesis.

### Topology / Build / Runtime Realization
The same semantic system may have collapsed or distributed realizations. Universal architecture owns stable semantic identity, requirement/offer/binding, realization lineage and evidence; Build/Deployment/Runtime own concrete graph, packaging, placement and execution.

### Tenant Fleet / Edge / Ingress / Routing
Universal scope/exposure/binding primitives must support many independently placed realizations and hierarchical scopes without hard-coding routing/TLS/tenant mechanics. Tenant/Station identity and authority cannot be inferred from host/provider placement.

## Adaptive Governed Work Surfaces preservation
AGWS remains a distinct active capability, not a generic UCA feature. UCA may supply generic `ScopeRef`, `CapabilityExposure`, `AuthorityFacet`, `EffectiveResolution`, revision/evidence and provider-binding primitives. AGWS owns `Enterprise → Station → Role → Person`, constrained grid/slot composition, mandatory inherited components, AI-only materialization, domain-change escalation, personal automation authority, lineage/diff/reset/rollback and governed promotion.

Cycle-5 consequence: every AGWS materialization must be qualified against the current semantic generation of Station/Role/Person exposure and policy. A personalization validated against generation N becomes stale after relevant generation N+1. If a requested component/action requires normalization of provider-observed state into canonical domain/process state, the request must escalate to an authority-bearing transition rather than being materialized silently.

## Comparison with fresh `main`
A bounded default-branch code search for `CapabilityOffer EvidenceQualification AuthorityConstraint TransitionLineage ClosureManifest` returned no matches. This is only negative evidence for that exact vocabulary, not repository-wide absence and not repository archaeology. Full implementation reconciliation remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE:** one revision/generation-qualified intent→binding→attempt→effective→postcondition→evidence lineage shared across domains.
- **GENERALIZE/HARDEN:** evidence qualification with explicit dependencies and `INCONCLUSIVE` propagation.
- **HARDEN constitutional boundary:** technical capability/support never implies authority; authority is faceted and non-amplifying.
- **GENERALIZE:** `OUTCOME_UNKNOWN`/ambiguous side-effect disposition as a reusable transition state where effects can escape the control plane.
- **GENERALIZE carefully:** authorized observation-to-desired normalization primitive; domain owner retains semantic validation.
- **GENERALIZE:** convergence-lag dimensions as evidence qualification, not a new observability owner.
- **INTEGRATE:** qualified local closure must include proof/validation/trust material, not bytes alone.
- **DO_NOT_BUILD:** universal execution engine, universal transaction engine, or universal organizational ontology justified only by shared vocabulary.

## Repository-validation questions
1. Does current SB distinguish semantic revision/generation, attempt, effective realization and health/postcondition?
2. Can evidence explicitly name the exact generation/revision it observed and become stale after a relevant mutation?
3. Is ambiguous external side-effect outcome representable without treating it as ordinary failure/retry?
4. Are observe/propose/normalize/approve/create/update/delete/recover authorities distinguishable?
5. Can provider-observed defaults/brownfield facts enter desired state only through authorized provenance-bearing normalization?
6. Can evidence dependencies propagate `INCONCLUSIVE` instead of false PASS/FAIL?
7. Are concurrency preconditions/conflicts/ownership represented separately from semantic revision identity?
8. Can one semantic system survive collapsed→distributed topology without identity churn?
9. Can Station exposure change invalidate AGWS materializations and provider bindings deterministically?
10. Does offline/self-host closure include validators, trust roots, policies, migration/recovery metadata and evidence verifiers?
11. Can provider replacement preserve semantic requirement identity while creating new binding/realization/transition evidence?
12. Do any current contracts accidentally make provider/runtime identifiers canonical semantic identity?

## Symbiotic Proof candidate
Create one portable semantic capability requirement and two provider realizations. Prove: (1) semantic identity survives provider/topology substitution; (2) binding compatibility is profile-scoped and can be `INCONCLUSIVE`; (3) an actuation attempt is separately identified from effective/healthy realization; (4) acknowledgement loss after an external side effect yields `OUTCOME_UNKNOWN` and quarantine, not blind retry; (5) observation-to-desired normalization is denied without explicit authority and provenance; (6) evidence tied to generation N becomes stale after relevant generation N+1; (7) missing upstream proof causes dependent obligations to become `INCONCLUSIVE`; (8) concurrent desired-state mutation surfaces conflict/precondition evidence; (9) Station/Role changes revalidate AGWS and cannot amplify Person/AI authority; (10) provider replacement preserves semantic identity but produces new governed transition/evidence lineage; (11) the same definition realizes under collapsed and distributed topology; (12) an offline profile fails closed/`INCONCLUSIVE` when one required validator/trust/policy/recovery dependency is removed.

## Findings — revisit 4 / cycle 5
- **G2-FINDING-UCA-29 — Universal Realization Lineage Requires Attempted, Effective and Healthy Facts to Remain Distinct:** one `currentRevision` cannot safely represent intent, actuation attempt, applied realization and postcondition.
- **G2-FINDING-UCA-30 — Generation Qualification Is a Universal Evidence Dimension:** apparently current evidence bound to an older semantic generation is stale/inapplicable regardless of observation recency.
- **G2-FINDING-UCA-31 — Ambiguous External Actuation Outcome Is a Reusable Transition State, Not Ordinary Failure:** where effects may escape the control plane, acknowledgement loss requires quarantine/reconciliation before retry.
- **G2-FINDING-UCA-32 — Observation-to-Desired Normalization Is an Explicit Authority-Bearing Transition:** discovered/default/brownfield facts may inform canonical intent but cannot mutate it merely because a provider observed them.
- **G2-FINDING-UCA-33 — Universal Authority Must Be Faceted Rather Than Binary:** observe/evaluate/propose/normalize/approve/create/update/delete/recover facets prevent provider support or diagnostic ability from becoming implicit mutation authority.
- **G2-FINDING-UCA-34 — Evidence Dependency and Convergence Lag Are Part of Evidence Qualification:** upstream proof failure and queue/attempt/apply/health lag must propagate `INCONCLUSIVE`/freshness semantics instead of being hidden behind a recent timestamp.
- **G2-FINDING-UCA-35 — Concurrent Desired-State Mutation Requires Ownership/Precondition Evidence Beyond Revision Identity:** reusable architecture must be able to express conflict/ownership/precondition evidence while leaving transaction semantics to their domain owners.

## Capability Discovery candidates
- `G2-CAPABILITY-CANDIDATE-UNIVERSAL-ATTEMPT-EFFECTIVE-POSTCONDITION-LINEAGE` — CROSS_CUTTING / MERGE_TARGET into unified revision-bound realization/evidence lineage.
- `G2-CAPABILITY-CANDIDATE-UNIVERSAL-FACETED-AUTHORITY-CONTRACT` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE with non-actuating/faceted reconciliation authority.
- `G2-CAPABILITY-CANDIDATE-UNIVERSAL-AMBIGUOUS-OUTCOME-DISPOSITION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; requires confirmation in Workflow/Integration/Deployment/Recovery.
- `G2-CAPABILITY-CANDIDATE-AUTHORIZED-NORMALIZATION-TRANSITION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; requires brownfield/Data/Config confirmation.
- `G2-CAPABILITY-CANDIDATE-EVIDENCE-DEPENDENCY-CONVERGENCE-QUALIFICATION` — CROSS_CUTTING / MERGE_TARGET into unified evidence qualification.

No candidate is promoted this pass.

## Architecture proof backfill — Universal Capability Architecture
Status advances from `BACKFILL_REQUIRED` to `PARTIAL` with explicit obligations:
1. semantic identity survives provider/topology realization replacement;
2. generation-N evidence becomes stale after relevant generation N+1;
3. attempted/effective/healthy facts remain distinguishable under failed actuation/postcondition;
4. ambiguous side-effect outcome quarantines and prevents blind retry;
5. observe-only actor cannot normalize/create/update/delete despite provider support;
6. missing/stale upstream evidence propagates `INCONCLUSIVE` to dependent obligations;
7. concurrent desired mutation produces explicit conflict/precondition/ownership evidence;
8. qualified local closure fails closed when validator/trust/policy/recovery proof material is incomplete;
9. AGWS Station/Role change revalidates effective surface and does not amplify Person/AI authority;
10. collapsed→distributed topology preserves semantic system/capability identity while realization evidence changes.

## Value / risk / priority / next question
Value: HIGH — these primitives constrain every later planning phase and prevent provider/runtime details from becoming accidental constitutional semantics.
Risk: HIGH if over-generalized — a universal layer that owns execution, transactions, organization or domain invariants would erase semantic ownership and recreate lock-in internally.
Priority: HIGH.
Next question for this capability: after another full cycle, test whether the proposed primitive set is actually minimal by trying to remove/merge primitives against transaction, topology, fleet/edge and AGWS proofs; saturation requires two eligible revisits without material architectural findings or repository-only remaining questions.