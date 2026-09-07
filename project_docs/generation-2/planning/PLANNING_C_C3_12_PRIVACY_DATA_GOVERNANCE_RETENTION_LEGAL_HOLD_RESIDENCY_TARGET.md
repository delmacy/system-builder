# Generation 2 — Planning C C3.12: Privacy / Data Governance / Retention / Legal Hold / Residency Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: `Privacy / Data Governance / Retention / Legal Hold / Residency`  
Decision scope: canonical target architecture only. No implementation, Planning D/E execution, WBS, Work Packages, executive TASKs, Construction or product code.

Entry branch head revalidated before persistence: `533f65c1d859e24a9bcc9ceaea9732d863df9d11`.

## 1. Authorities and inherited constraints

Authoritative inputs are `RESEARCH_PIPELINE_STATE.json`, Planning C C0/C1/C2, Planning A privacy boundaries, Planning B privacy current-state reconciliation, prior C3 decisions, and the inherited adversarial inventory of **284 edge scenarios + 124 ConflictPatterns = 408 material findings**, with zero HIGH/CRITICAL lacking owner/proof/detection route.

External references are semantic challenge evidence, not implementation mandates. NIST Privacy Framework reinforces governance, identification, control, communication and protection as distinct privacy-risk activities. NIST SP 800-88 Rev. 2 reinforces that sanitization is an enterprise program with validation and provider trust concerns rather than a synonym for logical deletion. These observations support the architecture's separation between policy intent, eligibility, provider action, physical effect and evidence of closure.

Constitutional invariants:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `retention eligibility != deletion completion`;
- `deletion requested != deletion converged`;
- `provider acknowledgement != all governed copies removed`;
- `restore completed != privacy obligations satisfied`;
- `residency intent != current physical placement proof`;
- `telemetry visibility != permission to overcollect`;
- `legal hold != indefinite universal retention`;
- `Fleet aggregate != local/provider privacy truth`;
- `AI inference != purpose/retention/deletion authority`;
- Physical/Peripheral remains inside C2 integration/governance plane; no generic direct physical actuation is inferred.

## 2. Decision summary

Planning C adopts a **provider-neutral, revision-qualified Canonical Privacy & Governed Data Plane** specialized over C0 identity, revision, evidence/currentness, authority, provider-binding, federation/locality, effect and residual-cohort primitives.

The capability owns portable semantics for:

1. governed data populations and data-subject relationships;
2. purpose/use qualification and declared lawful/organizational basis references where applicable;
3. data classification/sensitivity as a governance input;
4. retention schedules and disposition eligibility;
5. legal/investigative holds and preservation precedence;
6. residency, jurisdiction and transfer constraints;
7. replica/backup/archive/export/index/cache/derived-data population lineage;
8. deletion/erasure requests, ambiguous effects, reconciliation and population-wide closure;
9. restore-resurrection prevention and post-restore requalification;
10. provider-qualified enforcement and partial/unsupported support vectors;
11. local/offline/Fleet privacy-state currentness and drift;
12. privacy-safe evidence, observability minimization and incident/audit evidence retention;
13. tenant/site isolation and cross-boundary transfer qualification;
14. reconciliation queues, backlog, capacity and escalation;
15. Brownfield/manual data-governance procedures as evidence-bearing operations;
16. capability-specific Elicitation Lens and Production Readiness Coverage.

It does not own generic storage, generic authorization, generic compliance frameworks, statutory/legal interpretation, schema evolution, generic backup orchestration, provider discovery, observability transport or physical control truth.

## 3. C3.12-DEC-001 — Governed population identity is explicit and lineage-aware

Canonical identities include at least `GovernedDataPopulationRef`, `DataSubjectRef` where applicable, `DataClassRef`, `PurposeUseRef`, `RetentionScheduleRef`, `HoldRef`, `ResidencyConstraintRef`, `DispositionRequestRef`, `DispositionOccurrenceRef`, `DispositionEvidenceRef`, `ResidualGovernedPopulationRef` and C0 provider/revision/evidence/currentness references.

