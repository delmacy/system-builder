# G4 Editor Research — Triage Policy Governance, Anti-Gaming and Adaptive Recommendation Safety

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No implementation, WBS, Work Package, Sprint, TASK, migration, model or provider adoption is authorized by this artifact.

## 1. Research question and deduplication

This round extends `G4_EDITOR_POST_FREEZE_BACKLOG_FAIRNESS_RESEARCH.md`. That artifact already establishes backlog eligibility, fairness, starvation, capacity, preemption, feasibility and the boundary `urgency/priority/fairness != authority/admissibility/safety`. This round does not repeat scheduling algorithms. It studies the next unresolved layer: **who may define/change triage policy, how strategic actors can game its inputs, and how adaptive/AI recommendations can create feedback loops or discriminatory outcomes without becoming hidden authority**.

The proprietary-editor target remains Workflow Designer, Component Editor/Componentes, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation/Requirements, Preview/Sandbox and Revision/Diff.

Core boundaries:

`triage recommendation != triage authority`

`measured proxy != business objective`

`priority claim != verified priority`

`model prediction != permission`

`human override != unlimited bypass`

`observed outcome under policy P != counterfactual outcome under policy Q`.

## 2. Evidence base and portable lessons

### 2.1 Priority inputs are abuse surfaces

Kubernetes explicitly warns that an untrusted user able to create highest-priority Pods can evict or starve other work, and points to ResourceQuota as a control. PriorityClass-scoped quota can restrict consumption of high-priority classes.

Sources:
- https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/
- https://kubernetes.io/docs/concepts/policy/resource-quotas/
- https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/

Portable lesson: **priority must have an issuance/admission authority and abuse budget distinct from the queue scheduler**. A field named `priority` must not be self-authenticating.

### 2.2 Criticality and overload controls are policy, not business truth

Google SRE overload guidance uses explicit request criticality classes and expects capacity for critical traffic while allowing lower classes to be shed. This is useful as an operational primitive, but the classification itself remains a governed input.

Source: https://sre.google/sre-book/handling-overload/

Portable lesson: protect capacity by typed class, but do not let every producer label itself critical. `criticality label != entitlement`.

### 2.3 Optimizing a proxy can destroy its usefulness

Manheim and Garrabrant distinguish regressional, extremal, causal and adversarial Goodhart failure modes and emphasize that stronger optimization pressure increases the importance of proxy failure.

Source: https://arxiv.org/abs/1803.04585

Portable lesson: a triage score, SLA-risk predictor or urgency metric can be useful for observation and still become unsafe when directly optimized. Preserve underlying dimensions, provenance and out-of-distribution/uncertainty evidence rather than making the proxy canonical.

### 2.4 Consequential decision rules change actor behavior

Strategic-classification research models agents adapting features in response to decision rules and distinguishes gaming from changes that genuinely improve the desired outcome.

Sources:
- https://proceedings.mlr.press/v119/miller20b.html
- https://proceedings.mlr.press/v202/horowitz23a.html

Portable lesson: publishing or repeatedly applying a triage rule changes the distribution of deadline claims, classifications and submissions. Governance needs manipulation-resistant evidence and must distinguish legitimate improvement from proxy manipulation.

### 2.5 Sequential decisions create feedback effects

Research on fairness in sequential decision making shows that ignoring feedback effects can make fairness interventions worsen unfairness. Performative-prediction work likewise treats deployed predictors as capable of changing the future data distribution.

Sources:
- https://proceedings.mlr.press/v130/wen21a.html
- https://proceedings.mlr.press/v235/lin24ab.html

Portable lesson: fairness and model quality cannot be certified once and assumed stable after deployment. Triage decisions alter wait times, observed breach rates, service histories and therefore the data used by future recommendations.

### 2.6 AI governance requires lifecycle risk management, measurement and monitoring

NIST AI RMF organizes AI risk management around Govern, Map, Measure and Manage, with the Playbook emphasizing operationalization and documentation/monitoring practices.

