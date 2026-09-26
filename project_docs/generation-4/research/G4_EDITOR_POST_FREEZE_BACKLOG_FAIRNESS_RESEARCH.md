# G4 Editor Research — Post-Freeze Backlog Triage, Fairness and Starvation Safety

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption is authorized by this artifact.

## 1. Research question

This round extends `G4_EDITOR_SUCCESSION_TEMPORAL_OBLIGATIONS_RESEARCH.md` into the backlog that exists **after** a succession/dispute/governance freeze ends. It deliberately does not repeat generic deadline/lease semantics. The missing question is: when hundreds or thousands of overdue, near-due, blocked, disputed or newly-admissible obligations become runnable under limited human/provider/system capacity, how should the Builder help operators triage them without allowing urgency to fabricate authority, safety violations, conservation failures, starvation or opaque discrimination?

Core boundary:

`urgency/priority/fairness != authority/admissibility/safety`.

The proprietary-editor target remains Workflow Designer, Component Editor/Componentes, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation/Requirements, Preview/Sandbox and Revision/Diff.

## 2. Evidence base and portable lessons

### 2.1 Priority and capacity are independent controls

Kubernetes separates PriorityClass from resource feasibility and documents both preempting and non-preempting high-priority work. It also warns that untrusted users able to assign extreme priorities can starve/evict other work and recommends quota controls around high-priority classes.

Source: https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/

Portable lesson: **priority is a scheduling input, not a permission or resource entitlement**. High importance can move admissible work ahead in a queue; it cannot make an inadmissible effect safe or authorized.

### 2.2 Bounded capacity needs explicit pools/weights

Apache Airflow Pools bound concurrent slot consumption; when capacity is exhausted, runnable tasks queue. Priority weights order queued work, and weight rules can favor upstream or downstream paths. Pool slots additionally represent unequal resource cost.

Sources:
- https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/pools.html
- https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/priority-weight.html

Portable lesson: **capacity class, task cost and queue priority are distinct dimensions**. A backlog workbench should not collapse them into one severity number.

### 2.3 Fairness is a first-class scheduling objective

Temporal's Task Queue Priority & Fairness feature explicitly treats priority and fair resource allocation as separate controls for ordering work across a queue.

Source: https://temporal.io/changelog/priority-fairness-generally-available

Portable lesson: a shared editor needs to expose both **importance** and **fair-share/fairness key**, not infer fairness from static priority alone.

### 2.4 Pure efficiency/priority policies can starve work

Scheduling literature repeatedly exposes the trade-off: shortest-job policies improve mean delay but can starve large/low-priority work under sustained arrivals; fair scheduling and aging mechanisms address starvation at some efficiency cost. Quincy additionally models fairness and starvation-freedom together with locality/cost constraints rather than treating scheduling as a single scalar ordering problem.

Sources:
- https://openscholarship.wustl.edu/cse_research/121/
- https://www.microsoft.com/en-us/research/publication/quincy-fair-scheduling-for-distributed-computing-clusters/
- https://doi.org/10.1002/dac.744

Portable lesson: **post-freeze triage is multi-objective**. Deadline, criticality, wait age, fairness, resource cost, dependency unlock value and risk can conflict. A single opaque score is insufficient evidence for a consequential scheduling decision.

### 2.5 Deadline scheduling under overload does not make every deadline achievable

Weakly-hard real-time research studies bounded deadline misses under transient overload rather than assuming all deadlines remain satisfiable. This is a useful conceptual warning for a business backlog after a freeze: once demand exceeds capacity, scheduling can change which misses occur, but cannot fabricate capacity or retroactively satisfy already-missed obligations.

Source: https://doi.org/10.1145/3356865

Portable lesson: the UI must surface **infeasibility and predicted misses**, not merely reorder rows and imply that every obligation can still succeed.

These sources provide primitives/trade-offs only; they do not select a scheduler/provider for G4.

## 3. Vocabulary candidates

These are research candidates, not committed schemas/enums.

### 3.1 BacklogObligationRef

