# G4 — Web Desktop Concurrent Transfer & Resource Governance Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Web Desktop & Application Environment / large import-export / shared resource governance

## Purpose

Continue `G4_WEB_DESKTOP_LARGE_TRANSFER_IMPORT_EXPORT_CONTINUITY_RESEARCH.md` at its highest-value open gap: concurrent large transfers across Applications, Workspaces and Clients, shared network/CPU/memory/local-storage pressure, abandoned remote multipart state, cleanup verification, and provider replacement while resumable sessions remain in flight.

This is P&D documentation only. It selects no provider, package or implementation and materializes no WBS, Work Package, Sprint or TASK.

## Repository and adjacent-round reconciliation

The repository remains authoritative and preserves `Builder != Runtime`, runtime autonomy, replaceable suite modules, explicit contracts and no silent architecture change.

The latest adjacent Web Desktop research adds four constraints that materially affect transfer governance:

1. Application contributions may be lazily activated and resource-governed; activation urgency is not business priority.
2. Trust/proof rollover preserves immutable lineage; new trust material does not rewrite historical evidence.
3. Remediation/release from quarantine is a new evidence-bearing admission decision; healthy/ready/compliant/settled remain distinct.
4. External integrations bind qualification to a provider realization fingerprint; provider/API/configuration drift selectively invalidates guarantees.

This round therefore does **not** treat transfer scheduling, cleanup or provider failover as generic background mechanics.

## External evidence reviewed

Primary sources reviewed 2026-09-23:

- tus resumable upload protocol 1.0.x: https://tus.io/protocols/resumable-upload
- Amazon S3 multipart upload overview: https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html
- Amazon S3 AbortMultipartUpload API: https://docs.aws.amazon.com/AmazonS3/latest/API/API_AbortMultipartUpload.html
- Amazon S3 lifecycle examples for incomplete multipart uploads: https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html
- MDN Storage quotas and eviction criteria: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- RFC 6585 `429 Too Many Requests`: https://www.rfc-editor.org/rfc/rfc6585.html

Provider behavior is architectural evidence, not provider-adoption authority.

## 1. Main finding — transfer governance is a shared operational plane, not transfer ownership

Concurrent transfers need a common resource-governance foundation because Applications otherwise independently oversubscribe the same browser/network/device/provider resources. That foundation must not become owner of import/export business semantics.

```text
TransferOwner          = application/domain that owns the semantic task
TransferSession        = one resumable byte-movement occurrence
ResourceGovernor       = admits/schedules bounded execution resources
ProviderSession        = provider-specific resumable realization
SemanticAcceptance     = application/domain decision after byte completion
```

Invariants:

```text
RESOURCE_ADMISSION != BUSINESS_AUTHORIZATION
SCHEDULER_PRIORITY != BUSINESS_CRITICALITY
TRANSFER_COMPLETE != SEMANTIC_ACCEPTANCE
RESOURCE_GOVERNOR != TRANSFER_OWNER
THROTTLED != BLOCKED
QUEUED != FAILED
```

The governor may delay or shape work but cannot invent permission to upload, import, publish, overwrite, delete or abort a semantic artifact.

## 2. Resource budgets are multidimensional and hierarchically scoped

One scalar `transferConcurrency` is insufficient. Candidate budget dimensions:

```text
TransferResourceBudget {
  scopeRef                    // device, Client, Workspace, Application, provider
  networkBytesPerSecond?
  concurrentRequests?
  concurrentTransferSessions?
  memoryWorkingSetBytes?
  localStagingBytes?
  hashCpuBudget?
  parseCpuBudget?
  providerRequestRate?
  providerOutstandingBytes?
  retryAttemptBudget?
  retryByteBudget?
  retryTimeBudget?
  cleanupConcurrency?
  budgetRevision
  evidence/currentness
}
```

Scopes compose but do not collapse. A Client may have remaining quota while the device is under storage pressure; an Application may have network allowance while the provider returns rate-limit evidence.

