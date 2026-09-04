# Planning A — Architecture Reconciliation as a Capability Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Scope: taxonomy ownership and boundaries only. No SB current-state claim, product code, WBS, Work Package, TASK, Construction or worker handoff.

## Ownership
Architecture Reconciliation owns the cross-capability semantics for comparing an explicitly identified desired/product truth with qualified observed/effective truth, identifying and classifying drift, routing discrepancies to the semantic or realization owner that can resolve them, reconciling ambiguous outcomes, and closing reconciliation only when evidence demonstrates an authorized and validated relation between desired and effective state.

It does not own the canonical domain truths it compares. Each semantic owner remains authoritative for its own desired/product truth and postconditions; realization owners remain authoritative for actuation state and provider/runtime evidence. Architecture Reconciliation owns the reconciliation subject, comparison scope/revision vector, drift identity/classification, evidence qualification/currentness, assessment disposition, owner routing, normalization/adoption proposal lineage, correction/supersession lineage, and closure claim.

The source of truth for reconciliation is therefore a revisioned reconciliation record that references—not copies as replacement authority—the producing desired/product revisions and the qualified observed/effective evidence used for comparison.

## Canonical reconciliation model
A reconciliation subject identifies at minimum the canonical subject, semantic owner, intended revision/applicability scope, relevant realization/binding revision, observation/evidence horizon and the comparison rule or conformance profile being applied. Provider or external IDs remain realization identities and are non-canonical unless the owning semantic capability explicitly adopts them through an authorized transition.

Comparison results must distinguish at least CONFORMANT, DRIFTED, PARTIAL and INCONCLUSIVE. Drift classification records what relation failed without silently deciding how the underlying owner must mutate its truth. Useful classes include missing realization, unexpected realization, incompatible revision, stale realization, unauthorized realization, unsupported realization, residual old cohort, evidence mismatch and ambiguous effect.

Reconciliation preserves the attempted → accepted → applied/effective → converged → validated lineage. Control-plane acceptance is not equivalent to effective state; effective state is not automatically converged; convergence is not validated semantic conformance.

## Evidence qualification and currentness
Observed state is evidence, not canonical truth by default. Reconciliation evidence must preserve subject, producer, producing revision, collection time/horizon, applicability scope, coverage, provenance and uncertainty sufficient to replay the assessment against the revisions that produced it.

Missing, stale, partial, contradictory or insufficiently scoped evidence yields INCONCLUSIVE rather than an implicit PASS or forced drift classification. Historical evidence remains replayable against producing revisions but does not automatically qualify a changed current state.

Architecture Reconciliation may consume telemetry, provider observations, runtime status, release/deployment evidence, schema/data evidence, workflow state, governance assessments, security recovery evidence or domain-specific observations, but it does not redefine their semantics.

## Ambiguous outcomes and reconcile-before-retry
When a mutating operation has UNKNOWN effect, Architecture Reconciliation owns the cross-capability obligation to establish the effective outcome before an unsafe retry unless the owning operation explicitly qualifies idempotency for the same subject/revision/scope. It may correlate provider receipts, observed state, domain postconditions and lineage evidence to classify the prior attempt as APPLIED, NOT_APPLIED, PARTIAL or still UNKNOWN.

This capability does not itself acquire actuation authority from the need to reconcile. After classification it routes remediation to the appropriate semantic or realization owner under existing authorization.

## Governed normalization and adoption
Observed or provider-native state cannot silently overwrite canonical desired/product truth. When reconciliation discovers a legitimate external state that should become canonical, the result is a governed normalization/adoption proposal referencing the observed evidence, producing revisions, ownership and required authority. The semantic owner decides whether and how to adopt it.

Adoption, correction and supersession preserve lineage. A newer canonical revision may supersede prior desired truth, and corrected observations may supersede prior evidence, but the producing history remains replayable for audit and causal analysis.

Architecture Reconciliation therefore prevents two opposite errors: treating desired truth as proof of effective reality, and treating observed reality as automatic authority to rewrite desired truth.

## Reconciliation closure
A reconciliation closes only when the comparison scope is explicit and current evidence supports one of the allowed terminal dispositions for that scope. A repaired subject is not closed merely because a remediation request was accepted. Closure requires qualified evidence that the relevant state is effective, converged where required, semantically validated where required, and free of unresolved authoritative residual cohorts applicable to the reconciliation subject.

Closure is applicability-scoped. A successful reconciliation for one provider, region, tenant, Station, revision, population or evidence horizon does not imply universal conformance elsewhere.

## Boundary with Universal Capability Architecture
Universal Capability Architecture supplies shared identity, revision-vector, evidence-envelope, effect-disposition, lineage, support-vector and authority primitives. Architecture Reconciliation composes those primitives into reconciliation semantics. UCA does not own drift or conformance truth, and Architecture Reconciliation must not become a reverse god-object that absorbs every domain because it can compare them.

## Boundary with Observability / Operations / Incident
Observability owns telemetry/evidence production semantics, freshness/coverage descriptions, SLI/SLO and operational diagnostic/incident evidence. Architecture Reconciliation consumes qualified observations to compare desired and effective state and to route drift. It does not own telemetry pipelines, incident command, SLO policy or operational remediation execution.

