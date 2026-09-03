# Architecture Reconciliation as a Capability — Revisit 04 / Cycle 5

## Research question
What universal reconciliation semantics must Generation 2 preserve so that desired intent, attempted actuation, applied realization, effective consumer state and healthy/validated state cannot be collapsed into one provider-specific `synced` boolean, especially under ambiguous external effects, dependency uncertainty, provider/topology replacement, offline operation and AI-mediated recovery?

## Representatives
1. Kubernetes controller/finalizer semantics.
2. Crossplane managed-resource reconciliation, management policies, conditions and external-create annotations.
3. Flux Kustomization/Receiver reconciliation, suspend/resume, Ready, observedGeneration and last-handled reconcile requests.
4. Argo CD automated sync/self-heal/retry semantics.
5. Cluster API condition/observedGeneration conventions.

## Evidence / source ledger
- Kubernetes finalizers: deletion request may be accepted while the object remains terminating until cleanup obligations complete; acceptance is not completion.
- Crossplane: managementPolicies facet Create/Delete/LateInitialize/Observe/Update authority; empty policy can pause; external-create pending/succeeded/failed timestamps distinguish actuation phases; Ready/Synced conditions distinguish availability from reconciliation; finalizers delay deletion until external deletion completes.
- Flux: explicit reconcile requests are tracked separately from Ready; Receiver observedGeneration is the latest generation that resulted in Ready; suspend/resume is explicit.
- Argo CD: desired-vs-live drift, sync attempt, self-heal and retry are distinct; automated sync is keyed to commit+parameters and has bounded retry semantics; rollback is constrained while automated sync is enabled.
- Cluster API: Conditions support True/False/Unknown and may carry observedGeneration, making uncertainty and generation qualification first-class.

## Source of truth and identity
Portable desired intent is the semantic source of desired state. Provider live state is observation, not canonical intent. Reconciliation identity must bind `SemanticSubject + DesiredRevision + ReconciliationPolicyRevision + Binding/ProviderRevision + TopologyRevision` and distinguish attempts. Provider object IDs are realization references only.

## Lifecycle / versioning
Required lineage: `DesiredRevision → ReconcileEvaluation → ActuationAttempt → ProviderReceipt/Unknown → AppliedRealization → ConsumerEffectiveRealization → Health/PostconditionEvidence`. A new desired, policy, provider, topology, trust or dependency revision can stale prior evidence. `observedGeneration`-style qualification is a universal primitive; exact Kubernetes fields are product-specific.

## Failure semantics
`Accepted`, `Applied`, `Synced`, `Ready`, `Healthy` and `SemanticallySatisfied` are not synonyms. Timeout/ack loss after external actuation is `OUTCOME_UNKNOWN` until observed/reconciled. Dependency uncertainty propagates `INCONCLUSIVE`; a parent cannot become conclusively healthy merely because its own controller loop completed. Deletion is multi-stage and may remain blocked by cleanup/finalizer obligations.

## Extensibility / provider boundaries
Providers implement observe/normalize/actuate/verify adapters but cannot redefine semantic satisfaction. Provider replacement requires mapping desired semantics, external identity, residual old-provider state, actuation authority and postconditions. If state is not representable, in-flight replacement is unsupported or `INCONCLUSIVE`, not lossy success.

## Governance and authority
Reconciliation authority is faceted: Observe, Normalize/Adopt, Create, Update, Delete, Repair/Self-heal, Migrate/Rebind and Recovery are separately grantable. Crossplane managementPolicies are strong evidence that observe authority need not imply mutation authority. Observation-to-desired normalization (late initialization/adoption) is itself a canonical mutation and needs explicit authority/ownership rules.

## Observability
Every decision should expose desired revision, observed/effective revision, attempt identity, dependency qualification, provider/binding/topology revision, authority facet, status (`CONVERGED|PROGRESSING|PARTIAL|INCONCLUSIVE|FAILED|PAUSED|OUTCOME_UNKNOWN`) and evidence freshness. Queue/apply/health lag must remain visible rather than flattened into one timestamp.

## Portability / lock-in
Portable reconciliation semantics should not require Kubernetes CRDs, Argo sync history, Crossplane annotations or Flux Conditions. Those are realizations. Universal primitives are revision-qualified desired/effective lineage, faceted authority, typed uncertainty, dependency closure, ambiguous-outcome reconciliation and qualified local closure.

## Product-specific mechanism vs universal primitive
- Kubernetes finalizer → universal cleanup obligation / deletion closure.
- Crossplane managementPolicies → universal action-faceted reconciliation authority.
- Crossplane external-create annotations → universal ambiguous-actuation correlation evidence.
- Flux observedGeneration → universal revision-qualified status evidence.
- Argo commit+parameter sync key → universal attempt/idempotency scope, not a mandated identifier format.
- Cluster API Unknown condition → universal explicit uncertainty.

## Convergent / divergent patterns
Convergent: declarative desired/live comparison, generation-qualified status, explicit pause, retry/requeue, health separate from apply, deletion cleanup. Divergent: authority granularity, retry policy, adoption/late-init behavior, provider external-identity handling and what `Ready` means. Generation 2 must preserve divergence behind semantic contracts rather than normalize it away.