Sources:
- https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10
- https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook

Portable lesson: adaptive recommendation is not merely another sorting function. It needs model/policy identity, intended-use boundary, measurement, monitoring, change control and fallback behavior.

These sources provide design primitives/trade-offs only; they do not select Kubernetes, Google SRE mechanisms, a fairness definition, an AI model or a scheduler for G4.

## 3. Vocabulary candidates

These are research candidates, not committed schemas/enums.

### 3.1 TriageInputClaim

A typed claim used by triage, with:
- subject/obligation identity;
- claim type (`CRITICALITY`, `DEADLINE`, `IMPACT`, `CUSTOMER_TIER`, `REGULATORY_CLASS`, `RESOURCE_COST`, `DEPENDENCY`, etc.);
- asserted value;
- issuer/authority basis;
- source evidence;
- verification/currentness state;
- mutable/derived/externally-attested classification;
- dispute/anomaly state.

### 3.2 TriagePolicyAuthority

Authority contract for creating, approving, changing, activating, suspending and retiring `TriagePolicyRevision`. It is separate from PermissionPolicy, Domain Command authority and model ownership.

### 3.3 RecommendationModelRevision

Identity/provenance for an adaptive or AI recommendation producer: intended use, input/output contract, training/evaluation evidence references when applicable, known limitations, protected dimensions/cohort tests, calibration/uncertainty contract, policy compatibility, activation horizon and fallback.

### 3.4 RecommendationEvidence

A non-authoritative occurrence recording model revision, pinned input/candidate snapshot, recommendation/ranking, uncertainty/coverage, explanation refs, policy revision and later disposition (`ACCEPTED`, `PARTIALLY_ACCEPTED`, `OVERRIDDEN`, `IGNORED`, `STALE`, `INAPPLICABLE`).

### 3.5 GamingRiskProfile

Projection describing which triage inputs can be strategically manipulated, by whom, at what cost, with what verification controls and what downstream incentive.

### 3.6 PolicyImpactSentinel

A monitoring projection over post-activation outcomes: service distribution, starvation tails, deadline claims, override rate, protected-cohort outcomes, input distribution shift, anomaly/gaming signals and model/policy disagreement. It observes; it does not silently rewrite policy.

### 3.7 TriageGovernanceOccurrence

Evidence for consequential policy/model lifecycle actions: propose, review, simulate, authorize, activate, rollback/suspend, supersede and retire, including actor/authority, semantic diff, live-impact snapshot and proof obligations.

## 4. Findings

### F298 — Priority is a governed claim, not self-authenticating metadata
A producer capable of setting its own unconstrained priority can capture scarce capacity. Priority/criticality claims need typed issuer authority, evidence/currentness and quotas or equivalent bounded issuance where material.

### F299 — Triage-policy authority is distinct from business-effect authority
An actor may be allowed to tune scheduling/fairness policy without being allowed to authorize the Domain Commands ultimately executed. Conversely, a domain approver need not be able to rewrite queue policy.

### F300 — Policy changes require lifecycle governance, not live slider mutation
Changing weights, starvation bounds, protected cohorts, reservations or preemption law can reorder live obligations. Consequential changes require revision identity, semantic diff, simulation/impact evidence, authorization and explicit activation.

### F301 — A proxy becoming an optimization target creates Goodhart risk
SLA-risk, urgency, customer value or predicted breach can guide triage while correlating with the real objective. Once actors/models optimize directly for that proxy, the relationship can fail. Preserve goal/proxy distinction and detect extremal/adversarial use.

### F302 — Deadline claims are strategic inputs when actors benefit from earlier service
If users can choose arbitrary deadlines, the queue creates an incentive to report artificially short deadlines. Deadline provenance, external constraints, allowed ranges and anomaly evidence are therefore part of triage safety.

### F303 — Criticality inflation needs admission and budget controls
If every team can label work `CRITICAL`, criticality loses discriminative meaning and protected capacity is exhausted. High-criticality issuance may need scoped authority/quota and evidence, not merely UI validation.

