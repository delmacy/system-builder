# Generation 2 — Planning D D0 Migration Constitution / Cross-Cutting Dependency Graph

Status: **DECIDED / PASS FOR D0**  
Phase: `PLANNING_D_DEPENDENCY_MIGRATION_STRATEGY`  
Scope: D0 dependency/migration constitution only. No capability-specific D1+ migration records, Planning E, Architecture Reconciliation phase, WBS, Work Packages, executive TASKs, Construction, remediation or product code.

## 1. Authority and scope

This artifact executes only the `next_action` authorized by `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`: materialize the authoritative D0 migration constitution and cross-cutting dependency/migration matrix for the 28 canonical Generation 2 capabilities plus C0/C1/C2 cross-cutting concerns.

Inherited constraints remain unchanged:

- Research is `CLOSED / SATURATED / PASS` with 8 full adversarial passes, 28/28 canonical capabilities, 12/12 mandatory clusters and 408 material adversarial findings (284 edge scenarios + 124 reusable `ConflictPattern`s).
- `Research != remediation`.
- `ConflictPattern != ConflictInstance`.
- `Signal != ConfirmedConflict`.
- Planning C is `CLOSED / PASS` and remains target architecture authority.
- Planning B remains current repository-state authority.
- D0 does not claim that any migration has been executed.

The D0 question is:

> What cross-cutting prerequisite graph and migration constitution must every later Planning D capability record obey so that the SB can move from current state toward the Planning C target without big-bang source-of-truth replacement, history loss, authority amplification, hidden residual cohorts or false operational completeness?

## 2. Migration constitution

### 2.1 Migration slices

A migration slice is a governed semantic transition, not merely a package/table/service change. Every D1+ slice MUST declare:

1. semantic owner and predicate(s) being introduced, generalized, translated or transferred;
2. current source(s) of truth and target source of truth;
3. current and target immutable revisions and relevant `RevisionVector` dimensions;
4. authoritative writers, readers, external effectors and evidence producers;
5. provider/binding realizations and support-vector requirements;
6. historical populations that must remain interpretable under producing revisions;
7. in-flight work pinned to older revisions;
8. residual cohorts capable of producing effects after nominal cutover;
9. queues/backlogs/reconciliation populations and drain conditions;
10. rollback/abort/roll-forward/manual-reconciliation semantics;
11. C1 elicitation/evidence gaps and contradiction gates;
12. operability/Production Readiness Coverage prerequisites;
13. Planning E proof obligations required before closure.

### 2.2 Typed dependency edges

The authoritative D0 edge vocabulary is:

- `SEMANTIC_PREREQUISITE`
- `AUTHORITY_PREREQUISITE`
- `REVISION_PREREQUISITE`
- `EVIDENCE_PREREQUISITE`
- `PROVIDER_PREREQUISITE`
- `DATA_PREREQUISITE`
- `OPERABILITY_PREREQUISITE`
- `TRUST_PREREQUISITE`
- `LOCALITY_PREREQUISITE`

An edge means **a later migration transition is invalid until the predecessor condition is qualified**. It is not an implementation ordering by itself and does not authorize construction.

### 2.3 Planning-level migration state machine

Canonical planning states:

`DISCOVERED -> QUALIFIED -> COEXISTENCE_READY -> SHADOWING -> PARTIAL_CUTOVER -> CUTOVER -> RESIDUAL_DRAIN -> RECONCILED -> CLOSED`

Exceptional states/dispositions:

`BLOCKED | CONFLICTED | ABORTED | ROLLED_FORWARD | ROLLED_BACK_WHERE_REVERSIBLE | MANUAL_RECONCILIATION_REQUIRED`.

`PARTIAL`, `UNKNOWN`, contradictory evidence and residual populations may not be silently normalized away.

### 2.4 Source-of-truth movement protocol

Every ownership-changing migration MUST use:

`identify current authority -> establish target semantic/revision identity -> shadow/compare -> qualify lossiness/divergence/UNKNOWN -> admit target writer -> fence or explicitly coexist with old writer -> explicit authority transfer -> residual drain -> reconcile currentness/convergence -> closure disposition`.

Dual write is therefore an explicitly bounded coexistence mechanism. It is never interpreted as two canonical truths by default.

### 2.5 External-effect rule

