# Generation 2 — Planning C C0: Universal Capability Architecture / Semantic Substrate

Status: **DECIDED / C0 COMPLETE**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Decision scope: architecture constitution and universal semantic substrate only.  
Entry branch head revalidated before persistence: `de6c4db5f53b1e6cff4f096343bde9191b872fd8`.

This record decides the architecture-wide substrate required by later Planning C decisions. It does not implement code, choose storage/package topology, materialize Work Packages/TASKs, remediate research findings, decide C1 Elicitation/System Understanding, decide C2 Physical/Peripheral Integration, or enter Planning D/E.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `RESEARCH_PIPELINE_STATE.json` — Planning C is ACTIVE and C0 is the authorized next action;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`;
- `PLANNING_B_UNIVERSAL_CAPABILITY_ARCHITECTURE_SB_CURRENT_STATE.md`;
- `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`;
- final adversarial saturation closure: 284 material edge scenarios + 124 reusable `ConflictPattern`s = 408 inherited findings, with 0 HIGH/CRITICAL lacking owner/proof/detection route.

Standing invariants remain constitutional:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `CanonicalSemanticIdentity != Provider/External/RuntimeRealizationIdentity`;
- `attempted != accepted != applied/effective != converged != validated`;
- `provider acknowledgement != business effect`;
- `provenance != truth != currentness != authority`;
- `cryptographic validity != semantic authorization`;
- `AI inference = candidate`, never authority;
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

## 2. Decision summary

Planning C C0 adopts a **typed, owner-preserving semantic substrate** built around portable contracts and explicit qualification rather than a universal domain model.

The target architecture is divided into eight logical planes. These are semantic responsibilities, not package/module deployment decisions:

1. **Semantic Definition Plane** — typed canonical definitions, semantic ownership, references, revisions and graph relations.
2. **Execution & Effect Plane** — invocation context, execution state, durable journal, attempts and external-effect disposition.
3. **Evidence / Provenance / Currentness Plane** — qualified claims, observations, lineage, applicability, coverage, freshness and proof-domain boundaries.
4. **Provider / Binding / Realization Plane** — realization identities, support vectors, bindings, adapter qualification, coexistence and withdrawal.
5. **Authority / Trust Constraint Plane** — non-amplifying authority envelopes and references to domain-owned authorization/trust decisions; never a universal policy engine.
6. **Federation / Locality / Fleet Plane** — inter-system contracts, local autonomous truth boundaries and globally qualified observation/control intent.
7. **Analytical / Temporal / Transformation Plane** — analytical kinds, units, dimensions, vectors, uncertainty, valid/transaction time, revision vectors and graph transformations.
8. **Verification / Proof-Claim Plane** — verifier profiles that enumerate exactly which claims are established and which obligations remain unresolved.

No plane becomes an omniscient mutable source of truth. Canonical business/process/identity/authorization/economic/privacy/provider semantics remain owned by their canonical capabilities.

## 3. C0-DEC-001 — Typed Semantic Graph is the universal composition model

**Decision:** DECIDED.

The target `Typed Semantic Graph` is an architecture-level semantic IR composed of typed semantic nodes, typed relations and revisioned definitions. It is **not** a GraphDB decision and **not** a universal entity schema.

Every graph element that participates in cross-capability composition must preserve at least:

- stable semantic identity reference;
- semantic kind/type;
- semantic owner capability;
- definition/revision identity;
- tenant/enterprise/site applicability where meaningful;
- typed relation kind;
- producing/required revision references when the relation is revision-sensitive;
- extension/provider qualification where the construct is non-portable.

A generic `attributes: JSON` payload may carry bounded configuration but cannot erase semantic kind, owner or relation type.

### Identity primitives

C0 adopts these portable structural identities:

- `CanonicalSemanticIdentityRef` — owner-qualified identity of the semantic subject;
- `DefinitionRef` — identity of a reusable semantic definition;
- `DefinitionRevisionRef` — immutable revision identity for a definition;
- `OccurrenceRef` — identity of an occurrence/use/instance distinct from its definition;
- `RealizationIdentityRef` — provider/runtime/external realization identity;
- `TypedIdentityBinding` — explicit relation between canonical and realization identities, qualified by provider/tenant/site/resource kind/revision/lifecycle.

External/provider identity never becomes canonical by matching values. Adoption requires an explicit owner-governed decision.

### Ownership and reference rule

Cross-capability references are directional references to foreign owner truth. A capability may reference a foreign semantic type but cannot redefine its predicate or lifecycle semantics merely by embedding its fields.

This directly preserves Planning A's anti-god-object boundary.

## 4. C0-DEC-002 — Revision model is vector-qualified, immutable for producing history

**Decision:** DECIDED.

A single global version is insufficient for cross-capability truth. C0 adopts `RevisionVector` as a sparse set of independently owned revision dimensions required to qualify a claim, execution or artifact.

Possible dimensions include, only when applicable: process/workflow definition, schema, policy, provider profile/API, rule/formula, model, trust material, artifact/build, deployment, question/elicitation definition, site topology or other owner revisions.

Rules:

1. producing revision vectors are immutable historical facts;
2. current qualification may require a newer vector and explicit revalidation;
3. historical replay uses the producing vector, not the current vector;
4. supersession creates lineage; it does not rewrite the old revision;
5. compatibility is directional and owner-defined, never inferred from equal version numbers or successful parsing;
6. in-flight work may remain pinned to an older allowed revision and therefore forms an explicit cohort.

C0 adopts `CorrectionSupersessionLineage` to distinguish correction, supersession, migration and current projection from historical producing truth.

## 5. C0-DEC-003 — Temporal semantics are multi-clock and owner-qualified

**Decision:** DECIDED.

Where temporal meaning matters, the substrate must distinguish at least:

- occurrence/event time;
- observation/ingestion time;
- decision/evaluation time;
- effective/valid interval;
- transaction/recorded interval;
- execution attempt time;
- provider acknowledgement time;
- reconciliation/convergence observation time.

No timestamp alone proves ordering, causality, currentness or authority. Unknown or substituted event time must remain explicitly qualified rather than silently treated as occurrence time.

Valid-time and transaction-time are required architectural semantics where historical correction or retroactive policy/data validity matters; they are not imposed on every record indiscriminately.

## 6. C0-DEC-004 — Execution uses Envelope + State + append-only Journal + explicit EffectDisposition

**Decision:** DECIDED.

C0 adopts three distinct execution structures:

### `ExecutionEnvelope`

Bounded immutable/pinned execution context sufficient to interpret the invocation. It may reference input commitments, actor/authority references, tenant/site context, definition/revision vector, provider binding, correlation/effect identity, deadlines/budgets and required evidence profile. It must not become an unlimited event history bag.

### `ExecutionState`

Current mutable snapshot of an execution/occurrence under the owning execution capability. It is a convenience/current-state projection and does not replace journal history or business truth.

### `ExecutionJournal`

Durable append-oriented history of attempts, transitions, traversals, observations and evidence references. Journal integrity can support tamper detection/commitment but does not itself prove semantic correctness or external effect.

### Effect state

External or ambiguous mutations use explicit `EffectDisposition` with at least:

- `NOT_APPLIED`;
- `APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

