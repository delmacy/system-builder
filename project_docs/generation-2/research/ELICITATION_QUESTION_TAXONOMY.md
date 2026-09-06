# Generation 2 — Elicitation Question Taxonomy

Status: `RESEARCH SUB-ARTIFACT / NOT CANONICALIZED`
Parent: `ELICITATION_SYSTEM_UNDERSTANDING_METHODOLOGY_RESEARCH.md`

## Purpose

Provide a reusable universal question compendium plus capability-specific routing semantics. This is not a static form; questions are versioned definitions selected by context/applicability and followed by adaptive probes.

Each question definition should support: stable ID/revision, purpose, applicability, concepts discovered, preconditions, follow-up rules, ambiguity signals, contradiction rules, expected evidence/currentness, unresolved severity, downstream artifacts, semantic owner and provenance.

## Universal question families

1. **Purpose/value/outcome** — Why does this exist? What outcome is valuable? What is explicitly not a goal?
2. **Actors/stakeholders** — Who initiates, performs, approves, observes, supports, audits, supplies or is affected?
3. **Authority/responsibility** — Who may decide, mutate, approve, revoke, override, delegate or break glass? Separation-of-duty?
4. **Inputs** — What enters? Required/optional? source/currentness/unit/schema/quality?
5. **Outputs/external effects** — What is produced or changed? Which effects occur outside canonical control?
6. **Source of truth/ownership** — Which system/person owns each fact, decision, identity, permission, document, price, status or resource?
7. **State/transitions** — Valid states, transitions, invariants, terminal/UNKNOWN/PARTIAL states, illegal transitions?
8. **Time** — deadlines, schedules, effective windows, time zones, ordering, lateness, freshness, SLA/SLO?
9. **Workflow/control flow** — triggers, conditions, branches, loops/bounds, waits, fan-out/fan-in, joins, cancellation, compensation, nested workflows?
10. **Decision semantics** — what choice is made, by whom/what, hit policy/default/priority/conflicts, explanation, revision?
11. **Calculation/analytics** — formulas, units, precision/rounding, deterministic vs statistical/forecast/optimization, uncertainty?
12. **Data/schema** — entities, fields, identity, cardinality, null/absent/default/delete, version/migration, lineage?
13. **Forms/UI** — user context, tasks, field semantics, validation, accessibility, visibility/authority, stale-state indication?
14. **Documents/media** — lifecycle, versions, classification, signatures, retention, storage/provider realization?
15. **Search/reporting** — query semantics, filters, aggregation, freshness, drill-down, export, privacy, comparability?
16. **Notifications/events/messaging** — event identity, recipients, delivery semantics, ordering, duplicates, retries, dead-letter/redrive, acknowledgement vs effect?
17. **Scheduling/resource allocation** — calendars, constraints, conflicts, availability, capacity, priorities, overrides?
18. **Integrations/providers** — contract/profile/version, provider capability, mapping, external IDs, source of truth, partial/UNKNOWN, reconciliation, unsupported scopes?
19. **Legacy Mirroring/Brownfield** — what exists, what is observed vs documented, exceptions/workarounds, hidden dependencies, migration intent?
20. **Physical/peripheral systems** — read/query/event/provision/broker scope, external user/resource/permission mapping, currentness, drift, explicit non-actuation boundary unless separately justified?
21. **Security/trust** — authentication, secrets, trust boundaries, abuse cases, revocation, certificate/token/session currentness?
22. **Privacy/data governance** — purpose/legal basis, minimization, sensitivity, retention/hold/residency, subject linkage, deletion/correction, derived data?
23. **Audit/provenance** — what evidence is needed, source/currentness, lineage relation kind, tamper/error detection, retention/access?
24. **Failure/recovery** — failure modes, partial effects, UNKNOWN, retry/idempotency, compensation, reconciliation, restore, residual cohorts?
25. **Offline/degraded** — what continues locally, what is unavailable, buffering, later sync/reconcile, authority during disconnection?
26. **Performance/capacity** — expected/peak load, latency, throughput, queue/backlog, concurrency, bottlenecks, quotas, headroom, overload behavior?
27. **Observability/operations** — how know it works, detect degradation, owner/on-call/escalation, alerts, evidence, currentness, incident response?
28. **Versioning/change/evolution** — revisions, compatibility, migration, in-flight work, rollout, rollback, deprecation/residual cohorts?
29. **AI/low-code** — what may be suggested/inferred/generated, authority limits, evidence requirements, non-amplification, human review?
30. **Commercial/metering** — entitlements, quotas, usage evidence, rating/pricing, bundles, billing/invoice/payment boundaries, disputes?
31. **Lifecycle** — create/adopt/activate/use/change/suspend/deprecate/archive/delete/restore/reconcile semantics?
32. **Acceptance/proof** — what executable evidence proves the requirement/outcome, including negative/adversarial cases?
33. **Negative space** — who/what/scenario is missing, what assumption is unstated, what breaks at boundaries/concurrency/version changes, what should never happen?

## Capability Elicitation Lens candidate

Each canonical capability may bind:

`universal subset + capability-specific questions + follow-up rules + expected evidence + anti-patterns + required scenarios + coverage obligations`.

The lens references cross-capability concepts rather than duplicating semantic ownership.

## Adaptive follow-up triggers

Generate follow-ups when:

- answer uses ambiguous qualifiers such as “normally”, “usually”, “as needed”, “automatic”, “real time” without bounds;
- answer conflicts with another source/artifact;
- evidence is absent/stale or comes from a dependent secondary source;
- an external effect/provider is implied;
- a mutation can become PARTIAL/UNKNOWN;
- a requirement introduces a new actor/authority/data class/provider/site/tenant/revision;
- a number lacks unit/time window/population/uncertainty semantics;
- a state transition lacks failure/recovery/rollback semantics;
- `N/A` is asserted without applicability rationale;
- AI inference is being treated as established fact;
- a brownfield behavior is being promoted to desired behavior without decision authority.

## Evidence expectations

Evidence classes may include stakeholder statement, policy/contract, observed workflow, event log, database/schema, API/connector contract, form/screenshot, report, runbook, configuration, audit trail, provider response, incident history, performance measurement, test/proof, or authoritative decision record.

Evidence must carry source, observation/effective time where relevant, revision/currentness and provenance. Repetition is not independence.

## Anti-patterns

- “answered = resolved”;
- one universal stakeholder;
- questionnaire completion percentage as sufficiency;
- AI summarization erasing dissent;
- copied legacy text treated as current fact;
- capability-specific question cloning another capability's owner;
- happy path without failure/recovery/abuse/offline/concurrency/version scenarios;
- number without unit/context;
- provider success interpreted as canonical effect;
- monitoring visibility interpreted as control authority.

## Research disposition

Retain as a versioned question-taxonomy hypothesis for later Planning C classification. No implementation or canonical-capability promotion.