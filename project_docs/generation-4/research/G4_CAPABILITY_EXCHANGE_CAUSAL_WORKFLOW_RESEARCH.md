# G4 — Capability Exchange Causality, Saga & Long-Lived Workflow Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family at the boundary between cross-capability causation, long-lived workflow/saga state, compensation, federation, in-flight migration and finite causal-history retention. This is a material subfront, not a ninth macro-family. It selects no workflow engine, broker, tracing stack or saga framework and grants no implementation authority.

Core separation:

```text
Exchange Plane owns exchange semantics
Capability/workflow owner owns business process semantics
Trace context observes execution lineage
Causation records semantic lineage
Migration changes an occurrence only under explicit proof/authority
Compaction changes retained evidence, not historical truth
```

## Evidence classes reviewed

- AWS/Azure saga and compensating-transaction guidance: orchestration/choreography trade-offs; compensation is domain-specific recovery, can fail and is not time reversal.
- W3C Trace Context / OpenTelemetry: trace/correlation context is observability context, not business causation, identity or authority proof.
- Camunda 8 process-instance migration/versioning: active instances can be mapped between definition versions, but migration has element-specific limitations and can alter future compensation subscriptions; full instance identity/history can be retained while the resulting history may become surprising. Camunda 7->8 migration further demonstrates that runtime state, history, identity/authorization and custom executable integrations are distinct migration domains rather than one atomic artifact.
- Camunda data retention: process history is a governed retention surface; newer hierarchy retention treats related process-instance hierarchies as retention units, showing that lifecycle/retention scope need not equal one technical row/instance.
- Apache Kafka log compaction: compaction preserves latest keyed state/offset ordering properties while removing older records; a compacted log is therefore not an immutable full causal history.
- GDPR Article 5 storage limitation/data minimisation: retaining every historical payload indefinitely is not a universally safe architecture assumption.
- Existing G4 temporal/federation/retention findings: timestamp order is not causal order; replay is a new context; reconnect is not convergence; backlog is not executable; auditability does not require personal data forever.

These evidence classes constrain semantics and failure cases only.

## 1. Cross-capability process ownership remains explicit

```text
Process / Saga Definition Owner
  business sequence/guards
  completion criteria
  compensation/recovery policy
  pivot/irreversibility semantics
  migration authority/policy

Capability Participant
  local transaction/effect
  local canonical state
  participant evidence

Capability Exchange Plane
  contracted crossing
  delivery/currentness/compatibility evidence
  correlation/causation propagation
  retry/dedup/reconciliation disposition
  no business-step invention
```

`Exchange routing != workflow orchestration authority`.
`Gateway sees every step != gateway owns the process`.
`Participant completed local effect != whole process completed`.
`Workflow coordinator component != Exchange Plane by definition`.

## 2. Correlation, trace lineage and business causation remain different

Candidate primitives remain deliberately separate:

```text
CorrelationRef          purpose-qualified grouping
CausationRef            semantic predecessor relation
TraceContext            observability execution lineage
WorkflowOccurrenceRef   long-lived process occurrence identity
AuthorityRef            qualified effect authority/delegation
```

`Same trace != same business transaction`.
`Trace parent != business causation proof`.
`Correlation != causation`.
`Causation != authorization`.
`Trace sampled/dropped != business lineage may be dropped`.

Business causation required for replay, compensation, audit or migration therefore needs durable semantic evidence independent of telemetry retention.

## 3. Long-lived workflow state is not a transport backlog

Candidate `WorkflowOccurrenceEnvelope`:

```text
workflowOccurrenceId
workflowDefinitionRef + revision
businessOwnerRef
initiatingIntentRef
participantRefs[]
current business phase/state
completedStepEvidence[]
pendingIntentRefs[]
causation graph/frontier refs
contract/provider qualification refs
business precondition/currentness refs
compensation/recovery policy revision
authority refs + expiry/currentness
partition/reconnect lineage refs
migration lineage/current generation
retention/reproducibility qualification
UNKNOWN/conflict refs
```

`Message delivered != workflow step effective`.
`All messages drained != workflow complete`.
`Workflow state persisted != participant effects converged`.

## 4. Compensation is a new governed business effect

```text
Compensation != rollback by definition
Compensation success != historical effect never happened
Inverse command available != semantic undo proven
Restore old snapshot != safe compensation under concurrent change
```

A compensation has its own contract revision, preconditions, authority/currentness, idempotency/dedup scope, residual consequences and result (`EFFECTIVE | REJECTED | UNKNOWN | CONFLICTED`, names research-only). It cannot inherit authority merely from the original forward action.

## 5. Pivot and irreversibility change recovery semantics

Candidate classifications remain:

```text
COMPENSABLE
RETRYABLE_FORWARD
PIVOT / COMMITMENT_POINT
IRREVERSIBLE_EXTERNAL
MANUAL_RECONCILIATION_REQUIRED
```