Capabilities may refine this vocabulary but may not collapse `UNKNOWN` into success/failure where the distinction affects safe retry or completion.

`UNKNOWN -> reconcile-before-retry` is a constitutional default for mutations where duplicate or repeated effects can cause harm; semantic owners define the domain-specific reconciliation and retry rule.

## 7. C0-DEC-005 — Workflow completion and proof domains remain distinct

**Decision:** DECIDED.

C0 standardizes the interfaces between workflow/control flow and verification without making UCA the workflow engine.

Portable control-flow definitions may expose typed condition/switch, bounded iteration, wait/timer, fan-out/fan-in, cancellation, compensation and child/subworkflow relations. Arbitrary code may exist only behind a capability/provider operation boundary whose hidden behavior is not falsely treated as statically analyzable graph structure.

The target architecture distinguishes proof domains:

1. definition soundness;
2. termination/boundedness claim;
3. execution conformance;
4. journal integrity;
5. external-effect evidence;
6. business/domain postcondition validation.

A verifier result must enumerate the proof domains it establishes. No hash, signature, successful trace, provider ACK, child completion flag or soundness proof may be promoted into a stronger proof domain without its required evidence.

`ProcessProofBundle` remains a portable evidence bundle concept, not a universal truth certificate. Parent/child proof composition must be monotonic/non-strengthening: a parent cannot claim more than the verified child profile plus the parent's independently proven obligations.

## 8. C0-DEC-006 — Qualified evidence and claims are first-class and non-binary

