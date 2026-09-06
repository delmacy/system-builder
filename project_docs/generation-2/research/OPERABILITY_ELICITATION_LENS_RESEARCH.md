# Generation 2 — Operability Elicitation Lens Research

Status: `HIPÓTESE DE ARQUITETURA / EM PESQUISA`
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Scope: cross-cutting elicitation/readiness semantics; no product implementation or Planning C decision.

## Purpose

Generation 2 must distinguish a capability/workflow/integration that is functionally specified from one that is sufficiently specified to be operated, monitored, supported, audited, recovered and evolved in production.

Canonical separation:

`feature completeness != production readiness != runtime health != business convergence`

The lens is applied during elicitation and later reviews. It does not create a 29th canonical capability and does not authorize remediation or automatic control actions.

## Evidence basis

Portable semantics were extracted from mature operational-readiness practices rather than copied as provider-specific implementation requirements.

- Google SRE's Reliable Product Launches describes launch checklists covering architecture/dependencies, capacity, failure modes, client behavior, manual processes, external dependencies and rollout/contingency planning. It emphasizes that questions must remain concrete, useful and curated rather than grow without bound. Source: https://sre.google/sre-book/reliable-product-launches/ (accessed 2026-09-06).
- Google's historical Launch Coordination Checklist explicitly includes traffic/capacity estimates, load testing, dependency failure detection, timeout/retry/error handling, backup/restore, monitoring, alerts, staged rollout, spare capacity, external dependencies and operating procedures. Source: https://sre.google/sre-book/launch-checklist/ (accessed 2026-09-06).
- AWS Operational Readiness Reviews derive checklist questions from incidents, near misses and feared failure modes and group them around architecture, release quality and event management. Source: https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html and https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/the-orr-tool.html (accessed 2026-09-06).
- AWS Operational Excellence requires identified owners, runbooks/playbooks, support plans, consistent readiness review and a process/owner for alerts. Sources: https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operational-readiness.html and https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html (accessed 2026-09-06).
- Google SRE SLO guidance keeps service objectives workload-class specific where necessary and treats alerting/monitoring as actionable evidence rather than decorative telemetry. Sources: https://sre.google/sre-book/service-level-objectives/ and https://sre.google/sre-book/service-best-practices/ (accessed 2026-09-06).

These sources support a portable elicitation principle: production readiness is a multidimensional evidence problem with explicit ownership, failure/recovery behavior and change safety, not a feature-count score.

## Candidate Operability Elicitation Lens

For every capability, workflow, integration/provider binding or operationally material resource, ask the following question families when applicable.

### 1. Service intent and success evidence

- What user/business outcome must remain true?
- How will we know it is working end-to-end, not merely process-alive?
- Which SLI/SLO/SLA applies, to which workload class, over which time window?
- Which terminal state or effect constitutes completion, and what evidence proves it?
- What can legitimately remain `UNKNOWN` or `PARTIAL`, and for how long?

### 2. Load, flow and capacity

- Expected arrival rate `lambda`, service capability `mu`, concurrency and throughput?
- Normal, peak, launch/event burst and growth assumptions?
- Queue/backlog limits, backlog-age expectations, pressure vectors and headroom?
- Which shared provider/API/storage/network quotas can bind first?
- What is sustainable capacity versus transient burst tolerance?
- Which assumptions make any Little's-Law/M/M/1-like model applicable, and where do burstiness/heavy tails/correlation invalidate it?

### 3. Timeout, retry and ambiguous effect

- What are operation deadlines/timeouts?
- Is retry safe, conditionally safe, or forbidden after `UNKNOWN` mutation outcome?
- What idempotency identity/scope/window exists?
- How are duplicate, late, out-of-order or abandoned in-flight operations detected?
- What requires reconciliation before another mutation?

### 4. Dependencies/providers/integrations

