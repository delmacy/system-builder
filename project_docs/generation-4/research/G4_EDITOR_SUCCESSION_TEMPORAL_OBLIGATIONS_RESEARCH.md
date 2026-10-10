# G4 Editor Research — Succession Temporal Obligations, Clocks and Freeze Semantics

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption is authorized by this artifact.

## 1. Research question

This round extends `G4_EDITOR_SUCCESSION_EXCLUSIVE_RIGHTS_LIVE_OBLIGATIONS_RESEARCH.md` into the temporal boundary: during merger, split, transfer, dissolution, governance freeze or disputed succession, what happens to deadlines, leases, reservations, SLA clocks, escalation timers, temporary permissions and currentness horizons?

It deliberately deduplicates `G4_CANVAS_TEMPORAL_DEADLINE_LEASE_SEMANTICS.md`. That artifact already establishes that deadline, timeout, currentness, lease, cancellation, escalation and settlement horizons are distinct; this round adds the missing **succession/freeze transfer law** and shared-editor consequences.

Core question:

`authority frozen or transferred != time automatically paused, reset, extended or expired`.

The proprietary-editor target remains Workflow Designer, Component Editor/Componentes, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation/Requirements, Preview/Sandbox and Revision/Diff.

## 2. Evidence base and portable lessons

### 2.1 Workflow timers are typed semantics, not a generic clock

Camunda 8 documents interrupting and non-interrupting timer boundary events and notes that Zeebe timers can fire later than their configured due date under load, but not earlier. Wait-state inspection separately surfaces timer/user-task due dates without turning waiting itself into a new business state.

Sources:
- https://docs.camunda.io/docs/components/modeler/bpmn/timer-events/
- https://docs.camunda.io/docs/next/components/wait-states/overview/

Portable lesson: **due time, observed firing, interruption, escalation and business consequence remain distinct**. A succession event must not reinterpret an existing timer merely because responsibility changed.

### 2.2 Relative waits and absolute deadlines are different contracts

AWS Step Functions supports both relative waits (`Seconds`) and absolute waits (`Timestamp`), while task timeout and heartbeat semantics are separately defined. Deadline propagation guidance in Google SRE similarly treats an absolute request deadline as a budget that shrinks as work traverses layers, rather than restarting at each hop.

Sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/state-wait.html
- https://docs.aws.amazon.com/step-functions/latest/dg/state-task.html
- https://sre.google/sre-book/addressing-cascading-failures/

Portable lesson: **migration/reassignment must preserve the temporal basis**. Copying a remaining duration into a new occurrence can be materially different from preserving an absolute deadline; restarting a timeout at every succession hop can silently expand the original contract.

### 2.3 Leases coordinate temporary authority but do not fence stale effects

Kubernetes Lease objects expose holder identity, renew time and lease duration and are used for node heartbeats and leader election. The established fencing-token literature shows why lease expiry alone cannot stop a paused holder from later writing: the protected resource must reject stale generations/tokens.

Sources:
- https://kubernetes.io/docs/concepts/architecture/leases/
- https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html

Portable lesson: **succession of a lease-like authority requires both temporal/currentness reasoning and effect-side exclusion where conflicting effects matter**.

### 2.4 Human-facing time limits have accessibility obligations

WCAG 2.2 SC 2.2.1 requires many content-imposed time limits to be turn-offable, adjustable or extendable, with defined exceptions for essential/real-time constraints.

Sources:
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable
- https://www.w3.org/TR/wcag/

Portable lesson: **a governance freeze cannot justify inaccessible countdown UX**. Where a human-facing timer is adjustable, the adjustment capability must remain keyboard/non-drag accessible; where the deadline is externally fixed or essential, the UI must communicate that rather than pretending it can extend the domain obligation.

These sources provide primitives/trade-offs only; they do not select providers or engines for G4.

## 3. Temporal transfer vocabulary candidates

These are research roles, not committed schemas/enums.

### 3.1 TemporalObligationRef

