# Generation 2 — Planning C C3.1: Universal Capability Architecture Target

Status: **DECIDED / PASS FOR CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: **Universal Capability Architecture (UCA)**  
Decision scope: canonical target architecture for capability 1/28 only.  
Entry branch head revalidated before persistence: `092358601e685672fca2fb307dce5a13c5f6d6c9`.

This record decides the target architecture of the canonical **Universal Capability Architecture** capability after C0/C1/C2. It does not implement product code, choose package/storage topology, materialize WBS/TASKs, perform remediation, reopen research, or execute C3.2 or later capabilities.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — C3.1 is the sole authorized next decision;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`;
- `PLANNING_B_UNIVERSAL_CAPABILITY_ARCHITECTURE_SB_CURRENT_STATE.md`;
- `CAPABILITY_SYNTHESIS.md`;
- inherited adversarial closure: 284 material edge scenarios + 124 reusable `ConflictPattern`s = 408 findings.

Standing invariants remain constitutional:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `CanonicalSemanticIdentity != Provider/External/RuntimeRealizationIdentity`;
- `attempted != accepted != applied/effective != converged != validated`;
- `provider acknowledgement != business effect`;
- `provenance != truth != currentness != authority`;
- `AI inference = candidate`, never authority;
- `observed behavior != intended process != approved canonical process`;
- `answered != resolved != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

## 2. Decision summary

**C3.1-DEC-001 — UCA is the owner of portable composition contracts, not universal domain semantics.**

Generation 2 adopts UCA as a deliberately small architecture capability whose source of truth is the revisioned set of **portable structural contracts and invariants needed for independently owned semantic capabilities to compose safely**.

UCA owns:

1. typed semantic identity/reference structure;
2. semantic-owner-qualified graph composition structure;
3. revision/currentness/temporal qualification structure;
4. reusable execution/effect/evidence envelopes where the structure is genuinely cross-capability;
5. non-amplifying authority envelope structure;
6. provider/binding support qualification structure;
7. federation/locality qualification structure;
8. analytical kind/unit/vector/uncertainty carriers;
9. transformation/supersession/proof-claim interfaces;
10. reusable failure ambiguity states such as `PARTIAL`, `UNKNOWN` and `INCONCLUSIVE` where required by cross-capability composition.

UCA does **not** own business entities, process predicates, workflow behavior, permission truth, provider mechanisms, UI semantics, policy truth, data truth, trust truth, commercial semantics, physical actuation, operational truth, or a universal lifecycle state machine.

The architecture therefore follows the rule:

`Universal structure may be centralized semantically; domain truth remains directionally owned.`

## 3. Canonical responsibility and non-responsibility

### 3.1 UCA canonical responsibilities

UCA is responsible for defining and versioning the minimum portable contracts that preserve:

- semantic kind;
- semantic ownership;
- canonical versus realization identity;
- definition versus occurrence identity;
- revision vectors and producing revisions;
- valid/transaction/observation/execution time qualification where material;
- applicability and tenant/enterprise/site scope;
- currentness/freshness/coverage limitations;
- provenance and correction/supersession lineage;
- authority-envelope non-amplification;
- provider requirement/support qualification;
- external-effect ambiguity and reconciliation requirements;
- local/federated boundary qualification;
- proof-domain qualification and non-strengthening composition.

### 3.2 Explicit non-responsibilities

UCA must never become:

- a universal entity/schema registry that owns domain predicates;
- a universal JSON bag or metadata dumping ground;
- a universal process/workflow engine;
- a universal rule/policy engine;
- a universal provider facade that hides material differences;
- a universal `supported=true`, `healthy=true`, `ready=true` or scalar quality/risk/complexity evaluator;
- an authority broker;
- a canonical external-ID adoption mechanism without the semantic owner;
- a central mutable truth store that overwrites owner state;
- a generic orchestration engine;
- a direct physical actuation capability;
- an AI architecture authority.

Any future construct proposed for UCA must pass the **owner-independence test**: the shape must remain meaningful across at least two materially different semantic owners without requiring UCA to decide either owner's predicate.