A governed population may span primary data, replicas, backups, archives, exports, search indexes, caches, derived/inferred data, analytics materializations, downstream copies and external-provider realizations. Population membership is revisioned and evidence-backed; logical grouping does not imply physical co-location.

`primary row/object identity != governed population identity`.

## 4. C3.12-DEC-002 — Purpose/use qualification is explicit and current

Processing purpose and permitted use are first-class, revision-qualified semantics. A purpose/use qualification references the governed population, actors/consumers, operation class, declared basis/authority references, effective interval, jurisdiction/context and evidence/currentness.

A new use, derived-data use, model-training use, export or downstream sharing is not automatically covered by the purpose that justified collection.

AI may classify or propose purpose mappings only as `InferredCandidate`; it cannot establish purpose authority.

## 5. C3.12-DEC-003 — Retention is a schedule and eligibility model, not an auto-delete boolean

A retention schedule declares applicability, start/basis event, duration or rule, review/currentness requirements, preservation interactions, disposition route and evidence obligations.

Retention expiry means only that one retention blocker may have expired. Deletion still requires fresh qualification against holds, purpose/use, jurisdiction, authorization, recovery constraints, provider support and current population evidence.

`retention expired != delete allowed != delete executed != all copies disposed`.

## 6. C3.12-DEC-004 — Legal/investigative holds have explicit scope, authority and precedence

A hold is a scoped preservation obligation with identity, owner/authority, governed population selection, reason/reference, effective interval, supersession/release semantics and evidence.

Hold release never implies immediate destruction; it triggers fresh disposition qualification. Holds cannot silently expand to unrelated populations, purposes or indefinite universal retention.

Conflict between holds/retention/deletion/residency obligations yields explicit `DENY`, `INCONCLUSIVE`, `PARTIAL` or `CONFLICTED` semantics rather than precedence guessed from provider behavior.

## 7. C3.12-DEC-005 — Residency is a qualified support vector

Residency/jurisdiction semantics are operation- and population-specific. Qualification may vary for create, read, process, replicate, backup, restore, export, derive, index, log and delete operations.

A provider region label is realization metadata, not sufficient proof. Required support vectors may include primary placement, replicas, backup/archive placement, metadata, telemetry, derived services, transfer paths, disaster-recovery sites and provider control evidence.

`configured region != current complete placement proof`.

## 8. C3.12-DEC-006 — Provider enforcement is evidence, not canonical truth

Provider lifecycle rules, object locks, legal holds, region policies, deletion APIs and retention engines realize canonical intent behind Provider/Binding qualification.

Support is multidimensional: `SUPPORTED`, `PARTIAL`, `UNSUPPORTED`, `UNKNOWN` are preserved per semantic axis. A provider acknowledgement proves only the acknowledged operation at the provider boundary unless stronger evidence establishes wider convergence.

Provider substitution or region/service migration is a fresh qualification event and may create residual governed cohorts.

## 9. C3.12-DEC-007 — Disposition is a staged effect with population-wide closure

Portable lifecycle:

`identify population -> resolve obligations -> qualify authority/provider/currentness -> ALLOW|DENY|INCONCLUSIVE -> request disposition -> provider/local action -> observe -> reconcile ambiguous effects -> drain or disposition residual populations -> validate closure -> retain proof`.

External mutation can be `APPLIED`, `NOT_APPLIED`, `PARTIAL` or `OUTCOME_UNKNOWN`. `OUTCOME_UNKNOWN` requires observe/reconcile-before-retry unless idempotency/effect safety is qualified.

Closure requires authoritative evidence for all in-scope populations or explicit governed residual disposition. Successful primary deletion cannot hide unresolved replicas, backups, caches, exports or downstream copies.

## 10. C3.12-DEC-008 — Derived/inferred/search/index/cache data remain governed through lineage

Derived and inferred data are not automatically exempt because the original field is absent. The semantic graph preserves lineage from sources to derived populations, transformation/revision, purpose/use and downstream consumers.

Search indexes, vector stores, caches, reports, observability payloads and analytics outputs must be discoverable as governed populations when they carry governed information.

