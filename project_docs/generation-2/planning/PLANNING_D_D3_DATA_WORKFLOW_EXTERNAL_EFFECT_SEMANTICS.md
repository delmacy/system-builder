# Generation 2 — Planning D D3 Data, Workflow and External-Effect Semantics

Status: **DECIDED / PASS FOR D3**  
Phase: `PLANNING_D_DEPENDENCY_MIGRATION_STRATEGY`  
Scope: D3 dependency/migration planning only. No D4+, Planning E, Architecture Reconciliation phase, WBS, Work Packages, executive TASKs, Construction, remediation or product code.

## 1. Authority and decision question

This record executes only the D3 action authorized by `RESEARCH_PIPELINE_STATE.json`, under the Planning D entry framework and D0/D1/D2 decisions. Planning C remains target-architecture authority; Planning B remains current-state authority. Research remains `CLOSED / SATURATED / PASS` with 408 inherited material findings (284 edge scenarios + 124 reusable `ConflictPattern`s).

Constitutional distinctions remain unchanged:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `answered != understood`;
- `stakeholder claim != canonical truth`;
- `observed behavior != intended process`;
- `event/message/delivery identity != business-effect identity`;
- `accepted != processed != converged`;
- `provider ACK != semantic effect proof`;
- `AI inference = candidate`.

D3 answers:

> In what dependency order and coexistence envelopes can Data/Schema/Migrations, Workflow/Durable Execution, Integration/Automation and Notifications/Events/Messaging evolve toward the Planning C target while preserving producing revisions, in-flight truth, effect identity, uncertainty, replay boundaries, source-of-truth movement and finite convergence?

## 2. Decision summary

D3 adopts a **revision-pinned, journal-first, effect-qualified coexistence strategy**.

The governing partial order is:

`canonical data/process/effect identity -> revision-qualified schemas/contracts -> observation and reconciliation capability -> shadow/backfill/replay preparation -> bounded dual-read/dual-write or event coexistence -> explicit source-of-truth/writer admission -> residual queue/cursor/callback/in-flight drain -> reconciliation -> closure`.

No delivery, acknowledgement, workflow completion, provider response or latest database value may silently substitute for the semantic owner’s postcondition.

## 3. D3-DEC-001 — Data identity, representation and authority remain separate

Data migration distinguishes:

- canonical entity/object identity;
- schema/model identity and immutable revision;
- logical field/property identity;
- storage/provider realization identity;
- source-of-truth writer authority;
- observed replica/cache/index state;
- historical producing revision;
- correction/supersession lineage.

Provider keys, table names, document IDs, event offsets and cache keys remain realization/correlation identifiers unless explicitly adopted as canonical identities.

## 4. D3-DEC-002 — Schema evolution is directional and revision-qualified

Compatibility is never a single boolean. Migration records must qualify at least reader/writer directions, historical populations and transformation lossiness.

A schema transition must identify:

- old and target revisions;
- old-reader/new-writer and new-reader/old-writer behavior where coexistence is intended;
- required/default/nullable/delete semantics;
- enum/domain narrowing or widening;
- unit/currency/time-zone/precision changes;
- identity and reference changes;
- privacy/classification changes;
- transformation reversibility and information loss;
- residual writers/readers pinned to older revisions.

`round-trip accepted != semantic equivalence`.

## 5. D3-DEC-003 — Backfill, CDC and dual-write are evidence-bearing migration mechanisms

Backfill, CDC, replication and dual-write do not create two canonical truths. Each mechanism must declare:

- authoritative origin at each migration state;
- cursor/high-watermark/epoch semantics;
- ordering and duplicate behavior;
- transformation revision;
- snapshot boundary;
- late-arriving and out-of-order treatment;
- deletion/tombstone semantics;
- correction handling;
- lag/currentness horizon;
- finite catch-up and drain condition.

Divergence remains visible as `PARTIAL`, `UNKNOWN` or `CONFLICTED` until dispositioned.

## 6. D3-DEC-004 — Source-of-truth movement requires explicit writer fencing

A target store or service may shadow and reconcile before it becomes authoritative. Writer movement requires an explicit disposition and a plan for old-writer fencing or bounded coexistence.

Closure cannot be claimed while unknown legacy writers, spreadsheets, scripts, imports, manual database edits, offline Stations, stale workers or external callbacks can still produce authoritative mutations outside the declared transition envelope.