## 4. Owned semantic types and foreign references

### 4.1 UCA-owned portable semantic types

C3.1 adopts the following target type families as UCA-owned architecture contracts. Names are semantic contract names, not package/class mandates.

**Identity/reference:**

- `CanonicalSemanticIdentityRef`
- `DefinitionRef`
- `DefinitionRevisionRef`
- `OccurrenceRef`
- `RealizationIdentityRef`
- `TypedIdentityBinding`
- `SemanticOwnerRef`

**Revision/temporal/lineage:**

- `RevisionVector`
- `CorrectionSupersessionLineage`
- `TemporalQualification`
- `ResidualCohortRef`
- `ResidualCohortDrainageStatus`

**Execution/effect:**

- `ExecutionEnvelope`
- `ExecutionStateRef`
- `ExecutionJournalRef`
- `EffectIdentityRef`
- `EffectDisposition` = `NOT_APPLIED | APPLIED | PARTIAL | UNKNOWN` with owner-defined refinements permitted;
- `AttemptEffectValidationLineage`

**Evidence/proof:**

- `QualifiedClaim`
- `QualifiedEvidenceEnvelope`
- `EvidenceCurrentnessHorizon`
- `EvaluationProfileRef`
- `ImmutableQualifiedAssessment`
- `ProofClaimProfile`

**Provider/realization:**

- `CapabilityRequirement`
- `CapabilitySupportVector`
- `ProviderBindingRef`
- `BindingLifecycleRef`

**Authority/locality/federation:**

- `AuthorityEnvelope`
- `DelegationPath`
- `QualifiedLocalClosure`
- `FederatedContractRef`
- `ResponsibilityBoundaryRef`

**Analytical/transformation:**

- `AnalyticalKind`
- `QuantityQualification`
- `VectorQualification`
- `TypedUncertainty`
- `GraphTransformationRef`
- `RollbackEligibility`

### 4.2 Foreign semantic references

UCA consumes owner-issued references to foreign truth but cannot reinterpret them. Examples include:

- Identity subject/authentication refs;
- Authorization policy/grant/delegation decision refs;
- Process/application definition refs;
- Workflow execution semantics;
- Data/schema refs;
- provider-specific support evidence;
- lifecycle compatibility/postcondition refs;
- governance/control refs;
- privacy/legal obligation refs;
- trust/PKI refs;
- observability/incident evidence refs;
- commercial/economic refs;
- Elicitation evidence/question/coverage refs from C1.

Foreign refs remain directional: embedding a foreign reference never transfers semantic ownership to UCA.

## 5. Portable definition / IR

**C3.1-DEC-002 — UCA's portable IR is a typed semantic composition graph, not a universal domain model.**

Every cross-capability graph element that participates in portable composition must be capable of preserving:

- semantic identity;
- semantic kind;
- semantic owner;
- definition/revision identity;
- applicability scope;
- typed relation kind;
- producing/required revision references where sensitive;
- provider/extension qualification when non-portable;
- provenance/evidence references where the relation is claim-bearing.

Allowed bounded extension/configuration payloads must not erase semantic owner, kind, relation type or revision qualification.

The target IR supports owner-defined nodes connected by UCA-defined structural relation categories. UCA does not mandate one storage engine, GraphDB, serialization syntax or package topology in Planning C.

### Required graph relation properties

Relations that cross owner boundaries must be explicit about whether they are:

- semantic reference;
- realization binding;
- provenance/derivation;
- revision/supersession;
- authority/delegation reference;
- provider support/binding;
- execution/correlation/effect relation;
- evidence/proof relation;
- federation/responsibility relation;
- transformation relation.

A generic untyped `dependsOn` edge is insufficient when its semantics affect authority, currentness, compatibility, proof or external effects.

## 6. Runtime / execution boundary

**C3.1-DEC-003 — UCA defines execution contracts; execution owners perform execution.**

UCA owns the structural interfaces for `ExecutionEnvelope`, state/journal references and effect disposition. It does not own scheduler, durable workflow runtime, transaction manager, queue processor or domain state machine.

