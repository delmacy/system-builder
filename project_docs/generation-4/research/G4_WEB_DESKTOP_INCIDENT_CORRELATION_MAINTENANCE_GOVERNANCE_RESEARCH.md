# G4 — Web Desktop Incident Correlation & Maintenance Governance Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Frontend Design System & UI Foundation / Web Desktop Operating Environment
Parent research: `G4_WEB_DESKTOP_OPERATIONAL_OBSERVABILITY_MULTIDISPLAY_EXTERNAL_APPS_RESEARCH.md`

## Purpose

Deepens the open operational-UX gap around incident correlation/causality and maintenance/suppression governance without turning the Web Desktop into canonical incident-management authority. This artifact is deliberately narrow and deduplicates the parent research rather than restating Extended Desktop, external-app integration or resource-lifecycle foundations.

Constitutional boundaries remain: `Builder != Runtime`; telemetry/alert/correlation projections are not canonical truth; `UNKNOWN` is representable and never permission to guess; provider ACK is not effective state.

## Evidence reviewed

Pattern evidence, not provider adoption:

- Google SRE incident-management guidance recommends timely, actionable alerting that covers user-facing functionality and generally alerts on symptoms rather than internal causes; preventive internal alerts remain justified for imminent hard failures.
- Prometheus Alertmanager explicitly separates grouping, inhibition, silencing and routing. Grouping can collapse hundreds of related alerts into one notification while retaining affected members. Inhibition suppresses notifications for target alerts while a qualifying source alert is firing; it does not prove root cause.
- Prometheus alert rules distinguish pending from firing and support `keep_firing_for`, demonstrating that temporal stabilization is different from causal inference.
- Alertmanager `group_wait` deliberately trades notification latency against collecting related/inhibiting alerts; correlation therefore has a time/evidence horizon rather than an instantaneous truth boundary.
- Datadog composite monitors combine conditions while preserving constituent monitor identities; downtimes suppress notifications while monitor state can remain alerting. No-data policy is independently configurable.
- Grafana IRM records source firing/resolve signals while a group is silenced; when silence ends it reapplies the last source signal. This reinforces `silenced != healthy` and `suppression expiry != new evidence`.
- PagerDuty Event Orchestration distinguishes suppression, grouping/deduplication and automation; its documented interactions show that orchestration rules can change whether alerts/incidents/actions are created without rewriting the underlying event semantics.

Sources:
- https://sre.google/resources/practices-and-processes/incident-management-guide/
- https://prometheus.io/docs/alerting/latest/alertmanager/
- https://prometheus.io/docs/alerting/latest/configuration/
- https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/
- https://docs.datadoghq.com/monitors/types/composite/
- https://docs.datadoghq.com/monitors/downtimes/
- https://grafana.com/docs/grafana-cloud/observe-and-act/respond-to-incidents/respond-to-alerts/
- https://support.pagerduty.com/main/docs/event-orchestration

## Correlation is not causality

The Desktop Observatory needs an explicit epistemic boundary between things that occurred together and a qualified explanation of why they occurred.

Required distinctions:

- `Temporal proximity != causation`.
- `Shared dependency != proven root cause`.
- `Alert grouping != incident identity equivalence`.
- `Inhibition != causal proof`.
- `Topology edge != failure propagation proof`.
- `Same fingerprint != same occurrence`.
- `One incident group != one root cause`.
- `Provider correlation != SB canonical causality`.
- `Operator hypothesis != verified cause`.
- `Cause identified != mitigation effective != service effective`.

Candidate `CorrelationDisposition`:

`UNRELATED | POSSIBLY_RELATED | GROUPED_BY_RULE | GROUPED_BY_FINGERPRINT | SHARED_SCOPE | SHARED_DEPENDENCY | TEMPORALLY_CORRELATED | OPERATOR_LINKED | PROVIDER_CORRELATED | EVIDENCE_SUPPORTED_CAUSAL_HYPOTHESIS | VERIFIED_CAUSAL_RELATION | CONFLICTED | UNKNOWN`.

Only the final causal dispositions may use causal language, and even `VERIFIED_CAUSAL_RELATION` must carry provenance, evidence references, scope and currentness. Most operational grouping should remain correlation.

