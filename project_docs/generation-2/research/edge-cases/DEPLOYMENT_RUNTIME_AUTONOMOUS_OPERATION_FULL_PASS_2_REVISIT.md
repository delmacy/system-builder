# Generation 2 — Deployment / Runtime / Autonomous Operation — Full Pass 2 Revisit

Status: FULL PASS 2 — MATERIAL FINDINGS / LOCAL STREAK 0 / CLUSTER STREAK 0
Capability: Deployment / Runtime / Autonomous Operation
Paired cluster: Observability × Security/Recovery × runtime truth
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No remediation, target architecture, product code, Work Package, TASK or Construction is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Pass-2 technique rotation

This revisit deliberately differs from Full Pass 1. It used lifecycle-cut analysis across traffic, process execution and termination; negative-space checks around control-plane conditions that cease to advance; evidence-topology mutation analysis for observability pipelines; incomplete-observation reasoning under sampling/backpressure; and duplicate screening against the 115 reusable ConflictPatterns already catalogued.

## Current evidence anchors

- Kubernetes readiness is specifically about whether a container should receive Service traffic; when a Pod terminates, EndpointSlice `ready` is false while `serving` can still describe a terminating endpoint, and applications may still need to drain open connections or complete sessions. This demonstrates that routing withdrawal is narrower than execution quiescence. Source accessed 2026-09-04: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/ and https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/.
- Kubernetes Deployment progress deadlines are not evaluated while a Deployment is paused. A lifecycle state can therefore legitimately suspend one progress/failure signal while heterogeneous rollout state remains. Source accessed 2026-09-04: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/.
- OpenTelemetry Collector documentation states that queues can overflow and telemetry can be dropped under downstream outage/resource pressure; Collector internal telemetry exposes enqueue/drop signals. Source accessed 2026-09-04: https://opentelemetry.io/docs/collector/resiliency/ and https://opentelemetry.io/docs/collector/internal-telemetry/.
- OpenTelemetry documents that scaling stateful Collectors used for tail sampling can split spans of one trace across replicas, causing missing spans and misrepresentation of what occurred; similar topology effects can make service-derived metrics inaccurate. Source accessed 2026-09-04: https://opentelemetry.io/docs/collector/scaling/.

These are representative evidence sources only. Their product mechanisms are not promoted to universal architecture.

## Duplicate-screen result

The surviving scenarios below are material scenario refinements but do **not** justify a new reusable ConflictPattern after comparison with the 115-pattern catalogue. They remain covered by existing health-qualification, actuation-convergence, currentness, qualified-claim, revision-vector, residual-cohort, recovery/containment, distribution-convergence, support/coverage and AI/low-code composition families. No hypothetical pattern is converted into an implementation guard.

## New local material scenarios

### G2-EDGE-RUNTIME-007 — traffic withdrawal is mistaken for runtime quiescence

Scenario: a runtime instance is removed from ordinary request routing or marked non-ready/terminating, while in-flight sessions, background consumers, timers, asynchronous workers or provider callbacks can still produce business effects.

Activation conditions: rollout, drain, security fencing, rollback or recovery relies on routing/readiness state; the runtime has work channels beyond new synchronous Service traffic; termination is graceful or delayed; background work has independent lifecycle.

Incompatible claims/actions/states: `not routed / not ready / terminating` is composed as `cannot produce authoritative effects` even though execution can continue through already-open or non-routing work channels.

Expected safe behavior: routing eligibility, execution eligibility, mutation authority and quiescence remain separate qualified claims. A destructive transition that requires quiescence must use evidence covering the relevant effect channels and current cohort.

Forbidden behavior: treating load-balancer withdrawal, readiness false, endpoint removal request or termination start as proof that the runtime can no longer mutate business state.

Owners: Deployment/Runtime + Workflow/Durable Execution + Integration/Messaging + Security/Recovery + Observability; semantic owner of each affected business effect remains authoritative.

Effect/failure disposition: `PARTIAL/INCONCLUSIVE` until required effect channels are drained, fenced or otherwise dispositioned. Existing effects remain historical facts.

Evidence/currentness: runtime/cohort identity; termination phase; open/in-flight work; background-consumer leases/subscriptions; timer/workflow ownership; provider callbacks; fencing/drain evidence with bounded currentness.

Recovery/reconciliation: reconcile effects produced during the drain/termination window; requalify mutation eligibility before retry or rollback closure; preserve causal lineage.

Blast radius: workflow instance through fleet/system, potentially external parties.

Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-execution + runtime + post-effect. Reversibility: bounded to potentially difficult depending on external mutation. Time-to-harm: immediate. Misuse likelihood: likely accidental; plausible adversarial abuse if readiness is treated as an authority boundary. Evidence currentness: must be current for the relevant cohort/effect channel. False-positive risk: medium where runtime contract explicitly proves no non-routing work channels.

Proof obligation: `RUNTIME-ADV-PROOF-007` — demonstrate that any operation requiring quiescence distinguishes traffic withdrawal from effect cessation and can prove/fence every authoritative work channel included in its claim.

Future remediation disposition: detection/reconciliation/owner-qualified fencing candidate only; no implementation authorized.

### G2-EDGE-RUNTIME-008 — suspended progress watchdog is interpreted as evidence of safe rollout state

Scenario: a rollout lifecycle state legitimately pauses or suppresses a progress/failure watchdog while old/new cohorts remain mixed, but consuming automation interprets absence of a deadline failure as evidence that rollout safety or convergence remains current.

