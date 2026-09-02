# G2 Capability Dossier — Universal Capability Architecture — Revisit 3

Status: MATERIAL_NEW_FINDINGS / NOT SATURATED
Research cycle: 4

## Research question
Which recurring concepts discovered across cycles 1–3 deserve to remain universal primitives rather than become independent capabilities, especially desired/effective/observed realization, evidence freshness/quality, authority separation, compatibility profiles, qualified offline closure, Station hierarchy and provider-neutrality; and which recent candidates overlap enough to be merged during later synthesis rather than promoted now?

## Representatives and evidence/source ledger

1. **OASIS TOSCA 2.0** — requirement/capability/relationship semantics remain the strongest need/offer/fulfillment reference. Requirement matching constrains target capability, node and relationship types and may use filters; this is evidence for compatibility-before-binding without dictating a universal provider execution protocol. Source: https://docs.oasis-open.org/tosca/TOSCA/v2.0/TOSCA-v2.0.html
2. **Kubernetes declarative APIs / Deployment status** — desired object generation and controller-observed generation are distinct. `DeploymentStatus.observedGeneration` records the generation observed by the controller, while conditions are the latest observations of current state. This directly supports desired revision vs effective/observed realization evidence. Source: https://kubernetes.io/docs/reference/kubernetes-api/apps/deployment-v1/
3. **OpenFeature specification v0.9.x** — provider-neutral evaluation separates provider implementation, domain-scoped binding, evaluation context, resolution details and provider status. Evaluation context merges multiple scopes by explicit precedence; provider states include READY, STALE, ERROR, FATAL and RECONCILING. Provider evaluation returns reason/error metadata without making the provider a policy/authority source. Sources: https://openfeature.dev/specification/sections/providers/ ; https://openfeature.dev/specification/sections/evaluation-context/ ; https://openfeature.dev/specification/sections/flag-evaluation/
4. **OpenTelemetry Resource/Entity semantic model** — identifying attributes are minimally sufficient, stable during entity lifespan and reproducible across observers. This reinforces semantic identity/lifespan as a universal identity contract while telemetry remains an evidence producer rather than semantic owner. Sources: https://opentelemetry.io/docs/specs/semconv/how-to-write-conventions/resource-and-entities/ ; https://opentelemetry.io/docs/specs/otel/resource/data-model/
5. **Crossplane managed resources / ProviderConfig** — managed-resource identity differs from external-resource identity; provider configuration can be scoped independently from provider implementation and credentials/configuration are binding context. This reinforces offer/provider/configuration/realization separation. Sources: https://docs.crossplane.io/latest/managed-resources/managed-resources/ ; https://docs.crossplane.io/latest/get-started/get-started-with-managed-resources/
6. **SPIFFE trust domains and bundles** — semantic workload identity is qualified by a trust domain; trust bundles are authoritative for a domain, change over time with monotonic sequence support, can be federated and must be locally available to validate identities. This provides cross-domain evidence for authority scope, revisioned trust material, federation without namespace collapse and qualified local closure. Sources: https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/ ; https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/
7. **Open Policy Agent bundles/discovery/status** — activated policy bundles can be persisted for recovery so OPA can start from the most recently activated bundle when disconnected; bundle/plugin activation status is reported separately. This provides evidence that offline autonomy is not a boolean capability but a closure over locally available interpretation material plus freshness/status evidence. Sources: https://www.openpolicyagent.org/docs/management-discovery ; https://www.openpolicyagent.org/docs/management-status

Coverage judgment this pass: TOSCA `DEEP`; Kubernetes desired/observed revision semantics `DEEP`; OpenFeature provider/context/status `DEEP`; OpenTelemetry entity identity `DEEP`; Crossplane provider/configuration/realization `DEEP`; SPIFFE trust-domain/bundle semantics `DEEP`; OPA local bundle closure/status `DEEP`.

## Primitive stress test

### 1. Desired / effective / observed is one reusable realization lineage, not three new capabilities
Kubernetes makes desired generation and observed generation independently identifiable. Crossplane separates the control-plane managed resource from the external resource it realizes. OpenFeature separates provider configuration/evaluation from provider-reported lifecycle status. These systems differ radically in domain and mechanics, yet share the same shape:

`SemanticIntent@revision → Resolution/Binding@revision → EffectiveRealization@revision → Observation/Evidence@revision/time`

This strongly suggests the recent candidates `DESIRED-EFFECTIVE-ENVIRONMENT-REALIZATION-EVIDENCE`, `EFFECTIVE-REVISION-REALIZATION-OBSERVATION` and `DESIRED-EFFECTIVE-ARCHITECTURE-REALIZATION-EVIDENCE` should not be promoted independently before synthesis. They appear to be domain projections of one universal **revision-bound realization/evidence lineage**.

### 2. Evidence freshness/quality is a qualification contract, not a standalone capability
OpenFeature can mark cached provider state `STALE`; Kubernetes observations can lag desired generation; OPA distinguishes downloaded/activated bundle state and reports failures; SPIFFE bundles carry sequence/update semantics; OpenTelemetry identity guidance requires observer-consistent identity. Together they imply that evidence must carry at least producer, subject identity, observed revision, scope/profile, time/freshness and confidence/coverage/trust qualification.

This is likely universal metadata/decision semantics used by Observability, Governance, Architecture Reconciliation, Product Proof and provider health. The recent `ARCHITECTURE-EVIDENCE-FRESHNESS-COVERAGE-QUALITY` candidate therefore overlaps strongly with earlier `EVIDENCE-TRUST-QUALIFICATION` and revision-bound evidence candidates. Promotion as a separate capability would risk duplicating the Evidence & Provenance plane.

### 3. Evaluation/detection never grants actuation authority
TOSCA requirement matching says whether a relationship can satisfy a need; OpenFeature providers resolve a value and report reason/error/status; OPA evaluates policy and reports bundle/plugin state; OpenTelemetry observes; none of these acts as evidence that the evaluator automatically owns mutation authority in every consuming system.

The recurring architecture principle is narrower and more constitutional: **decision/evaluation authority and actuation/execution authority are separate contracts**. Drift detection, compatibility evaluation, policy evaluation, AI candidate generation and health observation may produce a decision/evidence object, but an explicit authority-bearing caller/process must own mutation.

This supports merging `NON-ACTUATING-RECONCILIATION-AUTHORITY-SEPARATION` with the broader candidate-mutation/execution findings during synthesis instead of promoting an Architecture-Reconciliation-specific capability now.

### 4. Context precedence is universal; Enterprise → Station → Role → Person is not
OpenFeature explicitly merges evaluation context by ordered levels and supports provider/domain-specific context. SPIFFE qualifies identities by trust domain and permits federation without merging trust domains. Crossplane scopes provider configuration separately from provider identity. These systems support a reusable model of `Scope`, `ContextLayer`, `Precedence`, `AuthorityConstraint` and `EffectiveResolution`.

They do **not** support hard-coding the System Builder organizational hierarchy as a universal ontology. `Enterprise → Station → Role → Person` remains an Adaptive Governed Work Surfaces / organization specialization built from generic scope and non-amplifying authority relations. Station remains first-class in SB semantics, but not every universal capability consumer should know what a Station is.

### 5. Compatibility is qualified by profile/context/operation, not a global boolean
TOSCA requirement matching is typed and filter-constrained. OpenFeature resolution is contextual and provider/domain-bound. SPIFFE federation validity depends on the presented trust domain and available corresponding bundle. Cross-domain convergence therefore supports a compatibility relation shaped like:

`CompatibilityDecision(subject, candidate, profile, operation, direction, contextRevision, constraints) → compatible | incompatible | inconclusive + evidence`

The cycle-3 `PROFILE-SCOPED-COMPATIBILITY-COEXISTENCE-MATRIX` candidate remains structurally strong, but current evidence favors a universal compatibility primitive plus domain-specific profiles, not necessarily a separate top-level capability.

### 6. Qualified offline closure is a profile claim over dependencies, not a new generic runtime
OPA can persist activated discovery bundles for recovery; SPIFFE validation requires the correct trust bundle locally and bundles evolve independently; OpenFeature providers may wrap remote services or local files and explicitly expose stale/error status. These show that offline/self-host autonomy means the required interpretation, policy/configuration, provider implementation, trust roots, artifacts, recovery procedures and evidence are locally available for a declared operation profile.