Projection/index reference to a live obligation with:
- canonical occurrence/obligation identity and semantic owner;
- authority/admissibility disposition;
- temporal state (`NOT_DUE`, `NEAR_DUE`, `OVERDUE`, `EXPIRED`, `UNKNOWN`, etc.);
- criticality/safety class;
- resource/capacity class and estimated demand when known;
- dependency/blocker set;
- fairness key(s) and protected cohort refs;
- arrival/freeze/release/wait observations;
- consequence/breach/remediation state;
- evidence/currentness refs.

The backlog index never becomes owner of the obligation.

### 3.2 TriagePolicyRevision

Versioned policy describing how **already-admissible** competing obligations are ordered/allocated. Candidate dimensions:
- hard invariant gates;
- priority/criticality classes;
- deadline/laxity contribution;
- aging/starvation bounds;
- fair-share/fairness keys;
- reserved capacity for protected classes;
- resource cost/capacity pools;
- dependency-unlock contribution;
- preemption rules where interruption is semantically safe;
- tie-break semantics;
- explainability/evidence requirements.

`triage policy != permission policy`.

### 3.3 TriageDecisionEvidence

Evidence for a consequential queue decision: candidate set/query snapshot, policy revision, capacity snapshot, authority/currentness qualification, relevant inputs, exclusions, chosen action, fairness/starvation counters, predicted consequences and human override evidence where applicable.

### 3.4 CapacityEnvelope

A scoped statement of available service capacity by resource/provider/human skill class and horizon. It is evidence for planning, not permission to execute an effect.

### 3.5 StarvationBudget

A bounded policy obligation saying how long or how many eligible scheduling opportunities a class/item may be deferred before escalation/reservation/review is required. Aging can increase scheduling claim; it never bypasses authorization/safety.

### 3.6 FairnessLedger

A projection of service received versus qualified entitlement/weight across fairness keys/cohorts over a declared window. It must preserve small critical cohorts rather than hiding them in aggregate averages.

### 3.7 BacklogFeasibilityAssessment

A projection answering whether the known capacity envelope can satisfy known deadlines/service objectives and which obligations are already impossible or at risk. `infeasible != unauthorized`; `authorized != feasible`.

## 4. Findings

### F268 — Post-freeze release is an admission transition, not a bulk execution command
When governance resolves, previously blocked obligations must be individually/batch requalified for authority, currentness, schema/policy compatibility and temporal consequence. `freeze ended != everything queued may execute`.

### F269 — Priority cannot manufacture authority
An overdue or critical obligation may deserve immediate review, but it cannot bypass permission, conservation, fencing, required evidence or domain-state preconditions.

`most urgent != authorized`.

### F270 — Fairness applies only after hard invariants and admissibility gates
Fair scheduling allocates scarce service among candidates that are eligible under the relevant operation contract. It cannot average away a safety/security/ownership invariant.

### F271 — One scalar priority score is insufficient for consequential triage
Criticality, deadline/laxity, wait age, customer/cohort fairness, cost, dependency unlock value, safety and remediation status can conflict. Preserve the vector and policy derivation; a scalar may be a projection/ranking aid only.

### F272 — Static priority without aging/starvation policy can indefinitely hide valid work
A continuous stream of high-priority arrivals can starve older low-priority obligations. Aging/starvation bounds are candidate scheduling primitives, but they must remain bounded by safety and authority.

### F273 — Aging increases scheduling claim, not business privilege
A task waiting 30 days may be escalated or reserved capacity, but waiting does not grant a missing permission, renew expired evidence or convert `UNKNOWN` into permission.

### F274 — Deadline-first is useful but not universally safe
Earliest deadline may reduce misses in some workloads, but a near deadline can belong to a low-consequence item while a later deadline protects a catastrophic invariant. Triage policy needs typed consequence/criticality, not deadline alone.

### F275 — Already-missed obligations require consequence/remediation semantics, not fake urgency
Once a non-extendable deadline is breached, executing immediately may still be required, prohibited, settlement-only or require reauthorization. `OVERDUE` is not a universal command to execute.

### F276 — Capacity infeasibility must be explicit
If known backlog demand cannot meet known horizons, the editor should surface predicted misses/shortfalls and the assumptions producing them. Reordering cannot masquerade as capacity.

