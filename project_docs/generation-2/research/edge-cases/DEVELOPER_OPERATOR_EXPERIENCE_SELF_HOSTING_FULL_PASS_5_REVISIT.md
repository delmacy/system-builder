# Generation 2 — Developer / Operator Experience / Self-hosting — Full Pass 5 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 5
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Scope and authority

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, the prior Developer/Operator register/revisits, `EDGE_CASE_INDEX.md`, `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`, `ADVERSARIAL_SATURATION_STATE.json`, and the current formal-assurance/federation research. It executes research only: no product code, Work Package, TASK, Construction, remediation, or preventive guard is authorized.

Preserved distinctions: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; operator-visible success/health != effective runtime/business truth; local journal/evidence != exported telemetry != Fleet aggregate != control authority; semantic topology != build topology != deployment topology != runtime truth; shared infrastructure != shared truth/authority; telemetry gap != runtime failure; backup existence != qualified recovery; proof/certificate presence != proof claim validity; `ABSENT/UNSET/null/default/delete` remain distinct; `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` remain distinct.

## Techniques materially different from earlier passes

1. **Proof-carrying runbook mutation** — hold procedure text constant while varying the proof obligations and evidence currentness required after each administrative step.
2. **Fleet-shadow divergence probe** — independently vary local runtime truth and delayed/sampled Fleet representation, then test whether an operator or AI loop promotes aggregate state to control authority.
3. **Build-to-operator lineage fracture** — remove or alter one join in `CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt` while keeping dashboards and CLI superficially coherent.
4. **Offline evidence-budget exhaustion** — extend air-gapped operation until trust, revocation, support, entitlement, provider or proof evidence crosses its qualified horizon without making the local runtime itself unavailable.
5. **Recovery-proof discontinuity** — restore a technically usable system while selectively losing journal segments, provenance, certificate lineage, residual-cohort disposition or semantic completion evidence.
6. **Operational topology aliasing** — make two deployments appear equivalent at service/capability labels while build, provider, contract, runtime topology or tenant context differs.
7. **Resource-pressure observer inversion** — increase local journal/export/support-bundle pressure until diagnostic machinery competes with workload resources, without assuming observability failure equals workflow failure.
8. **Human/AI procedure braid** — interleave a valid human runbook, generated recommendation and local break-glass action around maintenance/recovery, looking for authority or ordering amplification.
9. **Sixteen-family conflict screen** — structural, state, semantic ownership, rule/formula/condition, temporal, resource, authority/SoD, policy/compliance, data, provider, version/coexistence, recovery, human procedure, cross-process, objective and AI/low-code composition were all explicitly challenged.

## Fresh external evidence differential

Current Kubernetes version-skew policy (maintained branches 1.37/1.36/1.35) demonstrates that supported compatibility is topology- and direction-dependent: mixed API-server versions narrow supported kubelet, controller and kubectl ranges, and upgrade order has prerequisites. This reinforces the existing compatibility-direction/revision-vector families rather than creating a new pattern.

OpenTelemetry Collector resiliency guidance documents persistent sending queues/WAL as a way to survive collector restart, while explicitly retaining loss modes such as disk failure/exhaustion or endpoint unavailability beyond retry limits. This supports local-first operation and the distinction between local evidence, exported telemetry and Fleet completeness; store-and-forward is not proof of complete delivery.

SLSA provenance separates `buildDefinition` from execution-specific `runDetails`, including builder identity. This reinforces build/run identity and proof-lineage qualification: an operator-visible version label or Fleet cohort is not sufficient evidence that two runtime realizations are equivalent.

## Autonomous Builds × Fleet Observability/Capacity — architecture hypothesis under research

`HIPÓTESE DE ARQUITETURA / EM PESQUISA`; not a Planning-C decision.

The client build remains operationally autonomous: SB/Observe/Fleet unavailability must not block correct local workflow execution. Local journal/diagnostics must remain sufficient for bounded local diagnosis and reconciliation. Export is providerized/optional and may use bounded buffering/store-and-forward; export failure is an observability condition, not a workflow precondition.

Candidate operational lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

Operator/Fleet analysis SHOULD retain these dimensions rather than treating a capability label as execution identity. Aggregation by semantic capability is only analytically meaningful after compatibility/comparability qualification across build/release, contract, provider, topology, unit/schema and evidence-currentness dimensions. Otherwise analysis remains by build/release/deployment/cohort.

Fleet/Global Operations remains a read/analysis plane by default. Any future global actuation would require explicit client context, authority, approval where applicable, version/deployment targeting, effect reconciliation and safe rollback qualification. Fleet-derived health, risk, cost or capacity signals do not rewrite workflow semantics or grant authority.

