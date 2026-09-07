# Generation 2 — Planning E E2: Data / Workflow / External-Effect / Messaging Proofs

Status: **DECIDED / PASS FOR E2**  
Phase: `PLANNING_E_PRODUCT_PROOF_ACCEPTANCE`  
Decision: `E2`  
Entry branch head revalidated before persistence: `96b63d2b8203d546800185e4807042b54ee4d3aa`  
Scope: proof architecture only. No product code, executable tests, Architecture Reconciliation execution, WBS, Work Packages, executive TASKs, Construction or remediation.

## 1. Authority and inherited constitution

This record executes only the `next_action` authorized by `RESEARCH_PIPELINE_STATE.json`: Planning E E2. E0 is the proof constitution; E1 supplies semantic-owner, revision/currentness/population/locality, non-strengthening and no-false-complete rules. C3 target architecture and D3 migration semantics remain authoritative inputs.

Research remains `CLOSED / SATURATED / PASS` after eight full adversarial passes, with 284 material edge scenarios + 124 reusable `ConflictPattern`s = 408 inherited material findings. No research finding is remediated here.

Mandatory distinctions remain:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `event/message/delivery/attempt identity != business-effect identity`;
- `accepted != processed != converged`;
- `provider ACK != semantic postcondition proof`;
- `latest revision != producing revision`;
- `Fleet aggregate != Station/local truth`;
- `AI inference = InferredCandidate`, never authority.

Every E2 proof is revision-, population-, scope-, provider/binding-, locality- and currentness-qualified and resolves only to `PASS | PARTIAL | INCONCLUSIVE | BLOCKED | FAIL | NOT_APPLICABLE | DEFERRED`.

## 2. Matrix A — Data / Schema / Migration proofs

| ID | Claim to prove | Required positive evidence | Mandatory negative/adversarial evidence | Reopen / fail condition |
|---|---|---|---|---|
| E2-DATA-01 | Canonical data identity survives storage/provider realization changes | canonical identity + owner-qualified realization bindings across old/new stores | equal provider key/table/document ID cannot establish canonical identity | binding/identity-owner revision or ambiguous reuse |
| E2-DATA-02 | Schema compatibility is directional and revision-qualified | explicit old-reader/new-writer and new-reader/old-writer evidence for applicable cohorts | parse/validation success or equal version label cannot prove semantic compatibility | schema/reader/writer/transformation revision change |
| E2-DATA-03 | Lossy transformations remain explicit | field/unit/precision/domain/delete/default mapping with loss classification and owner disposition | dropped/rounded/defaulted values cannot silently PASS | newly discovered loss or unsupported population |
| E2-DATA-04 | Source-of-truth movement requires explicit writer admission and fencing | authoritative-writer state by migration stage + old-writer fence/coexistence envelope | target shadow/backfill success cannot imply authority; unknown scripts/manual writers block closure | writer inventory/currentness change |
| E2-DATA-05 | Backfill/CDC snapshot and cursor boundaries are reproducible | snapshot boundary, epoch/high-watermark, transformation revision, deletion/correction rules | latest-row comparison cannot prove complete historical convergence | cursor reset/gap/epoch ambiguity |
| E2-DATA-06 | Late/out-of-order/delete/correction semantics preserve lineage | occurrence time, processing time, tombstone/correction/supersession lineage | late arrival cannot overwrite newer truth by arrival order alone | ordering/source authority rule changes |
| E2-DATA-07 | Replicas/caches/indexes expose currentness rather than masquerading as source truth | lag/as-of/currentness horizon and source relation | healthy cache/index cannot prove authoritative freshness | lag exceeds declared horizon or source unknown |
| E2-DATA-08 | Brownfield data assimilation is evidence-first | discover→source/revision→extract→map→fidelity→proposal→owner adoption lineage | successful import, matching labels or observed frequency cannot create canonical truth | unknown/lossy mapping promoted without adoption |

## 3. Matrix B — Workflow / Durable Execution proofs