### F277 — Resource cost and queue priority are separate
A heavy task consuming all provider/human capacity can block many small tasks; blindly preferring shortest jobs can starve heavy work. Capacity pools, cost estimates and fairness need independent representation.

### F278 — Fairness needs an explicit key and scope
Fairness by Client, customer, business unit, legal obligation class, workflow, tenant or resource can produce different schedules. `fair` without `fairnessKey + window + weight/entitlement + scope` is underspecified.

### F279 — Aggregate fairness can conceal minority-critical starvation
A system can look fair overall while a small protected cohort never receives service. The Fairness Ledger needs cohort-level and tail/worst-case views, not only mean throughput/wait.

### F280 — Priority inheritance is not permission inheritance
If a critical obligation is blocked by a lower-priority prerequisite, the prerequisite may receive scheduling urgency sufficient to unblock it. It does not inherit the downstream obligation's business authority or permissions.

### F281 — Dependency unlock value is a scheduling signal, not workflow ownership
Completing one admissible prerequisite may release many obligations. The triage layer may project this value but cannot become the owner of workflow causation or silently execute prerequisite Domain Commands.

### F282 — Preemption is only valid where interruption semantics permit it
Stopping low-priority work to serve urgent work is safe only when the interrupted operation declares a resumable/cancellable/compensatable boundary. Preempting an in-flight external effect can duplicate or corrupt it.

### F283 — Non-preempting priority is a necessary semantic distinction
Some high-priority work should move ahead of queued work but must not cancel in-flight work. Editor policy needs `queue precedence` separate from `preemption authority`.

### F284 — Manual override needs bounded authority and evidence
Operators may override a suggested order, but the override must not bypass hard gates. Consequential overrides should preserve actor, reason, scope, policy revision, affected obligations and resulting risk.

### F285 — Bulk triage must bind to a qualified candidate snapshot
Selecting "all overdue" while the queue is changing can accidentally include newly arrived or newly unauthorized items. Bulk actions need query/snapshot identity, exclusions, revalidation at commitment and partial-result evidence.

### F286 — Offline backlog views cannot mint global fairness
An offline runtime knows only its observed subset/capacity/currentness. It may continue within prequalified local rights, but cannot claim fleet/global fairness or consume capacity allocated elsewhere without the relevant evidence.

### F287 — Reconcile must not double-count wait age or service credit
Forked/offline observations may report the same obligation waiting/served in multiple branches. Stable obligation/effect identity and qualified reconciliation are required before fairness/starvation metrics become authoritative evidence.

### F288 — New arrivals after freeze resolution must not permanently displace frozen backlog
A policy may reserve some capacity for fresh critical arrivals, but needs an explicit fairness/starvation rule so the released backlog is not perpetually postponed by a live stream.

### F289 — Backlog triage must distinguish service order from authorization order
Review/authorize/publish/execute can have different bottlenecks and authorities. A work item can be first for review while still blocked for effect; one global queue state is misleading.

### F290 — UI visibility/ranking cannot become canonical priority
Sort order, collapsed groups, virtualized rows, filters, search ranking or AI recommendations are projections. Hidden/low-ranked obligations retain their semantic priority/fairness rights.

### F291 — AI triage is advisory unless a deterministic policy/evidence contract says otherwise
AI may explain clusters, predict risk or suggest order, but cannot silently alter authority, protected-class fairness, conservation or hard safety constraints. Suggestions need visible assumptions and deterministic requalification before consequential actions.

### F292 — Priority-policy changes require semantic diff and live impact analysis
Changing `critical > overdue > normal` to another ordering, fairness weights, starvation bound or capacity reservation can reorder thousands of live obligations. Textual diff is insufficient.

### F293 — Preview must simulate overload without claiming effective scheduling evidence
Sandbox can replay candidate policies over pinned backlog/capacity snapshots and show predicted misses/fairness/starvation, but simulation does not reserve real capacity or authorize effects.

### F294 — Accessibility-equivalent triage cannot depend on drag ordering
Every queue reorder, grouping, priority inspection and override must have keyboard/list/table/command equivalents. Drag order itself must not be canonical business priority unless committed through the same validated command semantics.