`ExecutionEnvelope` must carry only the bounded context required to interpret an invocation, including as applicable:

- actor/subject refs;
- authority decision/envelope refs;
- tenant/site/locality scope;
- definition/revision vector;
- provider binding refs;
- input commitments;
- effect/correlation identity;
- deadlines/budgets;
- required evidence/proof profile.

`ExecutionState` is a current projection, never historical authority. `ExecutionJournal` is append-oriented execution evidence, never proof of business truth by itself.

External mutation semantics preserve:

`invoked -> attempted -> accepted? -> applied/effective? -> converged? -> validated?`

`UNKNOWN` is never silently mapped to failure or success when unsafe retry is possible. Default architecture behavior is `UNKNOWN -> reconcile-before-retry`; each semantic owner defines reconciliation and admissible retry.

## 7. Provider / binding boundary

**C3.1-DEC-004 — Portability is multidimensional qualification, not provider equivalence.**

Domain owners publish `CapabilityRequirement`; Provider/Binding owns discovery, evidence collection, qualification, admission, binding, fallback, coexistence and withdrawal; UCA owns the reusable requirement/support/binding shapes.

`CapabilitySupportVector` may qualify independently:

- semantic operation fidelity;
- limits/capacity/rate/pagination;
- ordering/delivery behavior;
- failure/`PARTIAL`/`UNKNOWN` behavior;
- idempotency/retry behavior;
- tenant/site/isolation scope;
- offline/degraded support;
- lifecycle/version support;
- evidence/audit support;
- privacy/residency constraints;
- authority/trust requirements;
- SLA/currentness characteristics.

Unsupported or unknown dimensions remain explicit. A provider-specific extension cannot be promoted into portable equivalence merely because a UI/AI/adapter can invoke it.

C2 remains authoritative for Physical/Peripheral systems: UCA can describe provider bindings/evidence/authority constraints but does not admit generic direct physical actuation.

## 8. Authority and tenant/site scope

**C3.1-DEC-005 — UCA carries authority; Authorization owns authority truth.**

`AuthorityEnvelope` is an owner-issued, revision/currentness-qualified reference structure. It may carry subject, operation/resource scope, tenant/site scope, restrictions, delegation path and validity references.

Effective authority may never be broader than the intersection/subset allowed by applicable owner-issued authority and restrictions.

The constitutional structural hierarchy remains:

`Enterprise -> Station -> Role -> Person`

UCA owns only the cross-capability structural relation. Authorization owns permission/delegation truth; AGWS owns governed work-surface exposure. Fleet visibility, provider permissions, commercial entitlement, UI visibility, local/offline operation, retries, reconciliation, AI suggestions and cryptographic validity cannot create canonical authority.

Tenant/site scope is first-class qualification where semantically material. Missing scope must not default to global authority.

## 9. Source-of-truth and currentness

**C3.1-DEC-006 — UCA is source of truth only for its contracts and invariants.**

For owner-provided facts, UCA stores/references qualification, not competing canonical values.

Every material cross-capability claim must be capable of representing:

- subject and owner;
- source/producer/observer;
- producing revision vector;
- applicability population;
- observation/effective time;
- evidence references;
- freshness/currentness horizon;
- coverage/incompleteness;
- typed uncertainty where meaningful;
- correction/supersession lineage;
- result/status;
- unresolved proof obligations.

`PASS`, `READY`, `HEALTHY`, `SYNCED`, `ALLOW`, `SUPPORTED` and similar positive terms are always claim-scoped. They do not survive relevant revision/population/currentness changes without requalification.

Where evidence is insufficient, `INCONCLUSIVE` or owner-equivalent explicit insufficiency is required rather than coercion into binary PASS/FAIL.

## 10. Lifecycle, revision and coexistence

**C3.1-DEC-007 — Revision is sparse/vector-qualified and historical producing truth is immutable.**

`RevisionVector` represents independently evolving owner dimensions. Producing revisions remain historical facts. Current qualification may reference newer revisions, but may not rewrite producing history.