Lineage uncertainty is explicit; incomplete discovery cannot be promoted to `RESOLVED` or `N/A` without evidence.

## 11. C3.12-DEC-009 — Restore and recovery cross privacy epochs

Backup/restore may resurrect data that is no longer eligible for active processing, was previously deleted, is subject to new residency constraints, or belongs to a superseded purpose/retention regime.

Restore therefore creates a `PrivacyRecoveryCut`: restored populations are compared against current obligations before normal processing resumes. Historical backup validity does not restore historical processing authority.

`restore success != lawful/current usable state`.

Recovery workflows must identify stale/resurrected populations, reapply holds/retention/residency constraints, requalify provider bindings and schedule necessary reconciliation/disposition.

## 12. C3.12-DEC-010 — Source-of-truth and evidence currentness are concern-specific

Canonical policy intent is owner truth; external placement, retention, hold and deletion state are provider/local evidence. No single database or Fleet aggregate becomes universal truth.

Evidence carries source, observation time, producer time where relevant, applicable revision, population scope and currentness horizon. Stale or partial evidence produces `INCONCLUSIVE`, `PARTIAL` or `NON_CONFORMING`, not optimistic success.

Offline/local operation uses bounded retained closure only within declared currentness horizons. Destructive or cross-jurisdiction transitions cannot infer permission from disconnection.

## 13. C3.12-DEC-011 — Tenant/site isolation and transfer are semantic constraints

Tenant, Enterprise, Station and site boundaries qualify governed population ownership, purpose/use, authorization, provider placement and transfer. Shared physical/provider infrastructure does not imply shared governance authority.

Cross-tenant or cross-site transfer requires explicit qualification of recipient, purpose, authority, residency/jurisdiction, provider route and evidence. `visibility != transfer authority`.

## 14. C3.12-DEC-012 — Observability is privacy-qualified and minimized

Observability/Operations owns telemetry mechanics; Privacy/Data Governance owns whether governed information may be collected into telemetry, at what granularity, for what purpose, retention and access scope.

Monitoring must support degradation detection without assuming unrestricted payload capture. Logs/traces/metrics that contain governed data become governed populations with their own lineage and retention.

Incident/audit evidence may require longer preservation than ordinary telemetry, but that exception is explicit, scoped and independently authorized.

## 15. C3.12-DEC-013 — Reconciliation is queue/capacity-aware

Disposition, residency verification, downstream deletion, restore requalification and provider reconciliation are workloads with arrival rate, service rate, backlog, retry, timeout, quota and headroom concerns.

A growing privacy-reconciliation backlog is itself an operational risk and cannot be hidden behind successful request counts. Readiness therefore includes queue age, unresolved `UNKNOWN/PARTIAL`, provider quotas, escalation ownership and maximum acceptable residual exposure.

## 16. C3.12-DEC-014 — Brownfield assimilation preserves epistemic status