Candidate `CorrelationEnvelope`:

`{ correlationRef, memberRefs[], scope, groupingBasis, timeWindow, topologyEvidenceRefs[], dependencyEvidenceRefs[], providerEvidenceRefs[], operatorEvidenceRefs[], confidenceDisposition, causalDisposition, createdAt, lastQualifiedAt, currentness, provenance }`.

The envelope is a projection/evidence record. It cannot silently become business truth or rewrite provider incident identity.

### Root-cause hypothesis UX

The Observatory may present ranked hypotheses only when visually and semantically distinct from verified cause. Candidate progression:

`NO_HYPOTHESIS -> HYPOTHESIS_PROPOSED -> EVIDENCE_ACCUMULATING -> SUPPORTED -> CONFLICTED -> VERIFIED_WITH_SCOPE -> SUPERSEDED`.

A hypothesis card must expose why it exists: shared dependency, temporal sequence, topology, provider inference, operator declaration or other evidence. Ranking without rationale is insufficient. AI-generated hypotheses remain assistant output, never authority.

The monitor wall should not lead with speculative root cause during an active outage. Primary attention remains user impact, evidence coverage/currentness, ownership and safe next action. Causal exploration belongs in progressive disclosure / Operations Application.

## Correlation and alert storms

Grouping is allowed to reduce attention load, but aggregation has preservation obligations. A group summary must retain or expose:

- member count and bounded drill-down;
- affected Client/Workspace/Environment/tenant scope;
- earliest/latest observed times;
- severity/urgency distribution;
- evidence-currentness distribution;
- suppression/maintenance distribution;
- unresolved/acknowledged ownership distribution;
- whether membership is complete, partial or unknown.

A new member that expands environment/tenant scope, raises severity, changes currentness confidence or violates the group's declared grouping basis is a material transition even if the group already exists.

Candidate group states: `FORMING | STABLE | EXPANDING | CONTRACTING | SPLIT_CANDIDATE | MERGE_CANDIDATE | PARTIAL | STALE | CONFLICTED | CLOSED`.

`group_wait`-like behavior is useful as a benchmark pattern, but SB must not delay a critical user-impact signal merely to obtain a prettier group. Correlation horizon and notification urgency are independent parameters.

## Maintenance, silence, inhibition and suppression governance

Maintenance is not one generic mute switch. Candidate distinctions:

- `PlannedMaintenance`: declared operational context with scope, owner, reason, start/end horizon and expected effects.
- `NotificationSilence`: suppresses selected notification delivery; does not rewrite evidence/alert state.
- `Inhibition`: suppresses a target notification because a qualifying source condition is active; does not prove the source caused the target.
- `Snooze`: user-scoped temporary attention deferral, where policy permits.
- `ProviderDowntime`: provider-native suppression/maintenance primitive with its own semantics and provenance.
- `ObservationPause`: intentionally stops collection; this reduces evidence coverage and must become explicit, never healthy-by-silence.
- `EffectFreeze`: blocks selected operational mutations; it is an authority/control-plane concern, not a notification state.

Required invariants:

- `Maintenance active != service healthy`.
- `Maintenance active != alert condition false`.
- `Silenced != acknowledged != resolved`.
- `Inhibited != irrelevant`.
- `Observation paused != no problem`.
- `Suppression expired != incident newly created`.
- `Maintenance window ended != recovery verified`.
- `Expected impact != acceptable unlimited impact`.
- `Provider downtime != SB maintenance policy equivalence`.

Candidate `MaintenanceEnvelope`:

`{ maintenanceRef, scope, owner, reason, plannedStart, plannedEnd, actualStart?, actualEnd?, expectedImpact, expectedAlertFamilies[], notificationPolicy, observationPolicy, effectPolicy?, providerRefs[], approval/provenance, currentness, revision }`.

A maintenance envelope should be visible on affected Observatory widgets and incident groups without turning the wall green. During planned impact, the visual grammar should communicate `EXPECTED_DEGRADED`, `EXPECTED_UNAVAILABLE`, `UNEXPECTED_DEVIATION`, `EVIDENCE_LOST`, or `UNKNOWN`, not simply `OK`.