Therefore `QUALIFIED-OFFLINE-OPERATION-CLOSURE`, `OFFLINE-MIGRATION-INTERPRETATION-RECOVERY-CLOSURE`, `PORTABLE-AGENT-EXECUTION-EVIDENCE-CLOSURE` and architecture-governance offline closure likely share one reusable **ClosureManifest + Profile + Evidence** primitive. Domain-specific closure contents remain owned by their capabilities.

### 7. Provider-neutrality means stable semantic contract plus replaceable binding, not lowest-common-denominator semantics
OpenFeature is explicit that providers translate a stable API to vendor/local implementations. Crossplane separates provider implementation/configuration and external resource. TOSCA separates typed need/offer from orchestration realization. Provider-neutrality therefore does not mean hiding all provider-specific capabilities; it means portable semantic requirements and compatibility profiles remain stable while provider-native configuration and optional extensions are isolated behind explicit bindings.

The universal model should permit richer provider-specific optional metadata/capabilities without contaminating the portable requirement contract. Replacement requires compatibility + migration/transition lineage rather than alias substitution.

## Candidate universal primitive set after cycle-4 stress test

Keep as **primitive candidates**, not promoted capabilities:

- `SemanticIdentity` + explicit `LifespanContract`
- `RevisionRef`
- `ScopeRef` / `ContextLayer`
- `Requirement`
- `CapabilityOffer`
- `CapabilityExposure`
- `CompatibilityProfile`
- `CompatibilityDecision`
- `BindingDecision`
- `EffectiveResolution`
- `RealizationRef`
- `EvidenceRecord` + `EvidenceQualification`
- `AuthorityConstraint`
- `DecisionAuthorityRef`
- `ExecutionAuthorityRef`
- `TransitionLineage`
- `ClosureProfile` / `ClosureManifest`
- `ArchitectureObligationRef`

This list is intentionally a research hypothesis. Synthesis must delete/merge primitives that do not survive all capability domains.

## Product-specific mechanisms not to universalize

- TOSCA node/relationship orchestration grammar.
- Kubernetes API server, reconciliation controller and generation fields as mandatory storage mechanics.
- OpenFeature feature-flag types, hook lifecycle or its exact context precedence as universal SB rules.
- OpenTelemetry resource/entity attribute taxonomy.
- Crossplane CRDs, Kubernetes namespace mechanics or ProviderConfig API shapes.
- SPIFFE trust-domain URI format, SVIDs and bundle transport as universal identity implementation.
- OPA bundle/discovery protocols as universal policy packaging.

## Convergent patterns

1. Semantic identity, revision, concrete realization and observation differ.
2. Desired/effective/observed is a lineage across authorities, not one mutable record.
3. Evidence is revision/scope/freshness/trust qualified and can be stale or inconclusive.
4. Evaluation/detection and execution authority remain separate.
5. Context is layered and resolved; domain-specific hierarchy should not pollute universal primitives.
6. Compatibility is profile/context/operation scoped.
7. Offline autonomy is qualified closure over required local dependencies plus evidence.
8. Provider-neutrality is achieved through stable semantic contracts and explicit bindings, not execution unification.
9. Federation composes independent authority domains without requiring namespace or ownership collapse.
10. Provider implementation, provider configuration, binding and realization can evolve independently.

## Divergent patterns

The representatives disagree on execution: TOSCA orchestrates topology, Kubernetes reconciles resources, OpenFeature evaluates values, OpenTelemetry observes, Crossplane manages external resources, SPIFFE establishes federated workload trust and OPA evaluates policy. This divergence is strong negative evidence against promoting a universal execution/orchestration capability simply because the surrounding identity/evidence/binding vocabulary converges.

## Adaptive Governed Work Surfaces preservation

Adaptive Governed Work Surfaces remains distinct and mandatory. Universal architecture may provide `ScopeRef`, `CapabilityExposure`, `AuthorityConstraint`, `EffectiveResolution`, revision/evidence and provider binding primitives. AGWS owns the specialized `Enterprise → Station → Role → Person` resolution, constrained semantic component composition, mandatory inherited components, AI-only materialization rule, personal/team/role/system promotion and its nine proofs. This revisit does not dilute AGWS into generic UI or generic scope.

## Commercial metering / entitlements / rating / billing / payment