### F295 — Explainability needs counterfactuals for consequential ordering
For a deferred critical item, the operator should be able to inspect why it was not selected: hard gate, higher criticality, earlier deadline, fairness debt, resource mismatch, dependency, non-preemptability or missing currentness. "Score 82" is inadequate proof.

### F296 — Starvation proof is policy- and load-assumption scoped
No scheduler can promise bounded wait if admissible higher-class demand permanently exceeds capacity unless capacity reservation/admission shedding or another explicit guarantee exists. The UI must expose the assumptions behind starvation guarantees.

### F297 — Triage completion does not settle backlog consequences
Processing all released work does not erase SLA breaches, missed deadlines, duplicate/unknown effects or remediation obligations accumulated during freeze. Operational clearing and semantic settlement remain separate.

## 5. Shared editor foundation consequences

### Shared primitives

1. `BacklogObligationRef` projection with stable canonical identity.
2. `TriagePolicyRevision` separate from Permission/Authority policy.
3. `TriageDecisionEvidence` with candidate/capacity snapshots and derivation.
4. `CapacityEnvelope` and typed resource pools.
5. `StarvationBudget`/aging counters bounded by hard gates.
6. `FairnessLedger` with explicit key/window/weight and protected cohorts.
7. `BacklogFeasibilityAssessment` with predicted miss/shortfall evidence.
8. Multi-dimensional queue state: eligibility, authority, temporal state, priority, fairness debt, resource feasibility, dependency state, effect disposition.
9. Command Registry preconditions for review/reprioritize/reserve-capacity/override/authorize/publish/execute as distinct commands.
10. Reverse-impact index from policy/capacity/authority/schema changes to live backlog.
11. Findings for starvation, deadline inversion, minority-cohort starvation, priority abuse, unauthorized urgency, resource mismatch, unsafe preemption and hidden obligations.
12. Semantic Diff facets for weights, fairness keys, starvation bounds, preemption law, tie-breaks and reserved capacity.
13. Preview workload/capacity fixtures with non-effective labeling.
14. Keyboard/list/table equivalents for every spatial/drag queue interaction.

### Reusable editor infrastructure

**Backlog Triage Workbench** — candidate table/tree with pinned snapshot, eligibility, consequence, deadline/laxity, fairness debt, capacity fit, dependencies and evidence. Ranking is projection, not authority.

**Fairness & Starvation Inspector** — fairness key/window, service received, wait age, starvation budget, protected cohort and assumptions.

**Capacity/Feasibility Panel** — capacity envelope, resource pools, predicted misses and what-if scenarios without pretending simulation changes runtime state.

**Triage Semantic Diff** — compares policy meaning and affected live obligations, not just weight numbers.

**Decision Explanation / Proof panel** — shows why an item was selected/deferred/excluded and which hard gate or scheduling objective controlled the decision.

## 6. Findings by proprietary editor

### Workflow Designer
Projects backlog across live workflow occurrences, prerequisites and Human Tasks. Priority inheritance may schedule an admissible blocker earlier but never transfers downstream authority. Workflow graph remains causation/occurrence owner; triage is a projection.

### Component Editor / Componentes
Reusable queue/list/card components need states for `LOADING`, `EMPTY`, `ERROR`, `STALE`, `READ_ONLY`, `DISABLED`, `BLOCKED`, `PERMISSION_DENIED`, `PENDING`, `EFFECTIVE`, plus visible distinction between priority, authority and fairness debt. Visual emphasis cannot be the only carrier of criticality.

### View/Page Builder
Views can project filtered backlog cohorts and capacity risk. Responsive/density variants must not silently hide minority-critical items; aggregation requires drill-down/findings and equivalent accessible semantics.

### Form Builder
A form for review/remediation can be top-ranked while submit/approve remains blocked. Autosave survives queue movement; authority/currentness is rechecked at consequential submission.

### Rules/Decision Editor
Owns declarative triage policy only if that policy is actually its bounded artifact; expression/state-matrix tooling should expose hard gates separately from soft scheduling objectives and reject/flag rules where urgency bypasses permission or `UNKNOWN` becomes eligible.