| ID | Claim to prove | Required positive evidence | Mandatory negative/adversarial evidence |
|---|---|---|---|
| E2-WF-01 | In-flight execution preserves producing `RevisionVector` | execution envelope/journal references producing workflow/data/policy/effect revisions | current workflow definition cannot reinterpret historical transitions |
| E2-WF-02 | Definition, execution, state projection and journal remain distinct | immutable definition revision + execution identity + append-oriented transition/effect evidence | mutable latest-state row cannot substitute for historical execution proof |
| E2-WF-03 | Terminal state has owner-qualified completion evidence | terminal predicate + required evidence/postconditions | status=`DONE` alone cannot prove external/business completion |
| E2-WF-04 | Stuck/wait/timeout states are detectable without false failure inference | timer/wait identity, deadline/currentness and explicit unresolved state | timeout cannot imply remote effect NOT_APPLIED when outcome may be UNKNOWN |
| E2-WF-05 | Retry/compensation preserve effect identity and revision context | attempt lineage, effect ref, retry/compensation rule and horizon | new attempt ID cannot manufacture new semantic effect or erase prior ambiguity |
| E2-WF-06 | Concurrency/duplicate execution is bounded by semantic rules | concurrency key/scope, duplicate detection and conflict disposition | duplicate worker/message cannot silently execute same harmful effect twice |
| E2-WF-07 | Abandoned in-flight instances receive explicit disposition | residual population + pinned revision + drain/migrate/abort/reconcile/manual route | deployment/cutover cannot declare closure while unknown in-flight population exists |

## 4. Matrix C — External effect / Integration / Automation proofs

| ID | Claim to prove | Required positive evidence | Mandatory negative/adversarial evidence |
|---|---|---|---|
| E2-EFF-01 | Canonical business-effect identity is independent of request/delivery/attempt identity | owner-qualified effect ID linked to invocation/request/attempt/reconciliation occurrences | equal payload, request ID or message ID cannot alone prove same effect |
| E2-EFF-02 | Remote mutation preserves four-way disposition | evidence distinguishes `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN` | timeout/lost ACK/provider 5xx cannot be collapsed into NOT_APPLIED |
| E2-EFF-03 | `UNKNOWN -> reconcile-before-retry` when duplicate harm is possible | reconciliation observation or independently proven duplicate safety | blind retry after ambiguous outcome fails acceptance |
| E2-EFF-04 | Idempotency is operation/provider/target/horizon-qualified | key authority, semantic effect mapping, provider scope, retention horizon and parameter-equivalence rule | presence of idempotency key cannot imply perpetual/global duplicate safety |
| E2-EFF-05 | Batch/fan-out partiality remains member-visible | per-member outcomes and unresolved subpopulation | batch-level 200/success cannot hide mixed APPLIED/PARTIAL/UNKNOWN outcomes |
| E2-EFF-06 | Provider ACK cannot strengthen into business postcondition | ACK classified only for provider receipt/acceptance predicate plus downstream effect evidence | accepted/queued/delivered callback cannot prove canonical effect without owner contract |
| E2-EFF-07 | Integration source-of-truth and sync lag remain explicit | authoritative side, lag/currentness, gap detection, reconciliation owner | sync process healthy cannot prove no event gap or permission drift |
| E2-EFF-08 | Provider outage/rate limit/partial pagination/API revision preserve uncertainty | quota/rate/page/contract revision evidence and unresolved continuation state | partial page or stale provider contract cannot be treated as complete inventory |

## 5. Matrix D — Events / Notifications / Messaging proofs