A typed reference to a temporal contract attached to a live right/obligation, with:
- semantic owner/object/occurrence identity;
- temporal role (`BUSINESS_DEADLINE`, `EXECUTION_TIMEOUT`, `AUTHORITY_LEASE`, `RESERVATION`, `SLA_CLOCK`, `ESCALATION_TIMER`, `CURRENTNESS_HORIZON`, `CANCELLATION_HORIZON`, `SETTLEMENT_HORIZON`, `TEMPORARY_PERMISSION`);
- basis (`ABSOLUTE_INSTANT`, `ELAPSED_DURATION`, `BUSINESS_CALENDAR`, `PROVIDER_LEASE`, `EVIDENCE_AGE`, other qualified profile);
- source policy/revision;
- start/due/renewal observations as applicable;
- pause/extension/transfer law;
- consequence law;
- currentness and evidence lineage.

### 3.2 TemporalSuccessionDisposition

Candidate dispositions:
- `CONTINUES_UNCHANGED`;
- `TRANSFERS_WITH_ORIGINAL_HORIZON`;
- `PAUSED_BY_QUALIFIED_POLICY`;
- `EXTENDED_BY_QUALIFIED_POLICY`;
- `REBASED_BY_EXPLICIT_NEW_OBLIGATION`;
- `EXPIRES_ON_CUTOVER`;
- `FROZEN_PENDING_DISPUTE`;
- `SETTLEMENT_ONLY`;
- `BELOW_FLOOR_UNRESOLVABLE`;
- `UNKNOWN`.

The disposition must be named per temporal obligation. A governance freeze is not a universal pause primitive.

### 3.3 TemporalTransferEvidence

Evidence that a live temporal obligation changed responsibility without silently changing its time contract. Candidate fields include source/target authority epochs, original temporal basis, qualified cutover frontier, pause intervals if legally/contractually allowed, extension authority, resulting horizon, already-fired timers/escalations, reservation/lease generations, effect fences and proof/findings.

### 3.4 FreezeInterval

A qualified interval during which a named operation class or authority relation is blocked. A freeze may affect admissibility while the underlying domain clock continues.

`freeze interval != paused business clock`.

### 3.5 TemporalDebt / TimeAtRisk

A projection of obligations that continue aging while action is blocked. This is not a new business owner. It answers: which deadlines/SLA/reservations will breach or expire if the dispute persists, and what consequences are already unavoidable?

## 4. Findings

### F246 — Every live temporal obligation needs an explicit succession law
A right/task/effect can transfer while its deadline continues, pauses, expires, or is replaced only according to the underlying contract. There is no safe default `reset timer on new owner`.

### F247 — Governance freeze and domain-time pause are independent
Blocking `AUTHORIZE` or `NEW_EFFECT` during a dispute does not pause contractual, statutory, provider or customer-facing deadlines unless a qualified rule explicitly does so.

`cannot act != clock stopped`.

### F248 — Reassignment must not silently reset elapsed budgets
If a task had 2 hours remaining before succession, recreating it with a fresh 24-hour timeout changes the obligation. Preserve original absolute/elapsed semantics or record an explicit authorized extension/new obligation.

### F249 — Absolute deadline and remaining-duration transfer are not interchangeable
An absolute 17:00 deadline remains 17:00 across ownership migration unless policy changes it. A relative execution timeout may be tied to an attempt and may legitimately restart only when a new attempt is semantically admitted.

### F250 — Already-fired escalation remains historical evidence after succession
A reminder/escalation triggered under predecessor authority is not erased or re-fired merely because responsibility moves. Successor handling is a new occurrence linked to the original timer/evidence.

### F251 — Temporary permissions need both authority and temporal continuity
A permission valid until T cannot be copied to a successor as `valid for another N hours` unless its policy explicitly grants a new interval. Organizational succession does not mint a fresh temporary grant.

### F252 — Reservation transfer is a conservation problem plus a time problem
A reservation can be exclusive/conserved and also expire. Transfer must preserve quantity/exclusivity and the qualified expiry law. Expired capacity cannot be resurrected by moving it to a successor.

### F253 — Lease handoff requires generation/fence semantics, not just remaining TTL
A successor receiving a lease-like right needs a qualified generation/authority transition. Copying predecessor TTL does not prove stale-holder exclusion; effect-side fencing remains required where dual effects are unsafe.