```text
CLIENT_BUDGET_AVAILABLE != DEVICE_CAPACITY_AVAILABLE
NETWORK_CAPACITY != PROVIDER_RATE_PERMISSION
LOCAL_STORAGE_AVAILABLE != PERSISTENT_STORAGE_GUARANTEED
RETRY_BUDGET_AVAILABLE != RETRY_SEMANTICALLY_SAFE
```

## 3. Fairness requires progress guarantees without flattening urgency

Strict foreground priority can starve recovery/cleanup/background transfers forever. Equal round-robin can make an active user wait behind large speculative/background work. The candidate model therefore separates urgency from fairness.

Candidate scheduling classes:

```text
INTERACTION_BLOCKING
FOREGROUND_VISIBLE
RECOVERY_REQUIRED
BACKGROUND_REQUIRED
SPECULATIVE
CLEANUP_SAFETY
```

`CLEANUP_SAFETY` is not necessarily highest throughput priority, but must have bounded progress because abandoned provider resources can consume cost/quota and block lifecycle operations.

Candidate scheduling properties:

- bounded global and per-provider concurrency;
- weighted/deficit fairness or equivalent progress-preserving policy;
- aging for non-speculative queued work;
- cancellation of obsolete speculative work;
- separate budgets for retry traffic so failure amplification cannot consume all useful capacity;
- explicit backpressure propagated to producers/parsers/staging rather than buffering without bound;
- interactive boost that expires instead of becoming permanent ownership of capacity.

```text
FOREGROUND != UNBOUNDED
BACKGROUND != STARVABLE
CLEANUP != BEST_EFFORT_FOREVER
RETRY != FREE CAPACITY
```

No concrete scheduling algorithm is selected by this research.

## 4. Provider backpressure is evidence, not business semantics

HTTP `429 Too Many Requests` may include `Retry-After`, but the HTTP specification intentionally does not define how the server identifies/counts the subject being limited. A provider throttle therefore cannot be blindly interpreted as Client quota, user quota or semantic denial.

Candidate provider-pressure claim:

```text
ProviderPressureEvidence {
  providerRef
  providerRealizationFingerprint
  observedStatus
  retryAfter?
  inferredScope = REQUEST | SESSION | PRINCIPAL | TENANT | ENDPOINT | UNKNOWN
  evidenceConfidence
  observedAt
  currentnessHorizon
}
```

```text
429 != PERMISSION_DENIED
429 != CLIENT_QUOTA_EXHAUSTED
RETRY_AFTER != BUSINESS_DEADLINE
PROVIDER_THROTTLE != TRANSFER_FAILURE
```

The scheduler may use this evidence to reduce pressure, but cannot relabel it into a stronger semantic claim.

## 5. Abandoned transfer state is a lifecycle obligation

S3 multipart uploads demonstrate why cleanup cannot be merely cosmetic: uploaded parts remain stored and billable until completion or abort. Lifecycle rules can abort incomplete uploads after a configured age.

A transfer that loses its UI owner can therefore leave a real remote obligation.

Candidate lifecycle:

```text
ACTIVE
 -> PAUSED_RESUMABLE
 -> OWNER_DISCONNECTED
 -> ABANDONMENT_SUSPECTED
 -> CLEANUP_ELIGIBILITY_EVALUATING
 -> CLEANUP_AUTHORIZED
 -> ABORT_SUBMITTED
 -> CLEANUP_VERIFYING
 -> CLEANED
      | PARTIALLY_CLEANED
      | STILL_PRESENT
      | UNKNOWN
      | MANUAL_RECONCILIATION_REQUIRED
```

`Window closed`, `Workspace closed`, logout, device loss and application unload are signals; none is by itself authority to destroy remote state.

```text
WINDOW_CLOSED != ABORT_AUTHORIZED
OWNER_OFFLINE != SESSION_ABANDONED
SESSION_EXPIRED != REMOTE_BYTES_PROVEN_REMOVED
ABORT_ACK != CLEANUP_PROVED
```

## 6. Cleanup itself has effect semantics and may require repetition/verification