For remote/provider/physical or otherwise harmful ambiguous mutation:

`APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN`

and, unless duplicate safety is independently proven for that operation:

`UNKNOWN -> reconcile-before-retry`.

### 2.6 Revision/history rule

Migration never rewrites historical producing truth. Old revisions may stop being current but remain valid historical referents for replay, audit, in-flight execution, prior evidence and residual-cohort interpretation.

### 2.7 Local / Station / Fleet rule

`Fleet observation != local runtime truth != control authority`.

Offline/local populations MUST retain producing revision/currentness metadata. Reconnect is a reconciliation boundary. Local autonomy cannot create additional authority merely because central dependencies are unavailable.

### 2.8 Physical / Peripheral rule

C2 remains authoritative. Planning D may migrate device/provider identity, topology, permissions, telemetry, command/effect correlation, lifecycle, currentness and reconciliation in the **integration/governance plane only**. D0 creates no generic direct physical actuation capability.

## 3. Cross-cutting constitutional prerequisites

The following rows are mandatory dependencies for later capability-specific D1+ records.

| Cross-cutting concern | Required D0 dependency | Migration consequence | Planning E proof route |
|---|---|---|---|
| **C0 Semantic substrate** | `SEMANTIC_PREREQUISITE`, `REVISION_PREREQUISITE` | owner-qualified identities, immutable revisions, typed references and relation semantics must exist before semantic ownership can move | prove owner/reference preservation and no semantic god-object |
| **C1 Elicitation/System Understanding** | `EVIDENCE_PREREQUISITE`, `AUTHORITY_PREREQUISITE` | unresolved facts/claims/assumptions/conflicts/unknowns cannot be normalized into migration certainty; no false-complete state | prove provenance, contradiction preservation, capability-specific coverage and blocker propagation |
| **C2 Physical/Peripheral boundary** | `AUTHORITY_PREREQUISITE`, `TRUST_PREREQUISITE`, `EVIDENCE_PREREQUISITE`, `LOCALITY_PREREQUISITE` | physical integration may be observed/governed only within specialized provider/domain authority; effect ambiguity remains explicit | prove no generic direct actuation authority; prove command/effect/currentness reconciliation |
| **Operability Elicitation Lens** | `OPERABILITY_PREREQUISITE`, `EVIDENCE_PREREQUISITE` | feature migration cannot be considered production-ready without explicit operational questions and evidence | prove SLO/throughput/peak/latency/backlog/retry/idempotency/timeout/failure/currentness/owner/recovery/reconciliation/change-safety coverage |
| **Production Readiness Coverage** | `OPERABILITY_PREREQUISITE` | feature completeness is distinct from operability completeness | prove multidimensional coverage without scalar health score |
| **RevisionVector** | `REVISION_PREREQUISITE` | coexistence/compatibility/currentness may depend on independently evolving schema/policy/provider/runtime/workflow/config/trust revisions | prove migration behavior under mixed revision vectors and residual cohorts |
| **Qualified evidence/currentness** | `EVIDENCE_PREREQUISITE` | observation/ACK/signature/telemetry cannot self-promote into truth or authority | prove provenance, freshness, population/coverage and `INCONCLUSIVE/UNKNOWN` handling |
| **Provider support vectors** | `PROVIDER_PREREQUISITE` | provider feature-name equality cannot imply semantic substitution | prove qualification, unsupported dimensions, coexistence/cutover/withdrawal |
| **Queue/backpressure/capacity** | `OPERABILITY_PREREQUISITE` | closure requiring drainage must declare workload, service capacity, backlog age/depth and convergence horizon | prove burst/headroom/backpressure/retry amplification and finite drainability |
| **Brownfield/Legacy Mirroring** | `EVIDENCE_PREREQUISITE`, `AUTHORITY_PREREQUISITE` | discovered behavior/configuration/manual practice remains evidence/candidate until owner adoption | prove observed != intended != approved and preserve provenance/lossiness |

## 4. Authoritative cross-capability dependency/migration matrix

The matrix gives the **primary cross-cutting prerequisites** for each canonical capability. It is a partial order and coexistence graph, not a Work Package sequence. Later D1+ records may add narrower edges but may not weaken these prerequisites without an explicit Planning D reconciliation.

