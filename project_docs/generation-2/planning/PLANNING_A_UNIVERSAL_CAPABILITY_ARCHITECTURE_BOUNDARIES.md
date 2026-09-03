# Generation 2 — Planning A: Universal Capability Architecture Boundaries

Status: COMPLETE_FOR_CAPABILITY — PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Universal Capability Architecture
Authority inputs: `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`, `project_docs/generation-2/research/CAPABILITY_PROOF_MATRIX.md`, authoritative Generation 2 research dossiers/ledgers, and the already-completed AGWS Planning A boundary pass.

This document defines taxonomy ownership and boundaries only. It does not assert current System Builder implementation, choose providers, define target modules, materialize WBS/TASKs, execute Construction, or enter Planning B.

## 1. Canonical ownership

**Universal Capability Architecture (UCA)** owns the smallest reusable architecture contracts required for independently owned capabilities to compose without collapsing semantic ownership into one platform-wide model.

UCA is a **shared architecture-contract owner, never a semantic god-object**. It owns common structural vocabulary only where multi-capability research proved the structure to be universal. Domain meaning remains with the capability that owns the relevant truth.

UCA owns:

1. typed distinction between canonical semantic identity and realization/provider/runtime identity;
2. applicability-scoped qualified claims;
3. revision-vector structure for independently evolving dependencies;
4. attempted → accepted → effective/applied → converged → validated lineage shape;
5. explicit effect disposition including `APPLIED`, `NOT_APPLIED`, `PARTIAL` and `UNKNOWN`;
6. qualified evidence-envelope structure, including subject, producer revision, provenance, applicability, freshness/currentness, coverage, uncertainty and replay horizon;
7. first-class `INCONCLUSIVE` outcome semantics for missing/stale/partial evidence;
8. source-of-truth ownership metadata and explicit adoption/normalization boundary;
9. capability/support-vector structure for multidimensional portability/compatibility claims;
10. provider-binding lifecycle skeleton: discover → qualify/admit → bind → actuate → observe → reconcile → drain/withdraw;
11. residual-cohort drainage contract shape;
12. evidence/currentness-horizon structure;
13. non-amplifying-authority contract shape;
14. governed delegation hierarchy invariant `Enterprise → Station → Role → Person` as a cross-capability authority relation consumed by semantic owners;
15. qualified local/offline-closure declaration structure;
16. rollback-eligibility qualification structure;
17. lineage-preserving correction/supersession structure;
18. measurement/evaluation-profile relation between consumer-owned information need, revisioned profile, source evidence and immutable assessment.

UCA does **not** own the domain-specific meaning, policy, lifecycle postconditions, data model, process, workflow, provider mechanism, economic interpretation, trust decision, UI behavior or runtime behavior expressed through these structures.

## 2. Source-of-truth boundary

UCA source of truth is the revisioned set of architecture-level contract definitions and invariants describing how semantic owners exchange identity, evidence, authority, revision, qualification and realization information.

UCA does not become source of truth for values carried by those contracts. For example:

- Identity owns whether a subject is a particular Person or workload;
- Authorization owns whether an actor may perform an act;
- Provider/Binding owns whether a provider satisfies a required support vector;
- Lifecycle owns generic revision/coexistence semantics while each domain owner owns its compatibility postconditions;
- Governance owns control/obligation meaning;
- Observability owns operational evidence semantics;
- FinOps owns technology-economic interpretation;
- AGWS owns governed-surface semantics.

A universal envelope may transport or qualify these facts, but cannot redefine them.

## 3. Anti-god-object constraints

UCA is forbidden from becoming any of the following:

1. a universal entity/schema model;
2. a universal workflow/process model;
3. a universal authorization/policy engine;
4. a universal provider abstraction hiding material semantic differences;
5. a universal evaluator or scalar health/complexity/risk score;
6. a central mutable store that overwrites owner truth;
7. an implicit orchestration engine;
8. a universal lifecycle state machine replacing domain lifecycle semantics;
9. a convenience layer that converts external/provider IDs into canonical IDs;
10. an authority broker that widens delegated rights;
11. an AI-controlled architecture authority;
12. a generic “common” package into which unresolved ownership questions are dumped.

A primitive belongs in UCA only when its structure is reusable across multiple independent semantic owners **without requiring UCA to decide the domain predicate itself**.

## 4. Canonical identity vs realization identity

UCA establishes the structural rule:

`CanonicalSemanticIdentity != Provider/External/RuntimeRealizationIdentity`.

The semantic owner decides canonical identity. Provider/Binding and realization owners maintain typed aliases/bindings to external identities. External identity may become canonical only through an explicit, authorized adoption decision owned by the relevant semantic capability.

Therefore:

- matching names or IDs do not establish equivalence;
- provider substitution may preserve canonical identity while changing realization identity;
- one canonical identity may have multiple simultaneous qualified realizations during coexistence/cutover;
- stale/ambiguous mappings yield `PARTIAL` or `INCONCLUSIVE`, not synthetic identity;
- cross-system composition preserves typed provider/tenant/resource-type/version context for aliases.

## 5. Qualified claim boundary

UCA owns the shape of an applicability-scoped claim, not the predicate being asserted.

A qualified claim minimally identifies:

- claim subject;
- semantic owner / claim type;
- applicability scope and population;
- producing revision vector;
- evidence/profile references;
- provider/support assumptions where relevant;
- freshness/currentness and observation time;
- coverage/uncertainty;
- result, including `INCONCLUSIVE` where evidence is insufficient;
- replay/current-use horizon.

A previous `PASS`, `READY`, `VALID`, `ALLOW` or `HEALTHY` result is not automatically current after relevant subject, policy, provider, schema, topology, trust, model or evidence revisions change.

## 6. Lifecycle and revision responsibility

UCA owns the generic **revision-vector relation** and qualification rules that prevent one global version from hiding independently changing dependencies.

It does not own domain-specific compatibility. Responsibilities are divided as follows:

- UCA: structure for revisions, lineage, producing revisions, supersession and applicability;
- Lifecycle/Versioning: cross-capability coexistence, migration readiness, withdrawal and rollback/state-recovery distinctions;
- semantic owner: compatibility rules, invariants and domain postconditions;
- Provider/Binding: realization/provider revision and support qualification;
- Architecture Reconciliation: desired-vs-observed/effective comparison and drift qualification.

Historical evidence remains replayable against its producing revision vector but cannot qualify changed current state without explicit revalidation.

## 7. Attempt/effect/convergence boundary

UCA owns the reusable lineage distinction:

`attempted → accepted → effective/applied → converged → validated`.

No stage may be inferred solely from another stage. Provider/API acceptance is not semantic effectiveness; observed effectiveness is not convergence; convergence is not domain validation.

For ambiguous remote mutations UCA requires explicit effect disposition. `UNKNOWN` requires reconciliation before an unsafe retry. Integration, Workflow, Deployment, Data, Storage and other owners define the domain-specific safe-retry/recovery rule.

## 8. Evidence boundary

UCA owns evidence-envelope structure and common currentness principles. It does not own the meaning of every signal.

The envelope preserves:

- subject and claim relation;
- producer and provenance;
- producing revision vector;
- applicability/coverage;
- freshness/currentness;
- uncertainty and incompleteness;
- correction/supersession lineage;
- replay horizon.

Observability owns telemetry semantics; Governance owns compliance/audit evidence semantics; Build/Artifact owns supply-chain evidence; Trust owns path/revocation evidence; AI evaluation owners produce evaluation evidence under their own semantic contracts. UCA merely prevents these from being flattened into unqualified booleans.

## 9. Authority boundary

UCA owns the **non-amplification invariant and delegation structure**, not permission truth.