UCA owns revision/supersession shape. Lifecycle/Versioning owns generic migration/coexistence/withdrawal semantics. Each semantic owner owns compatibility and business postconditions.

Required target semantics include:

- pinned in-flight cohorts;
- directional compatibility;
- concurrent old/new realization cohorts;
- residual effect-producing cohorts;
- explicit drain/withdraw disposition;
- rollback eligibility as a current qualified claim;
- correction versus supersession versus migration distinction;
- valid-time and transaction-time where retroactive correction matters.

A cutover is not complete while an old cohort can still create authoritative effects unless that residual population is explicitly accepted/dispositioned by the owner.

## 11. Failure, PARTIAL, UNKNOWN and reconciliation

**C3.1-DEC-008 — Ambiguity is typed and preserved.**

UCA standardizes the existence and transport of ambiguity, not every domain recovery rule.

Cross-capability contracts must preserve distinctions among:

- negative result;
- insufficient evidence (`INCONCLUSIVE`);
- partial population/effect (`PARTIAL`);
- unknown external outcome (`UNKNOWN`);
- stale/out-of-horizon evidence;
- conflicting claims/evidence;
- blocked resolution.

A consumer may not strengthen any of these states into success, authority or current truth without owner-defined evidence.

Reconciliation consumes desired/claimed/observed evidence and produces a qualified result; Architecture Reconciliation owns desired-vs-observed normalization/drift decisions. UCA merely supplies reusable comparison/evidence structures.

## 12. Provenance, evidence and audit

**C3.1-DEC-009 — Provenance is first-class lineage, not a truth certificate.**

Target evidence supports source/agent attribution, derivation, revision, invalidation/correction, applicability, currentness and proof-domain references. Provenance-of-provenance is allowed where evidence itself must be qualified.

Required non-equivalences:

- `DerivedValue != StoredFact`;
- `Observation != CanonicalTruth`;
- `wasRevisionOf != currently valid`;
- `correlatedWith != causedBy`;
- `signedBy != authorizedBy`;
- `journaled != externally effective`;
- `provider ACK != business postcondition`.

Audit consumers may verify integrity/lineage, but business truth and compliance meaning remain with their owners.

## 13. Security, privacy and trust

**C3.1-DEC-010 — Security/privacy/trust constraints qualify composition rather than being flattened into UCA policy.**

UCA contracts must be able to reference:

- owner-issued security/trust requirements;
- data minimization/redaction rules for evidence;
- purpose/residency/retention applicability where required;
- trust material revisions/currentness;
- authority and tenant/site scope;
- provider support limitations;
- local/offline horizons.

Sensitive evidence may be referenced without embedding secrets or excessive personal data in universal envelopes. Redaction must preserve sufficient provenance to distinguish “not collected,” “withheld,” “expired,” “unavailable,” and “unknown” when those states matter.

UCA does not own authentication, authorization, PKI, privacy policy or secret lifecycle.

## 14. Operability, observability and capacity

**C3.1-DEC-011 — Operability is a qualified obligation, not implied by semantic validity.**

UCA provides cross-capability hooks for capacity/currentness/evidence profiles but does not own telemetry or SLO meaning.

Target composition contracts must permit capabilities to declare/qualify:

- queue/backlog identity and scope;
- capacity/headroom dimensions;
- deadlines and budgets;
- overload/degraded behavior;
- evidence freshness/coverage;
- local/offline closure horizons;
- owner/escalation references;
- reconciliation/repair responsibility.

A graph can be semantically valid while operationally unready. Production-readiness claims therefore require their own evidence population and cannot be inferred from feature/architecture completion.

## 15. Elicitation lens

C1 is authoritative for the Elicitation Knowledge Base. UCA's capability-specific elicitation lens must discover whether a proposed “common” construct is truly universal or hiding domain semantics.

Mandatory question families include:

