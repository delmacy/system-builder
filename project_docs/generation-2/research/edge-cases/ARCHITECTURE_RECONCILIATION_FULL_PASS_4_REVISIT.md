# Generation 2 — Architecture Reconciliation as a Capability — Full Pass 4 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 4
Disposition: research-only; no remediation, Work Package, TASK, Construction or product-code authority.

## Authority and baseline

`RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `ADVERSARIAL_SATURATION_STATE.json`, `EDGE_CASE_INDEX.md` and the Full-Pass-3 reconciliation dossier were re-read before acting. The branch head was `cdbd7db61a9f569ec1a0641e9cd310d39e4ba4c6` immediately before persistence and state was re-read at that head.

Full Pass 4 entered this revisit at **27/28 capabilities + 12/12 mandatory clusters**, with **284 material edge scenarios + 119 reusable ConflictPatterns = 403 material findings**. Architecture Reconciliation already had local no-material streak **2** and must not be inflated above 2.

Canonical distinctions remain: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; desired/declared truth != observed/effective evidence; local journal/evidence != exported telemetry != fleet aggregate; semantic topology != build topology != deployment topology != runtime truth; read/analysis authority != runtime control authority.

## Techniques materially different from Full Passes 1–3

1. **Topology-layer separation mutation** — independently mutate semantic, build, deployment and runtime topology while holding the others valid, then test whether reconciliation falsely reports one common topology.
2. **Lineage-cut fracture** — challenge `CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt` by removing/reusing/reordering one identity edge and testing build-specific versus semantic aggregation.
3. **Aggregation-level inversion** — compare the same telemetry by invocation, capability-use, semantic capability, workflow, workspace, client, build/deployment and fleet, testing whether a valid lower-level statistic is promoted to a semantically invalid higher-level claim.
4. **Offline evidence-horizon subtraction** — retain correct autonomous local operation while delaying or dropping export, then test whether fleet absence is classified as runtime failure or fleet freshness uncertainty.
5. **Store-and-forward permutation** — reorder duplicates, late arrivals, retries, sampling and clock-skewed batches to challenge reconciliation currentness without changing local runtime truth.
6. **Control-plane authority transposition** — keep fleet analysis correct but attempt to reinterpret ranking/hotspot/placement recommendations as authority to mutate workflow semantics, provider binding or client runtime.
7. **Cross-tenant attribution mutation** — keep shared infrastructure valid while swapping/omitting client/workspace/build attribution dimensions to test whether shared infrastructure becomes shared truth/authority.
8. **Capacity-vector projection loss** — preserve CPU/RAM/I/O/DB/network/quota/cost/backlog dimensions, then collapse them into one score and test whether the scalar creates a false placement or capacity conclusion.
9. **Compatibility-qualified rollup mutation** — aggregate semantically related capability uses across builds/providers only after varying contract/revision/topology compatibility direction; test false equivalence.
10. **AI/low-code optimization braid** — allow AI to propose balancing/placement from fleet evidence while deleting client context, authority, contract, version-target or rollback qualification.

## Priority hypothesis — Autonomous Builds × Fleet Observability/Capacity

### HIPÓTESE DE ARQUITETURA / EM PESQUISA

A candidate architecture that survived this pass as **research hypothesis, not Planning-C decision** is:

- every generated/client system remains operationally autonomous; correctness of workflow execution does not depend on System Builder, Observe or Fleet availability;
- local runtime owns enough journal/diagnostic evidence for operation and bounded incident reconstruction;
- telemetry export is optional/providerized and failure to export never blocks workflow;
- store-and-forward may use bounded local buffering/persistent queue semantics, with explicit loss/backpressure/retention behavior rather than pretending delivery is lossless;
- Fleet/Global Operations is a read/analysis plane by default, consuming exported evidence and producing qualified aggregates, hotspots and capacity signals rather than canonical runtime truth;
- any future global actuation would require explicit client context, authority, approval where applicable, exact version/build/deployment targeting, operation-specific compatibility and rollback/recovery qualification;
- semantic identity and operational identity remain separate: a stable `CanonicalCapabilityRef` may aggregate compatible/equivalent uses, while `CapabilityUse`, `BuildRevision/Release`, `RuntimeRealization`, `Deployment` and `NodeInvocation/Attempt` preserve the dimensions needed to explain one execution;
- aggregation is qualified: build/release/deployment analysis is mandatory when behavior, provider, contract, runtime topology or revision can materially differ; semantic-capability rollup is permitted only over an explicitly compatible comparison domain;
- metrics remain vector-valued where causality matters: throughput, latency distribution, error/retry/UNKNOWN/PARTIAL, concurrency, queue/backlog, CPU/RAM/I/O/DB/network, provider quota/rate-limit, cost, pressure, centrality/fan-in/fan-out and blast radius are not silently reduced to one authoritative scalar;
- shared cluster/database/schema may be an infrastructure realization, but does not merge tenant truth, authority, backup/restore ownership or telemetry attribution.

Candidate alternatives retained for later comparison: direct client→fleet export; local agent/collector with bounded persistent queue; client-owned telemetry backend with optional federation; dedicated per-client versus shared multi-tenant collector/gateway; database-per-client/dedicated runtime versus shared infrastructure with explicit isolation/attribution. No option is selected here.

### Failure modes challenged

- SB/Fleet outage blocks client workflow;
- telemetry gap is interpreted as runtime outage rather than `UNKNOWN/PARTIAL` fleet knowledge;
- duplicate/late export double-counts invocation/cost/capacity;
- clock skew manufactures impossible ordering or latency;
- sampling is used as if it were complete cardinality evidence;
- `service.name`/provider-native identity is treated as canonical capability identity;
- build-specific regression disappears inside semantic-capability rollup;
- incompatible provider/runtime/contract cohorts are averaged together;
- fleet aggregate is treated as current runtime truth after offline periods;
- observability recommendations rewrite workflow semantics or binding without authority;
- high-cardinality lineage exhausts collector/backend resources and bounded/truncated analysis is reported as complete;
- shared telemetry path leaks cross-tenant data or attribution;
- local journal retention/privacy requirements conflict with export/fleet retention;
- balancing optimizes utilization/cost while violating resilience reserve, locality, privacy, authority or contract constraints.

All reduce to existing conflict families after duplicate-screening; no new reusable family is created.

## Duplicate-screen against 119 reusable ConflictPatterns

**Result: 0 new local edge scenarios, 0 new cross-capability scenarios, 0 new reusable ConflictPatterns and 0 new preventive invariants.**

The priority hypothesis is materially covered by existing families:

- telemetry/fleet evidence promoted to canonical/runtime truth -> reconciliation ownership, evidence qualification/currentness and observed/effective-state families;
- missing/stale/partial export promoted to failure or conformance -> evidence coverage plus `PARTIAL/INCONCLUSIVE/UNKNOWN` families;
- incompatible builds/providers/contracts aggregated as one capability cohort -> revision-vector/qualification joins plus `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`;
- provider/service IDs confused with canonical capability/use/build/deployment identity -> effective-identity/provider-identity/reconciliation-identity families;
- late/duplicate exports and ambiguous attempts -> event identity/idempotency/currentness families;
- cross-tenant telemetry mixing -> multitenant isolation/trust-namespace/privacy families, including `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001` where aggregation itself creates the privacy harm;
- fleet analysis widened into mutation authority -> `G2-CONFLICT-PATTERN-RECONCILIATION-OWNERSHIP-001` and authority non-amplification;
- bounded sampling/top-N/cardinality truncation presented as complete -> resource-boundedness/evidence-coverage families;
- missing/empty/default lineage fields changing interpretation -> `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`.

No signal is promoted to a `ConflictInstance`. No concrete remediation is authorized.

## Evidence refresh

- OpenTelemetry resource semantics distinguish logical service, service version and service instance; `service.instance.id` is required to be unique within the service namespace/name scope, and the entity guidance warns that external observers may be unable to derive the same instance identity reliably. This supports preserving explicit lineage dimensions instead of inferring canonical identity from telemetry labels.
- OpenTelemetry Collector resiliency guidance supports sending queues and optional persistent WAL storage for network export, while explicitly noting loss can still occur on disk failure/exhaustion or prolonged endpoint outage. This supports local-first/store-and-forward as a bounded evidence mechanism, not a lossless correctness dependency.
- SLSA provenance separates `buildDefinition` from `runDetails` and carries a per-execution invocation identity plus builder identity. This supports keeping semantic/build definition identity distinct from a particular build execution and from later runtime/deployment identity.
- KubeEdge documents autonomous edge operation during cloud disconnection and per-node metadata persistence. This is evidence that disconnected autonomous operation is a viable systems pattern; it does not establish the exact SB architecture.

## Conflict-family coverage

The revisit explicitly challenged structural graph; state-transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/SoD; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process; objective/optimization; and AI/low-code composition.

For each surviving candidate conflict, existing authoritative patterns already carry activation conditions, incompatible claims/actions/states, detection candidates, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive risk and future-remediation disposition. Research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## Saturation disposition

- Architecture Reconciliation local no-material streak: remains **2**; no inflation.
- Mandatory-cluster streaks: unchanged at their state-authoritative values; no incidental increment.
- Material totals remain **284 edges + 119 ConflictPatterns = 403**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Full Pass 4 capability coverage becomes **28/28**; mandatory clusters remain **12/12**.
- Full Pass 4 therefore completes and completed adversarial full passes become **4/8 minimum**.
- Saturation remains `NOT_SATURATED`; several capability local streaks remain below two, minimum full passes are not met, and final negative-space review remains `NOT_STARTED`.
- `PLANNING_C_TARGET_ARCHITECTURE` remains blocked.

## Next action candidate

Advance only within `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION` to **Full Pass 5**, beginning with **Adaptive Governed Work Surfaces**, using techniques materially different from Passes 1–4 and duplicate-screening all 119 patterns. Preserve the Autonomous Builds × Fleet Observability/Capacity hypothesis as a cross-cutting research lens in subsequent Build, Runtime, Observability, Provider, Security/Recovery, Privacy and Architecture Reconciliation revisits. Do not enter Planning C.