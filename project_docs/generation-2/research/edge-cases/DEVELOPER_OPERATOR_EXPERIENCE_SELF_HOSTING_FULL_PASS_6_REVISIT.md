# Generation 2 — Developer / Operator Experience / Self-hosting — Full Pass 6 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 6
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Scope and authority

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `ADVERSARIAL_SATURATION_STATE.json`, the prior Developer/Operator dossier, `EDGE_CASE_INDEX.md`, and `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`.

Research only. No product code, Work Package, TASK, Construction, remediation, architecture materialization, or preventive guard is authorized.

Preserved distinctions:

- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- operator-visible health != business/effect truth;
- `semantic topology != build topology != deployment topology != runtime truth`;
- `local journal/evidence != exported telemetry != Fleet aggregate != control authority`;
- `observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`;
- `multidimensional facts != scalar score`;
- historical observed fact != forecast/simulation/counterfactual;
- correlation/Fleet co-movement != causal proof != authority;
- `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` remain distinct;
- autonomous client correctness must not depend on SB/Observe/Fleet availability.

## Full-Pass-6 techniques

1. **Operator-plane queue-network falsification** — model bootstrap, upgrade, maintenance, recovery, diagnostics and telemetry as interacting queues rather than independent commands.
2. **Probe/truth separation** — vary liveness/readiness/operator-visible success independently from workflow/effect/recovery truth.
3. **Retry-amplification braid** — interleave CLI retries, automation retries, provider retries and human retries during overload or ambiguous mutation.
4. **Transient-versus-steady-state challenge** — compare burst/recovery/startup behavior against steady-state queue assumptions and averaged utilization.
5. **Revision-crossing in-flight work** — hold maintenance/recovery work in flight while build/provider/policy/runbook topology changes.
6. **Evidence-budget pressure inversion** — let journal/WAL/support-bundle/export work compete with business workload for disk/I/O/CPU/network.
7. **Causal-overclaim challenge** — create correlated operator action + latency/failure movement without sufficient intervention/confounder evidence.
8. **Autonomous/Fleet shadow split** — local runtime remains correct while Fleet is delayed, incomplete, duplicated or stale.
9. **Human/AI operational composition** — combine locally valid runbook instructions, AI suggestions, break-glass and fleet recommendations and test authority/order amplification.
10. **Sixteen-family conflict screen** — structural, state, semantic ownership, rule/formula, temporal, resource, authority/SoD, policy, data, provider, version/coexistence, recovery, human procedure, cross-process, objective and AI/low-code.

## Fresh evidence differential

### Kubernetes health probes

Current Kubernetes documentation separates startup, liveness and readiness probes by purpose. Readiness removes an endpoint from normal service traffic; liveness can trigger restart; startup gates the other probes. Kubernetes explicitly cautions that incorrectly implemented liveness probes can contribute to cascading failure under high load. Portable consequence: a probe is a qualified operational signal tied to a specific decision, not proof of semantic correctness, business convergence, recovery completeness or safe restart.

Source: Kubernetes, `Liveness, Readiness, and Startup Probes`, accessed 2026-09-06.

### OpenTelemetry Collector buffering and data-loss boundaries

Current OpenTelemetry Collector resiliency guidance documents bounded sending queues and optional WAL/file storage. A full queue can drop new telemetry; retry expiry can drop older telemetry; disk failure/exhaustion can still lose persisted telemetry. Portable consequence: local store-and-forward increases resilience but does not prove Fleet completeness, and diagnostic/export buffering itself consumes bounded resources.

Source: OpenTelemetry, `Collector Resiliency`, accessed 2026-09-06.

### Retry amplification and burst hiding

Google SRE documents cascading failure in which retries add load to an already overloaded backend and can amplify across multiple retry layers. AWS Builders' Library similarly treats retries as load-generating behavior, recommends bounded backoff/jitter, and notes that short traffic bursts can be hidden in aggregate metrics. Portable consequence: operator tooling cannot infer that retry is availability-improving from a timeout alone, and fleet averages cannot establish transient burst tolerance or stability margin.

Sources: Google SRE, `Addressing Cascading Failures`; AWS Builders' Library, `Timeouts, retries, and backoff with jitter`, accessed 2026-09-06.

### Queueing-model qualification

Little's Law relates time-average number in system, arrival rate and expected sojourn time under its applicable long-run conditions; queueing literature also distinguishes transient behavior from steady-state behavior. Portable consequence: `L = λW`, M/M/1 and related models are useful analytical tools only after assumptions and time regime are qualified. They do not turn observed means into a proof of sustainable capacity.

Sources: Bertsimas & Nakazato, `The Distributional Little's Law and Its Applications`, Operations Research 43(2), 1995; Kelton & Law, `The Transient Behavior of the M/M/s Queue`, Operations Research 33(2), 1985.