1. **Purpose:** Which independent capability compositions require this primitive?
2. **Ownership:** Which predicate would UCA be forced to decide if this construct were centralized?
3. **Identity:** Is the identity canonical, definition, occurrence, realization/provider, correlation or effect identity?
4. **Revision:** Which independently evolving revisions qualify its meaning/currentness?
5. **Authority:** Does the proposed structure carry authority or decide authority?
6. **Evidence:** What evidence population/currentness proves the claim, and what yields `INCONCLUSIVE`?
7. **Provider:** Which provider differences are material and must remain explicit?
8. **Failure:** Can the external effect be `PARTIAL/UNKNOWN`; what reconciliation owner exists?
9. **Locality:** What changes under site/offline/federated operation?
10. **Lifecycle:** Which residual cohorts can remain authoritative after substitution/revision?
11. **Privacy/trust:** Can the shared envelope accidentally over-collect sensitive data or imply trust?
12. **Negative-space:** Is “common” merely unresolved semantic ownership being dumped into UCA?

Critical unresolved dimensions block promotion of a new universal primitive when semantic owner, authority owner, source-of-truth, failure semantics or proof population remains ambiguous.

Answers discovered by AI remain `InferredCandidate` until owner-governed adoption. Brownfield common contracts discovered from current packages/configuration remain evidence/candidates, not automatic Generation 2 canon.

## 16. Inherited adversarial proof obligations

C3.1 routes the inherited adversarial families into target proofs without claiming remediation.

At minimum Planning E must test:

1. **Anti-god-object:** two domain owners use a UCA primitive without UCA deciding either predicate.
2. **Identity preservation:** provider/runtime/external substitution changes realization identity without silently changing canonical identity.
3. **No identity collision:** equal external IDs from different provider/tenant/site scopes cannot merge canonically.
4. **Revision/currentness:** stale positive claims become insufficient after relevant revision/population changes.
5. **Effect ambiguity:** `UNKNOWN` cannot be retried as definitely not-applied without reconciliation.
6. **Non-amplification:** AI/UI/Fleet/provider/local mode cannot widen owner-issued authority.
7. **Support vector:** partial/unknown provider dimensions cannot be represented as total portable support.
8. **Evidence population:** sampled/partial evidence cannot prove an uncovered population.
9. **Proof non-strengthening:** journal integrity/provider ACK/signature/provenance cannot establish stronger business postconditions without corresponding evidence.
10. **Residual cohort:** cutover cannot claim convergence while old cohorts remain capable of authoritative effects.
11. **Offline closure:** disconnection cannot broaden authority; expired closure dependencies yield bounded degradation/denial/inconclusive per owner policy.
12. **Federation:** producer handoff cannot be equated with consumer application/business effect.
13. **Analytical kind preservation:** deterministic, statistical, optimization, AI and human-decision outputs cannot be silently scalarized/equated.
14. **Units/vector semantics:** incompatible units/dimensions or missing vector dimensions cannot pass as equal values.
15. **Transformation non-strengthening:** import/mirroring/migration/provider substitution cannot strengthen authority, certainty, proof or canonical ownership.
16. **Elicitation false-completeness:** answered UCA questions cannot close unresolved ownership/currentness/authority/evidence gaps.
17. **Physical boundary:** a generic integration/provider binding cannot inherit direct physical actuation authority.

These are proof candidates, not assertions that current product fails them.

## 17. Planning D migration constraints

Planning D must sequence migration without a big-bang centralization.

Mandatory constraints:

1. **Preserve current bounded contracts.** Existing artifact envelopes, factory lineage, catalog resolution and runtime authority remain valid in their current scopes.
2. **Additive qualification first.** Introduce reusable qualification structures alongside current binary/domain contracts before attempting any consumer migration.
3. **No semantic reparenting by convenience.** Existing domain types move to UCA only if they pass the owner-independence test.
4. **Adapter/coexistence allowed.** Current scalar versions can coexist with target revision vectors through explicit mapping during migration.
5. **Binary evidence coexistence.** Current `PASS/FAIL` factory evidence remains bounded; cross-capability consumers may add `PARTIAL/INCONCLUSIVE` wrappers without rewriting historical meaning.
6. **Explicit ID binding.** Provider/external IDs discovered in existing subsystems must migrate through typed bindings, not value matching.
7. **Dependency direction control.** UCA contracts must remain low-coupling and must not import capability-specific semantics, provider SDKs or product runtime mechanisms.
8. **Journal/effect adoption is owner-led.** No generic `EffectDisposition` rollout may rewrite owner-specific retry semantics without an owner migration plan.
9. **Residual cohorts remain visible.** Migration cannot declare completion solely because new definitions/providers are active.
10. **Free-form + structured Elicitation coexistence.** C1 migration path remains additive and UCA only consumes references/coverage, not raw elicitation as canonical truth.
11. **No generic physical actuation migration.** C2 boundary remains intact.