The constitutional hierarchy is preserved:

`Enterprise → Station → Role → Person`.

Authorization/Policy owns actor authority and delegation decisions. AGWS owns governed-surface specialization and Station capability exposure semantics. UCA provides reusable structural constraints so a consumer can prove that effective authority is an explicit subset/intersection of applicable grants and inherited restrictions.

AI, AGWS, provider discovery, degraded mode, offline operation, retry, reconciliation and local administration cannot create authority absent an owning-capability decision.

## 10. Provider and portability boundary

UCA owns reusable provider-neutral structures but must not erase material provider divergence.

Provider/Binding owns discovery, qualification, admission, binding, fallback, coexistence, cutover and withdrawal. Standards/Interoperability owns protocol/contract conformance. Domain owners state required semantics.

UCA's `CapabilitySupportVector` therefore represents multiple independently qualified dimensions such as semantics, limits, ordering, failure behavior, isolation, offline behavior, lifecycle, evidence and authority. A single `supported=true` flag is insufficient where differences are material.

Provider-specific mechanisms remain providerized. They are not promoted into UCA because they are convenient implementation details.

## 11. Residual cohort and cutover boundary

UCA owns the reusable notion that substitution/cutover is not complete while an old cohort can still produce authoritative effects.

The domain owner names the cohort. Examples include sessions, workers, caches, subscriptions, credentials, replicas, routes, clients, rendered artifacts, checkpoints or retained provider resources.

Provider/Binding and Lifecycle orchestrate qualification/withdrawal semantics; individual capabilities define domain-specific drainage and closure postconditions.

## 12. Local/offline closure boundary

UCA owns the declaration/qualification shape for local/offline closure. Developer/Operator Experience, Deployment, Trust, Secrets, Identity, Authorization and domain owners determine the concrete closure.

Offline operation must state which trust, schema, policy, artifact, provider, evidence and authority dependencies are retained locally and their horizons. Missing/expired dependencies yield bounded degradation, denial or `INCONCLUSIVE` according to owner policy; disconnection never broadens authority.

Reconnect invalidates assumptions that depended on stale local state and triggers owner-specific reconciliation/requalification.

## 13. Rollback boundary

UCA owns `RollbackEligibility` as a qualified-claim structure. Lifecycle/Versioning owns generic coexistence/withdrawal semantics; the affected domain owns whether a historical revision is semantically restorable; Build/Artifact/Deployment/Data/Trust/Provider owners supply prerequisite evidence.

Historical existence is not proof of current rollback eligibility.

## 14. Measurement/evaluation boundary

UCA owns only the structural relation:

`ConsumerInformationNeed -> RevisionedEvaluationProfile -> QualifiedSourceEvidence -> ImmutableAssessment`.

It explicitly rejects a universal evaluator and universal scalar score. Predicates, thresholds, aggregation, materiality and acceptance remain domain-owned. This preserves the synthesis disposition of Relative Operational Complexity and AI-evaluation research: generalize profile/evidence contracts without creating an aggregation magnet.

## 15. Relationship to Process & Application Modeling

Process & Application Modeling owns canonical business/application/process semantics, imports and model lineage. UCA provides identity/revision/evidence/qualification contracts but cannot define a universal business object model or silently normalize brownfield/provider constructs.

Any unresolved provider-specific construct remains owned by Process modeling and its normalization policy, with ambiguity represented explicitly.

## 16. Relationship to UI and AGWS

UI / Generated Experience owns semantic projection/rendering/accessibility/component realization. AGWS owns governed work-surface semantics and remains explicitly distinct from generic UI.

UCA may supply shared references, revision/evidence envelopes and authority constraints. It cannot absorb AGWS's `Enterprise → Station → Role → Person` effective-surface semantics, mandatory-component rules or Station capability-exposure ownership.

## 17. Relationship to Workflow, Integration and Messaging

