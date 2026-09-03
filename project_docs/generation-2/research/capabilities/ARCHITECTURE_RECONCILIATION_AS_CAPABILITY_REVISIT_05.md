# Architecture Reconciliation as a Capability — Revisit 05 / Cycle 6

## Research question
What additional semantics must Generation 2 preserve so that architecture reconciliation is not merely a documentation comparison or provider controller loop, but a revision-qualified evidence process that can trace `evidence → finding → product truth → gap → disposition → proof`, preserve decision supersession, distinguish semantic authority from technical field ownership, and refuse false closure when observations, executable conformance or ownership evidence are stale, partial or contradictory?

## Research-by-exception scope
This revisit does not repeat cycle-5 desired/attempted/applied/effective/healthy semantics. It stress-tests the remaining exceptions named by the pipeline state: evidence lineage, ADR applicability/supersession, fresh-main versus research hypotheses, contradiction handling, proof ownership, disposition semantics, stale evidence, multi-axis revision vectors, executable conformance, provider/migration implications, and Enterprise → Station → Role → Person / AGWS / AI non-amplification.

## Representatives
1. AWS Prescriptive Guidance — Architectural Decision Records lifecycle, ownership, supersession and non-compliant code.
2. Kubernetes Server-Side Apply — field managers, managedFields, conflicts and forced ownership transfer.
3. Flux Kustomization / Flux 2.9 — SSA ownership policies and field-level ignore/delegation.
4. Crossplane managed resources — managementPolicies, late initialization, initProvider and provider-observed values.
5. Terraform refresh / refresh-only — provider observation updating state and the documented risk of misleading observations.
6. Open Policy Agent policy/conformance testing — executable tests as independent evidence over policy/documentation intent.
7. Kubernetes node conformance testing — executable qualification against stated minimum requirements.

## Evidence / source ledger
- AWS ADR guidance treats accepted ADRs as immutable historical decisions; a changed decision is represented by a new ADR that supersedes the old one, while the old record remains in the decision log. The guidance also states that ADR process alone does not make legacy code compliant. This falsifies any model where the latest architecture document automatically proves implementation truth.
- Kubernetes Server-Side Apply records field managers and conflicts. `force-conflicts` can re-acquire conflicting fields. Therefore technical ownership metadata is mutable reconciliation state, not proof that the actor has semantic or organizational authority to seize the field.
- Flux 2.9 field ignore rules explicitly delegate selected paths to other controllers. Depending on current SSA ownership, Flux may strip an ignored field from its payload and relinquish ownership, or adopt the live value while preserving its own technical ownership. This demonstrates that technical ownership, desired-value origin and semantic responsibility are distinct dimensions.
- Crossplane late initialization can copy provider-selected values into `spec.forProvider`; `managementPolicies` can disable LateInitialize, while `initProvider` defines create-time values that are not continuously enforced. Provider observation can therefore enrich a desired representation without implying that the provider owns the domain meaning of the field.
- Terraform refresh reads remote objects and can update Terraform state. HashiCorp explicitly warns that misconfigured credentials can make Terraform believe objects were deleted. Observed state is evidence with source/configuration quality, not infallible actuality.
- OPA separates policy definition from executable tests of policy behavior; its IR conformance suite also checks interpreters/compilers against expected outputs/errors. Documentation or source presence is insufficient when executable behavior is the claim being reconciled.
- Kubernetes node conformance tests qualify a node against minimum requirements through system/function tests. Architecture acceptance can therefore require executable conformance evidence where behavior is externally testable.

## Primitives and sources of truth
Architecture reconciliation needs typed records for `EvidenceRef`, `FindingRef`, `ProductTruthRef`, `GapRef`, `DispositionRef`, `DecisionRef/ADRRef`, `ProofObligationRef`, `ConformanceRunRef`, `OwnershipClaimRef` and `ReconciliationRunRef`.