`Pivot passed != previous world state recoverable`.
`Forward recovery != backward recovery equivalence`.
`Compensation unavailable != process may be reported as rolled back`.

## 6. Federation can split a workflow causal frontier

A `CausalFrontier` is evidence about known effects, pending/UNKNOWN effects, intent revisions, compensation revisions, authority/contract revisions, per-source high-water evidence and missing/conflicting predecessors. It is not a global serializable transaction claim.

`Later timestamp != later causal revision`.
`Reconnect order != business order`.
`Newest intent != automatic cancellation of already-effective downstream work`.

Reconnect reconstructs and qualifies this frontier before pending effects are resumed.

## 7. Orchestration and choreography remain above the Exchange Plane

The Exchange Plane may carry interactions for an orchestrated or choreographed process, but it is neither pattern by definition. A workflow capability/provider may legitimately own business coordination; that ownership must be explicit and portable rather than hidden in gateway/broker infrastructure.

## 8. Cancellation and supersession do not create retroactive control

`Cancel requested != downstream work cancelled`.
`Intent superseded != prior effect erased`.
`Caller abandoned != participant stopped`.

A cancellation contract must represent too-late/effective, compensation-required, forward-recovery, UNKNOWN and conflicted dispositions instead of false success.

## 9. In-flight workflow migration is a semantic transformation, not version reassignment

Camunda's process-instance migration is useful failure evidence: active elements require explicit mappings; unsupported topology changes exist; and adding compensation behavior during migration does not retroactively create compensation subscriptions for already-finished activity instances. Therefore a definition that is syntactically deployable is not necessarily a valid target for an occurrence already in flight.

Candidate `WorkflowMigrationEnvelope`:

```text
workflowOccurrenceRef
sourceDefinitionRef + revision
targetDefinitionRef + revision
migrationAuthorityRef
active-state mapping
completed-effect mapping
pending-intent mapping
causal-frontier mapping
source/target participant-contract profiles
compensation/recovery mapping
pivot/irreversibility preservation
variable/data transformation refs + lossiness
identity/tenant/classification preservation
authority/currentness requalification
UNKNOWN/conflict disposition
validation/proof evidence
rollback/abort boundary
```

Research classifications:

```text
NO_MIGRATION_REQUIRED
SAFE_CONTINUE_PINNED
MIGRATABLE_EQUIVALENT
MIGRATABLE_WITH_QUALIFIED_MEDIATION
FORWARD_ONLY_MIGRATION
MANUAL_RECONCILIATION_REQUIRED
INCOMPATIBLE
UNKNOWN
```

Invariants:

- `Definition deployable != in-flight occurrence migratable`.
- `Element ID mapped != business state equivalent`.
- `Workflow identity preserved != semantics preserved`.
- `New definition has compensation != old completed effect became compensable`.
- `Migration completed technically != authority/contracts/currentness qualified`.
- `Definition revision changed != occurrence silently migrates`.
- `Old contract retired != old occurrence may fabricate new semantics`.

Migration must preserve already-effective history rather than reinterpret it as if the target definition had always governed the occurrence.

## 10. Pinning old semantics and migrating are distinct legitimate strategies

A long-lived occurrence need not always migrate. Candidate policy choices:

```text
PIN_UNTIL_TERMINAL
MIGRATE_AT_SAFE_POINT
MIGRATE_WITH_MEDIATION
FORWARD_RECOVER_TO_NEW_FLOW
TERMINATE_AND_REINITIATE_WITH_NEW_AUTHORITY
MANUAL
```

Pinning may reduce semantic migration risk but increases operational burden, security patch exposure and historical executable dependency. Migration reduces version population but can invalidate old compensation/recovery assumptions. Neither is universally safer.

`Old code retained != old authority retained`.
`Old definition retained != old provider guarantee still available`.
`Security patch urgency != permission to silently alter business semantics`.

## 11. Historical executable code is not the same thing as historical semantic evidence

Long-lived workflows create pressure to keep old worker code, adapters and compensation implementations forever. G4 rejects that as a universal requirement.

Candidate separation:

```text
HistoricalSemanticEvidence
  definition/contract identity + revision
  qualified effect outcomes
  causal relations/frontier
  compensation/recovery obligations
  migration lineage
  authority/currentness evidence as policy permits

HistoricalExecutableArtifact
  worker/runtime code
  adapter/driver binary
  old dependency graph
  provider implementation

HistoricalSensitivePayload
  variables/documents/PII/secrets/artifact bytes
```

These have different retention/security obligations.

`Explain old effect != execute old code`.
`Retain contract identity != retain executable provider forever`.
`Retain causal edge != retain sensitive payload`.