| ID | Claim to prove | Required positive evidence | Mandatory negative/adversarial evidence |
|---|---|---|---|
| E2-MSG-01 | Event occurrence, message, notification intent, delivery attempt and consumer effect remain distinct | typed identities and lineage among all applicable stages | delivery receipt/read ACK cannot imply business completion |
| E2-MSG-02 | Replay preserves original occurrence and producing revision | original occurrence time/revision + replay occurrence/purpose + effect suppression/reconciliation policy | replay processing time cannot become original event time/current truth |
| E2-MSG-03 | Ordering claims are partition/epoch/scope-qualified | ordering key, partition, epoch and consumer contract | source-local sequence cannot become global order or causality |
| E2-MSG-04 | Duplicate delivery does not imply duplicate semantic effect | duplicate attempt lineage linked to same intended effect where applicable | equal payload cannot alone deduplicate distinct effects |
| E2-MSG-05 | Cursor/checkpoint reset preserves gap/overlap evidence | old/new cursor, reset reason, overlap/gap reconciliation | latest checkpoint cannot erase skipped or duplicated interval |
| E2-MSG-06 | DLQ/dead-letter is unresolved work, not terminal business disposition | unresolved population, reason, owner and replay/reconcile/manual route | moving to DLQ cannot count as successful completion |
| E2-MSG-07 | Notification delivery semantics remain channel/provider-qualified | accepted/sent/delivered/observed states qualified by provider evidence | provider-specific delivered cannot be generalized to user comprehension/action |

## 6. Matrix E — Offline / Station / Fleet and residual-cohort proofs

1. Offline/local producers preserve producing revision, local authority scope, event/effect lineage and currentness horizon.
2. Reconnect is a reconciliation boundary; late local state cannot silently overwrite newer authoritative decisions.
3. Fleet aggregate cannot mask a critical member `UNKNOWN/PARTIAL/FAIL/BLOCKED` or become local semantic authority.
4. Residual cohorts include old-schema readers/writers, in-flight workflows, queued/retrying/DLQ messages, cursors, callbacks/subscriptions, provider-side pending operations, offline buffers, caches/indexers and manual/shadow writers.
5. Each residual cohort requires population identity, producing revision, currentness objective, owner, drain/reconciliation route and terminal disposition.
6. Closure requires finite drainability or an explicit non-drain/manual disposition; a nominal cutover flag is insufficient.

## 7. Queueing / flow / capacity proof family

For every asynchronous migration or operational path, proof evidence must expose the model assumptions rather than only an average health indicator:

- arrival/admission rate `λ` by declared population/window;
- effective service/drain rate `μ` under declared concurrency/provider quota;
- utilization/headroom where the queueing model justifies it;
- queue depth **and oldest age**;
- peak/burst size and duration;
- retry/replay/fan-out amplification;
- partition skew/hotspots;
- blocked-owner/evidence age;
- convergence/currentness objective;
- finite-drain condition under the declared arrival scenario.

`low mean utilization != sustainable peak capacity`; `queue depth alone != bounded delay`; metric without unit/population/window/currentness cannot support authoritative acceptance.

## 8. Operability Elicitation Lens — E2 mandatory questions

For each data path, workflow, integration, provider and messaging route, acceptance evidence must trace back to explicit answers/evidence for at least:

- Como saberemos que está funcionando?
- Como saberemos que está degradado?
- Quem é responsável e quem está on-call/escalation owner?
- Que evidência precisamos e por quanto tempo deve ser retida?
- Qual estado pode permanecer `UNKNOWN`, por quanto tempo e com qual containment?
- Qual perda, duplicação, atraso, sync lag ou backlog é aceitável?
- Como recuperar?
- Como reconciliar?
- Como validar depois de mudança/deploy?
- Quais são SLO/SLA, throughput esperado, peak/burst, latency, queue/backlog e capacity headroom?
- Quais retry/idempotency/timeout semantics existem e qual é seu scope/horizon?
- Quais failure modes e dependency-health/currentness signals existem?
- Quais maintenance windows, provider quotas/rate limits e degraded/offline behaviors existem?
- Quem possui source-of-truth, event-gap, partial-pagination, permission-drift e provider-contract-revision reconciliation?
- Para workflows, qual terminal state/evidence, stuck detection, wait/timeout, dead-letter/reconciliation, compensation, concurrency, duplicate e abandoned-in-flight treatment?
- Para dados, quais volume/growth, retention/archive, corruption/integrity, backup/restore, migration/rebuild e lineage expectations?
- Para UI/operations, quais `PARTIAL/UNKNOWN/stale` estados precisam ser visíveis e quais ações são observe/control/change?
- Para security/privacy, qual minimization/redaction/access audit impede overcollection operacional?
- Para cost, quais usage/provider-cost/quota/anomaly dimensions devem ser observáveis sem virar pricing authority?