### F254 — `UNKNOWN` time observations cannot manufacture extension
If an offline runtime cannot prove whether a lease was renewed, timer fired, or provider reservation expired, reconcile to `UNKNOWN`/blocked as required by the invariant. Connectivity loss is not an extension grant.

### F255 — SLA clocks can continue while operational authority is frozen
A customer/service SLA may measure elapsed service unavailability regardless of an internal governance dispute. Editors need to surface accumulating breach risk rather than pausing the clock for UI convenience.

### F256 — Some clocks legitimately pause, but pause authority is its own contract
Examples may include an internal review SLA whose policy excludes formally declared legal hold intervals. The pause needs explicit authority, start/end evidence and scope. `hold exists` alone does not imply every clock pauses.

### F257 — Freeze can create temporal impossibility before authority is resolved
If a non-extendable deadline passes during a dispute, later authority resolution cannot pretend timely performance remained possible. The resulting state may be breach/expired/revalidation-required/remediation-required according to the domain contract.

### F258 — Temporal residue is first-class
During a split, an obligation may have a known deadline but unknown successor. Preserve it as `FROZEN_PENDING_DISPUTE` with aging/risk visible; do not duplicate the timer on every candidate successor.

### F259 — Deadline ownership and responsibility ownership remain separate
A deadline belongs to the obligation/contract lineage, not to the current assignee UI object. Reassigning a Human Task changes responsibility without necessarily changing due/follow-up dates.

### F260 — Offline runtimes need temporal horizons pinned before disconnection
An offline runtime may exercise temporary rights only within the already-qualified horizon and monotonic floors. Restart, snapshot restore or local clock rollback must not extend lease/currentness/permission life.

### F261 — Reconnection must reconcile fired/expired observations without duplicate effects
If predecessor and successor independently observe a timer due and both issue an escalation, stable occurrence/effect identity and idempotency/fencing determine reconciliation. `same due time` is not sufficient dedup identity.

### F262 — Preview time travel must be explicitly synthetic
Preview/Sandbox may evaluate `as-of` or accelerated clocks, but simulated expiry, escalation or lease loss cannot become runtime evidence. Fixture clock, policy revision and authority epoch must be pinned.

`preview clock != effective runtime clock`.

### F263 — Revision/Diff needs temporal-semantic facets
A one-line change from `CONTINUE` to `PAUSE_DURING_GOVERNANCE_FREEZE`, or from absolute deadline to duration-from-assignment, is a high-impact semantic change even if visual structure is unchanged.

### F264 — Accessibility timing and domain timing are separate layers
Extending a UI interaction timeout for accessibility must not silently extend a business deadline, auction window, security lease or provider reservation. Conversely, a fixed domain deadline must not force an inaccessible UI countdown when an equivalent non-timed interaction path can exist.

### F265 — Autosave/offline drafts cannot freeze authority/currentness clocks
Saving a draft preserves authoring work. It does not preserve a temporary permission, lease, evidence freshness or deadline admissibility. Publish/authorize/effect must requalify temporal dependencies.

### F266 — Timer processing lateness must not rewrite succession cutover history
If a timer due before cutover fires after cutover because processing was delayed, the system preserves `DueAt`, `ObservedAt`, authority epoch and consequence law. Whichever actor processes it does not retroactively move the deadline into its own epoch.

### F267 — Time-based compatibility filtering should prevent impossible composition
The guided editor can filter targets that cannot satisfy remaining horizon/currentness prerequisites, flag non-transferable timers/reservations, and surface `will expire before qualified cutover` before authorization.

## 5. Shared editor foundation consequences

### Shared primitives

1. `TemporalObligationRef` with typed temporal role and basis.
2. `TemporalSuccessionDisposition` and `TemporalTransferEvidence`.
3. `FreezeInterval` distinct from pause interval.
4. Clock/calendar/currentness provenance refs.
5. Timeline/history projection preserving `DueAt`, `ObservedAt`, `EffectiveAt`, `SettledAt`.
6. Command Registry preconditions for time/currentness at review, authorization and commitment frontiers.
7. Findings for expired-before-cutover, unauthorized extension, duplicated timers, stale temporary permissions and unfenced lease handoff.
8. Reverse-impact index from policy/authority/schema changes to live temporal obligations.
9. Dirty/autosave/offline reconcile that preserves draft content but requalifies time-sensitive authority.
10. Revision/Diff facets for temporal basis, pause/extension law, deadline movement, lease generation and currentness.
11. Preview clock fixtures with permanent non-effective labeling.
12. Keyboard/list/table equivalents for every timeline/drag interaction.