If a retired compensation contract remains an outstanding business obligation, the platform needs an explicit disposition: qualified successor/mediation, preserved bounded executor under governed support horizon, forward recovery, manual resolution, or incompatibility. It must not silently invoke current behavior under an old contract name.

## 12. Causal-history compaction requires a proof-preserving summary boundary

Kafka log compaction demonstrates a useful but limited principle: a system can preserve a current keyed state while older records disappear. That is not enough for workflow causality, because compensation, dispute resolution, duplicate detection and migration may depend on selected historical facts.

Candidate `CausalCheckpoint` / `WorkflowHistorySummary`:

```text
workflowOccurrenceRef
summaryRevision
covered causal frontier / predecessor set
completed-effect evidence refs or qualified digests
outstanding obligations
pending/UNKNOWN/conflicted intents
pivot/irreversibility facts
compensation/recovery obligations
contract/definition/migration lineage refs
retention/disposition qualifications
createdAt + authority/proof method
supersedesHistoryRange
reproducibility grade
```

A checkpoint may allow raw history before a declared frontier to expire only when future correctness no longer requires those raw records, or when policy intentionally accepts reduced reproducibility.

```text
History compacted != history never happened
Current state reconstructable != causal proof sufficient
Latest value retained != compensation evidence retained
Checkpoint created != raw history immediately erasable
Summary smaller != summary non-sensitive
```

Proof obligation: every future operation class that can legally occur after compaction—resume, retry/dedup, migrate, compensate, audit/explain, reconcile federation, erase—must declare whether the checkpoint contains sufficient evidence. If not, the operation must degrade explicitly (`EXPLAINABLE_NOT_REPLAYABLE`, `MANUAL`, `UNKNOWN`, etc.) rather than invent missing history.

## 13. Retention/erasure can intentionally reduce workflow reproducibility

Finite retention is not corruption. GDPR-style storage limitation/data minimisation and existing G4 erasure research prohibit assuming that every variable, document or identity-bearing payload can be retained for the lifetime of an arbitrarily long workflow plus audit horizon.

Candidate split:

```text
OccurrenceOperationalState   minimum state required to continue safely
CausalProofState             minimum evidence required for declared recovery/audit operations
SensitiveBusinessPayload     retained only under applicable purpose/policy
DisposableTransportHistory   broker/log mechanics not semantic truth
```

Where sensitive content expires, references may become intentionally unresolved/redacted while non-reconstructive disposition/causal evidence remains if separately authorized.

`Payload erased != completed effect erased`.
`Artifact unavailable != fabricate artifact content from current data`.
`Cannot exactly replay != cannot safely continue by definition`.
`Cannot safely continue != permission to retain prohibited payload`.

A workflow whose safe continuation truly requires data that policy requires to erase must surface a policy/business conflict and transition to a governed disposition; architecture cannot solve the conflict by hidden retention.

## 14. Definition/contract retirement needs an obligation horizon

A version can stop accepting new occurrences before every existing occurrence has terminated. Retirement therefore has at least two horizons:

```text
Admission horizon
  last point new work may bind to revision

Obligation horizon
  period/condition during which existing occurrences may still
  require interpretation, response, compensation or migration support
```

`Deprecated for new work != safe to delete for in-flight work`.
`No active happy-path step != no future compensation obligation`.
`Obligation horizon elapsed != evidence may be erased without retention-policy check`.

Candidate retirement evidence must enumerate active/pinned occurrences, outstanding compensation/recovery obligations, available successor mediation, security risk of retained executors and an explicit terminal disposition for occurrences that cannot be migrated.

## 15. Required adversarial fixtures

1. A->B succeeds; response is lost; duplicate retry must reconcile effect.
2. Partition occurs after B; A cancels while C continues from old causal branch.
3. Concurrent work makes naive inverse compensation destructive.
4. Compensation times out after effect; retry must not double-compensate.
5. Workflow crosses pivot; later failure must not be reported as rollback.
6. Authority is revoked before a sensitive downstream effect.
7. Contract revision changes while old occurrence still needs compensation.
8. Migration maps active node IDs but target changed business precondition.
9. Target definition adds compensation after source activity already completed; platform must not invent retroactive compensability.
10. Old compensation provider is removed while an in-flight occurrence remains pinned.
11. Security vulnerability requires retiring old executor before business occurrence naturally completes.
12. Raw causal history is compacted, then duplicate/retry arrives older than the retained dedup evidence.
13. History summary retains enough identifiers to defeat an erasure request.
14. Sensitive workflow variable is erased while a later step previously assumed exact replayability.
15. Migration occurs during partition; remote participant reconnects with source-definition intent.
16. Two sites independently migrate/compensate the same UNKNOWN effect.
17. History retention cleanup deletes a child/participant record still needed to explain root workflow outcome.
18. Current contract reuses old interface/schema but changed compensation guarantee; migration falsely declares compatibility.
19. Historical executable code is unavailable, but UI claims old occurrence can still be exactly replayed.
20. Archived artifact bytes are deleted but an old workflow later attempts to reconstruct them from a current projection.