### Maintenance mismatch and overrun

Maintenance requires mismatch detection:

- impact begins before planned start;
- impact exceeds expected scope;
- severity exceeds expected impact;
- maintenance ends but health/readiness/effectiveness do not recover;
- provider downtime remains active after SB maintenance expiry;
- telemetry disappears when observation was expected to remain active;
- new unrelated incident occurs inside the same time window.

These should surface as deviations, not be swallowed by the maintenance banner. A maintenance window is context, not a universal suppression authority.

Candidate lifecycle:

`DRAFT -> SCHEDULED -> ACTIVE -> ENDING -> ENDED_AWAITING_REQUALIFICATION -> VERIFIED_COMPLETE | OVERRUN | CANCELLED | UNKNOWN`.

`ENDED_AWAITING_REQUALIFICATION` is material: when the window closes, the desktop must reacquire/qualify evidence before declaring recovery.

## External-provider governance delta

External tools may expose silence/downtime/maintenance primitives, but SB should map them through a provider-neutral qualification record rather than pretending equivalence.

Candidate `ExternalOperationalControlQualification` axes:

- provider and version/API contract;
- primitive kind (`silence`, `downtime`, `maintenance`, `ack`, `resolve`, `inhibit`, other);
- target/scope semantics;
- whether alert evaluation continues;
- whether evidence collection continues;
- notification behavior;
- expiry semantics;
- cancellation semantics;
- recovery notification behavior;
- effect authority required;
- post-action verification path;
- currentness and compatibility horizon.

This is particularly important because providers differ: a Datadog downtime suppresses notifications while monitor state may remain alerting; Grafana IRM silence continues recording source signals; Prometheus inhibition depends on matching source/target alerts; PagerDuty orchestration can suppress creation/routing behavior. A single `mute()` abstraction would erase material semantics.

`Provider control accepted != control effective`; SB actions remain `SUBMITTED -> ACCEPTED? -> EFFECTIVE? -> VERIFIED?`, preserving UNKNOWN when refresh evidence is absent.

## Extended Desktop and multi-display delta

Correlation and maintenance state are Workspace-level semantic context; presentation remains per surface.

- A Monitor Wall on display B may show grouped incident summaries while display A shows diagnosis; both resolve the same `correlationRef`/`incidentRef` but keep local focus, zoom and layout.
- Closing display B does not dissolve correlation, maintenance or suppression state.
- Moving an Incident/Operations Window to another display preserves Client/Workspace/Environment/revision and correlation/maintenance context.
- A local visual filter on one display must not become a shared suppression policy.
- `Hide group on this surface != silence group`.
- If a secondary display was asleep/disconnected through maintenance expiry, its restored cards must requalify currentness and maintenance state before showing normality.

## Performance/resource delta

Correlation introduces compute pressure as well as render pressure. The candidate order is:

1. share/deduplicate qualified upstream evidence subscriptions;
2. perform bounded incremental grouping rather than recomputing all pairwise relationships;
3. bound correlation windows and retained membership summaries;
4. virtualize member drill-down and timelines;
5. coalesce low-priority presentation updates;
6. preserve critical state/currentness transitions even when rendering is throttled;
7. move expensive analysis off the UI critical path only after measurement justifies it.

Avoid an implicit `O(alerts^2)` desktop correlation loop. A stress fixture should include thousands of raw events/alerts, hundreds of active alert instances, tens of incident groups, concurrent maintenance scopes and at least one source-coverage failure. The qualification target is bounded operability and semantic preservation, not render-all.

Candidate measurements: event-to-evidence qualification latency; alert-to-group membership latency; material group-transition latency; main-thread long-task pressure; retained member memory; notification/render coalescing ratio; stale/currentness propagation latency; maintenance-expiry-to-requalification latency; group drill-down readiness.

`Background surface != background correlation authority`: browser-local analysis may assist, but durable incident/correlation identity and governance cannot depend on one tab staying alive.

## Accessibility delta

Correlation must not collapse distinct alerts into an inaccessible visual cluster. Every group exposes a textual summary, member count, affected scope, currentness, ownership and expandable member list. `Possibly related` and `Verified cause` require different text/icon semantics, not color alone.