No single store is universal truth. Research evidence is the source for external claims; fresh-main repository evidence is the source for current SB product facts; accepted architecture decisions are the source for intended architectural constraints within their applicability window; executable conformance is the source for behavior actually tested; provider observations are qualified actuality evidence. Reconciliation joins these sources and may conclude `INCONCLUSIVE` when they cannot be compatibly joined.

## Identity, lifecycle and versioning
Required lineage:
`EvidenceSnapshot → Finding → ProductTruthSnapshot → Gap → Disposition → Decision/Constraint → ProofObligation → ConformanceEvidence → ReconciledArchitectureState`.

Every link must carry an applicability vector sufficient to detect staleness: at minimum repository/head revision, evidence/source revision or retrieval time, decision revision/supersession status, semantic schema/profile revision, provider/binding revision where relevant, reconciler/conformance implementation revision, policy/trust revision and scope/tenant/Station where relevant.

A new ADR does not rewrite historical evidence; it supersedes the prior decision for a defined applicability window. A fresh-main product observation does not invalidate a research finding about an external semantic requirement; it changes the `ProductTruth` and therefore may close, reshape or create a gap.

## Failure semantics and contradiction handling
- `DOCUMENTED` is not `IMPLEMENTED`; `IMPLEMENTED` is not `CONFORMANT`; `CONFORMANT` is not necessarily `CURRENT` outside the tested revision/scope.
- Contradictory credible evidence is retained with provenance and yields an explicit unresolved contradiction or `INCONCLUSIVE`, not last-writer-wins truth.
- Missing fresh-main evidence cannot be converted into repository absence without a bounded search proof.
- Stale provider observation, stale conformance run or superseded decision cannot qualify a newer revision vector.
- A disposition does not erase the finding. `KEEP/HARDEN/GENERALIZE/PROVIDERIZE/INTEGRATE/REPLACE/DEFER/DO_NOT_BUILD` is a governed response to a gap or hypothesis, with rationale, owner and proof consequence.

## Ownership, authority and field-level reconciliation
Kubernetes/Flux establish a critical negative-space boundary: field-manager ownership is a collision-resolution mechanism. It is not semantic authorization. `force-conflicts` is technically able to take ownership, so Generation 2 must separately prove the authority to transfer or override a semantic field.

Ownership transfer requires at least: old-owner disposition/release or explicit authorized override, new-owner acceptance, scope/field identity, expected-base revision, and proof that stale reconcilers cannot continue shared-field mutation. Flux ignore/delegation semantics demonstrate that relinquishing mutation while preserving coexistence is a first-class reconciliation operation.

Crossplane establishes a second boundary: late initialization/defaulting is provenance-bearing normalization. Provider-selected defaults may become explicit desired representation, but that write must retain `origin=provider_observation/defaulting` and cannot silently become evidence that the provider owns the business/domain decision.

## Extensibility / provider and migration boundaries
Provider adapters may observe, normalize and actuate, but architecture reconciliation owns the evidence contract used to decide whether provider-specific state proves a portable requirement. Provider/region replacement invalidates affected observation/conformance evidence and requires new-effective evidence plus residual realization/old-authority disposition. Technical ownership handoff, semantic authority handoff and provider realization cutover are related but independently provable transitions.

## Governance and AGWS / AI boundary
Architecture findings, dispositions and ADR supersession are canonical governance mutations. AI/AGWS may collect evidence, propose findings, detect contradictions, draft dispositions and request reconciliation. They may not turn a hypothesis into product truth, force a field ownership conflict, supersede an accepted decision or close a proof obligation beyond the effective `Enterprise → Station → Role → Person` authority chain. Station-local closure is valid only within its delegated scope and evidence horizon; reconnect must requalify central decisions, trust, product truth and provider state that may have advanced.

## Observability
Each reconciliation result should expose: run identity; typed inputs; applicability/revision vector; evidence freshness/coverage; contradictions; product-truth evidence; gaps; disposition and owner; proof obligations and current proof status; field/semantic ownership transfer state; provider residual state; and final status such as `RECONCILED|PARTIAL|INCONCLUSIVE|STALE|CONTRADICTED|BLOCKED`.