**Decision:** DECIDED.

C0 adopts `QualifiedClaim` and `QualifiedEvidenceEnvelope` as portable shapes.

A qualified claim/evidence relation must be able to state:

- subject;
- claim kind / semantic owner;
- producer/observer/source;
- producing revision vector;
- observation and relevant effective time;
- applicability population/scope;
- evidence/profile references;
- coverage/completeness limitations;
- currentness/freshness horizon;
- uncertainty/confidence kind where meaningful;
- correction/supersession lineage;
- result/status;
- unresolved evidence obligations.

Cross-capability consumers must support an insufficient-evidence result such as `INCONCLUSIVE` rather than forcing every absence/partial population into `PASS` or `FAIL`.

A previous `PASS`, `READY`, `VALID`, `HEALTHY`, `SYNCED` or `ALLOW` does not remain current after relevant revisions or population changes unless the associated currentness/evidence profile still qualifies it.

Evidence coverage is claim-scoped. Aggregate telemetry or sampled evidence cannot prove a larger population than it actually covers.

## 9. C0-DEC-007 — Provenance is lineage, not truth or authority

**Decision:** DECIDED.

C0 adopts provenance relations for generation/derivation/revision/source/agent responsibility and supports provenance-of-provenance/evidence bundles. Provenance may inform trust decisions but does not itself establish correctness, authority, currentness or causal necessity.

The architecture must preserve distinctions such as:

- `DerivedValue != StoredFact`;
- `Observation != CanonicalTruth`;
- `wasRevisionOf != currently valid`;
- `correlatedWith != causedBy`;
- `signedBy != authorizedBy`.

The W3C PROV model is accepted as useful external conceptual precedent for domain-agnostic provenance, revision, invalidation and responsibility relations, but Generation 2 remains free to use a smaller portable internal representation rather than importing PROV wholesale.

## 10. C0-DEC-008 — Provider portability uses requirement/support vectors, never capability-equivalence booleans

**Decision:** DECIDED.

Portable semantics are expressed by semantic owners as `CapabilityRequirement`; Provider/Binding evaluates realizations through a multidimensional `CapabilitySupportVector` and produces a qualified `ProviderBindingRef`.

Support dimensions may include, as applicable:

- semantic operation support;
- resource/role/scope fidelity;
- limits/rate/pagination;
- ordering/delivery guarantees;
- failure/partial/UNKNOWN behavior;
- idempotency/retry behavior;
- isolation/tenant/site scope;
- offline/degraded behavior;
- lifecycle/version support;
- evidence/audit capabilities;
- authority/trust requirements;
- data residency/privacy constraints;
- capacity/SLA characteristics.

Unsupported dimensions cannot be silently dropped. Provider-specific extensions remain explicit, owner/provider qualified and excluded from portable equivalence claims.

Bindings have lifecycle: discover -> qualify/admit -> bind -> use/observe -> reconcile -> drain/withdraw. Old bindings may remain residual cohorts until their effect-producing population is proven drained or explicitly dispositioned.

## 11. C0-DEC-009 — Federation is contract continuity, not distributed shared state

**Decision:** DECIDED.

Inter-system/federated graph edges are versioned semantic contracts between autonomous systems. They do not imply shared transactionality, shared mutable state, shared authority or globally synchronized currentness.

A federated edge must be able to qualify:

- producer and consumer system/build/definition revisions;
- contract/schema/operation revision;
- bilateral identity/correlation/effect binding;
- authentication/authorization references;
- owner/responsibility boundaries;
- SLA/currentness expectations;
- privacy/data minimization;
- failure `PARTIAL/UNKNOWN` responsibility and reconciliation;
- provider/economic dependencies where material.

`producer handed off != consumer applied != consumer business postcondition`.

CloudEvents' source-scoped identity model is accepted as a useful precedent for why event identity must remain source-qualified rather than treated as globally canonical business identity.

## 12. C0-DEC-010 — Local runtime is authoritative only inside explicitly qualified local closure; Fleet is observation/control-intent, not omniscient truth

**Decision:** DECIDED.

Generated/autonomous systems may continue local execution without continuous System Builder/Fleet connectivity only when a `QualifiedLocalClosure` declares which dependencies are locally available and their horizons, including relevant artifact, schema, policy, trust, secret, authority, provider and evidence dependencies.