### System/Module Designer
Projects capacity/resource dependencies, queue boundaries and effect-side preemption/fencing constraints. Resource locality/capacity does not create semantic ownership.

### Elicitation/Requirements
Captures whose fairness matters, protected cohorts, acceptable starvation bounds, hard/soft deadlines, overload behavior, override authority, capacity assumptions, remediation rules and evidence obligations.

### Preview/Sandbox
Replays pinned backlog/capacity/policy snapshots under overload, burst, starvation and new-arrival scenarios. Can compare policies and predicted consequences but never creates real reservations/authority/effect evidence.

### Revision/Diff
Shows semantic change in fairness key, weight, starvation bound, deadline contribution, capacity reservation, preemption, tie-break and affected live backlog. A small numeric diff can be a large operational/governance change.

## 7. Semantic bridge

`Organization/Authority Epoch`
→ `Live Right/Obligation + TemporalObligationRef`
→ `post-freeze requalification`
→ `Permission/Policy/Currentness hard gates`
→ `BacklogObligationRef`
→ `TriagePolicyRevision + CapacityEnvelope + Fairness/Starvation state`
→ `TriageDecisionEvidence`
→ `Command intent`
→ `Workflow/View/Form/Component projection`
→ `commitment-time authority/currentness/capacity recheck where required`
→ `Domain State / external Effect`
→ `Evidence`
→ `fairness/service accounting + deadline/SLA/remediation settlement`.

Preserved boundaries:
- `View != Workflow Activity`;
- `Form != Workflow State`;
- `Button != Domain Command`;
- `Component event != authorized action`;
- `visual transition != business transition`;
- `urgency != authority`;
- `priority != permission`;
- `aging != privilege escalation`;
- `fairness != invariant weakening`;
- `queue order != workflow order`;
- `capacity != effect authority`;
- `priority inheritance != permission inheritance`;
- `preview schedule != effective runtime schedule`.

## 8. Required scenarios and adversarial cases

1. Freeze ends with 10,000 overdue obligations but capacity for 100/hour.
2. Continuous high-priority arrivals starve released normal backlog.
3. Aging pushes a task upward while its permission has expired.
4. Earliest-deadline-first selects a low-consequence item over a later catastrophic-safety obligation.
5. Shortest-job policy indefinitely defers a large mandatory reconciliation.
6. One tiny protected cohort is starved while aggregate fairness metrics look healthy.
7. One customer floods the queue with high priority labels.
8. Critical downstream task is blocked by a low-priority prerequisite; scheduling urgency is inherited but permission is not.
9. High-priority work requires unsafe preemption of an in-flight external effect.
10. Non-preempting urgent work must wait for capacity without cancelling existing effects.
11. Manual override moves a VIP task ahead but lacks authority to bypass a legal hold.
12. Bulk `all overdue` selection changes between review and commit.
13. Schema change breaks the Form needed by the highest-ranked Human Task.
14. Permission change makes a previously eligible item `PERMISSION_DENIED` while it remains urgent.
15. Workflow activity requires a form, but no compatible/current form binding exists.
16. Command exists without UI binding; backlog remains actionable through another authorized surface/API.
17. UI control exists without authorized command; visual prominence must not create action authority.
18. Offline runtime services a local queue while another successor consumes the same conserved capacity.
19. Rejoin double-counts wait age/service credit across branches.
20. Queue filter hides a minority-critical cohort.
21. Virtualized list never renders a critical item; semantic findings still detect it.
22. AI recommends a schedule that improves mean lateness by starving a regulated cohort.
23. Capacity estimate is stale and simulation claims deadlines are feasible.
24. Resource pool is available but required skill/provider permission is not.
25. Overdue obligation's legal consequence is settlement-only; executing original effect would be wrong.
26. Priority-policy revision changes fairness weights while thousands of live items exist.
27. Preview shows an attractive schedule but production has different capacity/currentness.
28. Drag reorder has no keyboard equivalent.
29. Two equally ranked items need a deterministic/auditable tie-break without pretending semantic superiority.
30. Backlog is operationally cleared while unresolved SLA breach/effect reconciliation remains.