Workflow owns durable execution; Integration owns adapters/automation/external interaction; Messaging owns event/delivery/subscription semantics.

UCA supplies common attempt/effect lineage, evidence, identity and ambiguity structures. It does not define one universal execution/event state machine or exactly-once guarantee.

## 18. Relationship to Identity, Authorization, Governance, Security, Trust and Privacy

These remain independent owners:

- Identity: stable identity/authentication/federation assurance;
- Authorization: policy, organization, tenant/Station authority and delegation decisions;
- Governance: obligations, controls, exceptions, remediation and audit;
- Security/Resilience: failure posture, fencing and recovery qualification;
- Enterprise Trust/PKI: trust anchors, path/revocation, certificate lifecycle and trust-provider substitution;
- Privacy/Data Governance: purpose/use, retention, hold, disposition and residency obligations.

UCA provides shared qualification/evidence/identity/authority structures but cannot decide these semantics.

## 19. Relationship to Data, Storage, Secrets, Build, Artifact and Deployment

Each owner retains canonical state and domain postconditions. UCA supplies structural contracts for revision, evidence, realization identity, currentness and rollback qualification.

This prevents apparently universal infrastructure facts—object version, secret version, artifact digest, deployment generation—from becoming the canonical identity of unrelated semantic subjects.

## 20. Relationship to Provider, Standards, Lifecycle and Architecture Reconciliation

These are UCA's closest neighboring architecture owners and must remain distinct:

- **Provider/Binding** owns concrete provider lifecycle and support satisfaction;
- **Standards/Interoperability** owns protocol/API conformance and extension/downgrade boundaries;
- **Lifecycle/Versioning** owns coexistence/migration/withdrawal relations across revisions;
- **Architecture Reconciliation** owns desired-vs-observed/effective comparison, drift and governed normalization decisions.

UCA defines reusable contract shapes they consume. It does not perform provider negotiation, protocol validation, migration orchestration or reconciliation itself.

## 21. Relationship to Observability, Extensions, Commercial Metering and FinOps

Observability owns operational signal semantics; Extension architecture owns extension admission/capability/lifecycle semantics; Commercial Metering owns customer entitlement/usage/rating/billing/payment semantics; FinOps owns provider-neutral technology-economic interpretation.

Shared evidence/profile/support-vector structures may be reused. UCA cannot turn these distinct economic/operational/domain semantics into generic metrics.

## 22. Required cross-cutting contracts

Planning A retains the following architecture contracts for later target-architecture design:

1. `CanonicalSemanticIdentityRef`
2. `RealizationIdentityRef`
3. `TypedIdentityBinding`
4. `RevisionVector`
5. `QualifiedClaim`
6. `QualifiedEvidenceEnvelope`
7. `EvidenceCurrentnessHorizon`
8. `EffectDisposition`
9. `AttemptEffectValidationLineage`
10. `CapabilityRequirement`
11. `CapabilitySupportVector`
12. `ProviderBindingRef`
13. `ResidualCohortDrainageStatus`
14. `AuthorityEnvelope`
15. `DelegationPath`
16. `QualifiedLocalClosure`
17. `RollbackEligibility`
18. `CorrectionSupersessionLineage`
19. `EvaluationProfileRef`
20. `ImmutableQualifiedAssessment`

These are semantic architecture contracts, not package/module/class declarations.

## 23. Contradiction dispositions

Planning A preserves the closed synthesis dispositions:

- **Executable Capability Composition & Cumulative Context:** architecture/proof input; UCA may provide typed/provenanced context structures but does not become an orchestration semantic owner.
- **Transaction / Consistency / Concurrency:** cross-capability proof concern; transaction invariants remain owned by affected semantic capabilities, not UCA.
- **Topology / Build / Runtime Realization:** cross-capability realization concern; do not promote into UCA.
- **Tenant Fleet / Edge / Ingress / Routing:** cross-capability proof concern; routing/topology identities remain with owning capabilities/providers.
- **Operational Profile Separation:** architecture contract input, not capability.
- **AI Evaluation / Model / Prompt / Safety Governance:** profile/evidence structures may generalize through UCA; domain ownership remains distributed.
- **Relative Operational Complexity:** no universal scalar/evaluator; retain consumer-owned qualified profiles.
- **Provider-native mechanisms:** providerize, do not canonize.