| # | Canonical capability | Primary typed prerequisites | Source-of-truth / coexistence migration rule | Residual / queue / operability obligations | Planning E proof route |
|---:|---|---|---|---|---|
| 1 | **Universal Capability Architecture** | C0 `SEMANTIC`, `REVISION`, C1 `EVIDENCE` | introduce owner-qualified canonical identities/revisions while legacy references remain interpretable; never big-bang rewrite all references | residual references and old revision readers must remain resolvable; schema/reference conversion backlog visible | prove owner-qualified identity, typed relation and revision preservation |
| 2 | **Process & Application Modeling** | UCA `SEMANTIC`; Data `DATA`; Lifecycle `REVISION`; C1 `EVIDENCE` | legacy/imported process models remain evidence/candidates until adopted canonical revisions; old definitions coexist for replay/history | in-flight consumers of old process definitions remain pinned; import/mapping lossiness explicit | prove observed/imported != approved canonical process and historical replay fidelity |
| 3 | **UI / Generated Experience / Low-code Builder** | Process `SEMANTIC`; Authorization `AUTHORITY`; AGWS `SEMANTIC`; Lifecycle `REVISION`; Observability `EVIDENCE` | generated/rendered projections coexist with existing screens; UI never becomes authority because it displays a value/action | residual clients/caches/components must be version/currentness-qualified; dashboard freshness visible | prove `visibility != authority`, binding correctness, currentness and safe control/change separation |
| 4 | **Adaptive Governed Work Surfaces (AGWS)** | UI `SEMANTIC`; Authorization `AUTHORITY`; Identity `TRUST`; Organization `AUTHORITY`; Observability `EVIDENCE` | effective surfaces migrate only after inherited/mandatory/delegated policy semantics are expressible; legacy role/person customizations remain explicit overlays | residual sessions/caches/surface revisions must drain; local Station views cannot broaden authority | prove Enterprise→Station→Role→Person inheritance, delegation bounds and reset/rollback semantics |
| 5 | **Workflow & Durable Execution** | Process `SEMANTIC`; Data `DATA`; Integration `PROVIDER`; Lifecycle `REVISION`; Observability `EVIDENCE`; Operability | new workflow revisions coexist with in-flight old revisions; execution journal/effect dispositions remain append-oriented | stuck/wait/timeout/DLQ/retry queues, duplicate executions and abandoned in-flight populations remain visible | prove terminal/completion evidence, revision pinning, retry/idempotency, recovery/reconciliation |
| 6 | **Integration & Automation** | Provider `PROVIDER`; Standards `SEMANTIC`; Authorization `AUTHORITY`; Secrets `TRUST`; Messaging `DATA`; Operability | external mappings/bindings shadow and compare before authority or writer movement; unsupported semantic scope remains explicit | rate limits, partial pagination, event gaps, provider outage, callback/retry backlogs and `UNKNOWN` effects reconciled | prove source-of-truth mapping, external permission drift, retry safety and provider substitution |
| 7 | **Identity / Authentication / Federation** | Trust/PKI `TRUST`; Secrets `TRUST`; Provider `PROVIDER`; Lifecycle `REVISION`; Observability | canonical subjects coexist with external identities/mappings; external account/group IDs are evidence, not canonical identity by default | residual sessions/credentials/assertions/caches; revoke/deprovision queues and offline currentness horizons | prove subject-link authority, assurance/currentness, revocation and ambiguous mapping handling |
| 8 | **Authorization / Policy / Organization / Multitenancy** | Identity `TRUST`; UCA `SEMANTIC`; Lifecycle `REVISION`; Governance `AUTHORITY`; Observability | current and target policy revisions may coexist, but permission truth has one explicit canonical owner per scope; external grants/groups remain evidence | residual grants/tokens/sessions/policy caches and in-flight work crossing policy revisions must drain/reconcile | prove non-amplifying authority, isolation, delegation, temporary authority, revoke propagation and stale decision handling |
| 9 | **Governance / Compliance / Audit** | Authorization `AUTHORITY`; Privacy `AUTHORITY`; Lifecycle `REVISION`; Storage `DATA`; Observability `EVIDENCE` | controls/obligations/exceptions move through explicit applicability and evidence mappings, not imported checklist truth | evidence-retention/audit queues, exception expiry and unresolved obligations remain explicit | prove applicability, evidence lineage/currentness, exception/remediation distinction and retention |
| 10 | **Security / Resilience / Failure Recovery** | Identity/Authz/Trust `TRUST`; Observability `EVIDENCE`; Deployment `OPERABILITY`; Lifecycle `REVISION` | resilience controls coexist with current mechanisms until recovery/fencing semantics are qualified; security observation does not rewrite domain truth | incident/recovery queues, degraded/offline modes, residual unsafe cohorts and recovery evidence horizons | prove fail/degrade/fence/recover semantics, rollback eligibility and post-recovery validation |
| 11 | **Enterprise Trust / PKI / Certificate Lifecycle** | Identity `TRUST`; Secrets `TRUST`; Provider `PROVIDER`; Lifecycle `REVISION`; Operability | trust anchors/issuers/credentials rotate via overlap + adoption + drainage, not instantaneous replacement | issuance/renewal/revocation/status/bundle distribution queues; residual verifiers/credentials tracked | prove trust-domain/bundle currentness, status UNKNOWN, rotation drainage and provider substitution |
| 12 | **Privacy / Data Governance / Retention / Legal Hold / Residency** | Governance `AUTHORITY`; Data `DATA`; Storage `DATA`; Provider `PROVIDER`; Lifecycle `REVISION` | purpose/retention/hold/residency rules move only after population/lineage/source-of-truth mapping is qualified | derived/index/cache/replica/backup/archive populations and deletion/hold/reconciliation queues visible | prove hold/deletion precedence, residency/replication, deletion convergence and restore non-resurrection |
| 13 | **Data / Schema / Migrations** | UCA `SEMANTIC`; Lifecycle `REVISION`; Privacy `AUTHORITY`; Storage `DATA`; Operability | schema/data readers and writers coexist through explicit compatibility windows; authority moves only after translation/backfill qualification | backfill/CDC/replication/reconciliation queues, corruption/integrity checks, residual old writers/readers | prove compatible mixed-version operation, lineage, migration/backfill correctness, recovery/rebuild |
| 14 | **Storage / Documents / Media** | Data `DATA`; Privacy `AUTHORITY`; Provider `PROVIDER`; Trust `TRUST`; Lifecycle `REVISION` | logical object identity remains stable across provider/object-location migration; provider key is realization identity | copy/verify/delete queues, replicas/caches/archive/backup residuals and retention/hold constraints | prove integrity/version identity, provider migration, retention/residency and residual-object drainage |
| 15 | **Notifications / Events / Messaging** | Standards `SEMANTIC`; Provider `PROVIDER`; Workflow/Integration `SEMANTIC`; Observability `EVIDENCE`; Operability | event occurrence, communication intent, message and delivery attempts remain distinct across provider migration | queue depth/age, retry amplification, DLQ, offline buffers, residual subscriptions/messages and cursor reconciliation | prove ordering scope, dedupe/idempotency, replay semantics, terminal completeness and provider cutover |
| 16 | **Secrets / Configuration / Environment Portability** | Identity/Authz/Trust `TRUST`; Provider `PROVIDER`; Deployment `DATA`; Lifecycle `REVISION` | references stay stable while values/providers/versions rotate; secret/config material may coexist during bounded handover | stale local caches, offline copies, expired/revoked material and distribution/reconciliation queues tracked | prove reference/value separation, rotation/revocation, stale-cache behavior and portable binding |
| 17 | **Build / Dependency Graph / Reproducibility** | UCA `REVISION`; Standards `SEMANTIC`; Provider `PROVIDER`; Artifact `DATA`; Observability `EVIDENCE` | dependency/material/toolchain identities become revision-qualified while existing builds remain historically interpretable | build queues, cache populations, runner/toolchain cohorts and missing/offline dependency closure visible | prove deterministic/reproducible closure, material provenance and runner/cache substitution |
| 18 | **Artifact / Release / SBOM / Provenance** | Build `DATA`; Trust `TRUST`; Lifecycle `REVISION`; Provider `PROVIDER`; Deployment `DATA` | build output is admitted into canonical artifact/release identity before promotion; registry/provider location is not canonical release identity | replication/signing/SBOM/provenance/promotion queues and residual registry/mirror copies tracked | prove digest/release distinction, provenance/SBOM qualification, promotion and current rollback eligibility |
| 19 | **Deployment / Environment / Runtime** | Artifact `DATA`; Secrets `TRUST`; Authorization `AUTHORITY`; Provider `PROVIDER`; Lifecycle `REVISION`; Observability `EVIDENCE` | desired deployment intent and provider-observed/effective runtime coexist until convergence is evidenced | rollout cohorts, old replicas, sessions, traffic placements, migration jobs and rollback/roll-forward populations | prove desired/observed/effective distinctions, rollout/readiness, mixed cohorts, capacity/headroom and recovery |
| 20 | **Developer / Operator Experience / Self-hosting** | Deployment `OPERABILITY`; Observability `EVIDENCE`; Trust/Secrets `TRUST`; Build/Artifact `DATA`; C1 `EVIDENCE` | bootstrap/runbook/diagnostic procedures become revision-qualified without erasing manual/self-hosted history | disconnected sites, old tooling/procedures, support bundles and maintenance queues must remain diagnosable | prove operable bootstrap, offline closure, diagnostics/currentness, restore eligibility and ownership |
| 21 | **Provider / Binding / Capability Negotiation** | UCA `SEMANTIC`; Standards `SEMANTIC`; Trust/Authz `TRUST`; Lifecycle `REVISION`; Observability `EVIDENCE` | provider realizations qualify/shadow/coexist before binding/cutover; feature names never imply semantic equivalence | old bindings/callbacks/resources/grants/quotas/caches and residual provider cohorts drain explicitly | prove support-vector qualification, unsupported semantics, bind/rebind/withdraw/cutover and reconciliation |
| 22 | **Standards / Interoperability / API Contracts** | UCA `SEMANTIC`; Lifecycle `REVISION`; Provider `PROVIDER`; Observability `EVIDENCE` | contract revisions coexist under directional compatibility; published contract does not imply consumer-effective adoption | residual consumers/providers, partial pagination/events, negotiation/downgrade and deprecation cohorts | prove syntax/structure/behavior/semantics separately, idempotency and current contract closure |
| 23 | **Lifecycle / Versioning / Evolution / Migration** | C0 `REVISION`; Observability `EVIDENCE`; Data/Workflow/Provider `SEMANTIC`; Operability | Lifecycle does not own foreign domain truth; it governs coexistence/revision vectors and migration state transitions | residual cohorts are first-class; withdrawal/sunset cannot precede drainage/disposition | prove revision vector, cutover/fencing, rollback vs roll-forward vs restore and historical preservation |
| 24 | **Architecture Reconciliation as a Capability** | all owners `SEMANTIC`; Observability `EVIDENCE`; Lifecycle `REVISION`; Provider `PROVIDER`; C1 `EVIDENCE` | desired/canonical and observed/provider/effective states coexist; reconciliation proposes/qualifies divergence but cannot silently transfer authority | reconciliation queues, stale evidence, local/Fleet divergence, residual cohorts and unresolved conflicts tracked | prove graph/vector-qualified drift, currentness/uncertainty, normalization authority and non-strengthening reconciliation |
| 25 | **Observability / Operations / Incident** | UCA `SEMANTIC`; Lifecycle `REVISION`; Privacy `AUTHORITY`; Provider `PROVIDER`; all operational owners `EVIDENCE` | telemetry/evidence identity and incident state become provider-neutral while preserving producer/currentness provenance | collector/exporter queues, sampling/drop, offline buffers, alert backlog, incident/escalation ownership | prove signal→condition→alert→incident separation, SLI/SLO, freshness, privacy-safe telemetry and Fleet/local qualification |
| 26 | **Extension / Plugin / Marketplace Architecture** | Authorization `AUTHORITY`; Trust `TRUST`; Provider `PROVIDER`; Artifact `DATA`; Lifecycle `REVISION`; Observability | extension requested/granted/effective capability states coexist with legacy plugin mechanisms; marketplace metadata is not permission truth | residual extension versions/workers/tokens/hooks/cache entries and revocation/update queues tracked | prove containment, grant/effective separation, update/revoke, provider/marketplace substitution and residual drainage |
| 27 | **Commercial Metering / Entitlements / Rating / Billing / Payment** | Identity/Org `AUTHORITY`; Observability/Usage `EVIDENCE`; Data `DATA`; Provider `PROVIDER`; Lifecycle `REVISION`; FinOps separation | entitlement, metering, rating, billing and payment migrate as separate sources/predicates; observability never becomes pricing authority | late usage, replay, provider statements, invoice/payment reconciliation and quota populations tracked | prove billable evidence, entitlement/currentness, rating revision, invoice/payment separation and dispute/replay |
| 28 | **Technology Economic Governance / FinOps** | Observability `EVIDENCE`; Provider `PROVIDER`; Data `DATA`; Lifecycle `REVISION`; Commercial separation | provider invoice/cost evidence is normalized into internal economic truth only through explicit allocation/rate policy; never customer billing authority | late corrections, billing-close bursts, allocation residual/unallocated population and reconciliation capacity | prove normalized evidence, allocation conservation, units/currency/time, rate currentness and no scalar complexity authority |