### F304 — Fairness-key selection is itself a governance decision
Changing fairness from `customer` to `business unit`, merging small cohorts, or choosing a window can materially redistribute service. Fairness-key configuration requires semantic review and cannot be hidden inside a recommendation model.

### F305 — Protected-cohort definitions cannot be inferred opportunistically from observed outcomes
A model finding a convenient cluster is not sufficient to declare or remove a protected cohort. Cohort semantics need policy/requirements provenance and privacy-aware evidence.

### F306 — Recommendation model output remains advisory unless separately admitted by deterministic policy
An AI ranking may predict risk or propose an order. It cannot directly turn `BLOCKED`, `PERMISSION_DENIED`, `STALE` or `UNKNOWN` into executable work.

### F307 — Confidence is not authority
High model confidence does not replace missing permission/currentness/evidence. Low confidence may trigger review or fallback; neither value changes business authority.

### F308 — Human-in-the-loop is not a sufficient safety argument by itself
A human who sees thousands of recommendations may rubber-stamp automation. Consequential use needs bounded override/accept semantics, meaningful review affordances, sampled/audited outcomes and hard gates that remain machine-enforced.

### F309 — Override behavior is evidence for governance, not training truth by default
Human overrides can reveal model error, local knowledge, bias, gaming or policy disagreement. Feeding overrides directly back as labels can amplify mistakes. Their meaning must be qualified before reuse.

### F310 — Adaptive triage creates performative feedback loops
Serving a cohort faster changes its observed waits/breaches and can alter future training/evaluation data. `observed after deployment != policy-independent ground truth`.

### F311 — Historical evaluation is policy-confounded
Past outcomes were generated under prior triage/admission policies. Comparing a new policy/model against historical outcomes without accounting for selection/feedback can fabricate improvement or fairness.

### F312 — Model/policy activation requires pinned compatibility
A recommendation model evaluated against TriagePolicy P7 cannot silently operate under materially changed P9 assumptions. Compatibility/currentness must be explicit; otherwise disposition is `STALE/INAPPLICABLE/UNKNOWN`.

### F313 — Ranking quality and decision quality are different proof domains
A model can rank likely breaches accurately yet produce poor operational decisions if resource costs, permissions, fairness or non-preemptability are omitted. Prediction metrics do not prove end-to-end triage safety.

### F314 — Aggregate performance can hide protected-tail regressions
Higher throughput, fewer average misses or better NDCG can coexist with worse starvation for a small critical cohort. Evaluation and monitoring need cohort/tail/worst-case views inherited from the Fairness Ledger.

### F315 — Optimization pressure needs bounded operating envelopes
A proxy/model may behave acceptably in normal regions and fail at extremes. Recommendation activation should declare input/score/volume regimes for which evidence exists and degrade outside them rather than extrapolate silently.

### F316 — Strategic behavior may be gaming or genuine improvement
An actor changing a feature because triage rewards it is not automatically malicious. The editor should distinguish unsupported manipulation from evidence-backed changes that genuinely reduce risk/cost or satisfy a prerequisite.

### F317 — Explanation must identify governing reason, not merely feature attribution
For consequential triage, operators need to know whether an item was excluded by a hard gate, selected by policy, recommended by a model, boosted by fairness debt or manually overridden. Feature importance alone does not explain authority or decision lineage.

### F318 — Model disagreement is evidence, not majority truth
Multiple recommenders can disagree. Consensus may increase confidence but does not manufacture permission, fairness correctness or semantic truth. Disagreement should be visible and can trigger deterministic fallback/review.

### F319 — Policy/model rollback must preserve live-decision lineage
Rolling back a recommendation model or triage policy does not retroactively erase decisions already made. New decisions bind the active revision; historical decisions retain their original policy/model evidence.