### Reusable editor infrastructure

**Temporal Obligation Inspector** — typed clock, source policy, current horizon, pause/extension authority, currentness and consequences.

**Succession Timeline Review** — predecessor/successor epochs, cutover, freeze intervals, due/fired/settled observations and unresolved temporal residue.

**Time-at-Risk Browser** — obligations that continue aging while governance/action is blocked, grouped by consequence/severity without hiding minority-critical items.

**Temporal Semantic Diff** — compares meaning, not just timestamps: absolute vs relative, pause law, extension authority, consequence and commitment-time recheck.

**Temporal Findings/Proof panel** — detects reset-on-reassignment, expired reservation resurrection, stale lease/permission, missing fence, deadline passed during freeze, duplicate escalation and inaccessible time-dependent interaction.

## 6. Findings by proprietary editor

### Workflow Designer
Workflow timers, Human Task due/follow-up dates, escalation and migration remain separate. Reassignment during succession preserves occurrence lineage and original timer semantics unless explicit transition evidence changes them. Workflow definition does not own organizational authority.

### Component Editor / Componentes
Components project `PENDING`, `STALE`, `READ_ONLY`, `DISABLED`, `BLOCKED`, `PERMISSION_DENIED`, `EFFECTIVE` according to qualified time/authority state. Visual countdown or disabled button is projection only. Interaction states must distinguish deadline breach from permission expiry and lease loss.

### View/Page Builder
Views can surface deadline/SLA/reservation state without owning the timer. Responsive/density variants must preserve semantic severity/currentness. A permission change can hide/restrict actions while the underlying obligation clock continues.

### Form Builder
A form may remain valid while submit authority expires. Autosaved input survives, but a stale temporary permission or evidence horizon requires requalification. Accessibility extension of form-session UI time cannot rewrite the business deadline.

### Rules/Decision Editor
Rules may declare typed temporal predicates and pause/extension laws. Expression editor should prevent generic `now > deadline => cancelled` unless cancellation is the declared consequence. State matrices should expose `CURRENT/STALE/EXPIRED/PAUSED/FROZEN/UNKNOWN` per named claim, not as one global state.

### System/Module Designer
Projects temporal dependencies between modules/providers and which effects require commitment-time currentness/fencing. Moving ownership/module placement does not move deadlines by itself.

### Elicitation/Requirements
Captures whose clock/calendar controls, whether deadlines are absolute/relative, which freezes legally pause which obligations, extension authority, accessibility exceptions, SLA consequences and evidence required for disputes.

### Preview/Sandbox
Supports pinned `as-of`, accelerated and fault-injected clock fixtures, succession/freeze simulations and offline expiry scenarios. Simulation never renews or consumes effective leases/reservations/permissions.

### Revision/Diff
Shows temporal-semantic change separately from timestamp/value diff: basis, deadline, pause/extension rule, consequence, lease generation, currentness and affected live occurrences.

## 7. Semantic bridge

`Organization/Authority Epoch`
→ `SuccessionAllocationPlan`
→ `Live Right/Obligation + TemporalObligationRef`
→ `Freeze/Pause/Transfer law`
→ `Permission/Policy currentness`
→ `Command intent`
→ `Workflow/View/Form/Component projection`
→ `Authorized Action admission`
→ `commitment-time temporal/authority recheck where required`
→ `Domain State / external Effect`
→ `Evidence (due/observed/effective/settled)`
→ `SLA/Breach/Escalation/Settlement/Reconciliation`.

Preserved boundaries:
- `View != Workflow Activity`;
- `Form != Workflow State`;
- `Button != Domain Command`;
- `Component event != authorized action`;
- `visual transition != business transition`;
- `freeze != pause`;
- `deadline passed != cancellation`;
- `lease expired != stale holder fenced`;
- `reassignment != timer reset`;
- `accessibility extension != business-deadline extension`;
- `preview clock != effective runtime clock`;
- `Factory administration != Client temporal authority`.