This revisit found no structural multi-representative evidence sufficient to absorb commercial metering into Universal Capability Architecture. Keep `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING` pending dedicated research / Negative-Space review. Generic `EvidenceRecord`, `ScopeRef`, `CapabilityExposure` and usage observations may later support metering, but that does not make rating/billing semantics universal by implication.

## Conceptual comparison with System Builder

No fresh-main repository archaeology is asserted here. This pass tests external universality and candidate overlap. Whether current SB contracts already implement any of these primitives remains a `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` question.

## Reconciliation hypotheses

- **GENERALIZE/MERGE candidate:** unify desired/effective/observed candidates into one revision-bound realization/evidence lineage if repository archaeology confirms duplicate domain models.
- **HARDEN/GENERALIZE candidate:** evidence qualification with producer, subject, observed revision, scope/profile, freshness and trust/coverage semantics.
- **HARDEN constitutional boundary:** decision/evaluation authority does not imply execution authority.
- **GENERALIZE carefully:** generic context layering/non-amplifying authority primitives; keep Station hierarchy specialized.
- **GENERALIZE:** compatibility profiles and tri-state/inconclusive compatibility evidence if existing compatibility is version-only/global boolean.
- **GENERALIZE/INTEGRATE:** qualified local closure manifest/profile across offline-capable domains, without creating one universal runtime.
- **PROVIDERIZE/HARDEN:** stable semantic requirement plus explicit provider binding/configuration/realization identities.
- **DO_NOT_BUILD:** universal execution/orchestration engine justified only by vocabulary convergence.

## Repository-validation questions

1. Are desired semantic revision, selected binding, effective realization and observation represented as distinguishable identities today?
2. Do multiple SB domains duplicate desired/effective/observed semantics under different names?
3. Does evidence record producer, subject/revision, scope/profile, freshness and trust/coverage, and can it express `unknown/inconclusive`?
4. Can a compatibility evaluator return inconclusive with exact profile/context/operation evidence rather than only boolean/version match?
5. Are detection/evaluation, approval/disposition and execution authority represented separately or implicitly collapsed?
6. Is generic scope/context resolution reusable without embedding `Station` into unrelated domain contracts?
7. Does `Enterprise → Station → Role → Person` resolve by non-amplifying intersection/precedence with revision-bound evidence?
8. Can offline operation declare and prove a local closure manifest for the exact operation profile rather than claiming generic self-hostability?
9. Are provider semantic identity, provider implementation revision, provider configuration, binding and concrete realization distinct?
10. Can provider replacement preserve semantic requirement identity and transition lineage while supporting provider-specific optional features?
11. Are architecture obligations/evidence consumers reusing one evidence qualification contract or inventing bespoke freshness/coverage fields?
12. Are recent desired-effective and offline-closure candidates duplicated enough to merge during synthesis rather than promote independently?

## Symbiotic Proof candidate

Define one portable semantic requirement with stable identity. Prove: (1) native and external providers advertise compatible offers under the same semantic contract; (2) compatibility is evaluated under an explicit profile/context and can return inconclusive; (3) a Station exposes only the permitted subset while Role/Person cannot amplify authority; (4) binding resolves to one concrete realization with separate identity; (5) observation/evidence names the exact desired/binding/realization revisions and becomes stale after relevant change; (6) provider/evaluator decision does not itself authorize mutation; (7) provider replacement creates transition/migration lineage without changing semantic requirement identity; (8) one declared offline operation profile remains valid using an explicit locally available closure manifest for artifacts, policies/configuration, trust and interpretation; (9) evidence generated offline can later be exported/reconciled; (10) generated runtime remains autonomous from Builder control-plane availability.

## Findings — revisit 3 / cycle 4