### F320 — Gaming detection must not become secret punitive authority
An anomaly detector may flag suspected manipulation, but suspicion alone must not silently demote, deny or punish business work unless an explicit policy authorizes that consequence with review/evidence semantics.

### F321 — Transparency and anti-gaming are not opposites
Hiding every rule may impede review and still not prevent actors from learning it. Publishing every threshold can ease gaming. The system needs purpose-scoped disclosure: enough semantics for accountability and contestability while protecting abuse-sensitive details where justified.

### F322 — Recommendation presentation can itself bias human decisions
Default ordering, visual salience, badges and auto-selected actions can cause automation bias. UI projection needs explicit `RECOMMENDED` versus `POLICY_REQUIRED`, alternate views and accessible inspection of non-recommended eligible items.

### F323 — Bulk acceptance of recommendations requires snapshot and commitment-time requalification
`Accept top 100` must bind the recommendation/candidate/policy snapshot and revalidate authority/currentness/capacity at commitment. A stale recommendation cannot become execution authority through bulk UX.

### F324 — Offline adaptive recommendations are locally scoped
An offline runtime can recommend over its observed candidate/capacity state but cannot claim global fairness or current fleet priority. Reconnect requires reconciliation; local model output does not reserve remote capacity.

### F325 — Preview/Sandbox is the primary place for policy/model stress testing, not evidence of effective runtime behavior
Preview should support replay, overload, strategic-input perturbation, cohort analysis and counterfactual comparisons over pinned fixtures. Results remain simulated and must be labeled as such.

### F326 — Revision/Diff needs semantic governance facets
Text/model-file diff is insufficient. Compare authority set, fairness key/window, protected cohorts, input provenance requirements, hard gates, reservations, override law, recommendation role, model operating envelope, fallback and live affected set.

### F327 — Continuous monitoring may recommend governance action but must not self-amend constitutional policy
A sentinel can detect drift, gaming, cohort harm or feedback loops and recommend suspend/review. Automatic containment may be preauthorized for bounded safety actions, but monitoring does not gain general authority to rewrite policy.

### F328 — Contestability is a first-class editor concern for consequential triage
Affected operators/owners need a path to inspect the controlling claim/policy/evidence, challenge stale or incorrect inputs and record disposition. Contest does not automatically win, but cannot be represented as ordinary comment text when it can affect consequential ordering.

### F329 — AI recommendations need a deterministic no-AI fallback
Because Builder/runtime autonomy and deterministic execution remain constitutional, loss, staleness or disqualification of the recommender must not make canonical backlog semantics unreadable. A declared deterministic policy/manual review path remains available.

## 5. Shared editor foundation consequences

### Shared primitives

1. `TriageInputClaim` with issuer/evidence/currentness/dispute semantics.
2. `TriagePolicyAuthority` separate from PermissionPolicy and Domain Command authority.
3. `RecommendationModelRevision` and `RecommendationEvidence` as advisory lineage.
4. `GamingRiskProfile` over manipulable inputs and incentive surfaces.
5. `PolicyImpactSentinel` for drift, feedback, cohort harm and gaming signals.
6. `TriageGovernanceOccurrence` for policy/model lifecycle evidence.
7. Semantic diff and live-impact indexes for policy/model changes.
8. Contest/challenge occurrence linked to the exact claim/recommendation/decision.
9. Deterministic fallback declaration and operation-scoped recommender availability.
10. UI semantics separating `POLICY_REQUIRED`, `RECOMMENDED`, `HUMAN_OVERRIDE`, `BLOCKED`, `UNKNOWN` and `EFFECTIVE`.

### Reusable editor infrastructure

**Triage Governance Workbench** — revision lifecycle, authority, semantic diff, live affected set, simulation evidence and activation/suspension state.

**Input Provenance & Gaming Inspector** — shows who asserted deadline/criticality/fairness inputs, evidence/currentness, manipulation risk, anomaly/contest status and downstream incentive.

**Recommendation Review Panel** — model revision, intended use, operating envelope, recommendation, uncertainty, policy compatibility, deterministic hard gates and accept/override evidence.