Amazon S3 documents an important adversarial behavior: after `AbortMultipartUpload`, part uploads that were already in progress may still succeed; the API documentation states that abort may need to be repeated and recommends listing parts to verify that storage has actually been freed.

This is strong evidence for a general invariant:

```text
CLEANUP_REQUESTED != CLEANUP_ACKNOWLEDGED != CLEANUP_EFFECTIVE
```

Candidate `CleanupEvidence`:

```text
CleanupEvidence {
  transferSessionRef
  providerSessionRef
  providerRealizationFingerprint
  cleanupOperationRef
  authorityRef
  submittedAt
  ackEvidenceRef?
  residualEnumerationEvidenceRef?
  residualBytesOrParts?
  verificationHorizon
  disposition = CLEAN | RESIDUAL_PRESENT | PARTIAL | UNKNOWN | STALE
}
```

Provider lifecycle auto-cleanup is useful defense in depth, but `lifecycle rule configured != this orphan already removed`.

## 7. Orphan ownership must survive UI/session loss

Remote transfer sessions need durable owner lineage independent of a particular WindowSession or browser surface.

Candidate ownership record:

```text
TransferOwnershipEnvelope {
  transferSessionRef
  semanticTaskRef
  clientRef
  workspaceRef
  applicationRef
  initiatingPrincipalRef
  authorityRevisionRef
  providerSessionRef
  sourceSnapshotRef?
  destinationIntentRef
  createdAt
  lastQualifiedActivityAt
  resumabilityHorizon?
  cleanupPolicyRef
  cleanupAuthorityRef
  retention/legalHoldRef?
  disposition
}
```

A new device/window may adopt responsibility for observation/reconciliation without automatically inheriting mutation/abort authority.

```text
OBSERVATION_ADOPTION != MUTATION_ADOPTION
TRANSFER_VISIBLE != TRANSFER_OWNED
SAME_USER != SAME_AUTHORITY_REVISION
```

## 8. Logout/device loss creates a policy decision, not a universal abort rule

Three legitimate classes exist:

1. **continue remotely** — provider can safely finish without browser residency and current authority permits it;
2. **pause/retain resumable state** — continuity horizon and storage/cost policy permit later resume;
3. **cleanup required** — security, privacy, cost, quota or semantic policy requires termination.

The class belongs to the transfer/task contract. A global `abort on logout` is unsafe for expensive legitimate work; global `keep forever` leaks resources and possibly sensitive data.

Candidate disposition:

```text
CONTINUE_REMOTE
PAUSE_WITH_EXPIRY
REQUIRE_REAUTH_TO_RESUME
REQUIRE_CLEANUP
LEGAL_RETENTION_BLOCKS_CLEANUP
UNKNOWN_RECONCILIATION_REQUIRED
```

## 9. Local staging competes with every other application in the same origin/device

Browser storage pressure is shared operational reality. Best-effort origin data may be evicted under storage pressure; persistence improves resistance but does not create infinite capacity.

Therefore local staging admission must account for shared usage rather than each Application independently comparing file size to an optimistic quota estimate.

Candidate local pressure states:

```text
NORMAL
PRESSURE_RISING
ADMISSION_RESTRICTED
EVICTION_RISK
PERSISTENCE_UNAVAILABLE
QUOTA_EXCEEDED
UNKNOWN
```

The governor may refuse new staging while allowing already-effective remote uploads to drain. Conversely, remote provider pressure may pause network transfer while local parsing/hashing is also throttled to avoid unbounded staged backlog.

```text
CAN_STAGE != SHOULD_PREFETCH
PERSISTENT_GRANTED != SPACE_RESERVED
QUOTA_ESTIMATE != RESERVATION
LOCAL_EVICTION != REMOTE_TRANSFER_ABORT
```

## 10. Provider replacement during in-flight sessions is a transfer migration, not adapter substitution

A resumable session is pinned to provider-specific state such as upload URL/ID, accepted offset or part set, expiry, integrity profile and authorization context. Replacing the provider adapter cannot make that session portable by declaration.

