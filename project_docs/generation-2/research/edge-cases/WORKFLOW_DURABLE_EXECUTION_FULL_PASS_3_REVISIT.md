# Generation 2 — Workflow & Durable Execution — Full Pass 3 Revisit

Status: FULL PASS 3 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK 1 / PAIRED CLUSTER STREAK 1
Capability: Workflow & Durable Execution
Paired cluster: Workflow × Integration × Messaging × external mutation
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research-only disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This artifact creates no implementation work, target architecture, Work Package, executable TASK or Construction. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, provider identity as realization evidence rather than canonical truth, authority non-amplification, and `UNKNOWN → reconcile-before-retry`.

Linked authorities: `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `EDGE_CASE_INDEX.md`, `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`, `ADVERSARIAL_SATURATION_STATE.json`.

## Pass-3 method

Full Pass 3 deliberately avoided repeating the Pass-1 happy-path/failure checklist and the Pass-2 correlation-cardinality/fairness probes. The revisit used:

1. **eligibility-drift braid analysis** — durable waits crossed policy, identity, formula, schema and provider revisions while the original wait remained structurally valid;
2. **attempt-lineage mutation** — redrive/retry/cancellation were permuted after downstream or human adoption of an earlier effect;
3. **acknowledgement/effect split** — human, physical or provider work completed while canonical acknowledgement was delayed, absent or duplicated;
4. **provider-coexistence perturbation** — old/new provider bindings, queues, subscriptions and jobs remained simultaneously observable during in-flight operations;
5. **temporal lattice analysis** — timers, cancellations, callbacks, retries and compensations were composed in different legal interleavings rather than tested one at a time;
6. **historical replay skew** — replay was evaluated against producing versus current formula/schema/identity/policy revisions;
7. **resource-pressure mutation** — queue growth, strict priority, retry amplification and provider quota were combined with durable liveness obligations;
8. **AI/low-code aggregate-plan analysis** — individually safe callbacks, retries and compensations were composed into loops and cross-process chains to test authority, liveness and effect ambiguity.

## Evidence anchors

Fresh provider documentation was used only as representative evidence for portable mechanics:

- AWS Step Functions redrive preserves successful prior history/results while rerunning unsuccessful work; redriven Task/Parallel/Inline Map retries reset their retry counters, and Wait states with timestamps already in the past can progress immediately on redrive. This reinforces that redrive is a new attempt over preserved lineage, not proof that external effects, current eligibility or temporal assumptions are unchanged.
- Azure Durable Functions documents event-sourced replay, deterministic orchestrator requirements, at-least-once activity execution, external-event duplicate possibility depending on backend, and guidance to race indefinite external waits against durable timeouts. This reinforces the separation between durable orchestration history, external effect identity, correlation, currentness and provider-specific delivery guarantees.

Representative sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html
- https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-code-constraints
- https://learn.microsoft.com/Azure/Azure-functions/durable/durable-functions-external-events

## Duplicate screen against the 115 reusable ConflictPatterns

No genuinely new material class survived. Candidate observations reduced to already catalogued patterns as follows:

| Pass-3 adversarial observation | Existing reusable class/family | Disposition |
| --- | --- | --- |
| A durable wait remains syntactically open but current policy/authority makes its wake action permanently ineligible | authority-liveness + revision/currentness | duplicate; detection remains owner/currentness-qualified |
| A callback matches more than one open obligation, or multiple callbacks compete for one exclusive obligation | `G2-CONFLICT-PATTERN-CORRELATION-CARDINALITY-001` | duplicate |
| Timer, cancellation and callback are all locally valid but imply incompatible terminal progress | temporal/state-transition conflict | duplicate |
| Redrive reruns a task after an earlier external effect has already been adopted downstream | cross-process compensation/adoption + effect identity/idempotency qualification | duplicate |
| Human or physical work is complete while canonical acknowledgement is absent | acknowledgement/effect + reconciliation/currentness | duplicate; absence of ack is not proof of no effect |
| External mutation times out during provider substitution and old/new providers both retain in-flight work | ambiguous effect + provider coexistence/residual cohort + idempotency qualification | duplicate |
| Strict priority/backpressure keeps an eligible durable cohort from progressing | `G2-CONFLICT-PATTERN-SCHEDULING-STARVATION-001` | duplicate |
| Historical replay is deterministic only under the producing revision vector, not the current one | revision-vector/currentness/historical qualification | duplicate |
| Residual queue/subscription/job from a withdrawn binding can still emit valid-looking work | residual-cohort/provider qualification + authority/currentness | duplicate |
| AI/low-code composes safe retry/callback/compensation fragments into an unbounded or authority-amplifying loop | automation-composition + resource boundedness + authority non-amplification | duplicate |

## Processual / semantic conflict review

The required conflict families were explicitly challenged:

- **structural graph:** callback/timer branches and compensation loops can be valid locally yet create duplicate progress or non-termination; existing structural/automation patterns cover this;
- **state-transition:** cancel/complete/retry/compensate interleavings can create incompatible progress claims; existing temporal/state patterns cover this;
- **semantic ownership:** transport/provider acknowledgement cannot own business completion semantics; existing ownership/effect patterns cover this;
- **rule/formula/condition:** durable eligibility evaluated under a different revision vector is already covered by revision/currentness patterns;
- **temporal/ordering:** redrive, delayed callback and timer races remain covered by temporal conflict patterns;
- **resource/capacity:** starvation/backpressure is explicitly owned by `G2-CONFLICT-PATTERN-SCHEDULING-STARVATION-001` plus capacity evidence owners;
- **authority/responsibility/SoD:** current authority must be requalified before protected follow-on action; no new universal pattern emerged;
- **policy/compliance:** a long-running instance cannot silently preserve superseded permission/policy assumptions; existing currentness/authority patterns cover this;
- **data/consistency:** correlation identity and effect lineage remain covered by correlation-cardinality/effective-identity patterns;
- **provider/integration:** partial/unknown effect and residual provider cohorts remain covered by provider qualification/coexistence patterns;
- **version/migration/coexistence:** in-flight operations spanning revisions remain covered by revision-vector and residual-cohort patterns;
- **exception/compensation/recovery:** compensation after downstream adoption remains covered by cross-process compensation/adoption patterns;
- **human-procedure/instruction:** human/physical completion without canonical acknowledgement is a known acknowledgement/reconciliation class;
- **cross-process:** later adoption of an earlier effect can invalidate otherwise-correct compensation; already catalogued;
- **objective/optimization:** throughput/priority optimization conflicting with liveness/fairness is covered by scheduling-starvation;
- **AI/low-code composition:** aggregate retry/callback/compensation loops are covered by automation-composition/resource/authority patterns.

`Signal != ConfirmedConflict` remains mandatory for all runtime detectors. None of these hypothetical activations is claimed as a `ConflictInstance`.

## Detection candidates retained

No new detector family is proposed. Existing candidates remain sufficient when supplied with current owner evidence:

- static/design-time overlap and cardinality analysis for declared correlation rules;
- pre-execution requalification of workflow revision, current authority/policy, provider generation and effect/idempotency contract;
- runtime detection of competing consumption, duplicate authoritative progress, starvation age, residual-cohort activity and inconsistent transition attempts;
- post-effect reconciliation of provider acknowledgement, canonical business postcondition, human/physical completion evidence and downstream adoption lineage;
- historical replay qualification against the producing revision vector instead of silently substituting current formula/schema/policy/identity semantics.

False positives remain material: intentional broadcast, best-effort low-priority work, intentionally detached human procedures and valid provider coexistence are legitimate in some domains. Detection therefore needs owner-qualified cardinality, liveness, authority, effect and coexistence semantics rather than universal rejection.

## Preventive invariant candidate review

No new preventive invariant candidate is added. Existing bounded candidates remain sufficient:

- ambiguous mutating effect must not be retried as though `NOT_APPLIED` without qualified idempotency/reconciliation evidence;
- explicitly exclusive correlation semantics must not silently allow competing consumption;
- AI/low-code and degraded execution must not amplify authority;
- owner-qualified liveness obligations must not be reported as globally healthy while indefinitely starved.

A broader universal ban on overlapping waits, retries, provider coexistence, delayed acknowledgement or compensation would block legitimate processes and is therefore not justified by this revisit.

## Saturation result

- New local edge scenarios: **0**.
- New paired-cluster scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- Workflow & Durable Execution local no-material streak: **0 → 1**.
- Workflow × Integration × Messaging × external mutation cluster no-material streak: **0 → 1**.
- Material inventory remains **278 edge scenarios + 115 reusable ConflictPatterns = 393 material findings**.
- HIGH/CRITICAL scenarios without owner/proof/detection route: **0**.
- `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` require no new material ID because no new scenario/pattern survived duplicate screening.
- Planning C remains blocked.

This is one eligible no-material revisit, not saturation. Both local capability and paired cluster still require a second consecutive eligible no-material revisit in a later full pass, and the campaign still requires at least eight completed full passes plus final negative-space closure.

## Next rotation recommendation

Continue Full Pass 3 with **Data / Schema / Migrations** and explicitly revisit **Data/Schema × Privacy × Storage × Lifecycle** using techniques materially different from Full Passes 1 and 2. Challenge multi-version read/write projection composition, manufactured defaults/backfills without source evidence, constraint interactions with privacy/retention/legal hold, dual-write/CDC common-cut absence, identity/key reuse across cohorts, online schema changes during long-running writes, correction/supersession after derived snapshots, restoration through obsolete cohorts, provider substitution and `PARTIAL/UNKNOWN` migration effects, resource exhaustion, and AI/low-code migration plans that alter ownership/retention/authority. Duplicate-screen against all 115 reusable ConflictPatterns. Do not enter Planning C.