### Autoscaling evidence is intentionally filtered

Current Kubernetes HPA documentation excludes or dampens some startup/readiness-related CPU observations before using them in scaling decisions. Portable consequence: raw resource observation, current readiness, and a scaling decision are different semantic objects; delayed/filtered control evidence makes autoscaling an explicitly qualified feedback loop rather than direct runtime truth.

Source: Kubernetes, `Horizontal Pod Autoscaling`, accessed 2026-09-06.

## Autonomous Builds × Fleet Observability/Capacity — architecture hypothesis under research

`HIPÓTESE DE ARQUITETURA / EM PESQUISA`; not a Planning-C decision.

Candidate operational lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

An operator or Fleet view must preserve enough of this lineage to answer whether an observation belongs to the same semantic capability, build/release, deployment, provider realization, instrumentation profile and tenant context. Aggregation by semantic capability is only justified after compatibility/comparability qualification. Otherwise analysis remains build/release/deployment/cohort scoped.

Local-first observability remains the research preference: autonomous runtime keeps bounded local journal/diagnostic evidence sufficient for local diagnosis/reconciliation; export is optional/providerized and can buffer/store-and-forward; export failure never becomes a workflow prerequisite. `PARTIAL/UNKNOWN`, evidence horizon, sampling/coverage, duplicate/late arrival and clock/currentness metadata remain explicit.

Fleet/Global Operations remains a read/analysis plane by default. Any future global actuation would require explicit client context, authority, approval where applicable, version/deployment targeting, effect reconciliation and safe rollback qualification. Fleet-derived capacity/risk/cost signals cannot rewrite workflow semantics.

Operational facts remain vectors/distributions: throughput, latency distribution, errors/retries, concurrency, queue depth/backlog, wait/service/sojourn time, CPU/RAM/I/O/DB/network, provider quota/rate limits, cost, pressure, centrality/fan-in/fan-out and uncertainty. Scalarization, if later useful, must be an explicit versioned/auditable policy while retaining causal dimensions.

## Queueing / flow / capacity findings — duplicate-screened

### Candidate A — green probes while business progress is stalled

**Activation conditions:** liveness/readiness/CLI status remains successful while downstream queue, durable workflow, external effect, reconciliation or recovery proof is stalled/`UNKNOWN`.

**Incompatible claims/actions/states:** operator health claim versus qualified business/effect-progress claim.

**Detection candidates:** compare probe-kind semantics with queue age, attempt/effect disposition, journal progression and business postcondition; require evidence profile/currentness before strengthening a claim.

**Owners:** Developer/Operator Experience + Runtime + Workflow/domain effect owner + Observability.

**Assessment:** severity HIGH; confidence strongly supported; detectability runtime/post-effect; blast radius deployment→process; reversibility bounded until automation acts; time-to-harm delayed/immediate; misuse likely accidental; evidence currentness can be current but semantically narrow; false-positive risk MEDIUM if a probe intentionally makes only a narrow claim.

**Duplicate-screen:** existing proof-claim conflation, analytical-kind/evidence qualification, runtime-health/business-convergence and recovery-qualification families. No new `G2-CONFLICT-PATTERN-*`.

**Future route:** Planning C/E claim lattice and product-proof candidate; no remediation now.

### Candidate B — retry storm created by operator/automation layers

**Activation conditions:** timeout/overload/ambiguous mutation causes CLI, runbook automation, provider adapter and/or higher-level workflow to retry independently.

**Incompatible claims/actions/states:** each layer's locally valid availability strategy versus globally unstable arrival rate and possibly duplicated external effect.

**Detection candidates:** per-operation attempt lineage; retry ancestry/budget; queue pressure; `UNKNOWN` effect reconciliation; arrival/service distributions; shared bottleneck/cut analysis.

**Owners:** Developer/Operator Experience + Workflow + Provider/Binding + Runtime/Capacity.

**Assessment:** severity HIGH/CRITICAL for mutating external effects; confidence strongly supported; detectability runtime; blast radius node→provider→fleet dependency; reversibility bounded to potentially irreversible; time-to-harm immediate; misuse accidental/plausible; evidence currentness current; false-positive risk LOW-MEDIUM if retry ancestry is explicit.

**Duplicate-screen:** unsafe retry/UNKNOWN, queue/resource amplification, provider idempotency/effect and objective-conflict families. No new pattern.

**Future route:** workload-admission/retry-budget/proof-boundary input to Planning C/D/E, not implementation.

### Candidate C — hidden saturation behind averages

**Activation conditions:** bursty/heavy-tailed or synchronized periodic load yields acceptable average CPU/utilization/throughput while queue age, tail latency, provider quota or short-interval pressure approaches instability.

**Incompatible claims/actions/states:** low averaged utilization versus sustainable capacity/headroom/stability margin.