- **G2-FINDING-UCA-23 — Desired/Effective/Observed Candidates Collapse Into One Revision-Bound Realization Lineage:** environment, migration and architecture variants show the same semantic shape; they should default to one universal intent→binding→realization→observation lineage until synthesis proves a domain-specific reason to split.
- **G2-FINDING-UCA-24 — Evidence Freshness/Coverage/Trust Is Qualification of Evidence, Not a Standalone Capability by Default:** stale provider state, lagging observed generation, bundle activation and observer identity all point to reusable EvidenceQualification metadata and inconclusive states rather than separate evidence capabilities per domain.
- **G2-FINDING-UCA-25 — Decision/Evaluation Authority and Execution Authority Are Universally Distinct Contracts:** matching, policy evaluation, health observation, drift detection or AI candidate generation may produce decisions/evidence but must not acquire mutation authority implicitly.
- **G2-FINDING-UCA-26 — Context Resolution Is Universal but Organizational Hierarchy Is Specialized:** reusable scope/layer/precedence/non-amplification primitives are justified; `Enterprise → Station → Role → Person` remains an AGWS/organization specialization composed from them.
- **G2-FINDING-UCA-27 — Compatibility Is a Profile/Context/Operation-Scoped Tri-State Evidence Relation:** cross-domain compatibility requires qualified context and must support inconclusive/unknown outcomes; a global boolean or version label cannot represent the semantics safely.
- **G2-FINDING-UCA-28 — Offline Autonomy Is a Qualified Closure Profile Over Local Dependencies:** offline/self-host capability claims should identify the exact artifacts, interpreters, configuration/policy, trust, recovery and evidence required locally for an operation profile; domain-specific closure contents remain outside the universal model.

## Candidate reconciliation / discovery

No candidate is promoted in this pass. Instead, record three consolidation candidates for synthesis:

- **G2-CAPABILITY-CANDIDATE-UNIFIED-REVISION-BOUND-REALIZATION-EVIDENCE-LINEAGE** — `CROSS_CUTTING / CONSOLIDATION_CANDIDATE`. Potentially subsumes/merges `DESIRED-EFFECTIVE-ENVIRONMENT-REALIZATION-EVIDENCE`, `EFFECTIVE-REVISION-REALIZATION-OBSERVATION`, `DESIRED-EFFECTIVE-ARCHITECTURE-REALIZATION-EVIDENCE` and `REVISION-BOUND-EFFECTIVE-RESOLUTION-EVIDENCE`. Promotion condition: Deployment/Provider/Observability/Product Proof synthesis confirms one shared contract and no capability-specific lifecycle conflict.
- **G2-CAPABILITY-CANDIDATE-UNIFIED-EVIDENCE-QUALIFICATION-CONTRACT** — `CROSS_CUTTING / CONSOLIDATION_CANDIDATE`. Potentially subsumes/merges `EVIDENCE-TRUST-QUALIFICATION`, `ARCHITECTURE-EVIDENCE-FRESHNESS-COVERAGE-QUALITY` and revision-bound approval/proof evidence metadata. Promotion condition: Governance/Observability/AI/Product Proof confirm one reusable evidence envelope with domain-specific payloads.
- **G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-CLOSURE-PROFILE** — `CROSS_CUTTING / CONSOLIDATION_CANDIDATE`. Potentially merges qualified offline operation, migration, agent and architecture-governance closure candidates. Promotion condition: Security/Artifact/Runtime/AI/Lifecycle synthesis confirms common profile/manifest/evidence structure while dependency contents remain domain-owned.

`G2-CAPABILITY-CANDIDATE-NON-ACTUATING-RECONCILIATION-AUTHORITY-SEPARATION` remains active but is reframed as a likely constitutional `DecisionAuthorityRef ≠ ExecutionAuthorityRef` primitive rather than a standalone architecture-reconciliation capability; no promotion now.

`G2-CAPABILITY-CANDIDATE-PROFILE-SCOPED-COMPATIBILITY-COEXISTENCE-MATRIX` remains active; current evidence strengthens compatibility-profile universality but does not yet prove the matrix deserves separate capability ownership.

## Saturation

Revisits completed: 3. Consecutive revisits with no material architectural finding: **0**. Result: **NOT SATURATED** because six material findings (`UCA-23..28`) were produced.

## Value / risk / priority / next question

**Value for SB:** critical. This pass reduces ontology inflation by showing that several apparently new capabilities are better modeled initially as shared primitives and evidence envelopes.

**Risk:** over-generalization remains high. A universal primitive must survive process, UI, workflow, identity, data, runtime and governance domains without forcing infrastructure mechanics into them.

**Priority:** critical.

**Next research question:** test the consolidated primitive set against **Process & Application Modeling** next in cycle 4, especially semantic identity/lifespan, desired vs effective model realization, model-level evidence, contextual capability exposure and whether decision/execution authority separation holds for model evolution without importing infrastructure concepts.