Candidate provider handoff dispositions:

```text
CONTINUE_ON_OLD_PROVIDER_UNTIL_SETTLED
PAUSE_AND_REQUALIFY_OLD_SESSION
RESTART_ON_NEW_PROVIDER_FROM_SOURCE
MIGRATE_VIA_QUALIFIED_SERVER_SIDE_COPY
DUAL_SESSION_RECONCILIATION_REQUIRED
BLOCKED_SOURCE_UNAVAILABLE
UNKNOWN
```

A new provider session normally creates a new `TransferSession` attempt or child realization linked to the same semantic transfer intent; it does not reuse the old provider-session identity.

```text
SAME_SEMANTIC_ARTIFACT != SAME_PROVIDER_SESSION
ADAPTER_REPLACED != RESUME_PORTABLE
OFFSET_70_ON_A != OFFSET_70_ON_B
SAME_BYTES != SAME_ACCEPTANCE_EVIDENCE
```

Provider qualification invalidation from the latest :40 research applies selectively: if an upgrade changes resumability, authorization, checksum, finalization or cleanup semantics, the affected in-flight guarantees must be requalified. Unaffected historical byte-acceptance evidence is not rewritten.

## 11. Minority-critical aggregation: one orphan or unknown cleanup cannot disappear in totals

Large installations may show thousands of healthy/completed transfers and a handful of dangerous or costly outliers. Aggregate UX must preserve minority-critical states.

Candidate summary dimensions:

```text
activeCount
queuedCount
throttledCount
pausedCount
orphanSuspectedCount
cleanupUnknownCount
cleanupResidualCount
providerMigrationCount
bytesInFlight
stagedBytes
retryBytes
oldestUnreconciledAge
```

A headline such as `99.9% completed` must not suppress `1 orphan with UNKNOWN cleanup` or `1 transfer holding mutation-sensitive provider state`.

```text
AGGREGATION != SILENT OMISSION
MAJORITY_SUCCESS != MINORITY_CRITICAL_SAFE
ZERO_VISIBLE_WINDOWS != ZERO_REMOTE_OBLIGATIONS
```

This aligns with Observatory semantics: monitoring projects qualified evidence; it does not own transfer truth.

## 12. Application Portfolio Matrix delta

The seven integration modes remain valid: `Native SB`, `API-backed`, `Hybrid`, `Embedded`, `Proxied`, `Deep-link`, `Native bridge`. This round adds the following evaluation dimensions for transfer-heavy tasks:

| Criterion | Question |
| --- | --- |
| Resource-governance visibility | Can SB observe/admit/throttle the relevant resource consumption? |
| Backpressure fidelity | Can provider/device pressure be represented without inventing business semantics? |
| Resume-provider coupling | How strongly is resumability bound to provider-local session identity? |
| Cleanup authority | Who may terminate remote/local partial state? |
| Cleanup verification | Can effective removal be verified independently of request ACK? |
| Orphan discoverability | Can abandoned sessions be enumerated/reconciled? |
| Cost/quota exposure | Can incomplete work consume billable/quota resources? |
| Cross-device ownership continuity | Can responsibility move without fabricating authority? |
| Provider-migration behavior | Continue old, restart, copy, or become unknown? |
| Shared-budget participation | Can the mode cooperate with device/Client/Workspace/Application budgets? |
| Telemetry disclosure | Can scheduling/cleanup be observed without leaking local filenames/content/tokens? |
| Lifecycle replaceability | Can the integration be replaced without stranding opaque partial state? |

Implications:

- **Native SB** offers the strongest opportunity for shared budget participation but still cannot bypass browser/provider limits.
- **API-backed** is preferred when the external system exposes explicit session, quota, cleanup and currentness APIs.
- **Hybrid** is often strongest for mature storage/data systems: SB owns semantic intent/governance while provider-native machinery performs transfer.
- **Embedded** may expose UX without sufficient session/cleanup authority; framing does not grant transfer governance.
- **Proxied** can centralize transport pressure but increases responsibility for streaming, buffering, cancellation and credential boundaries.
- **Deep-link** is weak for shared transfer governance unless the external system exposes independent observation/reconciliation APIs.
- **Native bridge** may be necessary for device-local high-throughput paths, but device loss and bridge versioning become first-class failure modes.