## 8. Declarative + guided UX

Valid composition should be easier than invalid composition through:
- compatibility filtering by temporal role/basis and transfer law;
- prerequisites for explicit pause/extension authority;
- missing clock/calendar/currentness binding detection;
- orphan timer/deadline/reservation detection after split;
- duplicate timer/escalation detection after migration;
- `will expire before cutover` and `deadline continues during freeze` findings;
- stale temporary permission and stale lease findings;
- currentness checks at authorize/publish/commitment where the invariant requires them;
- Time-at-Risk aggregation preserving minority-critical obligations;
- semantic drag/drop validation that refuses to reset clocks implicitly;
- accessible list/tree/table and keyboard alternatives to timelines/drag operations;
- preview banners stating clock fixture, authority epoch and non-effective status.

## 9. Mandatory/adversarial scenarios

1. Human Task due at 17:00 is reassigned at 16:55 and naïvely receives a fresh 24-hour deadline.
2. Governance dispute freezes approval actions but a statutory filing deadline continues and passes.
3. Internal SLA explicitly pauses under legal hold, but UI pauses every unrelated SLA too.
4. Reservation expires during succession; successor migration resurrects it with the old reservation ID.
5. Temporary permission valid until T is copied to successor as `N hours remaining from migration`.
6. Lease expires during partition; successor acts while predecessor can still reach an unfenced provider.
7. Offline runtime restores snapshot and local clock rollback makes expired authority appear current.
8. Timer was due before cutover but fires after cutover; successor UI rewrites due time to firing time.
9. Non-interrupting escalation fires and UI marks predecessor task cancelled.
10. Same escalation is emitted by both branches after partition because dedup uses timestamp rather than occurrence/effect identity.
11. Workflow activity still requires a form; form is valid but submit permission expired during freeze.
12. Command has no UI binding but remains time-admissible; UI absence must not cancel its obligation.
13. UI control remains visible after temporary authorization expiry and event is treated as authorized command.
14. Schema change breaks form while deadline continues; editor must surface both independent blockers.
15. Permission change affects View while SLA clock continues in domain state.
16. Revision conflict changes pause law on one branch and deadline basis on another; merge cannot use last-write-wins.
17. Offline draft preserves stale permission and attempts publish after reconnect.
18. Preview accelerates clock and triggers escalation; runtime evidence must remain unchanged.
19. Accessibility user extends UI session; implementation incorrectly extends external business deadline.
20. Dragging obligation to successor silently resets countdown.
21. Bulk succession changes only visible virtualized timers, leaving hidden obligations under predecessor.
22. Minority-critical deadline expiring in two minutes is hidden inside thousands of low-risk timers.
23. Freeze ends after non-extendable deadline passed; system backdates successor authorization to make action appear timely.
24. SLA breach is hidden because internal authority was disputed, although contract does not exclude dispute time.
25. Relative execution timeout is correctly restarted for an explicitly new attempt, but UI incorrectly moves the original business deadline too.
26. Absolute deadline is converted to local timezone/calendar and DST handling shifts the obligation without provenance.
27. Factory changes Client ownership metadata and UI pauses Client-local clocks without Client authority.
28. Publish review evidence was current, but temporary authority expires before effect commitment and no recheck/fence occurs.

## 10. Proof/test obligations for future qualification