## Boundary with Provider / Binding / Capability Negotiation
Provider/Binding owns provider discovery, support qualification, admission, binding, realization mappings, provider coexistence/cutover and withdrawal. Architecture Reconciliation may detect binding drift, unsupported realization, provider substitution mismatch or ambiguous provider mutation outcomes, but it does not infer semantic equivalence from feature names or provider success responses and does not own provider admission/cutover actuation.

## Boundary with Lifecycle / Versioning / Evolution / Migration
Lifecycle owns revision succession, compatibility/coexistence coordination, migration readiness/currentness, staged cutover, deprecation/withdrawal, rollback eligibility and residual authoritative cohort drainage. Architecture Reconciliation assesses whether intended lifecycle states match effective evidence and whether a transition can be considered reconciled for a defined scope. It does not define lifecycle policy or migration semantics.

## Boundary with Governance / Compliance / Audit
Governance owns obligations, control applicability, exceptions, remediation findings and audit claims. Architecture Reconciliation may consume governance evidence and report conformance drift to Governance, but it cannot create or waive obligations, exceptions or audit truth. An architecture state can be reconciled yet non-compliant, or compliant evidence can remain INCONCLUSIVE for architecture reconciliation if effective-state coverage is insufficient.

## Boundary with Security / Resilience / Failure Recovery
Security/Resilience owns containment, degraded-mode eligibility, recovery qualification, restore/failover/rebuild safety and return-to-service evidence. Architecture Reconciliation compares intended and effective security/recovery state and can classify unresolved drift, but it cannot declare recovered service safe merely from topology convergence.

## Boundary with Data / Schema / Migrations
Data/Schema owns canonical schema/data identity, compatibility, migration/backfill/CDC semantics, population transition and data postconditions. Architecture Reconciliation may compare declared schema/data migration state with qualified materialized/consumer-effective evidence, but it cannot redefine schema correctness or silently normalize data state.

## Boundary with Deployment / Environment / Runtime
Deployment/Runtime owns desired/observed/effective deployment generations, rollout, placement, readiness, traffic and deployment rollback actuation. Architecture Reconciliation can compare deployment intent with effective runtime evidence and classify drift or UNKNOWN effects, but does not own rollout actuation or runtime readiness semantics.

## Boundary with domain semantic owners
Every canonical capability remains owner of its domain truth and validation rules. Architecture Reconciliation owns only the cross-owner comparison, drift record, evidence-qualified assessment, routing and closure relation. A domain-specific conformance failure is reported with the domain owner's identity and revision; it is not reinterpreted into a generic architecture scalar.

## Failure semantics
Reconciliation itself may be COMPLETE, PARTIAL, INCONCLUSIVE or BLOCKED for a defined scope. Ambiguous observations never become implicit success. Conflicting evidence remains explicit until provenance/currentness/coverage allows a qualified resolution or owner review.

If reconciliation cannot determine whether a prior mutation applied, the effect remains UNKNOWN and unsafe retry is prohibited unless explicit idempotency qualification exists. If a remediation can only be performed by an unavailable or unauthorized owner, the reconciliation remains open rather than fabricating convergence.

## Authority and AGWS
Enterprise → Station → Role → Person remains monotonic. Reconciliation visibility, normalization proposals and remediation routing are bounded by inherited authority and capability exposure. Station-scoped reconciliation cannot weaken Enterprise constraints or normalize state outside delegated scope.

AI and Adaptive Governed Work Surfaces may summarize evidence, propose classifications, surface drift or orchestrate authorized reconciliation workflows, but they cannot manufacture evidence, convert INCONCLUSIVE into PASS, silently adopt observed/provider state as canonical, grant themselves remediation authority or bypass domain-owner validation.

## Non-goals
Architecture Reconciliation is not a canonical configuration database, universal policy engine, telemetry store, provider controller, deployment orchestrator, migration engine, incident manager, compliance engine, recovery controller or domain semantic owner. It must not collapse heterogeneous conformance into one universal score or use reconciliation as authority to overwrite source-of-truth owners.

## Planning B repository-validation questions
Later repository archaeology from fresh main must determine: whether desired/product truth and observed/effective truth are represented as distinct identities/revisions; where reconciliation subjects and drift records currently exist; whether effect disposition includes UNKNOWN with reconcile-before-retry semantics; how evidence provenance/currentness/coverage are represented; whether provider/runtime observations can overwrite canonical truth implicitly; whether reconciliation routes to explicit semantic/realization owners; whether normalization/adoption is governed and lineage-preserving; whether correction/supersession preserves producing evidence; whether closure distinguishes accepted/effective/converged/validated states; and whether residual cohorts can keep reconciliation open. These are questions only; this artifact makes no current-SB implementation claim.

## Planning A decision
PASS_FOR_CAPABILITY. Architecture Reconciliation owns evidence-qualified desired/product-versus-observed/effective comparison, drift identity/classification, ownership routing, ambiguous outcome reconciliation, governed normalization/adoption proposal lineage, correction/supersession and reconciliation closure. It cannot absorb canonical domain truth, provider/runtime actuation, governance policy, telemetry, recovery qualification or UCA primitives. No Planning B work is authorized by this artifact.