No mode is globally preferred.

## 13. Desktop/Application synthesis

This research does not change the current hierarchy:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

Transfer governance remains below Application UX and above provider-specific transport realizations.

Desktop taxonomy remains job-oriented. Transfer surfaces can appear differently without becoming duplicate authority:

- Design/Data sphere: import/export task progress and semantic acceptance;
- Operations Desktop: authorized operational transfer actions and reconciliation;
- Desktop Observatory: fleet-wide evidence/pressure/orphan posture;
- Pinned Monitoring Surface: compact read-only transfer indicators;
- Control Center: policy/budget/provenance configuration;
- Application Manager: lifecycle/qualification of applications that provide transfer capabilities.

`Desktop widget != transfer manager` and `Observatory != Operations Desktop` remain intact.

## 14. Componentization complexity map delta

This extends, rather than replaces, the existing `primitive/atomic -> compound -> module component -> tool -> workspace -> complete task page -> system view` decomposition.

### C0/C1 — primitive / atomic

Shared candidates:

- `TransferSessionRef`
- `TransferOwnershipRef`
- `ResourceBudgetRef`
- `ProviderPressureClaimRef`
- `CleanupEvidenceRef`
- `OrphanDispositionRef`
- `TransferUrgencyRef`
- `TransferCurrentnessRef`
- `ProviderSessionRef`
- `ResidualResourceClaimRef`

Obligations: identity stability, explicit UNKNOWN/STALE/PARTIAL, no business authority in visual tokens, keyboard/screen-reader labels for state.

### C2 — compound

Shared candidates:

- `TransferProgressIndicator`
- `BackpressureIndicator`
- `BudgetUsageIndicator`
- `OrphanWarningCard`
- `CleanupVerificationCard`
- `ResumeDispositionCard`
- `ProviderMigrationTransferCard`
- `ResourcePressureSummary`

Obligations: aggregation cannot hide critical minorities; compact mode preserves state distinctions; no color-only status.

### C3 — module component / reusable foundation

High-reuse foundations:

- `TransferResourceGovernorBoundary`
- `HierarchicalBudgetResolverBoundary`
- `TransferFairnessSchedulerBoundary`
- `ProviderBackpressureAdapterBoundary`
- `TransferOwnershipRegistryBoundary`
- `OrphanReconciliationBoundary`
- `CleanupQualificationBoundary`
- `CleanupVerificationBoundary`
- `TransferProviderMigrationBoundary`
- `TransferTelemetryDisclosureBoundary`

These reduce repeated mechanics across proprietary applications while leaving semantic import/export ownership application-local.

### C4 — tool

- transfer queue inspector;
- orphan/reconciliation inspector;
- resource-budget inspector;
- cleanup/effect inspector;
- provider-session migration inspector.

### C5 — workspace / application

Application-specific behavior remains necessary for:

- source/destination semantics;
- duplicate/conflict policy;
- parsing/transformation;
- semantic validation/acceptance;
- authorization to overwrite/publish/import;
- domain-specific rollback/compensation;
- retention/legal-hold rules.

### C6 — complete task page

Examples: `Import dataset`, `Export release artifact`, `Migrate large media`, `Recover abandoned transfer`, `Reconcile provider replacement`.

### C7 — system view

Cross-Client transfer pressure, orphan posture, provider migration impact and resource/cost evidence are projections. They do not become canonical transfer authority.

## 15. Accessibility and small-screen equivalence

Resource governance cannot depend on dense desktop-only queue tables or drag ordering.

Equivalent paths require:

- list/table queue view with semantic ordering controls;
- explicit pause/resume/cancel/cleanup commands where authorized;
- textual reasons for throttling/backpressure;
- focus restoration by transfer identity after list virtualization/update;
- non-color distinction for `THROTTLED`, `PAUSED`, `BLOCKED`, `UNKNOWN`, `CLEANUP_REQUIRED`;
- progress semantics that distinguish byte progress from semantic completion;
- small-screen drill-down preserving orphan/cleanup criticality;
- no requirement to keep a foreground window open merely to preserve remote transfer correctness.

## 16. Performance/resource-budget research implications

This round advances resource-budget maturity but does not freeze numeric thresholds.

Required future measurements include:

- aggregate throughput versus concurrency by provider/network class;
- main-thread time for hashing/progress/UI updates;
- worker CPU saturation and thermal/battery effects where measurable;
- memory working set per active transfer/chunk strategy;
- local staging write amplification;
- queue latency by urgency class;
- fairness/starvation metrics;
- retry amplification ratio;
- orphan discovery/cleanup latency;
- telemetry cardinality from high transfer counts;
- effect of virtualization/aggregation on interaction latency.

The scheduler must consume measured budgets, not infer semantic priority from raw file size or UI focus alone.

## 17. Adversarial proof matrix

| Scenario | Required safe disposition |
| --- | --- |
| Ten background 20-GB uploads start before a 5-MB foreground import | foreground may be boosted; background retains bounded progress |
| One Application opens hundreds of parallel chunks | global/per-app budget applies backpressure; no unbounded buffering |
| Provider returns 429 with Retry-After | throttle qualified scope; do not relabel permission/business failure |
| Retry storm after network flap | retry budget contains amplification; useful traffic retains capacity |
| User closes the transfer Window | remote session remains governed by durable ownership; no implicit abort |
| Browser crashes after multipart parts accepted | orphan discovery/reconciliation can recover remote obligation |
| Logout occurs during upload | contract chooses continue/pause/cleanup; no universal hidden rule |
| Device disappears permanently | remote state becomes reconcilable orphan, not automatically clean |
| Abort returns success while a part was concurrently uploading | cleanup remains VERIFYING until residual evidence qualifies removal |
| Lifecycle cleanup rule exists | do not mark current session CLEAN before evidence/currentness supports it |
| OPFS staging approaches quota | restrict new staging; preserve explicit state for admitted work |
| Best-effort staging is evicted | local source/staging loss does not fabricate remote failure or completion |
| Client A consumes provider rate budget | scope evidence before throttling unrelated Client B |
| Same user opens two Workspaces | budgets may share device/provider ceilings but semantic ownership remains separate |
| App A has high UI urgency but no business authorization | scheduler may load/transfer only after semantic admission; urgency grants no authority |
| Cleanup queue starves behind foreground work | safety cleanup receives bounded progress |
| Provider adapter upgrades mid-transfer | selectively invalidate affected resume/finalize/cleanup guarantees |
| Old provider session remains valid after provider replacement | continue/reconcile explicitly; do not silently transplant to new provider |
| New provider reports same accepted byte count | byte count equality does not prove same source/session/integrity |
| Source file is unavailable after provider migration | restart may be BLOCKED while old session remains observable/reconcilable |
| 9,999 transfers healthy, one orphan cleanup UNKNOWN | aggregate preserves minority-critical UNKNOWN |
| Transfer reaches 100% bytes but import parser rejects artifact | byte completion remains distinct from semantic acceptance |
| Cleanup principal loses authority after orphan detection | observation remains; destructive cleanup is BLOCKED/AUTHORITY_MISSING |
| Legal hold conflicts with generic orphan TTL | retention authority wins for protected state; generic cleanup cannot erase it |
| Telemetry label would include filename/path/upload token | disclosure boundary suppresses/redacts; governance metrics remain useful |
| Small screen hides detailed queue | critical orphan/unknown states remain discoverable and operable through equivalent path |

## 18. Proof obligations

Future implementation planning must be able to prove at least:

1. resource scheduling cannot mint business/domain authority;
2. per-scope budgets compose without silently merging Client/Workspace ownership;
3. non-speculative queued work has bounded progress under sustained load or explicitly declares overload;
4. retries cannot silently exceed end-to-end attempt/byte/time budgets;
5. provider backpressure remains evidence with explicit scope/currentness;
6. remote transfer ownership survives Window/surface/browser lifecycle loss;
7. logout/device loss follows declared transfer policy rather than a hidden global default;
8. cleanup has independent request/ACK/effect verification states;
9. abort success cannot suppress residual in-flight/provider state evidence;
10. lifecycle/TTL cleanup is not treated as proof of immediate deletion;
11. local staging admission accounts for quota/pressure and does not assume persistence equals reservation;
12. provider replacement cannot fabricate resumable-session portability;
13. provider upgrade selectively invalidates resume/finalize/cleanup guarantees by proof dependency;
14. aggregation preserves orphan, cleanup-unknown, migration-unknown and other minority-critical states;
15. byte completion cannot be displayed as semantic import/export completion;
16. telemetry/resource metrics do not require sensitive filename/path/content/token disclosure;
17. keyboard/screen-reader/small-screen flows can inspect and reconcile critical transfer states;
18. Application-specific semantic acceptance, overwrite/publish authority and compensation remain outside the generic resource governor.

## 19. Contradictions and trade-offs retained

### Aggressive parallelism versus bounded shared resources

Parallel chunking can improve throughput, but unbounded concurrency increases memory, request pressure, retry amplification and interference. Resolution: provider/device-qualified concurrency with measured budgets, not one fixed global number.

### Foreground responsiveness versus background completion

Strict foreground priority improves perceived latency but can strand recovery and cleanup. Resolution: urgency plus fairness/aging, with cleanup progress protected.

### Automatic orphan cleanup versus resumability/recovery

Short TTLs reduce cost/privacy exposure but can destroy legitimate resume opportunities. Long TTLs improve recovery but retain cost/sensitive state. Resolution: task/provider-specific retention and cleanup policy with visible expiry/currentness.

### Central governor versus autonomous applications

A shared governor reduces resource contention but risks becoming accidental workflow authority. Resolution: governor owns resource admission/scheduling only; Applications own semantic tasks and effect authority.

### Provider lifecycle automation versus evidence

Automatic cleanup is valuable defense in depth, but configuration presence cannot prove effect completion. Resolution: distinguish cleanup policy from observed/effective cleanup evidence.

## 20. Saturation assessment

- Web Desktop hierarchy / Desktop Sphere separation: **high conceptual maturity**.
- Window/session identity and same-device lifecycle: **high**.
- Application Portfolio integration taxonomy: **medium-high**.
- Application Manager / external qualification lifecycle: **medium-high**.
- Control Center provenance / declarative deployment / auto-binding: **medium-high**.
- Proprietary editor shared foundation / semantic bridge: **medium-high**.
- Large transfer identity/resume/integrity: **high conceptual maturity**.
- Concurrent transfer resource governance: **medium-high conceptual maturity after this round**.
- Orphan ownership/cleanup verification: **medium-high**, provider diversity still needs evidence.
- Provider migration with in-flight transfer sessions: **medium**, material gap remains.
- Accessibility/small-screen equivalence: **medium-high contractually**.
- Performance/resource budgets: **medium**; empirical thresholds remain intentionally open.

Research remains active. Material gaps remain.

## 21. Next high-value vector

The next deep-gap should study **transfer finalization/semantic-acceptance races under duplicate destinations and concurrent writers**:

- two resumable sessions targeting one logical destination;
- conditional create/overwrite and compare-and-swap style destination guards;
- finalization ACK loss followed by retry;
- provider object exists but semantic import transaction failed;
- destination versioning versus overwrite semantics;
- stale destination preconditions;
- cross-provider copy/migration while a destination mutates;
- cleanup of superseded but successfully finalized objects;
- effect identity, idempotency and compensation without pretending byte storage is a domain transaction.

This can still change contracts, state machines, Application Portfolio criteria and future component boundaries, so no research-complete claim is justified.