## 16. Proof obligations

Before implementation planning, prove or explicitly bound:

1. workflow/saga ownership remains distinct from Exchange Plane ownership;
2. durable business causation survives telemetry loss and is not inferred from trace IDs;
3. workflow progress distinguishes transport progress from authoritative effects;
4. compensation is a new governed effect with authority/currentness/evidence;
5. pivots/irreversibility have explicit forward/compensatory/manual recovery semantics;
6. reconnect reconstructs a qualified causal frontier before pending effects resume;
7. migration maps active state, completed effects, pending intents, causality, contracts, compensation and authority—not just diagram nodes;
8. migration never retroactively changes the semantics under which historical effects occurred;
9. pinned historical definitions/contracts have explicit admission and obligation horizons;
10. retirement of an executable/provider cannot fabricate semantic equivalence through a successor;
11. causal compaction identifies which future operations remain provable from the summary and which become degraded/UNKNOWN/manual;
12. retention/erasure can reduce reproducibility without falsifying historical effect evidence;
13. raw payload, executable artifact, semantic contract identity and causal/disposition evidence have independently governed retention;
14. dedup/retry/compensation horizons remain compatible with retained evidence after compaction;
15. migration and compaction across partition/federation preserve source/target generation lineage and do not auto-execute stale work;
16. authority, tenant and classification are requalified across migration where required;
17. client runtime autonomy remains valid without Builder/central registry availability according to pinned local qualification evidence;
18. portability includes in-flight occurrence state/evidence, not only process-definition syntax.

## 17. Portability / exit path

A workflow realization is portable only if definition identity/revision, occurrence state, completed-effect evidence, causation/frontier, pending intents, compensation/recovery obligations, authority/currentness qualifiers, contract/provider qualification, UNKNOWN/conflict state, migration lineage and partition lineage can be exported or reconstructed independently of one engine/broker/tracing backend.

Portability after compaction may be intentionally weaker; its `ReproducibilityEnvelope` must state what is still reconstructable. A migration preserving only BPMN/JSON shape but losing participant effect evidence, compensation state or causal/migration lineage is not semantic portability.

`Workflow definition portable != in-flight occurrence portable`.
`History exportable != old executable semantics reproducible`.

## 18. Material delta and maturity

This round adds a **sixth deep evidence consolidation** to the eighth G4 family. Material delta:

- treats in-flight workflow migration as a separately authorized semantic transformation rather than a version reassignment;
- introduces migration proof over active state, completed effects, causal frontier, contracts, compensation and authority;
- separates pinning old semantics from migration and exposes their different risk profiles;
- separates historical semantic evidence, executable artifacts and sensitive payloads;
- introduces proof-preserving causal checkpoint/history-summary boundaries instead of assuming infinite event history;
- introduces admission horizon versus obligation horizon for definition/contract retirement;
- integrates finite retention/erasure with workflow continuation and explicitly permits qualified loss of reproducibility;
- prevents retired compensation semantics from being silently replaced by current behavior.

Family remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated. No workflow engine, migration framework, event store, broker, compaction algorithm or retention provider was selected.

Highest-value remaining gap: **empirical/properties-based migration + compaction fixtures** across local/RPC/async/federated bindings, especially migration during UNKNOWN effects/partitions and proof that a compacted checkpoint remains sufficient for retry, compensation, reconciliation and erasure without preserving forbidden payloads.

## Sources / evidence class

- Camunda 8 — Process instance migration: https://docs.camunda.io/docs/components/concepts/process-instance-migration/
- Camunda 8 — Versioning process definitions: https://docs.camunda.io/docs/components/best-practices/operations/versioning-process-definitions/
- Camunda 8 — Data Migrator / migration limitations: https://docs.camunda.io/docs/guides/migrating-from-camunda-7/migration-tooling/data-migrator/
- Camunda 8 — Data retention: https://docs.camunda.io/docs/self-managed/components/orchestration-cluster/core-settings/concepts/data-retention/
- Apache Kafka — Log compaction design: https://kafka.apache.org/41/design/design/
- EU GDPR Article 5 — data minimisation/storage limitation: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- AWS Prescriptive Guidance — Saga patterns: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html
- Azure Architecture Center — Compensating Transaction: https://learn.microsoft.com/azure/architecture/patterns/compensating-transaction
- W3C Trace Context: https://www.w3.org/TR/trace-context/
- OpenTelemetry context propagation: https://opentelemetry.io/docs/concepts/context-propagation/

These sources constrain research boundaries only and do not authorize adoption.