## 5. Required high-risk dependency cuts

The following cross-capability cuts are mandatory because incorrect migration order can create silent authority, history or operability failure.

### 5.1 Identity → Authorization → AGWS/UI

Authentication/federation facts must be qualified before authorization can consume them. Authorization truth must be explicit before AGWS/UI may expose or enable governed actions. A UI migration may not bootstrap permission semantics from what the legacy UI happened to show.

### 5.2 Trust/Secrets → Provider/Integration/Deployment

Credential or certificate migration must preserve overlap, revocation/currentness and residual consumers before provider binding or runtime cutover. `signature valid != authorized/current provider effect`.

### 5.3 Data/Schema → Workflow/Integration/Messaging

A new writer cannot be admitted until target representation, compatibility and reconciliation exist. In-flight workflow/message populations keep their producing revisions. Backfill and CDC queues must be bounded and drainable.

### 5.4 Build → Artifact → Deployment → Runtime evidence

`build success != canonical artifact != promoted release != effective deployment != validated runtime`.

Each transition requires its own evidence/currentness and rollback/roll-forward eligibility.

### 5.5 Provider substitution

Canonical protocol:

`discover -> qualify support vector -> admit -> coexist/shadow -> compare -> cutover -> fence old writer/provider -> residual drain -> reconcile -> withdraw`.