Operational metrics remain multi-dimensional: throughput, latency distributions, errors/retries, `UNKNOWN/PARTIAL`, concurrency, queue/backlog, CPU/RAM/I/O/DB/network, provider quota/rate limit, cost and graph pressure/centrality. A scalar score may be derived only without discarding the causal dimensions needed to explain it.

Shared cluster/database/schema and dedicated/database-per-client remain deployment alternatives under research. Neither topology changes canonical tenant ownership. Noisy-neighbor, backup/restore, attribution, portability, privacy and anti-lock-in remain explicit comparison dimensions.

## Adversarial challenges and duplicate-screen against all 123 reusable ConflictPatterns

### 1. Fleet says healthy while local proof is incomplete

Activation: sampled/delayed export or an aggregate rollup reports normal health while local journal/proof indicates `PARTIAL/UNKNOWN`, unresolved effect or missing current evidence.

Incompatible claims: Fleet analytical health versus qualified local runtime/business/effect proof.

Duplicate-screen: observability coverage/currentness, proof-claim conflation, analytical-kind conflation and qualified-effect families already classify it. Detection candidate: compare Fleet evidence horizon/coverage with local deployment/revision/effect lineage before promoting a claim. Owners: Observability + runtime/domain semantic owner + proof owner. Severity HIGH; confidence strongly supported; detectability runtime/post-effect; blast radius deployment→fleet decision; reversibility bounded if no actuation follows; time-to-harm delayed; misuse plausible; evidence currentness incomplete/stale; false-positive risk high unless local evidence and observer health are qualified. Future route: Planning-C/E proof obligation, not remediation.

### 2. Same capability label, different operational realization

Activation: two builds/deployments expose the same canonical capability/service label but differ materially in contract, provider, build revision, runtime topology or instrumentation.

Incompatible claims: semantic equivalence versus execution/performance/economic comparability.

Duplicate-screen: compatibility-direction, revision-vector, semantic ownership, analytical-kind and provider-realization patterns cover it. Detection candidate: cohort qualification over the full lineage vector. Owners: UCA + Build/Runtime + Provider + Observability. Severity HIGH; confidence supported; detectability design/runtime; blast radius fleet analysis/capacity planning; reversibility easy before actuation; delayed/cumulative harm; accidental likely; currentness must be revision-qualified; false-positive risk medium. Future route: comparability proof obligation.

### 3. Air-gapped runtime remains correct after central evidence becomes stale

Activation: autonomous build remains locally functional while revocation/support/policy/provider/proof evidence cannot be refreshed.

Incompatible claims: local runtime availability versus current external qualification.

Duplicate-screen: offline-horizon/currentness, retained-closure, trust and proof families already cover it. Detection candidate: explicit evidence horizon and `UNKNOWN/INCONCLUSIVE` when current proof is required but unavailable. Owners: local runtime + relevant trust/policy/proof owner. Severity HIGH where privileged/recovery decisions depend on freshness; confidence strongly supported; detectability pre-actuation/runtime; blast radius deployment; reversibility bounded; harm delayed; misuse plausible; evidence currentness stale/unknown; false-positive risk low when horizons are explicit. Future route: offline proof policy in later architecture.

### 4. Restore returns service but breaks operational lineage

Activation: backup/restore recreates service/data while local journal segments, artifact provenance, certificate lineage, deployment identity or residual-cohort disposition is missing or stale.

Incompatible claims: service restored versus recovery/proof continuity established.

Duplicate-screen: recovery qualification, historical reproduction, proof-claim conflation, certificate composition and residual-cohort families cover it. Detection candidate: post-restore continuity manifest over data/config/artifact/trust/journal/deployment revisions. Owners: Recovery + Runtime + Artifact/Trust + semantic owners. Severity HIGH; confidence supported; detectability post-effect; blast radius deployment/system; reversibility migration/reconciliation may be required; immediate/delayed harm; misuse accidental; evidence incomplete; false-positive risk medium. Future route: recovery proof obligation.

### 5. Diagnostic/store-and-forward pressure competes with workload

Activation: outage or high cardinality expands local journal/WAL/support bundles until disk/I/O/CPU pressure affects the autonomous workload.

Incompatible claims: preserve diagnostic completeness versus preserve workload correctness/availability.