**Feedback & Cohort Monitor** — before/after distributions, tail starvation, override patterns, input drift, cohort outcomes and feedback-loop warnings without claiming causal proof from correlation alone.

**Contest & Decision Lineage Panel** — exact controlling policy/model/claims, reason, challenge, review and final disposition.

All graph/spatial views require list/tree/table/Inspector and keyboard equivalents. Drag/drop is never the only route to policy change or contest.

## 6. Findings by proprietary editor

### Workflow Designer
Projects recommendation/triage state onto live occurrences without turning queue order into workflow causation. Dependency priority inheritance remains separate from permission inheritance. AI may identify likely bottlenecks but cannot authorize a transition.

### Component Editor / Componentes
Reusable recommendation/priority controls need explicit states for `LOADING`, `EMPTY`, `ERROR`, `STALE`, `READ_ONLY`, `DISABLED`, `BLOCKED`, `PERMISSION_DENIED`, `PENDING`, `EFFECTIVE`, plus `RECOMMENDED` as projection metadata rather than domain state. Salience/color cannot be the sole distinction.

### View/Page Builder
Views need alternate sort/group projections, disclosure of active recommendation/policy revision, cohort/tail visibility and a route to inspect eligible items suppressed by ranking. Responsive/density changes must not hide contestability or minority-critical findings.

### Form Builder
Forms that capture deadline, impact, criticality or classification must expose provenance/validation and allowed claim authority. A required field is not necessarily trusted evidence. AI prefill remains proposed data until validated under field semantics.

### Rules/Decision Editor
Separates hard admission rules, triage objectives and recommendation features. It is the primary place to surface Goodhart/gaming warnings, policy authority, semantic diff and deterministic fallback. Model score predicates require typed calibration/currentness assumptions.

### System/Module Designer
Projects model service dependencies, fallback path, capacity/quota controls and monitoring without making the model a runtime semantic owner. A recommender can be replaceable/off while canonical operation remains possible.

### Elicitation/Requirements
Captures the actual objective, acceptable proxies, strategic actors, protected cohorts, contest rights, fairness scope, manipulation assumptions, monitoring obligations and consequences of false priority. This is where `goal != metric` must remain explicit.

### Preview/Sandbox
Supports pinned-policy/model replay, synthetic overload, deadline/criticality inflation attacks, cohort/tail analysis, feature perturbation, model disagreement and deterministic fallback comparison. `preview recommendation != effective decision`.

### Revision/Diff
Provides facets for authority, objective/proxy, input provenance, fairness semantics, protected cohorts, model revision/operating envelope, override/contest law, fallback and affected live backlog. Small numeric changes can be high-impact semantic changes.

## 7. Cross-app semantic bridge

The bridge remains typed and ownership-preserving:

`Business objective / requirement`
→ `TriageInputClaim + provenance`
→ `Permission/Authority/Currentness hard gates`
→ `TriagePolicyRevision`
→ optional `RecommendationModelRevision`
→ `RecommendationEvidence`
→ `human/deterministic triage decision`
→ `TriageDecisionEvidence`
→ `Command intent`
→ `Workflow/View/Form/Component projection`
→ commitment-time requalification
→ `Domain Effect`
→ `Evidence`
→ `FairnessLedger / outcome observation`
→ `PolicyImpactSentinel`
→ governance review/supersession.

Preserved boundaries:

- `View != Workflow Activity`.
- `Form != Workflow State`.
- `Button != Domain Command`.
- `Component event != authorized action`.
- `visual transition != business transition`.
- `recommendation != authorization`.
- `model confidence != currentness`.
- `proxy optimization != business-goal satisfaction`.
- `fairness metric != fairness authority`.
- `anomaly != proven abuse`.
- `monitoring finding != policy amendment`.

## 8. Declarative + guided composition

Make valid governance easier than invalid governance:

- do not allow high-impact priority/criticality classes without a declared issuer/authority basis;
- flag self-asserted or unverified deadline/criticality inputs;
- require explicit objective/proxy mapping for model-assisted triage;
- show Goodhart/gaming risk when a mutable input directly controls scarce service;
- require protected-cohort/fairness-key declaration before claiming fairness;
- show live affected-set and cohort/tail deltas before activating policy/model changes;
- block model use outside declared compatibility/currentness/operating envelope unless policy explicitly permits degraded advisory use;
- keep hard gates visually and semantically separate from soft recommendation factors;
- require deterministic fallback for model loss/staleness;
- preserve contest/review routes without drag or hidden hover interactions;
- never let AI auto-resolve `UNKNOWN`, permission mismatch, stale evidence or semantic conflict.

## 9. Adversarial scenarios

1. Every team marks new work `CRITICAL` after learning it gets faster service.
2. A user repeatedly sets deadlines one minute in the future to jump the queue.
3. A customer-tier field is editable by the same actor benefiting from higher service.
4. A model optimizes predicted SLA misses until teams change reporting behavior and the proxy loses meaning.
5. A model has excellent average accuracy but systematically under-ranks a small regulated cohort.
6. A fairness-key change merges a minority cohort into a large parent and hides starvation.
7. A policy weight changes from 1.0 to 1.1 but reorders 40% of live backlog.
8. Human reviewers accept 99% of recommendations because the top item is auto-selected.
9. Overrides are fed back as labels and amplify one supervisor's bias.
10. A model trained under P7 is reused after P9 changes capacity reservations.
11. Recommendation confidence is 0.99 but submit permission expired.
12. A model recommends an item whose required Form schema is stale.
13. A gaming detector falsely flags legitimate emergency work and silently demotes it.
14. Two recommendation models disagree; majority vote conflicts with deterministic fairness debt.
15. A strategic actor improves a genuine prerequisite but is incorrectly treated as gaming.
16. A strategic actor changes only a cosmetic proxy and is treated as genuine improvement.
17. Historical replay claims improvement using outcomes selected by the old policy.
18. Faster service reduces observed breaches for one cohort, causing the model to divert capacity elsewhere and oscillate.
19. A model operates far outside the volume/feature region represented in evaluation evidence.
20. Offline runtime ranks local work as globally highest priority without seeing remote backlog.
21. `Accept top 100` uses recommendations generated before permission revocation.
22. A dashboard hides non-recommended eligible items behind virtualization/filtering.
23. Responsive mobile layout removes the contest/explanation control.
24. An accessibility user cannot inspect ranking factors without drag/hover.
25. An AI-generated deadline is persisted as if asserted by the business owner.
26. An AI-generated criticality explanation cites stale evidence.
27. Model suspension makes the queue unusable because no deterministic fallback exists.
28. Model rollback causes historical decision evidence to be reinterpreted under the old model binary rather than its pinned revision.
29. Monitoring detects cohort harm and automatically rewrites fairness weights without authority.
30. Anomaly score is used as a hidden deny rule although policy only authorized review.
31. A producer splits one obligation into many records to gain more scheduling opportunities.
32. A producer merges unrelated work to inherit the highest criticality among children.
33. A protected-capacity quota is exhausted by self-classified critical work before genuine emergencies arrive.
34. A policy is transparent enough for accountability and actors learn to sit exactly below anti-gaming thresholds.
35. A secret policy prevents meaningful contest because affected users cannot learn which claim controlled the decision.
36. A model improves throughput but increases unresolved irreversible-effect risk because effect disposition was omitted from features.

## 10. Proof/test obligations for future planning

Research-only obligations for later materialization:

1. Prove no recommendation path bypasses permission/currentness/hard invariant gates.
2. Prove priority/criticality claims preserve issuer/provenance/currentness.
3. Prove self-asserted high priority cannot silently consume protected capacity without authorized policy.
4. Test deadline inflation and criticality inflation attacks.
5. Test fairness-key/cohort semantic changes against live impact.
6. Prove policy/model revision is pinned in every consequential decision evidence record.
7. Test model use after policy incompatibility/currentness expiry.
8. Test high confidence with missing authority remains blocked.
9. Test recommendation disagreement does not become majority authority.
10. Test anomaly/gaming suspicion does not silently deny unless explicit policy permits that consequence.
11. Test human override cannot bypass hard gates.
12. Test bulk recommendation acceptance against stale candidate/policy/permission snapshots.
13. Test deterministic fallback under model outage/staleness/disqualification.
14. Test historical evidence remains interpretable after model/policy rollback.
15. Test protected-cohort tail outcomes, not only averages.
16. Test feedback-loop/performative shift monitoring under repeated decisions.
17. Test overrides are not automatically treated as ground-truth training labels.
18. Test model outside declared operating envelope degrades visibly.
19. Test strategic feature manipulation versus genuine causal improvement cases.
20. Test split/merge obligation gaming against stable canonical occurrence identity.
21. Test quota exhaustion before genuine emergency arrival.
22. Test accessible explanation/contest without drag, hover or color-only cues.
23. Test responsive/density modes preserve minority-critical visibility/findings.
24. Test Form AI prefill does not acquire claimant authority.
25. Test Preview stress/adversarial scenarios remain non-effective.
26. Test monitoring finding cannot self-amend policy without preauthorized bounded containment semantics.
27. Test contest occurrence binds exact claim/policy/recommendation revision.
28. Test explanation distinguishes hard gate, deterministic policy, model recommendation and human override.
29. Test historical evaluation marks policy-confounded data and assumptions.
30. Test model performance improvement cannot hide worse irreversible-effect or protected-cohort outcomes.
31. Test recommendation ranking never becomes workflow order/canonical domain state by UI persistence alone.
32. Test offline recommendation reconciliation does not fabricate global fairness/capacity reservation.

## 11. Componentization complexity / dependency hotspots

### P0 — LOW/MEDIUM
- typed claim/status badges;
- policy/model revision refs;
- recommendation versus required visual semantics;
- basic provenance/currentness display.

### P1 — MEDIUM/HIGH
- Input Provenance & Gaming Inspector;
- Recommendation Review Panel;
- Contest & Decision Lineage;
- semantic policy/model diff;
- cohort/tail monitoring projections.

### P2 — HIGH/VERY HIGH
- live affected-set impact analysis;
- strategic-input stress simulation;
- policy-confounded historical evaluation;
- feedback-loop/drift monitoring;
- deterministic fallback across editor/runtime contexts;
- offline recommendation/reconciliation.

### P3 — EXTREME
`authority epoch × input-claim provenance × strategic actor/incentive × objective/proxy relation × triage policy revision × fairness/protected cohort × model revision/operating envelope × feedback distribution × capacity × offline frontier × effect disposition × contest/override lineage`.

The complexity is primarily semantic/governance composition, not rendering.

## 12. Maturity, saturation and next gaps

Maturity: `ADVANCED_EMERGING / MATERIAL_DELTA`.

The generic scheduling/fairness mechanics are increasingly saturated. This round adds a material governance layer: priority issuance, strategic manipulation, Goodhart risk, recommendation-model lineage, performative feedback, contestability and deterministic fallback.

Remaining high-value vectors:

1. **pre-overload capacity reservation/admission control for minority-critical obligations** — how to preserve guaranteed headroom before a freeze/incident rather than promise starvation freedom after capacity is already exhausted;
2. **counterfactual evaluation/evidence for policy changes** — how Preview can compare triage policies without presenting observational replay as causal proof;
3. **privacy boundaries of gaming/fairness monitoring** — prevent anti-gaming analytics from becoming cross-client behavioral surveillance;
4. **governance of AI-generated requirements/claims** — especially when elicitation AI proposes deadlines, criticality or protected-cohort semantics.

No implementation or executable planning is authorized by this research.