Provider outage or quota pressure does not authorize unqualified substitution.

### 5.6 Lifecycle as cross-cutting coordinator, not semantic owner

Lifecycle owns revision/coexistence/migration semantics but cannot determine foreign domain compatibility alone. Each semantic owner supplies domain-specific compatibility/postconditions.

### 5.7 Architecture reconciliation

Architecture Reconciliation consumes desired and observed graphs/vectors. It may detect/qualify drift and propose normalization, but owner-specific adoption authority remains required. `drift detected != canonical change authorized`.

## 6. Queueing / flow / capacity constitution

Any later migration transition whose closure depends on processing a population MUST declare a queue model sufficient for operational reasoning.

At minimum:

- arrival/admission population and units;
- expected and peak/burst arrival rate `λ` where meaningful;
- service/drain rate `μ` and concurrency assumptions where meaningful;
- utilization/headroom assumptions, with `ρ = λ/μ` used only when model assumptions actually hold;
- queue depth **and queue age**;
- retry/replay amplification and duplicate population;
- timeout/UNKNOWN population;
- provider quotas/rate limits;
- degraded/offline buffering and reconnect burst behavior;
- explicit convergence/currentness objective;
- overload/backpressure/fencing behavior;
- closure proof that debt is drainable rather than permanently accumulating.