**Detection candidates:** distributions/percentiles, queue growth rate, utilization by bottleneck, burst windows, saturation duration, provider-quota pressure, sensitivity/seasonality and uncertainty intervals.

**Owners:** Capacity/Runtime + Observability + Developer/Operator Experience + Provider realization owner.

**Assessment:** severity HIGH; confidence strongly supported; detectability runtime/forecast; blast radius node→workflow/fleet cohort; reversibility easy before overload, harder during cascade; time-to-harm delayed or burst-immediate; misuse likely accidental; currentness window-dependent; false-positive risk MEDIUM if workload is intentionally transient.

**Duplicate-screen:** resource/capacity, analytical-kind, source-population completeness/currentness and objective-conflict families. No new pattern.

**Future route:** Planning C queue/capacity semantics and Planning E proof scenarios.

### Candidate D — unstable autoscaling or placement feedback loop

**Activation conditions:** delayed/sampled Fleet metrics drive scaling/placement/provider selection while topology or workload distribution changes faster than observation/control response.

**Incompatible claims/actions/states:** optimizer's predicted improvement versus time-qualified runtime topology and delayed evidence; repeated action can oscillate or worsen pressure.

**Detection candidates:** control/evidence latency, decision revision, effective interval, before/after cohort identity, stability/oscillation signatures, rate-of-change and rollback/effect evidence.

**Owners:** Runtime/Capacity + Observability + Provider/Binding + Governance/Authority for actuation.

**Assessment:** severity HIGH; confidence supported; detectability runtime/post-effect; blast radius deployment→fleet; reversibility bounded if safe rollback exists; time-to-harm delayed/cumulative; misuse plausible; evidence currentness stale/partial possible; false-positive risk MEDIUM-HIGH because correlation and normal workload drift can mimic feedback instability.

**Duplicate-screen:** temporal/currentness, optimization/objective, provider-binding, graph revision and authority non-amplification families. No new pattern.

**Future route:** optimization provider boundary + feedback-loop product proofs; Fleet remains non-authoritative.

### Candidate E — support/telemetry preservation competes with autonomous workload

**Activation conditions:** exporter outage or incident causes WAL/journal/support bundles to grow until disk/I/O/CPU/network pressure affects business workload.

**Incompatible claims/actions/states:** maximize diagnostic/evidence retention versus preserve autonomous runtime correctness/availability.

**Detection candidates:** dimensioned `ResourcePressureVector`, queue capacity, disk/WAL growth rate, drop/retention policy evidence and business workload pressure; never a single health score.

**Owners:** Developer/Operator Experience + Observability + Runtime/Capacity + Privacy/Retention where evidence contains governed data.

**Assessment:** severity HIGH; confidence strongly supported; detectability runtime; blast radius node/deployment; reversibility usually bounded; time-to-harm cumulative; misuse accidental likely; evidence currentness may degrade as pressure rises; false-positive risk LOW for measured pressure.

**Duplicate-screen:** resource boundedness, observability completeness, privacy/retention and objective-conflict families. No new pattern.

**Future route:** bounded local evidence-budget and overload-shedding proof candidate for later planning.

### Candidate F — in-flight maintenance crosses topology/revision change

**Activation conditions:** upgrade/recovery/restore/maintenance begins under one build/provider/runbook/policy revision and completes after deployment or dependency topology changes.

**Incompatible claims/actions/states:** procedure valid at start versus effect/rollback/recovery eligibility at completion.

**Detection candidates:** pin operation target and revision vector; record effective intervals; compare preconditions at material actuation; detect residual cohorts and `PARTIAL/UNKNOWN` effects.

**Owners:** Lifecycle + Developer/Operator Experience + Runtime + Provider/Binding + relevant authority owner.

**Assessment:** severity HIGH; confidence strongly supported; detectability pre-execution/runtime; blast radius deployment/system; reversibility migration/recovery may be required; time-to-harm immediate/delayed; misuse accidental plausible; evidence currentness must be time-qualified; false-positive risk MEDIUM because controlled rolling coexistence is legitimate.

**Duplicate-screen:** compatibility-direction, revision-vector/coexistence, recovery qualification, currentness and residual-cohort families. No new pattern.

**Future route:** Planning C/D operation-target/revision proof obligation.

### Candidate G — causal story inferred from Fleet co-movement

**Activation conditions:** latency/errors/cost improve or worsen near a runbook action, provider switch, scaling event or configuration change, and an operator/AI labels the action causal without modeling confounders/cohort differences.

**Incompatible claims/actions/states:** observational association versus causal intervention/effect claim.

**Detection candidates:** explicit causal graph/model, intervention identity, pre/post compatible cohorts, confounders, missingness/currentness, uncertainty/sensitivity and counterfactual assumptions.

**Owners:** Observability/Analytics + consuming operational/business owner; Governance for high-impact actuation.