Maintenance/suppression status is announced as context, not silence. Screen-reader users must be able to discover `maintenance active`, `notifications silenced`, `evidence stale`, `impact exceeds maintenance expectation` and `maintenance ended; revalidating` independently.

Grouping/rate-bounding applies to live announcements as well as visual notifications. Critical expansion of affected scope or loss of evidence coverage may interrupt the normal announcement budget; repeated child alerts should not.

All correlation, maintenance, silence and investigation actions remain keyboard reachable. Dragging nodes on a topology graph is never required to establish or inspect correlation.

## Componentes impact

Add/refine research records:

`CorrelationGroup`, `CorrelationDispositionBadge`, `CorrelationEvidenceInspector`, `RootCauseHypothesisCard`, `CausalQualificationBadge`, `GroupMembershipSummary`, `MaintenanceContextBanner`, `MaintenanceScopeInspector`, `MaintenanceDeviationBadge`, `SuppressionPolicyBadge`, `InhibitionIndicator`, `ObservationCoverageWarning`, `MaintenanceRequalificationBoundary`, `ExternalOperationalControlQualificationPanel`.

State matrices must cover partial/stale/conflicted evidence, group split/merge, hypothesis supersession, maintenance overrun, suppression expiry, provider UNKNOWN and reduced-motion/non-color behavior.

## Proof obligations / adversarials

1. Five hundred child alerts share a failed dependency -> group without claiming the dependency is root cause unless causal evidence qualifies it.
2. Two unrelated incidents occur in the same 60-second window -> temporal proximity alone cannot merge them irreversibly.
3. Topology says A depends on B, but A fails while B evidence is stale -> causality remains unknown/qualified.
4. Provider labels two alerts as correlated -> preserve provider provenance; do not upgrade to SB-verified cause.
5. Inhibiting source alert clears -> target notifications may resume according to policy; target evidence was never rewritten normal.
6. Planned maintenance starts -> expected degraded state is contextualized, not greened.
7. Failure exceeds maintenance scope -> deviation remains attention-worthy despite active maintenance.
8. Maintenance ends with last cached sample green -> enter requalification, not healthy.
9. Observation collection is paused during maintenance -> wall exposes evidence coverage loss.
10. Provider downtime expires while incident remains alerting -> preserve incident identity and requalify notification eligibility.
11. Provider silence API returns success but refresh is unavailable -> control state remains accepted/unknown, not effective-by-assumption.
12. One display locally hides an incident group -> other surfaces and shared semantic state remain unchanged.
13. Secondary display sleeps through suppression expiry -> restored UI requalifies before displaying current suppression/health.
14. Alert storm under memory pressure -> group/member history remains bounded while material scope/severity/currentness changes survive.
15. Screen reader receives 500 child alerts -> one qualified grouped announcement plus material deltas, with drill-down available.
16. AI proposes a root cause -> UI labels it hypothesis with rationale/evidence and never turns it into verified causality automatically.
17. Grouping algorithm changes after provider/version update -> historical group provenance remains interpretable; new algorithm does not silently rewrite old incident history.
18. Maintenance expected impact says `unavailable`, but unrelated security/currentness UNKNOWN appears -> maintenance does not suppress the independent critical uncertainty.

## Maturity and next gaps

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE`.

This closes much of the conceptual gap around correlation versus causality and maintenance/suppression semantics. The broad Web Desktop operational topology is approaching conceptual saturation, but empirical and provider-qualification work remains.

Highest-value next gaps:

1. empirical NORMAL/STRESS resource budgets for multi-window + monitor wall + incident storm + maintenance transitions;
2. formal WorkspaceSession/WindowRegistry persistence and transfer epochs;
3. semantic query/subscription deduplication under per-user disclosure and tenant isolation;
4. provider-neutral qualification fixtures for Grafana/Prometheus/PagerDuty/Datadog/Portainer-class integrations;
5. third-party embed accessibility/focus qualification;
6. historical incident/correlation evidence retention and algorithm-version provenance without making SB canonical incident-management owner.

Do not advance this slice to implementation planning until reconciled with the broader G4 frontend corpus.