Activation conditions: deployment/rollout can be paused, frozen, maintenance-held or otherwise exempted from normal progress timing; partial cohorts remain active; higher-level recovery/security automation consumes only the watchdog condition.

Incompatible claims/actions/states: `watchdog not failed` is composed as `rollout healthy/current/converging`, although the watchdog is not currently evaluating progress.

Expected safe behavior: watchdog applicability and evaluation state are explicit. A suspended detector yields no stronger safety claim than its active observation scope permits; mixed cohorts retain their own currentness and risk status.

Forbidden behavior: converting absence of timeout/progress failure during an inapplicable or paused interval into positive evidence of rollout safety, business correctness, security posture or convergence.

Owners: Deployment/Runtime + Observability + Security/Recovery + Lifecycle.

Effect/failure disposition: rollout may remain `PAUSED/PARTIAL/INCONCLUSIVE`; detector silence is not `PASS`.

Evidence/currentness: lifecycle mode, detector applicability, last evaluation time, cohort composition, runtime-effective revisions and security/recovery qualification.

Recovery/reconciliation: on resume or before dependent actuation, re-establish current detector applicability and reconcile mixed cohorts; do not retroactively rewrite the paused interval as healthy.

Blast radius: fleet/system.

Severity: HIGH–CRITICAL. Confidence: supported. Detectability: pre-execution/runtime/audit. Reversibility: usually bounded before further mutation, difficult after dependent automation acts. Time-to-harm: delayed or immediate. Misuse likelihood: likely accidental. Evidence currentness: current lifecycle/applicability evidence required. False-positive risk: low when consumer explicitly treats suspended detector as unknown/non-applicable.

Proof obligation: `RUNTIME-ADV-PROOF-008` — prove that operational safety claims carry detector applicability/currentness and that absence of a signal cannot be promoted to PASS when the detector is suspended, filtered or out of scope.

Future remediation disposition: evidence-applicability detection candidate; no implementation authorized.

## New paired-cluster material scenario

### G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-005 — observability topology change creates a false security/recovery narrative

Scenario: runtime behavior is unchanged, but scaling/rebalancing/sampling/backpressure in the observability pipeline changes which events/spans/metrics survive. The resulting evidence set appears internally valid yet omits or distorts the minority cohort or causal path needed to qualify security containment, recovery convergence or runtime truth.

Activation conditions: stateful/tail sampling, collector scaling, queue overflow, dropped telemetry, aggregation topology change, partition, or resource pressure; security/recovery decision depends on cross-signal completeness or causal joins.

Incompatible claims/actions/states: `available telemetry shows no violating cohort/path` versus `telemetry coverage/topology cannot prove that the relevant cohort/path was observed`.

Expected safe behavior: evidence carries coverage/topology/sampling/drop/currentness qualification. Missing or topologically fragmented evidence degrades the dependent claim to `PARTIAL/INCONCLUSIVE`; absence of evidence is not evidence of absence.

Forbidden behavior: declaring containment, recovery convergence, security cleanliness or fleet-wide runtime correctness from telemetry whose relevant coverage was dropped, sampled inconsistently, split across stateful processors or made non-comparable by topology revision.

Owners: Observability + Security/Recovery + Deployment/Runtime; semantic owner of the stronger claim remains responsible for required evidence.

Effect/failure disposition: observation may be `PARTIAL/DEGRADED/INCONCLUSIVE` while runtime effect itself remains independently `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN`.

Evidence/currentness: collector/topology revision; sampling policy; queue/drop counters; source/cohort coverage; correlation completeness; time bounds; security/recovery claim profile.

Recovery/reconciliation: restore/qualify observability coverage, use independent authoritative evidence where available, and reconcile affected cohorts before claiming closure. Historical telemetry remains historical and is not rewritten as complete.

Blast radius: fleet/system/security incident; potentially external parties.

Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime + audit; some failures only post-effect. Reversibility: evidence loss may be irreversible; business/security effects may require separate recovery. Time-to-harm: immediate/latent. Misuse likelihood: likely accidental; plausible adversarial pressure on telemetry capacity. Evidence currentness: coverage and topology revision must be current. False-positive risk: medium where the stronger claim explicitly does not require complete telemetry and has independent evidence.

Proof obligation: `XRUNTIME-ADV-PROOF-005` — demonstrate that security/recovery/runtime-truth qualification cannot silently strengthen when telemetry coverage/topology changes, and that dropped/fragmented evidence is detectable or explicitly bounded.

Future remediation disposition: coverage/currentness detection and evidence-requalification candidate only; no implementation authorized.

## Processual / semantic conflict classification

No new reusable `G2-CONFLICT-PATTERN-*` is added in this revisit after duplicate screening. The scenarios map to existing catalogue families:

- `G2-EDGE-RUNTIME-007`: actuation/convergence, effective-identity, residual-cohort, recovery/containment and workflow/integration effect semantics;
- `G2-EDGE-RUNTIME-008`: health-qualification, qualified-claim, currentness and revision/applicability semantics;
- `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-005`: health-qualification, support/coverage, currentness, qualified-claim and observability/resource-pressure semantics.

Research remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

## Saturation disposition

Material findings survived duplicate screening. Deployment / Runtime / Autonomous Operation local streak remains/resets to `0`. Observability × Security/Recovery × runtime truth cluster streak remains/resets to `0`. Full Pass 2 capability coverage becomes 9/28 and mandatory-cluster coverage becomes 9/12. This revisit adds three material edge/cross-capability scenarios and zero reusable ConflictPatterns.