Disconnection never broadens authority. Expired/missing closure dependencies cause owner-defined denial, bounded degradation or `INCONCLUSIVE`.

Fleet/global views are qualified observations whose currentness, coverage and revision population are explicit. Fleet may issue governed control intent where authorized, but a Fleet command is not proof that every local runtime applied or converged it.

Reconnect triggers requalification/reconciliation for assumptions that may have become stale while disconnected.

## 13. C0-DEC-011 — Authority envelope is structural and non-amplifying; domain Authorization remains sole permission owner

**Decision:** DECIDED.

C0 adopts `AuthorityEnvelope` and `DelegationPath` as reusable reference structures. They carry owner-issued authority decision references, subject/actor, operation/resource scope, tenant/site scope, constraints, producing policy/revision context and validity/currentness.

UCA does not decide permission truth.

Any effective authority produced by composition must be no broader than the intersection/subset allowed by applicable owner-issued grants and restrictions. AI, provider discovery, UI visibility, local/offline mode, retries, reconciliation, Fleet observation, economic entitlement, cryptographic validity and physical-provider permission cannot create canonical authority.

The constitutional `Enterprise -> Station -> Role -> Person` relation remains a structural delegation hierarchy consumed from Planning A; Authorization owns delegation truth and AGWS owns governed work-surface exposure semantics.

## 14. C0-DEC-012 — Analytical semantics preserve kind, units, dimensions, vectors and uncertainty

**Decision:** DECIDED.

Calculation remains cross-cutting and providerized mechanically. Portable semantics distinguish at least:

- `DETERMINISTIC_DERIVATION`;
- `STATISTICAL_ESTIMATE`;
- `OPTIMIZATION_RESULT`;
- `AI_INFERENCE`;
- `HUMAN_DECISION`.

Consumers must declare which kinds they accept. Numerically equal values of different semantic kinds are not interchangeable.

Quantities must carry unit/dimension/currency/timezone/precision/rounding semantics when required by the domain. Vector/multidimensional results remain vectors unless an explicit owner-defined aggregation/scalarization is applied. Missing dimensions cannot be replaced by a scalar quality/support/health score.

Uncertainty is typed: measurement uncertainty, statistical confidence, model uncertainty, incomplete population, stale evidence and external-effect `UNKNOWN` are not one generic confidence field.

Causal/counterfactual outputs remain analytical/research claims unless separately governed; correlation/provenance does not grant causal truth or decision authority.

## 15. C0-DEC-013 — Graph transformations are revisioned, typed and proof-invalidating by default where assumptions change

**Decision:** DECIDED.

Transformations such as normalization, migration, optimization, compilation, projection, import, mirroring, schema adaptation or provider substitution must declare:

- source graph/revision population;
- target graph/revision;
- transformation kind/revision;
- semantic owner and authority to transform;
- preserved/lost/unsupported semantics;
- evidence/lineage;
- compatibility direction;
- proof/assessment invalidation or reuse conditions.

A transformation cannot silently strengthen semantic kinds, authority, proof claims, currentness or certainty.

Legacy Mirroring/Brownfield assimilation is therefore an evidence-producing transformation path: observed legacy behavior/config/data/workarounds become typed candidates/evidence and mappings, not automatically canonical target semantics.

## 16. C0-DEC-014 — Queue/backpressure/capacity are cross-boundary qualification dimensions, not hidden runtime details

**Decision:** DECIDED.

Whenever correctness/currentness/revoke/reconciliation/effect completion depends on asynchronous work, architecture contracts must be able to expose backlog and capacity assumptions sufficiently for the owning capability to prove bounded progress or explicitly report degradation/UNKNOWN.

Required architecture-level concepts include, when applicable:

- admitted demand/work identity;
- bounded queue/backlog population;
- service/drain capacity assumption;
- retry/redrive amplification;
- starvation/fairness class where material;
- expiry/deadline/currentness impact;
- terminal/dead-letter/reconciliation disposition.

C0 does not define one queue implementation or scheduling algorithm. It prevents hidden queue debt from masquerading as convergence/readiness.

## 17. C0-DEC-015 — Physical/Peripheral and Elicitation are mandatory consumers, not silently decided here

**Decision:** DECIDED AS CONSTRAINT / C1-C2 DEFERRED.

### Elicitation/System Understanding consumer requirements

C1 must build on C0 primitives rather than invent parallel semantics. Question/answer/claim/evidence/owner/revision/currentness/contradiction/coverage/traceability models must reference the same identity, revision, evidence and non-strengthening rules.