## Subcapabilities
Desired/effective lineage; observation normalization; convergence evaluation; action-faceted authority; ambiguous-actuation disposition; dependency qualification; cleanup/finalization; provider/topology migration; local/offline reconciliation; reconnection requalification; health/postcondition closure.

## SB comparison — bounded evidence only
A bounded fresh-main code search for `reconcile observedGeneration desired effective health provider` returned no matches. This is not evidence of repository-wide absence. Detailed SB truth remains deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE** revision-qualified desired/attempted/applied/effective/healthy lineage as a cross-capability primitive.
- **HARDEN** reconciliation with explicit `PARTIAL`, `INCONCLUSIVE` and `OUTCOME_UNKNOWN` dispositions.
- **GENERALIZE** faceted reconciliation authority rather than a monolithic controller privilege.
- **PROVIDERIZE** provider-specific observe/actuate/health adapters while keeping semantic satisfaction portable.
- **INTEGRATE** Lifecycle revision vectors, Provider Binding, Security/Recovery eligibility, Observability evidence qualification and qualified local closure.
- **DO_NOT_BUILD** a second provider-specific GitOps engine as the universal architecture.

## Repo-validation questions
Does current SB distinguish desired, attempted, applied, effective and healthy revisions? Are provider actuation attempts correlated? Can observe-only bindings exist? Can provider observations mutate desired definitions? Is ambiguous external creation quarantined before retry? Are dependency `INCONCLUSIVE` states propagated? Is deletion/recovery closure explicit? Can offline Stations reconcile locally and later requalify? Are AI repair operations authority-scoped?

## Symbiotic Proof obligations
1. Positive: desired revision converges through attempt, applied, effective and healthy evidence.
2. Negative: `Applied` without health/postcondition cannot satisfy the capability.
3. Ambiguous effect: lost acknowledgement after create yields `OUTCOME_UNKNOWN`, reconciliation finds the external object, and blind duplicate creation is prevented.
4. Authority: Observe-only principal/provider cannot normalize, update, delete or self-heal.
5. Version: stale health for desired/provider/topology revision N cannot qualify N+1.
6. Dependency: parent remains `INCONCLUSIVE/PARTIAL` while required child evidence is uncertain.
7. Provider replacement: cutover proves new effective realization plus residual-source disposition.
8. Offline: Station reaches qualified local closure only against locally available trust/config/dependency evidence; reconnection requalifies advanced dependencies.
9. Recovery: self-heal/repair does not bypass Security/Recovery eligibility or break-glass scope.
10. AGWS/AI: a Person-level automation may request reconciliation only within effective Enterprise → Station → Role → Person authority and cannot promote domain/provider/recovery authority.

## Stable findings
- **G2-FINDING-ARC-31** — Reconciliation requires revision-qualified `Desired → Attempted → Applied → Effective → Healthy/SemanticallySatisfied` lineage; no single `Synced` bit is sufficient.
- **G2-FINDING-ARC-32** — Reconciliation authority is action-faceted; Observe, Normalize/Adopt, Create, Update, Delete, Repair, Migrate and Recovery must not be implicitly interchangeable.
- **G2-FINDING-ARC-33** — Ambiguous external actuation requires correlation, quarantine and reconcile-before-retry; transport acknowledgement is not proof of effect absence or success.
- **G2-FINDING-ARC-34** — Observation-to-desired normalization is a canonical mutation requiring explicit ownership and authority, not harmless controller bookkeeping.
- **G2-FINDING-ARC-35** — Dependency uncertainty propagates upward: required `PARTIAL/INCONCLUSIVE` child state prevents conclusive parent semantic satisfaction.
- **G2-FINDING-ARC-36** — Queue, apply, consumer-uptake and health convergence have independent lag/freshness; status must identify the revision each evidence item qualifies.
- **G2-FINDING-ARC-37** — Provider/topology substitution is reconciliation migration and requires representability, new-effective evidence and residual-source disposition before authority transfer.
- **G2-FINDING-ARC-38** — Offline/local convergence is profile-qualified and must be requalified after reconnection when trust, policy, provider, dependency or desired revisions may have advanced.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-ARC-REVISION-QUALIFIED-CONVERGENCE-LINEAGE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-ACTION-FACETED-RECONCILIATION-AUTHORITY` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-AMBIGUOUS-ACTUATION-QUARANTINE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-DEPENDENCY-INCONCLUSIVE-PROPAGATION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

No candidate is promoted in this run; each overlaps established cross-cutting primitives and requires synthesis consolidation.

## Value / risk / priority / next question
Value: prevents false convergence and unsafe autonomous repair across every provider-backed capability. Risk if omitted: duplicate external effects, stale-health promotion, unauthorized normalization, unsafe provider cutover and false fleet health. Priority: constitutional cross-cutting. Next question: in cycle 6, begin the least-covered non-saturated capability according to the state rotation, emphasizing contradiction closure and proof debt rather than repeating representative summaries.