## 7. D3-DEC-005 — Workflow definitions and executions preserve producing revisions

Workflow migration distinguishes definition identity/revision from execution identity/state.

Every in-flight execution must retain the producing `RevisionVector` necessary to interpret its transitions, decisions, inputs, timers, retries, compensations and external-effect references. A new workflow definition does not rewrite the semantic meaning of an execution already in progress.

Migration may use one or more explicit dispositions for in-flight work:

- remain pinned to old revision until terminal state;
- migrate through a qualified state transformation;
- quiesce and resume under target revision with explicit proof;
- abort and roll forward/reconcile where safe;
- require manual reconciliation when no sound transform exists.

`latest workflow revision != current execution semantics`.

## 8. D3-DEC-006 — ExecutionEnvelope, ExecutionState and ExecutionJournal remain distinct

D3 preserves the Planning C execution constitution:

- `ExecutionEnvelope` carries execution identity, scope and producing revision context;
- `ExecutionState` is the current qualified projection;
- `ExecutionJournal` is append-oriented evidence/history of transitions, attempts, observations and effect dispositions.

Migration must not reconstruct authoritative history solely from a mutable latest-state row when the journal/provenance is needed to prove what occurred.

Journal replay is interpretation under declared revisions, not permission to re-execute external effects.

## 9. D3-DEC-007 — Business-effect identity is independent of delivery and attempt identity

Integration/automation/messaging migration must preserve separate identities for:

- event/message occurrence;
- subscription/trigger occurrence;
- delivery attempt;
- automation/workflow invocation;
- provider request/receipt;
- canonical external/business effect;
- reconciliation occurrence.

A redelivery or replay can create a new attempt while referring to the same intended effect. Conversely, two messages with equal payload do not prove one effect identity.

## 10. D3-DEC-008 — External effects retain four-way disposition

External mutation semantics remain:

`NOT_APPLIED | APPLIED | PARTIAL | UNKNOWN`.

`UNKNOWN -> reconcile-before-retry` whenever a duplicate effect could be harmful, unless duplicate safety is independently proven for the specific operation, provider/binding, target scope and idempotency horizon.

Timeout, lost acknowledgement, provider retry, callback loss or consumer crash cannot be collapsed into failure when the remote effect may already have happened.

## 11. D3-DEC-009 — Idempotency is scoped and horizon-bound

An idempotency key or deduplication token is not a universal proof of duplicate safety.

Migration must qualify:

- semantic effect identity;
- key generation authority;
- target/provider scope;
- retention horizon;
- payload/parameter equivalence requirements;
- retry versus replay semantics;
- delete/recreate or target identity reuse;
- batch/suboperation behavior;
- behavior after provider migration.

Expired or provider-local dedup state cannot silently justify replay safety.

## 12. D3-DEC-010 — Replay and cursor semantics preserve historical truth

Event/message replay, CDC replay and workflow journal replay must preserve:

- original producing revision and source identity;
- ordering/partition/epoch context where semantically relevant;
- original occurrence time distinct from replay/processing time;
- supersession/correction lineage;
- replay purpose and scope;
- effect-suppression or effect-reconciliation policy;
- cursor/high-watermark identity and reset lineage.

Replay cannot convert stale historical input into current canonical truth merely because it is processed later.

## 13. D3-DEC-011 — Notification and messaging delivery do not prove business completion

D3 preserves:

`message accepted != delivered != observed/read != business action completed`.

Delivery receipts, provider ACKs and consumer acknowledgements are evidence for their own predicates. They do not prove downstream semantic postconditions unless an owner-qualified contract explicitly defines such equivalence for that scope.

## 14. D3-DEC-012 — Partial batch and fan-out outcomes remain visible

Batch mutations, fan-out notifications, multi-target automations and bulk data migrations must retain per-target/per-operation outcomes when partial application is possible.

A batch-level success or failure cannot hide mixed `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` subresults. Reconciliation and retry operate on the unresolved subpopulation, not blindly on the entire batch.

## 15. D3-DEC-013 — Provider/binding coexistence is qualified before effect migration

Although generalized provider substitution is elaborated in D4, D3 requires provider/binding prerequisites for any data, integration or messaging path that can affect semantics.

Before writer/effect movement, the provider realization must expose sufficient support for:

- identity and revision mapping;
- consistency/order semantics;
- timeout/ambiguity behavior;
- idempotency/dedup horizon;
- replay/cursor behavior;
- callback/subscription lifecycle;
- quota/rate/backpressure behavior;
- evidence/reconciliation capabilities;
- locality/offline behavior;
- revoke/deprovision/resource cleanup.