Duplicate-screen: resource/capacity, observability boundedness, objective conflict and queue/backlog families cover it. Detection candidate: dimensioned pressure vectors and bounded evidence budgets, never a single health scalar. Owners: Operator Experience + Observability + Runtime/Capacity. Severity HIGH under exhaustion; confidence strongly supported; detectability runtime; blast radius deployment/node; reversibility usually bounded; time-to-harm cumulative; accidental likely; current evidence may itself degrade; false-positive risk low for measured pressure. Future route: boundedness proof candidate, not implementation now.

### 6. Human runbook + AI recommendation + break-glass compose unsafe authority/order

Activation: each actor/action is locally valid, but AI reorders prerequisites, broadens target cohort or selects a more privileged context while a human follows a valid recovery/upgrade procedure.

Incompatible claims: local action validity versus composed authority/ordering/SoD validity.

Duplicate-screen: authority non-amplification, human-procedure, temporal ordering, objective conflict, AI/low-code composition and context/identity patterns cover it. Detection candidate: explicit target/context/authority/revision lineage and procedure partial-order validation before material actuation. Owners: Authorization/Governance + Operator Experience + semantic owner. Severity CRITICAL for broad privileged actuation; confidence supported; detectability pre-execution/runtime; blast radius system/fleet if target broadening is allowed; reversibility potentially migration/recovery; immediate harm; misuse plausible/adversarial; currentness must be checked at actuation; false-positive risk medium. Future route: later proof/approval boundary; no present remediation.

### 7. `ABSENT/null/default/delete` crosses CLI/config/runtime revisions

Activation: operator omits a field intending preserve while a newer adapter/runtime interprets omission as default/clear/delete.

Incompatible claims: operator intent versus effective mutation semantics.

Duplicate-screen: `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`, compatibility-direction and semantic-owner patterns directly cover it. Detection candidate: operation/revision-qualified presence semantics and diff/effect evidence. Owners: Configuration + Runtime + semantic owner. Severity HIGH for destructive fields; confidence strongly supported; detectability pre/post effect; blast radius configuration subject→deployment; reversibility varies; immediate harm; accidental likely; currentness revision-bound; false-positive low when contract is explicit. Future route: contract proof obligation.

## Conflict classification completeness

All sixteen required processual/semantic families were searched. No candidate survived duplicate-screen as a distinct 124th reusable ConflictPattern. Existing authoritative pattern records retain activation conditions, incompatible claims/actions/states, detection candidates, owner sets, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive controls and future remediation disposition. No `ConflictInstance`, remediation, Construction work or preventive invariant is claimed.

## Detection/proof candidates retained for later phases

Research-only candidates: lineage-complete target/context identity; build/release/deployment cohort qualification; local evidence horizon/coverage markers; explicit telemetry-gap and observer-health state; bounded journal/export pressure dimensions; post-restore proof continuity manifest; residual agent/config/provider discovery; operation-qualified presence semantics; `PARTIAL/UNKNOWN` reconciliation; authority/SoD re-evaluation at material actuation; and provenance for AI-generated operational procedures. These remain future architecture/proof candidates.

## Saturation disposition

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New preventive invariants: **0**.
- HIGH/CRITICAL finding lacking owner/proof/detection route: **0**.
- Developer / Operator Experience / Self-hosting local eligible no-material streak: remains **2**, already satisfied and not inflated.
- Mandatory cluster streaks: unchanged at their capped values; all 12/12 already covered in Full Pass 5.
- Full Pass 5 capability coverage after this revisit: **24/28**.
- Full Pass 5 mandatory cluster coverage: **12/12**.
- Material inventory remains **284 edge scenarios + 123 ConflictPatterns = 407 material findings**.
- Completed full passes: **4/8 minimum**; target 12; no maximum.
- Negative-space: `NOT_STARTED`.
- Saturation: `NOT_SATURATED`.
- Planning C remains blocked.

## Exact next action

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 5, with **Provider / Binding / Capability Negotiation**. Duplicate-screen all 123 ConflictPatterns. Carry Typed Semantic Graph/Federation/Workflow proof plus Autonomous Builds/Fleet into discovery→qualification→admission→binding currentness; canonical capability versus realization identity; semantic portability versus feature-label equality; bind/rebind/withdraw/cutover; provider ACK versus canonical/effective state; residual provider cohorts; fallback degradation; provider-native IDs; quota/capacity/cost pressure; `PARTIAL/UNKNOWN`; idempotency scope; offline qualification; trust/privacy/governance; compatibility direction; Fleet cohort comparability; shared-infrastructure isolation; human provider-operations procedures; objective conflicts; and AI/low-code provider selection. Preserve Fleet as non-authoritative read/analysis plane by default, GraphDB optional/provider-level, and local autonomous operation. Absent material novelty, keep Provider/Binding local streak capped at 2. Do not enter Planning C.