A Wizard/AI cannot mark elicitation complete while applicable HIGH/CRITICAL dimensions remain unresolved or contradicted without disposition. This is a downstream C1 decision, not finalized here.

### Physical/Peripheral consumer requirements

C2 must use canonical-vs-realization identity, provider support vectors, tenant/site/resource scope, external-effect qualification, evidence/currentness, residual-cohort drainage and reconciliation semantics.

Generic Integration does **not** acquire direct physical actuation authority through C0. VMS/access/BMS/PDV/industrial/device-management systems remain specialized control/media planes by default until C2 explicitly decides otherwise. Provider-reported permission remains distinct from canonical authority and actual physical/media access success.

## 18. Portable primitive set adopted by C0

C0 adopts the following architecture contracts as the target universal vocabulary. Names may later map to concrete schema/type names without changing their semantic responsibility:

1. `CanonicalSemanticIdentityRef`
2. `DefinitionRef`
3. `DefinitionRevisionRef`
4. `OccurrenceRef`
5. `RealizationIdentityRef`
6. `TypedIdentityBinding`
7. `TypedSemanticNodeRef`
8. `TypedSemanticRelation`
9. `RevisionVector`
10. `CorrectionSupersessionLineage`
11. `QualifiedClaim`
12. `QualifiedEvidenceEnvelope`
13. `EvidenceCurrentnessHorizon`
14. `EffectDisposition`
15. `ExecutionEnvelope`
16. `ExecutionStateRef`
17. `ExecutionJournalRef`
18. `AttemptEffectValidationLineage`
19. `CapabilityRequirement`
20. `CapabilitySupportVector`
21. `ProviderBindingRef`
22. `ResidualCohortDrainageStatus`
23. `AuthorityEnvelope`
24. `DelegationPath`
25. `QualifiedLocalClosure`
26. `RollbackEligibility`
27. `EvaluationProfileRef`
28. `ImmutableQualifiedAssessment`
29. `AnalyticalResultKind`
30. `QuantitySemantics`
31. `VectorSemantics`
32. `UncertaintyKind`
33. `TemporalQualification`
34. `GraphTransformationRef`
35. `FederatedContractRef`
36. `ProofClaimProfile`
37. `ProcessProofBundleRef`
38. `CapacityQualification`

This list is a semantic vocabulary, **not** authorization to implement 38 classes/tables/packages. Planning D will later decide migration/dependency order; implementation topology remains out of scope.

## 19. Rejected alternatives

### Universal JSON/document model

Rejected because it erases semantic kind/owner and makes static compatibility, proof and authority checks unreliable.

### One global revision/version

Rejected because independently changing policy/provider/schema/workflow/model/trust dimensions invalidate claims differently.

### One universal execution state machine

Rejected because Workflow, Integration, Deployment, Data and other owners have distinct domain lifecycles. C0 standardizes shared attempt/effect/evidence boundaries only.

### Boolean provider compatibility

Rejected because material differences in scopes, ordering, limits, failure, isolation, offline behavior and evidence cannot be represented safely.

### Fleet/global source of truth

Rejected because autonomous/local systems can be disconnected and Fleet evidence may be stale/partial.

### Universal scalar readiness/quality/support score

Rejected because it hides critical unresolved dimensions and enables false completion.

### GraphDB as constitutional dependency

Rejected. Typed graph semantics do not require a graph database; persistence/query provider choice remains later architecture/implementation work.

### Cryptographic/provenance proof as semantic truth certificate

Rejected because integrity/authenticity/lineage establish narrower proof domains than semantic correctness, authority or external effect.

## 20. Adversarial inventory routing

All 408 inherited adversarial findings remain constraints/proof routes; none is marked remediated by this decision.

C0 provides the common target surfaces to which the existing owner/proof/detection routes attach:

- identity/provider/site leakage -> typed identity binding + authority/provider qualification;
- stale/currentness/provenance -> qualified evidence + revision/temporal qualification;
- partial/UNKNOWN external effects -> effect disposition + journal/reconciliation;
- provider semantic mismatch -> support vectors + explicit unsupported dimensions;
- revision/cohort/rollback failures -> revision vectors + residual drainage + rollback eligibility;
- proof-claim conflation -> proof claim profiles;
- analytical/unit/vector/uncertainty conflation -> analytical typed semantics;
- queue/reconciliation starvation -> capacity qualification;
- federation/Fleet/offline drift -> federated contract + qualified local closure/currentness;
- AI/low-code authority amplification -> non-strengthening ownership/authority rules;
- false elicitation completeness -> C1 consumer of qualified claim/evidence/coverage/revision primitives;
- Physical/Peripheral permission/currentness leakage -> C2 consumer of provider/identity/authority/effect/currentness primitives.