## 9. Proof/test obligations for future planning

Research-only obligations to preserve for future WBS synthesis:

1. Prove no priority/aging path bypasses authority, permission, safety, conservation or fencing gates.
2. Prove `UNKNOWN` never becomes eligibility merely due to urgency.
3. Verify post-freeze release requalifies authority/currentness before consequential actions.
4. Verify static-priority starvation is detected under sustained arrivals.
5. Verify aging cannot renew expired permission/evidence.
6. Verify fairness key/window/weight are explicit in consequential decisions.
7. Verify protected minority cohorts are visible independently of aggregate averages.
8. Verify capacity infeasibility produces findings/predicted misses rather than false feasibility.
9. Verify resource cost and priority remain separate dimensions.
10. Verify priority inheritance does not copy permissions/authority.
11. Verify dependency unlock value does not auto-execute prerequisites.
12. Verify preemption only occurs at declared safe boundaries.
13. Verify non-preempting priority is representable.
14. Verify manual override cannot bypass hard gates and leaves evidence.
15. Verify bulk triage binds to a qualified candidate snapshot and revalidates at commit.
16. Verify offline/local scheduling cannot claim global fairness without evidence.
17. Verify branch reconciliation does not double-count service/wait/fairness credit.
18. Verify fresh arrivals cannot starve released backlog beyond declared policy assumptions.
19. Verify review/authorization/execution queue states remain separable.
20. Verify sorting/filtering/virtualization cannot erase canonical obligations or semantic findings.
21. Verify AI ranking is advisory and deterministic gates remain authoritative.
22. Verify triage policy diff computes affected live obligations.
23. Verify Preview pins policy/backlog/capacity/currentness fixtures and remains non-effective.
24. Verify every drag/reorder path has keyboard/list/command equivalent.
25. Verify decision explanations expose controlling gate/objective, not only an opaque score.
26. Verify starvation guarantees expose load/capacity assumptions and degrade to `UNKNOWN/NOT_GUARANTEED` when assumptions fail.
27. Verify already-missed deadlines preserve consequence/remediation semantics.
28. Verify clearing queue work does not mark SLA/effect settlement complete automatically.
29. Verify required workflow-form bindings and command/UI bindings are checked independently of queue priority.
30. Verify permission/schema changes invalidate affected queue eligibility without deleting draft/work evidence.

## 10. Componentization complexity / dependency hotspots

### P0 — LOW/MEDIUM
- backlog refs/status chips;
- typed priority/fairness/capacity refs;
- accessible table/tree projections;
- static findings.

### P1 — MEDIUM/HIGH
- Backlog Triage Workbench;
- Fairness & Starvation Inspector;
- Capacity/Feasibility Panel;
- Decision Explanation/Proof panel;
- semantic diff facets and impact indexes.

### P2 — HIGH/VERY HIGH
- adapters across Workflow/Form/View/Component/Rules/System/Elicitation/Preview/Revision;
- live query snapshots and bulk revalidation;
- offline draft/reconcile and fairness accounting;
- overload simulation and live-impact projections.

### P3 — EXTREME

`authority epoch × obligation class × temporal consequence × hard invariant × priority/aging × fairness key/window × protected cohort × resource capacity/cost × dependency graph × preemption semantics × offline frontier × effect disposition × policy revision`.

This is a future decomposition hotspot only; it is not a WBS.

## 11. Maturity and next vector

Maturity: `ADVANCED_EMERGING / MATERIAL_DELTA`.

The shared-editor foundation is increasingly saturated for generic queue primitives. The remaining high-value gap exposed by this round is **triage-policy governance and anti-gaming under adaptive/AI recommendations**: how to detect priority inflation, strategic deadline manipulation, fairness-key abuse, model-induced discrimination, feedback loops and Goodhart effects while retaining explainability and local autonomy. This should remain separate from ordinary scheduler implementation.

A second follow-up vector is **capacity reservation/admission control for hard minority-critical obligations before a freeze happens**, because starvation freedom cannot be guaranteed after overload if critical demand was never protected by capacity/admission assumptions.
