# Generation 2 — Workflow & Durable Execution — Full Pass 8 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Workflow & Durable Execution
Mandatory cluster exercised: Workflow × Integration × Messaging × external mutation
Prior authority: workflow edge-case register and Full Pass 2–7 revisit dossiers
Conflict-classification authority: `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
Reusable ConflictPattern inventory screened: 124

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `UNKNOWN != NOT_APPLIED`, `message accepted != handler completed != workflow completed != external effect converged`, and `observed workflow != intended procedure != approved canonical workflow`. This revisit authorizes no product code, Work Package, TASK, Construction, target-architecture decision or pre-emptive remediation.

## 1. Full-Pass-8 method

This revisit uses an **effect-boundary, message-stage, elicitation-sufficiency and operability-fracture method** materially different from Full Pass 7's temporal-liveness/proof-cut profile. The attack asks whether a durable instance remains semantically and operationally safe when message acceptance, handler completion, external effect, child completion, retry/redrive, provider substitution, human understanding and runtime observation disagree.

The probes were:

1. **message-stage fracture** — distinguish a command/update being received, accepted, durably recorded, handler-completed, workflow-consumed and externally-converged; test surfaces that collapse those stages;
2. **effect identity versus transport identity permutation** — vary event/message/delivery/update/correlation/attempt/idempotency/business-effect identities independently across retry and redrive;
3. **UNKNOWN-after-side-effect redrive** — external mutation may have applied but acknowledgment is lost; redrive occurs under the same or a substituted provider and tests reconcile-before-retry ownership;
4. **child completion asymmetry** — synchronous child completion, async child dispatch, parent continuation, callback arrival and child external effects are permuted to expose false fan-in completion;
5. **handler-liveness versus workflow-liveness** — accepted update or signal handler is still blocked/running when the main workflow reaches terminal/continue-as-new behavior;
6. **wait/timer revision crossing** — a wait is registered under workflow/policy/provider revision `R1` and wakes under `R2`; current truth must not rewrite registration-time semantics;
7. **event occurrence versus observation ordering** — delayed/offline/federated events arrive after later observations and challenge causal/sequence inference from ingestion order;
8. **cancellation versus external adoption** — local cancel/abort wins while remote provider already adopted work, retains session/state or continues callback/result writing;
9. **compensation-after-adoption** — local inverse exists, but downstream use/ownership/policy changed and compensation no longer proves business reversal;
10. **partial fan-in and dead-join pressure** — children return success/failure/timeout/UNKNOWN/late completion under join predicates that may create impossible waits or false completion;
11. **decision freshness fracture** — rule/human/AI decision was valid when produced but stale or superseded when durable continuation consumes it;
12. **queue/deadline coupling** — retry caps are locally finite while shared service queues, rate limits and deadline pressure create unstable backlog or priority inversion;
13. **provider substitution with residual callbacks** — binding changes while old provider callbacks, ids, pending effects or credentials remain live;
14. **federated responsibility subtraction** — valid cross-system contract exists but no owner is elicited for timeout, UNKNOWN, reconciliation, compensation or residual callback disposition;
15. **Brownfield workflow inference attack** — logs/spreadsheets/email chronology shows an observed sequence that differs from declared procedure; process-mining-style observation remains evidence rather than canonical authority;
16. **elicitation happy-path closure attack** — user story/use case names success but omits timeout, retry, compensation, cancellation, offline behavior, external-effect ambiguity or terminal proof; test false `complete`;
17. **cross-capability question-routing attack** — workflow elicitation discovers authorization, retention, formula, provider or physical-integration semantics and duplicates them locally rather than routing/referencing their semantic owner;
18. **bounded Physical/Peripheral provisioning fracture** — external user/grant/resource sync succeeds locally while provider application is partial/stale/UNKNOWN; test `provider-reported permission != canonical authority != actual physical/media access success` without assuming direct actuation;
19. **AI/low-code early completion** — generated flow converts accepted messages, stale decisions, unresolved external effects, provider status or incomplete stakeholder evidence into stronger terminal claims;
20. **formal-assurance composition attack** — preserve a sound control-flow fragment while adding asynchronous messages, external mutations, cancellation, data/time/resource semantics and uncertain effects; test whether prior soundness/liveness proof is improperly inherited.

The mandatory `Workflow × Integration × Messaging × external mutation` cluster is materially exercised by probes 1–5, 7–10, 12–14, 18 and 19.

## 2. Evidence refresh

External evidence is comparative research evidence, not architecture prescription.

### 2.1 Durable message acceptance and completion are distinct lifecycle stages

Temporal documentation distinguishes Update acceptance from Update completion. An accepted Update is durably represented in Event History, while completion is separately recorded; documentation also warns that a Workflow may finish while an Update handler is still running if the workflow does not wait for handlers. Buffered Updates may also be invoked later and can create ordering concerns across message types.

Representative sources refreshed 2026-09-06:
- https://github.com/temporalio/documentation/blob/main/docs/develop/go/workflows/message-passing.mdx
- https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/workflow/workflow-definition.mdx

Portable consequence: `message/update accepted != handler completed != workflow completed`. A completion certificate cannot infer stronger stages merely from durable acceptance evidence.

### 2.2 Durable replay/versioning is revision-qualified

Temporal documents deterministic replay constraints and explicitly requires a versioning strategy for long-lived workflows that can span multiple worker revisions. Some Workflow API changes are safe while changing activity/child types or IDs is not generally safe without version-aware handling.

Representative source refreshed 2026-09-06:
- https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/workflow/workflow-definition.mdx

Portable consequence: in-flight durable instances need an explicit revision/profile relationship; current workflow code cannot silently reinterpret historical Event History.

### 2.3 Side-effect durability and retry semantics remain operation-kind dependent

Temporal documents regular Activities as durably tracked, while Local Activities may execute again if a Worker fails before the enclosing Workflow Task records their marker. AWS Durable Execution guidance similarly treats idempotency keys as explicit replay/retry boundaries for side-effecting steps.

Representative sources refreshed 2026-09-06:
- https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/activities/local-activity.mdx
- https://docs.aws.amazon.com/durable-execution/patterns/best-practices/idempotency/

Portable consequence: execution history and retry machinery do not prove external business-effect exactly-once semantics. `attempt identity != idempotency identity != business-effect identity` remains required.

### 2.4 Redrive demonstrates parent/child/quiescence and queue distinctions

AWS Step Functions documents that a Distributed Map can continue canceling children or writing results after the parent stops/times out; redrive may wait for those operations, and concurrency limits can leave redriven children pending. Some failures rerun work that was previously successful.

Representative sources refreshed 2026-09-06:
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-map-run.html
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html

Portable consequence: parent terminality, child lifecycle, redrive attempt lineage, result-writer quiescence, queue capacity and business-effect convergence are separate proof claims.

### 2.5 Observed behavior remains distinct from intended/canonical workflow

Process-mining conformance checking compares observed cases/event logs against a reference process model and surfaces discrepancies for analysis; it does not establish that the observed trace is the intended or authoritative process.

Representative source refreshed 2026-09-06:
- https://docs.uipath.com/process-mining/automation-suite/2024.10/user-guide/conformance-checking

Portable consequence: Brownfield traces and operational event logs are evidence. `observed workflow != intended procedure != approved canonical workflow`; divergence is a signal until owner/evidence/currentness establish a conflict.

### 2.6 AI can support requirement articulation but does not replace stakeholder validation

A 2026 empirical study of LLM-assisted requirements expression found improvements in perceived clarity/alignment while explicitly retaining stakeholders in the validation loop.

Representative source refreshed 2026-09-06:
- https://arxiv.org/abs/2601.16699

Portable consequence: AI may generate follow-up questions, candidate scenarios and clearer phrasing, but may not promote inference to Requirement/Decision or close a critical elicitation gap without qualifying evidence and owner validation.

### 2.7 Provenance relation types do not manufacture causal or authority claims

W3C PROV distinguishes derivation, generation, usage, association and attribution as different relations. Provenance connectivity does not itself establish authorization or causal responsibility.

Representative source refreshed 2026-09-06:
- https://www.w3.org/TR/prov-o/

Portable consequence: `derivedFrom != causedBy != authorizedBy`; workflow journal linkage cannot strengthen the relation kind beyond available evidence.

## 3. Candidate findings and duplicate-screen against 124 reusable ConflictPatterns

No candidate survived duplicate-screen as a distinct 125th reusable ConflictPattern.

### 3.1 Accepted update is surfaced as completed business work

Candidate: an Update/command is durably accepted and UI/API reports workflow or business completion before handler/external effect completes.

Disposition: existing proof-claim conflation, terminal-state, false-convergence and observability/currentness families. Detection candidate: stage-typed lifecycle (`received/accepted/handler-completed/workflow-consumed/external-disposition/converged`) with evidence refs. Proof obligation: completion strength cannot exceed the strongest independently evidenced stage.

### 3.2 Retry preserves message identity but duplicates the business effect

Candidate: delivery/update/correlation ID is stable but downstream provider does not bind that ID to the same business effect, or a new provider interprets it differently after substitution.

Disposition: existing effect-identity, provider-semantic mismatch, idempotency and ambiguous-mutation families. Detection candidate: qualified effect identity + provider contract revision + operation semantics. `same message != same effect`.

### 3.3 UNKNOWN external mutation is redriven before reconciliation

Candidate: timeout follows a potentially applied mutation, and redrive/retry assumes `NOT_APPLIED` because current provider state does not show the effect.

Disposition: existing ambiguous external mutation, residual-provider, federated-continuity and false-convergence families. Owner set: workflow/integration semantic owner + provider realization owner + business-effect owner. Detection route: effect correlation across old/current providers and reconciliation ledger. Proof obligation: required `UNKNOWN` blocks unsafe retry and strong completion until disposition is qualified.

### 3.4 Parent completes while accepted child/update work is still live

Candidate: child/update handler is durable and accepted but not terminal; parent reaches terminal or continue-as-new state without explicit handoff/quiescence semantics.

Disposition: existing certificate-composition, residual-work, terminal-state and child-lifecycle families. Detection route: pending handler/child/callback closure at parent terminal boundary. Proof obligation: strong parent completion requires the declared completion profile to state whether live child/update work is allowed, transferred or blocking.

### 3.5 Wait wakes under stale or changed semantics

Candidate: timer/event subscription registered under `R1` wakes after policy/schema/provider/authority revision `R2`, and current semantics are applied retroactively.

Disposition: existing temporal/currentness, revision-vector, compatibility and historical-non-rewrite families. Detection route: registration-time semantic commitments plus wake-time qualification. Proof obligation: `current truth`, `historical truth` and `effective truth at T` remain distinct.

### 3.6 Observation order is mistaken for occurrence/causal order

Candidate: late/offline/federated event is observed after later events and workflow reconstruction infers wrong ordering, causality or responsibility.

Disposition: existing temporal ordering, provenance-overattribution, Brownfield/process-conformance and causal-claim families. Detection route: source occurrence time, observation time, source clock/currentness and sequence guarantees. Signal remains distinct from ConfirmedConflict.

### 3.7 Cancellation is interpreted as revocation of the external world

Candidate: local workflow cancel succeeds while external provider has adopted work, retained an access grant/session or continues callbacks.

Disposition: existing residual effect/cohort, false convergence, external permission drift and federated-continuity families. Proof obligation: local cancellation disposition is separate from external revocation/quiescence/convergence.

### 3.8 Compensation is technically available but semantically invalid

Candidate: inverse operation exists, but downstream adoption, ownership, authority or policy changed after the original effect.

Disposition: existing compensation/adoption, temporal/currentness, authority and provenance families. Detection route: downstream-use lineage + current compensation authority/eligibility. Proof obligation: inverse command success does not prove restored business truth.

### 3.9 Join reaches false completion or impossible wait

Candidate: fan-in assumes all children are homogeneously terminal even though one is late/UNKNOWN/canceled/residual, or join conditions can never become jointly satisfiable.

Disposition: existing dead-join/impossible-wait, workflow soundness, child-proof composition and UNKNOWN families. Detection route: static reachability/model-checking candidate plus runtime child-disposition vector. Proof obligation: join/completion predicates preserve per-child effect and evidence kind.

### 3.10 Stale decision drives a durable external effect

Candidate: human/rule/AI decision was valid at time `T1` but policy/authority/data changes before continuation at `T2`.

Disposition: existing decision-currentness, temporal authority, analytical-kind and stale-evidence families. Detection route: decision revision/effective window + consumption-time requalification where contract requires it. Proof obligation: decision outcome is not timeless authority.

### 3.11 Bounded retries destabilize shared queues

Candidate: each workflow has a finite retry cap but synchronized failures/backoffs create backlog growth, head-of-line blocking or priority inversion beyond sustainable capacity.

Disposition: existing queue/resource/fairness and objective-conflict families. Detection route: arrival/service distributions, correlated retry amplification, shared bottleneck topology and backlog age. `bounded != stable`.

### 3.12 Provider substitution leaves live residual callbacks or identities

Candidate: new provider is canonical while old provider still emits callbacks, accepts stale credentials or retains externally authoritative IDs/grants.

Disposition: existing residual-provider/cohort, identity/currentness, source-of-truth and false-convergence families. Detection route: provider-qualified ownership + residual cohort inventory + callback acceptance policy. Proof obligation: substitution completion includes explicit residual disposition.

### 3.13 Federated workflow has no owner for ambiguous failure

Candidate: cross-system handoff is syntactically valid but timeout/UNKNOWN/retry/reconcile/compensation responsibility was never elicited.

Disposition: existing federated-continuity, human-responsibility, elicitation completeness and UNKNOWN families. Detection route: responsibility coverage by failure/effect disposition. Proof obligation: a valid contract is insufficient when failure ownership is unresolved.

### 3.14 Brownfield chronology becomes canonical workflow

Candidate: observed logs/email/spreadsheet chronology is promoted directly to intended workflow, including unofficial workaround or exceptional behavior.

Disposition: existing Brownfield inferred-semantics, false process reconstruction, provenance and semantic-owner families. Detection route: relation kind `observed/declared/inferred/approved` + owner review. Proof obligation: observation remains evidence, not canonical authority.

### 3.15 Workflow is marked understood after happy-path elicitation only

Candidate: story/use case describes success but omits authority, failure, rollback, `UNKNOWN`, offline, retries, compensation, currentness, observability, capacity or evidence.

Disposition: existing false elicitation completeness, happy-path-only, proof-claim and operability-readiness families. Detection route: per-capability multidimensional coverage state rather than scalar percentage. Proof obligation: applicable HIGH/CRITICAL unresolved dimensions prevent `complete`/publish-ready claims.

### 3.16 Elicitation artifact copies semantics owned elsewhere

Candidate: workflow interview captures policy/formula/retention/provider/physical-access behavior and the workflow artifact becomes a second semantic owner.

Disposition: existing semantic-ownership and cross-capability routing families. Detection route: question/finding-to-owner routing and duplicate semantic definition detection. Proof obligation: capture-at-discovery does not imply ownership-at-discovery.

### 3.17 Physical/peripheral provisioning success is overstated

Candidate: workflow records successful local provisioning or revoke while camera/VMS/access/BMS/PDV provider state is stale, partial, unknown or scoped differently.

Disposition: existing external permission drift, partial deprovision, provider-scope semantic mismatch, currentness and cross-site isolation families. Detection route: provider/site/resource-qualified reconciliation. Proof obligation: `provider-reported permission != canonical authority != actual physical/media access success`; direct actuation remains non-goal by default.

### 3.18 AI/low-code promotes weak evidence to terminal truth

Candidate: generated workflow maps accepted message, stale decision, provider acknowledgment, observed trace, incomplete stakeholder answer or confidence estimate to `completed`.

Disposition: existing AI non-amplification, analytical-kind conflation, false completeness and proof-claim families. Detection route: artifact/proof relation typing and deterministic unresolved-gap checks. No new pattern.

### 3.19 Formal soundness is inherited across unsupported semantic enrichment

Candidate: a sound control-flow graph adds asynchronous handlers, cancellation, external mutation, data/time/resources or uncertain effects and retains the previous proof label without preservation evidence.

Disposition: existing proof-claim conflation, graph transformation/proof invalidation and formal-profile families. Proof obligation: every soundness/liveness/reachability result names the formal fragment, revision and assumptions; richer semantics require preservation proof or downgrade to unproven.

## 4. Formal-assurance disposition

The proof lattice remains deliberately non-collapsible:

`definition soundness != reachability/liveness under formal assumptions != termination != message acceptance != handler completion != execution conformance != journal integrity != external-effect disposition != child/callback quiescence != queue stability != business convergence`.

Research candidates for later Planning C/D/E remain:

- Workflow Nets/Petri nets for restricted control-flow soundness and dead-join/unreachable-state analysis;
- bounded model checking/SAT/SMT for finite revision/state/effect combinations where practical;
- temporal properties for waits, cancellation, child/federated handoffs and eventual reconciliation;
- ranking/variant functions, explicit iteration/depth/time/resource bounds or other fragment-specific termination arguments for loops/recursion;
- trace/prefix conformance bound to exact workflow/model revision;
- `WorkflowCompletionCertificate` / `ProcessProofBundle` that binds workflow/graph revision, build/deployment identity, input commitments, attempts, message/update stages, child proof refs, external effect dispositions, terminal profile, unresolved UNKNOWNs, outputs, invariants and journal-integrity commitment;
- tamper-evident journals as integrity evidence only, never as proof that external effects occurred or that business convergence holds;
- proof composition that cannot strengthen child/provider/observability evidence beyond its source claim.

The verifier must be able to return `UNKNOWN/INCONCLUSIVE` when evidence is missing, stale, provider-incompatible or semantically outside the proven profile.

## 5. Elicitation & System Understanding disposition

This revisit reinforces the active cross-cutting methodology without canonicalizing a target implementation:

- `answered != understood`;
- `stakeholder claim != canonical truth`;
- `observed behavior != intended process`;
- `user story != complete requirement`;
- `use case != exhaustive behavior`;
- `acceptance criterion != full product proof`;
- `QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision`;
- `Fact != Claim != Assumption != InferredCandidate != Requirement != Decision`;
- `OutOfScope != NotApplicable`; `Deferred != Resolved`;
- adaptive questioning must follow ambiguity, contradiction, failure/effect kind, stakeholder/source gaps and cross-capability ownership;
- capability coverage must remain multidimensional (`UNTOUCHED/PARTIAL/RESOLVED/CONFLICTED/BLOCKED/DEFERRED/NA`) rather than collapse to a scalar completeness score;
- Workflow sufficiency for abstraction, architecture, implementation and publish/operation are different gates;
- a critical unresolved question or contradiction without disposition blocks stronger readiness claims;
- negative-space probes must continue looking for shadow spreadsheets, manual workarounds, verbal approvals, off-channel exceptions, emergency procedures and key-person knowledge;
- abuse/misuse/threat questions are conditional mandatory dimensions for high-risk external effects, authority, identity and Physical/Peripheral integrations;
- AI may articulate/synthesize/follow-up, but cannot convert inference or fluent summary into owner-approved requirement/decision.

Candidate conflict labels `FALSE_ELICITATION_COMPLETENESS`, `STAKEHOLDER_COVERAGE_GAP`, `ASSUMPTION_PROMOTED_TO_FACT`, `UNRESOLVED_CONTRADICTION_HIDDEN`, `HAPPY_PATH_ONLY_SPECIFICATION`, `ELICITATION_PROVENANCE_BREAK`, `CROSS_CAPABILITY_QUESTION_ROUTING_GAP` and `AI_INFERENCE_PROMOTED_TO_REQUIREMENT` all duplicate-screen into existing reusable families; no new ID is created.

## 6. Detection candidates and proof obligations carried forward

Research candidates only:

1. **message-stage typing** — receipt/acceptance/durable record/handler completion/workflow consumption/external disposition/convergence remain independently evidenced;
2. **effect-identity qualification** — message, delivery, update, correlation, attempt, idempotency and business-effect identities cannot be conflated;
3. **UNKNOWN reconcile-before-retry** — ambiguous mutation preserves owner/provider/contract revision until external disposition is proven;
4. **child/update quiescence profile** — parent completion states whether pending handlers, children, callbacks or result writers are allowed, transferred or blocking;
5. **temporal wait-contract binding** — registration and wake-up revisions/effective-time semantics remain explicit;
6. **historical non-rewrite** — current graph/policy/provider/decision projection cannot reinterpret producing historical evidence silently;
7. **occurrence/observation-time discipline** — workflow ordering/causal claims name source timestamp, observed timestamp and ordering guarantees;
8. **compensation eligibility proof** — downstream adoption and current authority/ownership qualify reversal claims;
9. **join soundness + runtime disposition vector** — impossible waits/dead joins are checked statically where feasible and terminal proof preserves per-child status/UNKNOWN;
10. **decision-currentness qualification** — stale/superseded human/rule/AI decisions cannot become timeless execution authority;
11. **queue-stability qualification** — retry/fan-out bounds are separate from sustainable capacity/backlog/deadline proof;
12. **provider substitution residual proof** — residual callbacks, IDs, grants, credentials and old-provider effects receive explicit disposition;
13. **federated responsibility proof** — timeout/UNKNOWN/retry/reconcile/compensation owners are explicit across system boundaries;
14. **Brownfield process provenance** — observed/declared/inferred/approved workflow relations remain distinguishable;
15. **no-false-elicitation-complete** — applicable HIGH/CRITICAL unresolved dimensions or contradictions block strong completeness/readiness claims;
16. **cross-capability routing proof** — workflow-discovered semantics reference their canonical owner rather than clone ownership;
17. **Physical/Peripheral provisioning proof** — provider/site/resource-qualified provisioning/revoke/reconcile/currentness and cross-tenant/site isolation remain explicit; no generic actuation authority is inferred;
18. **formal-profile binding and proof invalidation** — transformed/enriched workflow proofs are preserved only with explicit preservation evidence;
19. **offline verifier non-strengthening** — missing external/current/child/message evidence yields `UNKNOWN/INCONCLUSIVE`;
20. **AI/low-code non-strengthening** — generated orchestration cannot strengthen authority, certainty, completion, causal/provenance or external-effect claims.

Planning E should later test at least: accepted-but-not-completed update; workflow terminal with live handler; UNKNOWN external mutation followed by redrive; stable message ID with duplicated business effect; child/callback residual work after parent terminal; wait across revision cut; out-of-order occurrence/observation events; impossible join; compensation after downstream adoption; stale decision consumption; bounded retries with unstable queue; provider substitution with residual callback; Brownfield trace versus intended procedure; happy-path-only elicitation falsely marked complete; external provisioning PARTIAL/UNKNOWN; cross-site/resource scope mismatch; AI-generated false completion; and proof invalidation after semantic enrichment.

## 7. Saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT**.

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances asserted: **0**;
- new preventive invariant candidates: **0**;
- HIGH/CRITICAL without owner/proof/detection route introduced: **0**;
- bounded synthesis / Planning-A backfill required: **no**;
- implementation/remediation work opened: **0**;
- Workflow & Durable Execution local no-material streak remains capped at **2**;
- Workflow × Integration × Messaging × external mutation cluster streak remains capped at **2**;
- Full Pass 8 capability coverage becomes **3/28**;
- Full Pass 8 mandatory-cluster coverage becomes **3/12**;
- inventory remains **284 material edge scenarios + 124 reusable ConflictPatterns = 408 material findings**;
- completed full passes remain **7/8 minimum** until Full Pass 8 covers all 28 capabilities;
- negative-space review remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains blocked.

No streak is inflated because both local and cluster streaks were already capped at 2.

## 8. Next action

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 8, next **Data / Schema / Migrations**, explicitly exercising **Data/Schema × Privacy × Storage × Lifecycle**.

Use materially different probes centered on: bitemporal corrections; schema revision pins for in-flight workflows; null/blank/zero and presence semantics; field-level provenance loss; generated/derived/stored-fact conflation; out-of-order CDC and missed tombstones; partial migration/dual-write residual cohorts; wrong entity resolution; unit/currency/timezone/precision transformations; uncertain data-quality evidence; Brownfield spreadsheet/docs imports and unsupported-content reporting; source-of-truth transition; privacy/retention/legal-hold conflicts; provider/offline data sync; migration queue/capacity; physical/peripheral identity/event records; elicitation stakeholder/source coverage; stale/superseded answers feeding schema decisions; cross-artifact story/use-case/workflow/schema/acceptance consistency; and AI mapping/type inference promoted beyond evidence. Duplicate-screen all 124 patterns. Data and cluster streaks are already capped at 2; do not inflate absent material novelty. Do not enter Planning C.