No contradiction requires UCA to split or absorb another canonical capability in this Planning A pass.

## 24. Planning B repository-validation questions

The following are recorded for later Planning B only; this pass makes no implementation claim:

1. Does current SB already have a shared contract layer, and if so, does it contain domain semantics that should migrate back to owners?
2. Are provider/external IDs currently used as canonical identity anywhere?
3. Are result/status booleans collapsing attempted, effective, converged and validated states?
4. Is evidence revision/applicability/currentness represented explicitly or inferred ad hoc?
5. Does any shared abstraction hide material provider capability/failure differences?
6. Are authority/delegation structures reusable without permitting AI/UI/provider mechanisms to amplify authority?
7. Are `INCONCLUSIVE`, ambiguous-effect reconciliation and residual drainage represented as first-class semantics?
8. Are generic “common/core” modules acting as dependency or semantic god-objects?

These questions must not be answered until `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` is entered.

## 25. Mandatory proof obligations preserved for later phases

The Capability Proof Matrix requires UCA proof emphasis on:

1. primitive reuse across materially different semantic owners without semantic leakage;
2. stable canonical identity across provider/realization substitution;
3. evidence qualification and stale-evidence invalidation;
4. authority separation/non-amplification;
5. provider-neutrality without false equivalence.

Planning A additionally preserves negative proofs for:

6. a domain-specific predicate cannot be decided by UCA merely because it uses `QualifiedClaim`;
7. an external/provider ID cannot silently become canonical identity;
8. `UNKNOWN` effect cannot be retried unsafely without reconciliation;
9. a stale `PASS/READY/HEALTHY` claim cannot qualify a changed revision vector;
10. a lower hierarchy layer, AI or provider cannot widen `Enterprise → Station → Role → Person` authority through a universal contract;
11. provider substitution exposes unsupported dimensions as `PARTIAL/INCONCLUSIVE` rather than flattening them to `supported`;
12. a universal evaluation profile cannot collapse distinct domain measures into an ownerless scalar.

These remain Product Proof/Acceptance obligations; no test implementation is claimed here.

## 26. Non-goals

Universal Capability Architecture is explicitly **not**:

- a universal domain model;
- a process/workflow engine;
- a generic database schema for every capability;
- an authorization or governance engine;
- a provider SDK hiding semantic divergence;
- an integration bus;
- a reconciliation controller;
- a deployment/runtime orchestrator;
- an observability store;
- a universal evaluator/score;
- an AGWS/UI owner;
- an AI-agent authority source;
- a mutable replacement for owner source-of-truth;
- a reason to introduce shared dependencies where contracts can remain directional and minimal.

## 27. Planning A disposition

**PASS_FOR_CAPABILITY.** Universal Capability Architecture has explicit ownership of reusable cross-capability contract structures, a bounded source of truth, anti-god-object constraints, canonical-vs-realization identity rules, lifecycle/evidence/authority responsibilities, provider-neutrality limits, neighboring-owner relations, contradiction dispositions and preserved proof obligations.

No top-level capability split, merge or new promotion is required. Adaptive Governed Work Surfaces remains distinct from generic UI; `Enterprise → Station → Role → Person` and Station delegated capability exposure remain preserved; provider IDs remain non-canonical unless explicitly adopted; AI/AGWS remain non-amplifying.

This pass does not close global `PLANNING_A_TAXONOMY_BOUNDARIES`; the remaining canonical capabilities still require their own explicit boundary reconciliation.