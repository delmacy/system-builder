# Generation 2 — Workflow & Durable Execution Full Pass 4 Revisit

Status: ACTIVE RESEARCH — Full Pass 4
Capability: Workflow & Durable Execution
Explicit mandatory cluster: Workflow × Integration × Messaging × external mutation
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; provider acknowledgement is not business effect; provider identity is not canonical operation identity; `UNKNOWN -> reconcile-before-retry`; local validity does not prove composed soundness. Research does not authorize remediation, Work Packages, TASKs, Construction or Planning C.

## 1. Rotation and method

This revisit used techniques materially different from Full Passes 1–3 and duplicate-screened candidates against all 119 reusable ConflictPatterns, including presence semantics, trust-namespace collapse, cumulative privacy and directed compatibility.

Techniques used:

1. **history/current-eligibility splice** — a durable history remained valid while policy, schema, provider, authority or downstream eligibility changed before the next effect;
2. **semantic-effect braid** — acknowledgement, correlation, external effect, canonical adoption and compensation evidence were permuted independently instead of assuming one linear commit point;
3. **cancellation/retry/compensation commutator** — legal pairwise operations were reordered to test whether the aggregate still had one coherent effect lineage;
4. **directed-compatibility inversion** — workflow/provider revisions supported in one execution direction were exercised under replay, rollback, reverse producer/consumer roles or residual cohorts;
5. **presence-operator mutation** — missing/null/default/delete command and event fields were round-tripped through workflow, integration and messaging boundaries;
6. **cross-process adoption cut** — another process adopted an effect after the original workflow lost acknowledgement but before cancellation/compensation;
7. **residual-cohort interleaving** — old/new queues, subscriptions, provider bindings and workflow revisions remained simultaneously active during cutover;
8. **resource/backlog product stress** — retries, fan-out, delayed messages, priority and provider quota were combined to test bounded liveness and cost;
9. **AI/low-code aggregate delta** — individually admitted retries, callbacks, compensation and fallback steps were composed to test contradictory effects, authority widening and unbounded loops.

## 2. Fresh evidence and portable implications

AWS Step Functions current documentation states that redrive continues an unsuccessful execution from the unsuccessful step, preserves successful prior history/results, uses the same state machine definition/execution ARN, and resets retry attempt counters for rerun Task/Parallel/Inline Map states. This reinforces a portable distinction already present in the catalogue: durable execution history and retry lineage do not prove that an external business effect is absent, current, retry-safe or still semantically eligible.

Representative current sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html
- https://docs.aws.amazon.com/step-functions/latest/apireference/API_RedriveExecution.html

These sources deepen existing attempt-lineage, revision/currentness, effect-identity and idempotency patterns; they do not establish a new universal mechanism for System Builder.

## 3. Local and explicit-cluster duplicate screen

No genuinely new material local edge scenario, cross-capability scenario or reusable ConflictPattern survived duplicate screening.

- durable history valid under an earlier revision while the next action is no longer currently eligible remains covered by revision/currentness, authority-liveness and compatibility-direction families;
- provider/message acknowledgement versus downstream effective business state remains covered by acknowledgement/effect separation and qualified convergence;
- cancellation, retry and compensation interleavings that can each be locally legal but jointly contradictory remain covered by temporal/state-transition and cross-process compensation/adoption patterns;
- delayed/duplicate/out-of-order events remain covered by temporal, correlation-cardinality and effect-identity patterns;
- old/new provider bindings, subscriptions or queues coexisting after cutover remain covered by provider coexistence/residual-cohort patterns;
- one-way workflow/provider revision support reused for replay/rollback/reverse roles is covered by `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`;
- missing/null/default/delete differences in commands/events are covered by `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` plus lossy-normalization/conformance families;
- downstream process adoption before compensation remains covered by the cross-process compensation/adoption family;
- retry/fan-out/backlog/quota combinations that hide starvation or unbounded work remain covered by `G2-CONFLICT-PATTERN-SCHEDULING-STARVATION-001`, automation-composition and resource-boundedness patterns;
- AI/low-code plans that compose individually permitted effects into contradictory, recursive or authority-amplifying behavior remain covered by AI/low-code composition plus authority non-amplification.

Trust-namespace collapse and cumulative privacy were also exercised as overlays for identity-bearing callbacks and payload/event accumulation. No Workflow-specific material extension survived: trust namespace ownership remains with Trust/Identity, and history-dependent privacy aggregation remains with Privacy/Data Governance.

## 4. Conflict-family coverage and detection candidates

The sweep explicitly covered structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition.

Existing records already carry the required activation conditions, incompatible claims/actions/states, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive risk and future-remediation disposition for the material classes exercised here.

Detection candidates remain sufficient when owner-qualified:

- static/design-time correlation overlap/cardinality and state-transition conflict analysis;
- pre-execution requalification of current workflow revision, directed compatibility, authority/policy, provider generation and idempotency/effect contract;
- runtime detection of competing progress, duplicate consumption/effects, residual-cohort activity, retry/compensation races and starvation/backlog signals;
- post-effect reconciliation joining canonical operation/effect identity, provider receipts, target postconditions, downstream adoption and compensation lineage;
- round-trip presence-state differential for command/event transformations;
- aggregate AI/low-code semantic/authority-envelope comparison.

False-positive controls remain essential: intentional broadcast/fan-in, best-effort queues, asymmetric compatibility, delayed human procedures, declared provider coexistence and domain-valid compensation are legitimate. A signal therefore remains evidence requiring context, not a `ConfirmedConflict`.

## 5. Preventive invariant review

No new preventive invariant candidate is elevated. Existing bounded candidates are sufficient: ambiguous mutation is not retry-safe merely because transport failed; explicitly exclusive correlation must not silently permit competing consumption; directed compatibility must not become undirected/global without owner evidence; AI/low-code must not amplify authority; and owner-qualified liveness cannot be reported healthy while indefinitely starved.

A universal ban on retries, compensation, overlapping waits, provider coexistence, asymmetric compatibility or delayed acknowledgement would block legitimate processes and is therefore not justified.

## 6. Saturation result

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- new local edge scenarios: `0`;
- new cross-capability scenarios: `0`;
- new reusable ConflictPatterns: `0`;
- Workflow & Durable Execution local no-material streak: `1 -> 2`;
- Workflow × Integration × Messaging × external mutation cluster no-material streak: `1 -> 2`;
- Full Pass 4 coverage after this revisit: `3/28` capabilities and `2/12` mandatory clusters;
- material inventory remains `284` edge scenarios + `119` reusable ConflictPatterns = `403` findings;
- HIGH/CRITICAL without owner/proof/detection route remains `0`;
- negative-space remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains blocked.

A future material finding resets the affected local or cluster streak. Saturation is not claimed.

## 7. Next rotation recommendation

Continue Full Pass 4 with **Data / Schema / Migrations** and explicitly exercise **Data/Schema × Privacy × Storage × Lifecycle** using techniques materially different from Full Passes 1–3 and duplicate-screen against all 119 reusable ConflictPatterns. Challenge multi-version read/write semantic cuts, defaults/backfills manufacturing facts, constraints versus retention/legal hold/residency, dual-write/CDC without a common qualified cut, identity/key reuse across cohorts, online schema changes crossing long writes, correction/supersession after derived adoption, restore of disposed data from obsolete cohorts, directed compatibility in migration/rollback, presence semantics, provider substitution and `PARTIAL/UNKNOWN`, pathological graph/cardinality/resource pressure, human migration instructions and AI/low-code plans that alter semantic ownership, privacy or authority. Do not enter Planning C.