No `ConflictInstance` or preventive remediation is created.

## 21. Compatibility/coexistence assumptions deferred to Planning D

Planning D must later sequence adoption without breaking existing bounded contracts. In particular:

- existing artifact envelopes remain artifact-domain truth, not retroactively reinterpreted as universal identity;
- current exact lineage contracts remain valid predecessors;
- binary factory `PASS/FAIL` evidence remains valid for its bounded current contract and must coexist with future qualified `INCONCLUSIVE/PARTIAL` consumers;
- current catalog/provider resolution remains provider-aware but must not be reinterpreted as full support-vector equivalence;
- runtime authority remains Authorization-owned and fail-closed;
- concrete persistence, package dependency directions, migration stores and rollout order remain undecided here.

## 22. Planning E proof obligations created by C0

Planning E must eventually prove, at minimum:

1. semantic-kind/owner preservation across cross-capability graph composition;
2. stable canonical identity across provider realization substitution and delete/recreate cases;
3. revision-vector stale-claim invalidation and historical replay preservation;
4. `UNKNOWN` external effect cannot become unsafe blind retry or false completion;
5. evidence population/currentness cannot be strengthened by projection/aggregation;
6. proof-domain outputs cannot be strengthened by parent/child composition;
7. provider unsupported scope cannot be silently dropped;
8. authority composition cannot exceed owner-issued authority;
9. disconnected/local operation cannot widen authority and stale Fleet state cannot become local truth;
10. analytical kind/unit/vector/uncertainty cannot be silently erased;
11. graph transformation/migration cannot silently rewrite historical producing semantics;
12. queue/capacity debt cannot be hidden behind a success/readiness flag;
13. Brownfield observed behavior cannot become canonical target truth without governed adoption;
14. AI/low-code cannot promote inference/evidence/projection into stronger requirement, authority or proof claim;
15. C1 elicitation cannot false-close HIGH/CRITICAL unresolved/contradicted dimensions;
16. C2 physical/provider integration cannot conflate provider permission, canonical authority and realized physical/media access.

## 23. External conceptual sanity checks

External standards are comparative evidence, not repository authority:

- W3C PROV-DM separates provenance entities/activities/agents, derivation/revision, invalidation and responsibility; this supports the chosen distinction between lineage and current truth/authority: https://www.w3.org/TR/prov-dm/
- CloudEvents defines event identity within a `source` scope and explicitly distinguishes the event envelope from the underlying occurrence; this supports source-qualified event identity rather than globally canonical business identity: https://github.com/cloudevents/spec/blob/main/cloudevents/primer.md
- RFC 3339 defines an interoperable timestamp representation but does not supply causal/currentness semantics; C0 therefore keeps temporal meaning explicitly qualified: https://www.rfc-editor.org/rfc/rfc3339

These references validate separation of concerns; they are not adopted wholesale as Generation 2 schemas.

## 24. C0 gate result

**C0 — Architecture constitution and universal semantic substrate: DECIDED / PASS FOR C0.**

The target planes and universal primitives are explicit enough for C1/C2/C3 to consume without UCA becoming a semantic god-object. The inherited 408 adversarial findings remain active constraints/proof obligations rather than remediated items.

Planning C remains **ACTIVE / OPEN**. No canonical capability target record has yet been completed under C3, so the per-capability count remains 0/28.

### Next authorized decision

Proceed only to **C1 — Elicitation & System Understanding architecture** after re-reading branch head and `RESEARCH_PIPELINE_STATE.json`.

C1 must decide Elicitation Knowledge Base ownership/model, `QuestionDefinition` vs `QuestionOccurrence`, information kinds, adaptive routing, contradiction/provenance/currentness, Unresolved Questions Inbox, stakeholder/evidence coverage, multidimensional sufficiency gates, artifact traceability, capability-specific lenses, Wizard/AI boundaries and separate Production Readiness Coverage.

Do not enter C2, C3, Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction or product code in the same action.