## Portability / lock-in
Portable primitives are evidence lineage, typed applicability, decision supersession, contradiction preservation, proof ownership, semantic-vs-technical ownership separation and executable-conformance linkage. Kubernetes managedFields, Flux annotations, Crossplane policies, Terraform state and OPA/Kubernetes test harnesses are representative mechanisms, not mandated System Builder storage formats.

## Product-specific mechanism versus universal primitive
- AWS ADR `Superseded` → universal decision supersession lineage and applicability window.
- Kubernetes `managedFields` / field manager → universal technical mutation-ownership evidence, explicitly not semantic authority.
- Flux ignore/Strip/Adopt → universal governed field delegation/relinquishment and value-origin distinction.
- Crossplane LateInitialize/initProvider → universal provenance-bearing default/normalization with enforcement-mode distinction.
- Terraform refresh-only → universal qualified external observation and observation-risk metadata.
- OPA/Kubernetes conformance tests → universal executable proof evidence tied to tested revision/scope.

## Convergent and divergent patterns
Convergent: immutable/historical decision lineage; explicit ownership; observation distinct from desired intent; executable validation independent of documentation; technical reconciliation capable of partial delegation; revision/scope qualification. Divergent: exact ownership granularity, whether live values are adopted, force semantics, observation reliability, and the meaning/coverage of conformance. Generation 2 should preserve the semantic distinctions instead of imposing one provider's mechanism.

## Subcapabilities
Evidence-to-gap lineage; decision applicability/supersession; fresh-main product-truth capture; contradiction register; disposition governance; proof-obligation ownership; executable conformance linkage; field ownership/delegation; semantic authority transfer; provider-observation qualification; stale-evidence invalidation; local/reconnect architecture requalification.