Concrete package/module/storage placement is deferred to Planning D/WBS and is not decided here.

## 18. Planning E product-proof candidates

Planning E should define product proofs for:

- typed owner-preserving semantic graph serialization/round-trip;
- foreign semantic reference without ownership transfer;
- canonical/realization identity substitution and coexistence;
- revision-vector pinning, requalification and historical replay;
- stale-evidence invalidation/currentness horizons;
- `PARTIAL/UNKNOWN/INCONCLUSIVE` preservation end-to-end;
- reconcile-before-retry for ambiguous external mutation;
- authority-envelope subset/intersection and non-amplification;
- support-vector qualification with unsupported dimensions preserved;
- residual-cohort drainage before convergence/withdrawal;
- local/offline closure expiry and reconnect requalification;
- federated responsibility/currentness/effect separation;
- proof-domain non-strengthening;
- analytical kind/unit/vector/uncertainty preservation;
- graph transformation with explicit preserved/lost semantics and proof invalidation;
- EKB question provenance/routing into UCA ownership gaps without AI promotion to authority;
- bounded Physical/Peripheral provider integration without generic actuation inheritance;
- compatibility with current artifact/lineage/catalog/authority predecessors during coexistence.

## 19. Alternatives considered

### Alternative A — One centralized `common/core` semantic package

**Rejected as architecture model.** A package may eventually contain some contracts, but a catch-all semantic owner would become a dependency and ownership magnet. Package topology cannot define semantic ownership.

### Alternative B — Domain capabilities duplicate every structural contract

**Rejected.** Duplication would cause incompatible identity/revision/evidence/ambiguity semantics and make safe federation/provider substitution harder.

### Alternative C — Fully dynamic JSON graph with runtime conventions

**Rejected.** It erases type/owner/revision semantics and weakens static and runtime proof obligations.

### Alternative D — Provider-centric universal abstraction

**Rejected.** Provider convenience cannot define canonical domain identity, authority or semantic equivalence.

### Alternative E — Fully centralized orchestration/evaluation plane

**Rejected.** UCA must not become workflow engine, universal evaluator, policy engine or omniscient Fleet truth.

### Chosen model

**Typed, owner-preserving portable composition contracts + directional foreign references + providerized realization + qualified evidence/currentness + explicit ambiguity.**

## 20. Architecture-level contradictions and unresolved questions

No architecture-level contradiction was found that requires changing the 28-capability taxonomy.

The following remain intentionally deferred rather than silently decided:

- physical module/package/storage topology for UCA contracts;
- exact serialization syntax and code-generation strategy;
- adoption order for current bounded predecessors;
- owner-specific refinements of generic ambiguity/result vocabularies;
- which UCA contracts can be zero-copy reused versus adapted during migration.

These are Planning D/WBS concerns and do not block the C3.1 architecture decision.

## 21. Capability result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Universal Capability Architecture is the canonical owner of the smallest reusable, typed, revisioned and evidence-qualified composition contracts needed across Generation 2. Its target architecture deliberately prevents UCA from becoming a semantic god-object, authority broker, provider facade, orchestration engine, universal evaluator, central mutable truth store or physical-control plane.

C0 remains the architecture-wide substrate authority; C3.1 establishes how the **UCA capability itself** owns, publishes and constrains that substrate while every domain owner retains its predicates, lifecycle postconditions and canonical truth.

No product code changed. No remediation was performed. No `ConflictPattern` was converted to a `ConflictInstance`. No C3.2 or later Planning C capability was executed.