Brownfield discovery may ingest policies, spreadsheets, storage configs, provider consoles, data maps, scripts, tickets, interviews and operational procedures. Observed artifacts become `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `OpenQuestion`, `Conflict` or `Unknown` according to C1; they are not automatically canonical policy.

Mirroring-first discovery must search negative space: hidden exports, manual extracts, local caches, provider snapshots, shadow analytics, retired systems, removable media and undocumented retention exceptions.

## 17. C3.12-DEC-015 — Capability Elicitation Lens

The Privacy/Data Governance lens extends C1 with adaptive questions and expected evidence for:

- what data populations exist and how they are derived/replicated;
- who the subjects/owners/stewards are;
- purposes, permitted uses and prohibited secondary uses;
- source-of-truth and lineage;
- retention clocks, triggers and exceptions;
- holds, release authority and precedence;
- deletion/erasure routes and residual populations;
- residency, jurisdiction and transfer requirements by operation;
- provider controls and unsupported/partial axes;
- backups, restores and resurrection risk;
- caches/indexes/telemetry/AI-derived populations;
- offline/local/Fleet currentness;
- SLOs for deletion/reconciliation and acceptable residual windows;
- incident evidence retention;
- ownership/escalation and on-call responsibility;
- expected/peak volumes, backlog and provider quotas;
- acceptance/product-proof obligations.

Question answers are never sufficient merely because text exists. HIGH/CRITICAL gaps, contradictions, stale evidence or unresolved population ownership block the relevant sufficiency gate.

## 18. C3.12-DEC-016 — Production Readiness Coverage is separate from feature completeness

Production readiness for a governed population requires evidence for at least:

- policy/currentness and owner;
- population inventory and lineage confidence;
- provider support qualification;
- retention/hold/residency enforcement visibility;
- deletion/reconciliation workflow and `UNKNOWN` handling;
- queue/backlog/capacity headroom;
- backup/restore requalification;
- observability minimization and privacy-safe incident evidence;
- local/offline behavior;
- escalation and incident response;
- proof of residual-population closure.

A system can be feature-complete while privacy readiness remains `PARTIAL`, `BLOCKED` or `CONFLICTED`.

## 19. Boundaries with adjacent capabilities

- **Governance / Compliance / Audit:** control frameworks, assessments, waivers and audit governance; Privacy owns data-specific purpose/preservation/residency/disposition semantics.
- **Authorization:** permission to invoke an action; Privacy separately decides governed-transition eligibility.
- **Storage / Documents / Media:** storage mechanics and content realization; Privacy decides data-governance obligations and closure semantics.
- **Data / Schema / Migrations:** data shape and migration mechanics; Privacy obligations cross those revisions independently.
- **Security / Recovery:** generic recovery; Privacy requalifies restored/resurrected populations.
- **Provider / Binding:** discovery/admission/binding/cutover; Privacy supplies required support vector and privacy postconditions.
- **Observability:** telemetry mechanics; Privacy owns minimization/purpose/retention of governed telemetry populations.
- **Lifecycle / Versioning:** generic evolution; Privacy owns obligation applicability across changes.
- **C2 Physical/Peripheral:** external device/media systems remain specialized planes; privacy semantics may govern their data populations without creating generic actuation authority.

## 20. Planning D migration constraints

Planning D must preserve coexistence between free-form/current module-specific privacy notes and structured governed-population evidence. Migration must be incremental and lineage-preserving:

1. discover existing retention/privacy hooks without declaring them canonical;
2. backfill stable references where evidence exists;
3. preserve unknown/unmapped populations explicitly;
4. avoid inventing historical purpose, consent/basis, hold or location facts;
5. permit provider-native mechanisms to coexist behind qualified mappings;
6. make provenance/backfill limits visible;
7. treat restore/migration/provider cutover as requalification boundaries;
8. keep historical evidence immutable relative to its producing revisions.

## 21. Planning E proof candidates

Planning E must design proofs for at least:

- retention expiry cannot alone authorize deletion;
- active hold overrides technically valid deletion;
- hold release forces fresh qualification;
- deletion request/ACK does not equal population-wide closure;
- residual replicas/backups/indexes/exports prevent false completion;
- provider substitution/residency change forces requalification;
- restore cannot resurrect processing authority silently;
- `UNKNOWN/PARTIAL` external effects reconcile before unsafe retry;
- stale evidence blocks current compliance claims;
- cross-tenant/site transfers cannot amplify authority;
- telemetry minimization prevents observability from bypassing purpose/use;
- adaptive elicitation exposes hidden populations and critical gaps;
- Brownfield/AI inference remains candidate evidence rather than authority;
- queue/backlog pressure cannot be hidden by feature-level success;
- Fleet aggregate cannot override local/provider privacy truth.

## 22. Decision

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.** Privacy / Data Governance / Retention / Legal Hold / Residency becomes a first-class canonical semantic owner in Generation 2, implemented later through portable intent plus provider-qualified realization and evidence. The architecture preserves explicit population identity/lineage, independent obligation revisions, qualified eligibility, ambiguous-effect reconciliation, residual-population closure, restore requalification, privacy-safe observability, bounded local/offline operation, adaptive elicitation and production-readiness coverage without absorbing adjacent capabilities.

Planning C may advance only to the next capability authorized by the state machine after this decision is persisted and the state/head are re-read.