## SB comparison — bounded evidence only
This revisit does not claim repository-wide SB implementation truth. The pipeline explicitly reserves authoritative fresh-main reconciliation for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`. Any current research-branch architecture statement therefore remains hypothesis/requirement unless backed by a bounded repository observation carrying head/path evidence.

## Hypotheses
- **GENERALIZE** typed `Evidence → Finding → ProductTruth → Gap → Disposition → Proof` lineage as architecture reconciliation substrate.
- **HARDEN** contradiction and stale-evidence handling with explicit `INCONCLUSIVE/CONTRADICTED/STALE` outcomes.
- **GENERALIZE** decision supersession/applicability rather than mutable in-place architecture truth.
- **HARDEN** semantic-authority transfer separately from provider/SSA field-manager ownership transfer.
- **GENERALIZE** provenance-bearing defaulting/late initialization without semantic ownership capture.
- **INTEGRATE** executable conformance evidence with proof obligations and revision vectors.
- **PROVIDERIZE** observation/actuation/field-management mechanics.
- **DEFER** broad SB implementation-gap conclusions until Planning B fresh-main evidence.
- **DO_NOT_BUILD** documentation-only architecture compliance or last-writer-wins contradiction resolution.

## Repo-validation questions
Does SB already type research evidence, findings, product truths, gaps, dispositions and proof obligations separately? Can a finding survive a later disposition without being rewritten? Are accepted decisions superseded rather than mutated? Is fresh-main evidence bound to commit/path? Are contradictions represented explicitly? Can conformance results identify tested revision/profile? Is technical field ownership separated from business/semantic authority? Can default/provider-observed values retain provenance? Can proof closure be invalidated when repository/provider/policy/trust revisions advance? Can AI/AGWS only propose canonical architecture changes within effective delegated authority?

## Symbiotic Proof obligations
1. Positive lineage: one external finding is traced through fresh-main product truth, gap, accepted disposition and executable/inspection proof without losing provenance.
2. Negative documentation: an accepted ADR with non-compliant code remains an open gap, not `RECONCILED`.
3. Supersession: old and new decisions remain historically addressable; only the applicable decision qualifies current proof.
4. Contradiction: two credible incompatible observations produce `CONTRADICTED/INCONCLUSIVE` until disposition evidence resolves them.
5. Staleness: a conformance result for repository/reconciler revision N cannot prove N+1 when affected semantics changed.
6. Observation quality: provider observation made under invalid/mis-scoped credentials cannot prove absence and must not destructively rewrite canonical truth.
7. Ownership: SSA `force-conflicts` capability alone cannot authorize semantic ownership transfer.
8. Delegation: a field delegated to another controller remains outside the original reconciler's drift-correction authority while non-delegated fields continue converging.
9. Defaulting: provider late-init/defaulting records value origin without silently transferring domain ownership.
10. Provider migration: new provider proof plus residual old-provider realization/authority disposition is required before architecture closure.
11. Offline Station: local proof closes only within delegated scope/evidence horizon; reconnect invalidates or requalifies affected conclusions.
12. AGWS/AI: AI may propose a finding/disposition/ADR but cannot make it canonical or close proof beyond effective Enterprise → Station → Role → Person authority.

## Stable findings
- **G2-FINDING-ARC-39** — Architecture reconciliation requires typed, revision-qualified `Evidence → Finding → ProductTruth → Gap → Disposition → Proof` lineage; a finding, product observation, decision and proof are not interchangeable records.
- **G2-FINDING-ARC-40** — Architecture decisions require immutable historical identity plus explicit applicability/supersession lineage; a new accepted decision replaces applicability, not historical evidence, and documentation alone does not prove implementation compliance.
- **G2-FINDING-ARC-41** — Credible contradictory or stale evidence must remain provenance-preserving and yield `CONTRADICTED/INCONCLUSIVE/STALE`; last-writer-wins reconciliation is architecturally unsafe.
- **G2-FINDING-ARC-42** — Technical mutation ownership such as SSA field management is not semantic authority; forced conflict resolution or field re-acquisition requires a separately authorized ownership-transfer proof.
- **G2-FINDING-ARC-43** — Field delegation/relinquishment is a first-class reconciliation transition; convergence must support mixed ownership without treating delegated live values as drift requiring unconditional overwrite.
- **G2-FINDING-ARC-44** — Defaulting/late initialization is provenance-bearing normalization: provider-observed values may enrich desired representation without acquiring semantic/domain ownership or continuous enforcement authority.
- **G2-FINDING-ARC-45** — External/provider observation is epistemic evidence whose source, credentials/configuration, freshness and coverage qualify confidence; observation failure or misleading context cannot be flattened into authoritative absence.
- **G2-FINDING-ARC-46** — Architecture proof closure must bind executable conformance/inspection evidence to the tested revision, scope and implementation profile; documentation claims cannot substitute for behavior where executable proof is feasible.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-ARC-EVIDENCE-FINDING-PRODUCTTRUTH-GAP-DISPOSITION-PROOF-LINEAGE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-SEMANTIC-VS-TECHNICAL-OWNERSHIP-TRANSFER-PROOF` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-CONTRADICTION-STALE-EVIDENCE-DISPOSITION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-EXECUTABLE-CONFORMANCE-REVISION-QUALIFIED-PROOF` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

No candidate is promoted in this pass. They consolidate architecture-reconciliation concerns with existing typed identity, governance, observability, lifecycle and proof/readiness primitives. Adaptive Governed Work Surfaces remains promoted and distinct.

## Value / risk / priority / next question
Value: prevents documentation drift, false proof closure, stale product-truth assumptions, unsafe forced ownership changes and AI-mediated canonicalization. Risk if omitted: architecture can appear reconciled while code/provider behavior contradicts it, historical decisions are rewritten, or technical controller privileges are mistaken for semantic authority. Priority: constitutional cross-cutting. Next question: close cycle 6, then begin cycle 7 using the state-selected least-covered non-saturated capability; Enterprise Completeness / Negative-Space remains unavailable until seven full cycles complete.