Feature-name or protocol equality does not prove semantic substitution.

## 16. D3-DEC-014 — Residual cohorts are first-class closure obligations

D3 residual cohorts include, where applicable:

- in-flight workflow executions;
- old-schema readers/writers;
- CDC/backfill cursors and lagging partitions;
- queued messages/events;
- retry/DLQ populations;
- scheduled timers/jobs;
- callbacks/webhooks/subscriptions;
- external automation invocations;
- provider-side pending operations;
- offline Station buffers;
- stale caches/indexers/read models;
- manual/import/shadow-system writers.

Each cohort needs population identity, producing revision, currentness objective, drain/reconciliation condition and explicit closure disposition.

## 17. D3-DEC-015 — Queue, backpressure and capacity determine convergence

Any D3 transition depending on asynchronous work must expose at least:

- arrival/admission rate assumptions;
- queue depth and oldest age;
- processing/reconciliation throughput;
- retry/replay amplification;
- provider quota/rate-limit constraints;
- partition skew/hotspots;
- blocked-owner or blocked-evidence age;
- currentness/convergence objective;
- finite drain condition.

If arrival persistently exceeds effective drain capacity, migration is not convergence-ready regardless of a nominal cutover flag.

## 18. D3-DEC-016 — Offline/Station/Fleet state preserves locality and currentness

Offline/local producers retain producing revision, local authority scope, event/effect lineage and currentness horizon.

Reconnect is a reconciliation boundary. Fleet aggregation is an observation/control-intent surface, not automatic authority over local semantic truth. Late local events cannot silently overwrite newer authoritative decisions without conflict/currentness qualification.

External effects initiated while disconnected require the same `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` discipline where their remote outcome is ambiguous.

## 19. D3-DEC-017 — Brownfield/Legacy Mirroring remains evidence-first

Legacy databases, queues, scripts, cron jobs, spreadsheets, email triggers, manual imports, verbal approvals, copy/paste procedures, shadow APIs and direct provider-console actions remain evidence/candidates until owner adoption.

Migration follows:

`discover -> source/revision -> extract -> map -> fidelity classification -> unresolved semantics -> proposal -> owner adoption -> canonical revision`.

Observed sequences or successful replay do not prove intended process, complete exception behavior or canonical authority.

## 20. D3-DEC-018 — Elicitation/System Understanding is a migration prerequisite

Capability-specific questioning for D3 must cover, when applicable:

- canonical data/process/effect owner and source-of-truth;
- all writers/readers, including manual/shadow/offline writers;
- schema history, compatibility and unknown populations;
- workflow authority, exception/compensation/recovery paths;
- timers, concurrency, duplicate/retry semantics;
- external-effect identity and reconciliation route;
- timeout/`UNKNOWN` behavior;
- idempotency scope/horizon;
- ordering/partition/cursor/replay semantics;
- deletion/tombstone/correction behavior;
- callbacks/subscriptions/provider coexistence;
- queue/backpressure/capacity/currentness;
- privacy/security/trust dependencies;
- historical and rare high-impact scenarios;
- evidence proving convergence rather than mere acceptance.

Answers preserve typed information kinds. Stakeholder disagreement remains a contradiction until dispositioned. AI-generated mappings and summaries remain `InferredCandidate` unless promoted by the proper owner/evidence route.

## 21. D3-DEC-019 — Coverage and sufficiency remain dimensional

D3 creates no aggregate completeness score. Applicable dimensions include:

- semantic owner/source-of-truth;
- schema/revision/compatibility;
- writer/read population;
- historical/in-flight treatment;
- workflow failure/recovery/compensation;
- event/message/effect identity separation;
- `PARTIAL/UNKNOWN` handling;
- idempotency/replay/cursor semantics;
- provider/binding qualification;
- residual cohorts;
- offline/local currentness;
- queue/capacity/convergence;
- evidence/provenance/currentness;
- Planning E proof route.

States remain `UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`.

HIGH/CRITICAL unresolved dimensions or contradictions without disposition prevent a D3 slice from being called complete.

## 22. D3-DEC-020 — Production Readiness Coverage remains separate

Migration-semantic completeness does not imply publish/operation readiness. Planning D records separate readiness obligations for:

- telemetry and reconciliation observability;
- queue/backlog thresholds;
- replay controls;
- operator abort/fence/manual-reconcile procedures;
- provider quotas and outage behavior;
- recovery from partial/unknown effects;
- capacity to drain residual cohorts;
- alerting on divergence/currentness debt;
- evidence retention and auditability.

These routes are carried to Planning E; D3 does not execute them.

## 23. D3-DEC-021 — Physical/Peripheral boundary remains bounded

Where events/integrations reference devices or physical/peripheral effects, D3 only carries integration/governance semantics: identity, command/effect correlation, provider/binding, safety/currentness evidence and reconciliation.

No generic direct physical actuation authority is introduced. Ambiguous physical effect remains `UNKNOWN` until domain-qualified reconciliation.

## 24. D3 dependency edges

D3 has hard incoming prerequisites from:

- D0 via `SEMANTIC_PREREQUISITE`, `REVISION_PREREQUISITE`, `EVIDENCE_PREREQUISITE` and `OPERABILITY_PREREQUISITE`;
- D1 via Elicitation Knowledge Base, typed information, contradiction/currentness and no-false-complete semantics;
- D2 via canonical identity/scope, authorization, trust/secrets/config, isolation and recovery semantics.

D3 establishes prerequisites consumed by later strata:

- D4 consumes provider-effect, residual-cohort and reconciliation requirements;
- D5 consumes revision-pinned data/workflow/effect provenance for build/deploy/lifecycle boundaries;
- D6 consumes event/data/document/observability currentness semantics;
- D7 consumes qualified source data, correction lineage, units/currentness and non-strengthening derivations;
- D8 consumes desired/observed/effective reconciliation evidence across data, workflow and external effects.

These are dependency relationships, not implementation sequencing permissions.

## 25. Planning E proof routes carried forward

D3 routes, without executing, at least the following proof obligations:

1. canonical identity survives storage/provider-key change;
2. schema compatibility is directional and revision-qualified;
3. lossy transformations remain explicit;
4. source-of-truth movement requires explicit writer fencing/admission;
5. backfill/CDC cursor and snapshot boundaries are reproducible;
6. late/out-of-order/delete/correction semantics preserve truth;
7. in-flight workflows preserve producing revisions;
8. workflow state transforms do not silently rewrite historical meaning;
9. `ExecutionJournal` preserves transition/effect lineage;
10. replay does not reapply harmful external effects without proof;
11. delivery/attempt/message IDs cannot substitute for effect identity;
12. `UNKNOWN -> reconcile-before-retry` under harmful ambiguity;
13. idempotency scope/horizon prevents false duplicate-safety claims;
14. batch/fan-out partial outcomes remain visible;
15. provider ACK cannot strengthen into business postcondition;
16. provider/binding support is qualified before effect cutover;
17. residual queues/cursors/callbacks/in-flight executions drain or receive explicit disposition;
18. queue/backpressure/capacity demonstrates finite convergence;
19. offline/local replay preserves locality/currentness/conflicts;
20. Fleet observation cannot silently become local authority;
21. Brownfield evidence cannot become canonical truth without owner adoption;
22. C1 no-false-complete blocks HIGH/CRITICAL unresolved gaps;
23. cross-artifact consistency detects story/use-case/workflow/permission/data/acceptance contradictions;
24. AI/low-code proposals cannot promote inference to requirement or authority;
25. Physical/Peripheral references cannot create generic actuation authority;
26. Production Readiness Coverage remains distinct from migration-semantic completion.

## 26. Finding disposition

This Planning D decision creates **no new research finding, no new `ConflictPattern`, no `ConflictInstance`, no preventive invariant and no remediation**. The inherited 408 adversarial findings remain active constraints/proof routes.

Material candidates encountered here duplicate-screen to existing research classes, including false completion, hidden contradiction, provenance/currentness break, happy-path-only specification, AI inference promotion and cross-capability routing gaps.

## 27. Gate result

**Result: DECIDED / PASS FOR D3.**

D3 establishes the dependency/migration strategy for Data/Schema/Migrations, Workflow/Durable Execution, Integration/Automation and Notifications/Events/Messaging. It does not claim migration execution or product proof.

Planning D remains `ACTIVE / OPEN`. The next ordered action is **D4 — Provider / Binding and bounded Physical / Peripheral Realization**. No D5+, Planning E, WBS, Work Packages, executive TASKs, Construction or product code is authorized by this record.