1. Every material temporal obligation declares role, basis, source policy and consequence.
2. Succession/reassignment cannot reset a timer without explicit qualified transition evidence.
3. Governance freeze cannot pause a domain clock unless the named policy authorizes that pause.
4. Absolute deadlines survive responsibility transfer unchanged absent explicit authorized amendment.
5. Relative attempt timeouts restart only when a new attempt is semantically admitted.
6. Already-fired timers/escalations remain in history across succession.
7. Temporary permissions do not gain fresh lifetime by migration/copy.
8. Reservation transfer preserves conservation/exclusivity and expiry semantics.
9. Lease transfer cannot substitute TTL copy for generation/fence evidence.
10. Offline `UNKNOWN` renewal/expiry cannot be treated as current authority.
11. SLA breach calculation follows the SLA's own pause/exclusion law, not internal UI state.
12. Pause/extension authority is independently provable and scoped.
13. Deadline passing during freeze remains visible even after dispute resolution.
14. Unallocated temporal residue is preserved without timer duplication.
15. Reassignment changes responsibility without silently changing deadline identity.
16. Restore/restart cannot extend learned temporal/security/currentness floors.
17. Reconnection deduplicates timer-driven effects by stable semantic identity, not timestamp coincidence.
18. Preview time manipulation cannot create effective timer/effect/lease evidence.
19. Revision/Diff detects semantic temporal changes even when timestamp values are unchanged.
20. Accessibility time accommodation cannot mutate an unrelated business/security/provider deadline.
21. Autosave preserves draft data but not expired authority/currentness.
22. Delayed timer processing preserves original `DueAt` and records distinct `ObservedAt`.
23. Compatibility filtering blocks targets that cannot satisfy required temporal transfer law/currentness.
24. Commitment-time requalification occurs only where the protected invariant requires it; the design does not force unnecessary global synchronization.
25. Virtualization/bulk operations do not omit hidden temporal obligations.
26. Aggregation cannot hide minority-critical imminent deadlines or `UNKNOWN` authority.
27. Keyboard/non-drag interaction can perform every supported review/allocation action with equivalent semantic validation.
28. `preview != effective runtime` remains explicit in every temporal simulation.

## 11. Componentization complexity / dependency hotspots

### P0 — LOW/MEDIUM
- typed temporal refs/status badges;
- Due/Observed/Effective/Settled display;
- accessibility-safe countdown alternatives;
- static semantic diff facets.

### P1 — MEDIUM/HIGH
- Temporal Obligation Inspector;
- Succession Timeline Review;
- Time-at-Risk Browser;
- reverse-impact/findings indexes;
- virtualized bulk review with semantic selection identity.

### P2 — HIGH/VERY HIGH
- editor-specific temporal adapters;
- offline draft/reconcile requalification;
- preview time-travel fixtures;
- live-obligation migration with clock/calendar provenance;
- operation-scoped state matrix.

### P3 — EXTREME
- `authority epoch × temporal role × clock basis × pause/extension law × currentness × offline frontier × right allocation × live occurrence × effect fence × provider reservation/lease × jurisdiction/SLA policy`;
- proof that a temporal transfer preserves both conservation and authority invariants;
- cross-runtime reconciliation after independently observed expiry/firing;
- commitment-time qualification without accidental global coordination.

## 12. Classification of this round

### Shared primitive
`TemporalObligationRef`, `TemporalSuccessionDisposition`, `FreezeInterval`, clock/currentness provenance, due/observed/effective/settled lineage.

### Editor infrastructure
Temporal Obligation Inspector, Succession Timeline Review, Time-at-Risk Browser, Temporal Semantic Diff, temporal findings/proof panel.

### Proprietary app
Each editor adapts these primitives to its own owned semantics; none receives generic ownership of Workflow, Form, Permission, Domain State or Evidence.

### Cross-app semantic integration
The bridge carries typed temporal claims across Workflow/View/Form/Component/Command/Permission/Domain State/Evidence while preserving ownership and requiring explicit transfer/pause/currentness semantics.

## 13. Maturity / saturation / gaps

Maturity: `ADVANCED_EMERGING / MATERIAL_DELTA`.

The generic deadline/lease semantics were already mature enough in the Canvas corpus; the material delta is specifically the **succession/freeze transfer law** and its editor infrastructure. This round therefore extends rather than duplicates the earlier temporal artifact.

Remaining gaps:
1. multi-jurisdiction/business-calendar succession where two successor legal calendars disagree;
2. temporal proof under long offline intervals when trusted time itself is unavailable/ambiguous;
3. fairness/priority when freeze resolution leaves many overdue obligations competing for limited successor capacity;
4. remediation semantics when timely performance became impossible during a legitimate governance freeze;
5. whether Time-at-Risk aggregation needs formal completeness/currentness contracts analogous to Findings indexes.

Recommended next vector: **post-freeze backlog triage and fairness** — prioritizing overdue/live obligations after succession without allowing urgency to override permission, conservation, safety or evidence requirements; include starvation, deadline inversion, capacity allocation and explainable priority rules.