No average utilization, queue depth or scalar health value can replace population/time-window/context-qualified evidence.

## 7. Temporal / uncertainty / causality constitution

Planning D preserves temporal and epistemic boundaries:

- event time, observation time, ingestion time, effective time and transaction time are not interchangeable;
- stale evidence may remain historically valid while becoming insufficient for current decisions;
- `UNKNOWN` and `INCONCLUSIVE` are first-class and may block cutover;
- causal/derived assessments remain research/analytical claims unless independently authorized by the relevant semantic owner;
- a migration transformation may preserve, weaken or invalidate prior proof and must declare which;
- correction/supersession appends lineage instead of erasing producing history.

## 8. Operability Elicitation migration gate

Every D1+ capability record MUST answer, where applicable:

- Como saberemos que está funcionando?
- Como saberemos que está degradado?
- Quem é responsável?
- Que evidência precisamos?
- Qual estado pode permanecer `UNKNOWN` e por quanto tempo?
- Qual perda ou atraso é aceitável?
- Como recuperar?
- Como reconciliar?
- Como validar depois de mudança/deploy?

The capability-specific lens MUST also cover: SLO/SLA, throughput, peak/burst, latency, queue/backlog, retry/idempotency, timeout, failure modes, dependency health, freshness/currentness, evidence retention, alert thresholds, escalation/on-call, maintenance windows, provider quotas, degraded/offline operation, reconciliation, recovery, rollback, capacity headroom, cost/usage, audit and incident response.