**Assessment:** severity MEDIUM→HIGH depending downstream action; confidence strongly supported as a general analytical hazard; detectability analysis/audit; blast radius analysis→fleet decision; reversibility easy before actuation; time-to-harm delayed; misuse plausible/likely; evidence currentness variable; false-positive risk HIGH without experimental/quasi-experimental qualification.

**Duplicate-screen:** analytical-kind conflation, provenance-edge overattribution, evidence/currentness and authority non-amplification families. No new pattern.

**Future route:** causal-analysis boundary in Planning C/E; correlation never grants control authority.

## Temporal/uncertainty coupling

Capacity and operator analysis must qualify topology by time. Planned deployment/provider changes, effective intervals, residual cohorts, stale forecasts and in-flight work crossing a revision can make a forecast internally correct for the wrong topology. Historical observed facts must remain separate from forecasts, simulations and counterfactuals.

Queue models likewise require explicit regime/assumptions. Little's Law can support consistency/estimation under qualified long-run conditions, but a transient recovery burst, finite queue with loss, priority queue, retry network, correlated arrivals, heavy-tailed service, shared quota or fan-out/fan-in network may require another model or simulation. `M/M/1` is a model profile, not runtime truth.

## Multiobjective placement / fairness / tenancy

Candidate placement/balancing/autoscaling analysis may optimize latency, cost, pressure, resilience or headroom only within hard semantic/provider/authority/data-locality/tenancy constraints. Pareto alternatives can be useful; silent scalarization cannot choose policy. Shared infrastructure does not create shared truth or authority.

Per-client fairness/noisy-neighbor analysis must preserve tenant attribution and distinguish reservations, quotas, business priority, admission control and overload shedding. A provider quota is an external realization constraint, not proof of internal semantic capability capacity.

## Conflict-classification completeness

All sixteen conflict families were explicitly challenged. None of the seven strongest candidates survived duplicate-screen as a distinct 125th reusable ConflictPattern. Existing patterns already provide the required reusable owner/detection/remediation vocabulary.

No `ConflictInstance` is claimed. No signal is promoted to confirmed conflict. No remediation or preventive invariant is materialized.

## Planning C/D/E handoff candidates

Research-only carry-forward inputs:

- queue/capacity semantic vocabulary: arrival/service/throughput/concurrency/queue depth/wait/service/sojourn/backpressure/stability;
- explicit distinction among low utilization, queue health, sustainable capacity, headroom, burst tolerance and stability margin;
- `ResourcePressureVector`, `RiskVector`, `ComplexityVector`, `CapabilityOperationalVector` with units/revisions/currentness;
- scalarization only as explicit versioned policy;
- workload admission/retry ancestry/budget and overload-shedding semantics;
- time-qualified topology and operation target/revision vector;
- optimization/placement provider boundary constrained by semantics/authority/data locality;
- causal/counterfactual analysis boundary with explicit model/confounders/uncertainty;
- local-first evidence budget and telemetry-gap semantics;
- product proofs for retry storm, hidden saturation, feedback-loop lag, queue loss, restore/proof continuity and Fleet/local divergence.

These are inputs only; they do not materialize target architecture.

## Saturation disposition

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New ConflictInstances: **0**.
- New preventive invariants: **0**.
- HIGH/CRITICAL finding lacking owner/proof/detection route: **0**.
- Developer / Operator Experience / Self-hosting streak: remains **2**, already capped and not inflated.
- Mandatory cluster streaks: unchanged; all 12/12 already exercised in Full Pass 6.
- Full Pass 6 capability coverage after this revisit: **24/28**.
- Full Pass 6 mandatory cluster coverage: **12/12**.
- Material inventory: **284 edge scenarios + 124 ConflictPatterns = 408 material findings**.
- Completed full passes: **5/8 minimum**; target **12**; no maximum.
- Negative-space: `NOT_STARTED`.
- Saturation: `NOT_SATURATED`.
- Planning C remains blocked.

## Exact next action

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 6, with **Provider / Binding / Capability Negotiation**. Duplicate-screen all 124 reusable ConflictPatterns and carry Autonomous Builds/Fleet + queue/flow/capacity + temporal/uncertainty + causal lenses into provider discovery→qualification→admission→binding; provider quota versus internal capacity; bind/rebind/withdraw/cutover; residual cohorts; queue/rate-limit/backpressure semantics; correlated provider failure; fallback degradation; provider-native identity; semantic compatibility; provider telemetry gaps; time-qualified capability support; placement/optimizer constraints; cross-tenant fairness; `PARTIAL/UNKNOWN`; retry/idempotency; trust/privacy/governance; causal overclaim around provider changes; and AI/low-code provider selection. Provider/Binding streak is already capped at 2 and must not inflate absent material novelty. Planning C remains blocked.