- What is the semantic source of truth versus provider/external realization?
- Required provider scope/contract/revision and unsupported-semantic behavior?
- Expected sync lag, event gap, pagination completeness and reconciliation mechanism?
- Provider outage, rate limit, token/session expiry and connector-health behavior?
- What does degraded/offline operation preserve locally?
- Who owns external drift and deprovision/revoke lag?

### 5. Observability and currentness

- Which metrics/logs/traces/events/journal evidence are required to diagnose state?
- Units, dimensions, tenant/client/site/build/deployment/provider context and sampling?
- Source timestamp, observed timestamp, freshness horizon and acceptable gap?
- How is stale-green prevented in presentation semantics?
- Can exporter/Fleet fail without blocking local execution?
- Which local evidence remains authoritative for local execution/reconciliation?

### 6. Alerting, escalation and ownership

- Who owns the resource/process/capability operationally?
- Who is on-call or responsible for action during the relevant window?
- Which condition pages now, tickets later, or is retained only for analysis?
- Does every actionable alert have an owner and a concrete investigation/recovery route?
- What is the escalation path if ownership is unavailable or contested?

### 7. Failure handling and degraded operation

- Enumerated failure modes, dependency failures and partial-effect states?
- What safe degraded modes exist and what semantics are intentionally unavailable?
- What failure may be tolerated, shed, queued, rejected, or marked `UNKNOWN`?
- Which failure may never silently fail open?
- What blast radius and tenant/client/site isolation is expected?

### 8. Recovery and reconciliation

- Recovery objective and required evidence before declaring recovery?
- Backup/restore, rebuild, replay, resync or compensation expectations?
- How are residual cohorts, stale sessions, old providers, old schemas/config or in-flight work reconciled?
- How is restore resurrection or duplicate replay detected?
- How will we validate business convergence after recovery?

### 9. Change and rollout safety

- Maintenance windows and blackout/lock conditions?
- Canary/staged rollout population and success/abort criteria?
- Compatibility matrix across build/release/deployment/provider/schema/policy revisions?
- Rollback eligibility and evidence; what state is not rolled back with code?
- What in-flight work crosses the revision boundary?
- How are mixed-version residual cohorts surfaced and retired?

### 10. Data/evidence lifecycle

- Volume, growth, retention, archival, purge and legal-hold expectations?
- Freshness, replication/sync lag, corruption/integrity detection?
- Backup/restore and migration/rebuild requirements?
- Lineage from source through derived/materialized evidence?
- Which evidence must remain available for incident/audit/reconciliation proof?

### 11. Security/privacy/trust

- Credential/session/certificate/token expiry and revocation/currentness requirements?
- Suspicious-activity/security signals and response owner?
- Telemetry minimization/redaction and access to operational evidence?
- Can monitoring reveal unnecessary personal/biometric/location/access data?
- Does cryptographic/provider validity remain separate from canonical authorization?

### 12. Cost/usage and optimization

- Which usage/cost dimensions matter operationally and which provider quotas/costs create pressure?
- What anomaly/currentness evidence is needed before economic interpretation?
- Which billable evidence exists and who owns its semantics?
- Which optimization objectives conflict with latency, resilience, privacy, locality or authority constraints?
- Any scalarization must identify policy revision, units/normalization, missingness treatment and audit trail.

### 13. Documentation and human procedures

- Which runbooks/playbooks/manual procedures are required?
- Who owns and validates them?
- Are emergency/break-glass procedures explicit and reversible/reconcilable?
- Can two human instructions issue incompatible actions or circular escalation?

### 14. Control versus observe/change authority

- Which surfaces are read/analysis only?
- Which actions, if any, are authorized operational controls and at what scope?
- Is explicit client/workspace/site/build/deployment/provider context required?
- Which approval/separation-of-duty conditions apply?
- Fleet/Observe visibility does not imply remote mutation/actuation authority.

## Production Readiness Coverage candidate

Production readiness is tracked separately from feature completeness. Candidate dimensions:

- `OBSERVABILITY`
- `OWNERSHIP`
- `FAILURE_HANDLING`
- `RECOVERY`
- `CAPACITY`
- `CURRENTNESS`
- `SECURITY`
- `RECONCILIATION`
- `CHANGE_SAFETY`
- `COST`
- `DOCUMENTATION`

Candidate per-dimension states:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`

Rules under research:

1. do not collapse these dimensions into one health/readiness scalar by default;
2. `NA` requires rationale, not absence of evidence;
3. `RESOLVED` means the elicitation obligation has sufficiently explicit semantics/evidence for the review context, not that runtime is guaranteed healthy;
4. `CONFLICTED` means incompatible answers/requirements are present; it is not itself a confirmed runtime defect;
5. `BLOCKED` identifies missing authority/evidence/dependency preventing qualification;
6. coverage should be revision-aware because a later provider/deployment/policy/schema change can invalidate earlier readiness evidence.

## Relationship to Autonomous Builds × Fleet

For an autonomous client build, readiness questions must preserve:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != Fleet aggregate != control authority`.

A minimum useful operational lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`.

Elicitation should additionally ask which dimensions are semantically comparable across builds/providers before Fleet rollup. Local runtime must continue according to its qualified contract if SB/Observe/Fleet is unavailable. Export failure is an observability gap, not a workflow blocker.

## Physical / Peripheral integration-plane qualification

For external VMS/BMS/access/PDV/biometric/device systems, the lens is bounded to integration observability/reconciliation by default. Ask about inventory/resource/user/grant mapping, sync lag, event gaps, provider API health, rate limits, connector/session/token expiry, unresolved drift and currentness. Do not infer low-level physical/media/control authority from Fleet visibility.

`external provider state != canonical authority != physical truth`.

## Adversarial candidate set

The following compositions are explicitly screened as reusable research prompts:

- functionally complete capability with no operational owner;
- integration without timeout or reconciliation semantics;
- dashboard state without source/currentness;
- retry policy without idempotency/effect qualification;
- alert without action owner;
- metric without unit/context/population;
- failure mode without recovery route;
- rollout without rollback/abort qualification;
- capacity claim without peak/burst/distribution assumptions;
- audit/compliance claim without evidence retention;
- local runtime dependent on central Fleet availability;
- external provider sync marked green despite pagination/event gaps;
- a readiness scalar hiding one `BLOCKED` safety/currentness dimension.

These candidates map to existing semantic-ownership, evidence/currentness, resource/capacity, retry/ambiguous-effect, recovery, authority, provider, temporal and analytical-kind conflict families unless later evidence proves a distinct reusable class.

## Detection candidates — research only

Potential later detection/qualification routes:

- schema/metadata presence checks for required operability questions;
- workload-class SLO/SLI qualification;
- timeout/retry/idempotency consistency checks;
- owner/on-call/escalation completeness checks;
- alert-to-owner/runbook linkage;
- queue/backlog/capacity-assumption qualification;
- source/currentness/evidence-retention qualification;
- recovery/rollback/reconciliation proof links;
- provider scope/pagination/rate-limit/degraded-mode checks;
- change-revision invalidation of stale readiness evidence;
- control-plane authority checks distinct from observability access.

All remain `DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; they are not implementation mandates.

## Planning C / D / E carry-forward

Carry forward without materializing architecture:

- operational elicitation metadata attached to capability/workflow/integration/provider contexts;
- Production Readiness Coverage separate from feature completeness;
- monitoring/currentness/evidence requirements;
- operational ownership/escalation requirements;
- failure/recovery/reconciliation semantics;
- queue/capacity assumptions and proof domains;
- change/rollback safety evidence;
- explicit observe-versus-control authority boundary;
- product proofs for failure, recovery, alerts, currentness and reconciliation;
- readiness revision/currentness semantics so stale readiness cannot be silently reused after material change.

## Research disposition

This lens is a cross-cutting research hypothesis. It creates no executable task, no product code, no Construction work, no Planning C commitment, no automatic remediation and no authority escalation.