Integration-specific migration must additionally qualify source-of-truth, sync lag, event gaps, provider outage, rate limits, partial pagination, external permission drift, contract/API revision, unsupported semantic scope and reconciliation ownership.

Workflow-specific migration must qualify terminal state, completion evidence, stuck detection, wait/timeout, dead-letter/reconciliation, compensation, concurrency, duplicates and abandoned in-flight work.

Data-specific migration must qualify volume/growth, retention/archive, freshness/replication lag, corruption/integrity, backup/restore, rebuild/migration and lineage.

UI/operations migration must make currentness, unresolved/partial/UNKNOWN state, drill-down, audit trail and safe observe/control/change separation visible.

Security/privacy telemetry must be minimized/redacted, access-auditable and purpose-qualified.

Commercial/cost telemetry may expose usage/cost/quota/anomaly evidence but cannot silently become rating/pricing authority.

## 9. Production Readiness Coverage

Feature completeness and migration progress are explicitly insufficient for production readiness.

Each D1+ record MUST carry the independent dimensions:

`OBSERVABILITY | OWNERSHIP | FAILURE_HANDLING | RECOVERY | CAPACITY | CURRENTNESS | SECURITY | RECONCILIATION | CHANGE_SAFETY | COST | DOCUMENTATION`

with states:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

No single scalar score may override a critical `BLOCKED` or `CONFLICTED` dimension.

Adversarial mandatory checks include:

- fully specified feature with no operational owner;
- integration with no timeout/reconciliation;
- dashboard with no freshness/currentness;
- retry with no idempotency qualification;
- alert with no action owner/runbook;
- metric with no unit/population/time window/context;
- failure mode with no recovery;
- rollout with no rollback/abort/roll-forward semantics;
- capacity plan with no peak/burst assumptions;
- audit/compliance evidence with no retention.

## 10. Brownfield / Legacy Mirroring migration protocol

Canonical evidence-first protocol:

`discover -> source/revision -> extract -> map -> fidelity classification -> unresolved semantics -> proposal -> owner adoption -> canonical revision`.

Spreadsheets, scripts, tickets, manual workarounds, off-channel approvals, unofficial exceptions, copied binaries/configuration, verbal knowledge and observed runtime behavior remain evidence/candidates. Mapping classes MUST preserve at least `LOSSLESS | LOSSY | AMBIGUOUS | UNSUPPORTED | UNKNOWN`, with affected migration transitions blocked when the missing semantic distinction is material.

## 11. D0 gate disposition

**D0 result: `DECIDED / PASS FOR D0`.**

D0 establishes:

- one migration constitution for all 28 canonical capabilities;
- typed prerequisite edges;
- source-of-truth movement protocol;
- coexistence-first migration rather than big-bang replacement;
- revision/history/in-flight preservation;
- residual cohort drainage;
- provider qualification/substitution;
- external-effect `UNKNOWN` reconciliation;
- Brownfield/Mirroring evidence-first adoption;
- C1 elicitation contradiction/no-false-complete gates;
- local/Station/Fleet boundaries;
- bounded C2 Physical/Peripheral scope;
- queue/backpressure/capacity requirements;
- rollback/abort/roll-forward/manual reconciliation dispositions;
- capability-wide Operability Elicitation and Production Readiness Coverage;
- Planning E proof routes without executing Planning E.

No capability-specific migration record has been executed by D0. No source of truth has been moved. No repository/product remediation is claimed.

The next Planning D action must be selected only by a fresh `RESEARCH_PIPELINE_STATE.json` update after anti-stale revalidation. It must not skip directly to Planning E or later phases.