## 9. Separate Production Readiness Coverage

Feature/migration/proof completeness does not imply production readiness. E2 retains independent dimensional states `UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`:

| Dimension | E2 proof obligation |
|---|---|
| `OBSERVABILITY` | effect/workflow/data/message state, currentness, backlog and unresolved ambiguity are inspectable without scalar masking |
| `OWNERSHIP` | semantic owner plus operational/reconciliation/on-call owner exist for critical paths |
| `FAILURE_HANDLING` | timeout, partial batch, gap, duplicate, provider outage and stale dependency preserve qualified states |
| `RECOVERY` | replay/restore/restart/compensation do not duplicate harmful effects or rewrite history |
| `CAPACITY` | peak/burst, quotas, queue depth/age, drain rate and headroom demonstrate bounded operation/convergence |
| `CURRENTNESS` | source/replica/cache/cursor/provider/offline horizons are explicit |
| `SECURITY` | degraded/retry/replay paths do not bypass authority, isolation or privacy controls |
| `RECONCILIATION` | `UNKNOWN`, residual cohorts, gaps and partial effects have evidence-bearing terminal routes |
| `CHANGE_SAFETY` | schema/workflow/provider/contract changes preserve producing revisions, compatibility and rollback/roll-forward constraints |
| `COST` | retry/replay/storage/provider usage and quota pressure are observable but not pricing authority |
| `DOCUMENTATION` | runbooks, owner, evidence, limits, retention and reopen conditions are inspectable |

No scalar readiness percentage may override a critical unresolved dimension.

## 10. Inherited adversarial findings

E2 creates no new material research finding. The mandatory adversarials — retry without idempotency, integration without timeout/reconciliation, failure mode without recovery, capacity without peak assumptions, stale dashboard/currentness, alert without owner, and ambiguous provider effect — duplicate-screen into the inherited ConflictPattern inventory and become proof obligations only.

- new material findings: `0`;
- new `ConflictPattern`: `0`;
- `ConflictInstance`: `0`;
- remediation: `0`;
- saturation streak reset: `none`.

## 11. E2 acceptance decision

**E2 = DECIDED / PASS FOR E2.**

Pass rationale:

- Data/Schema/Migration has directional compatibility, source-of-truth/writer-fencing, backfill/CDC, lossiness/currentness and Brownfield proof routes;
- Workflow/Durable Execution has producing-revision, journal, terminal/stuck/retry/compensation/concurrency and abandoned-in-flight proofs;
- Integration/Automation has effect identity, four-way disposition, reconcile-before-retry, scoped idempotency, batch partiality, provider ACK non-strengthening and provider-drift proofs;
- Messaging/Events/Notifications has identity separation, replay/order/partition/epoch, duplicate/cursor/DLQ and delivery-semantics proofs;
- offline/Station/Fleet, residual cohorts and finite queue drainability remain explicit;
- Operability Elicitation and separate Production Readiness Coverage are first-class;
- no executable test, product work, remediation or Construction was performed.

## 12. Carry-forward

E3+ must consume E0/E1/E2 without weakening semantic-owner/revision/currentness/population/locality/non-strengthening rules. In particular, later proof families must not convert delivery, provider ACK, aggregate health, successful replay or latest revision into stronger semantic/effect claims.

The next Planning E action should be selected only by the updated `RESEARCH_PIPELINE_STATE.json`; no E3+ work is executed in this record.
