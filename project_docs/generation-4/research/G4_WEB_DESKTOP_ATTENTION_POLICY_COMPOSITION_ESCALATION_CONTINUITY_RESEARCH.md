# G4 Web Desktop — Attention Policy Composition, Escalation & Multi-Session Continuity Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## 1. Research question

How should the G4 Web Desktop compose personal, Client, Workspace, security/safety and accessibility attention policies; escalate/de-escalate unresolved conditions; coordinate assignment and acknowledgement across users; and preserve continuity across browser tabs, devices, sessions and offline intervals without turning delivery, ranking, acknowledgement or shell state into semantic authority?

This extends `G4_WEB_DESKTOP_ATTENTION_NOTIFICATION_ORCHESTRATION_RESEARCH.md`. It is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, providers or G2/G3 changes.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application candidate, not a navigation foundation.

## 2. Preserved boundaries

- `Client != Workspace != Desktop != Application != Window`.
- `Module != Capability != Application`.
- `Window lifecycle != runtime lifecycle`.
- `Close/minimize UI != stop service`.
- `Desktop presence != app loaded`.
- `Browser tab != SB tab`.
- `Display Surface != Workspace`.
- `Window movement/docking != semantic relation`.
- `SELECTED != FOCUSED`.
- `STALE != CURRENT`.
- `UNKNOWN != SUCCESS`.
- `BLOCKED != DISABLED`.
- `PENDING != EFFECTIVE`.
- `MODEL_SCORE != INTERRUPTION_RIGHT`.
- `Research candidate != implementation authority`.

Additional boundaries from this slice:

```text
LOCAL_MUTE != SECURITY_FLOOR_OVERRIDE
OLDER != MORE_SEVERE
OTHER_USER_SEEN != I_HAVE_SEEN
DELIVERED_ON_DEVICE_A != ACKNOWLEDGED_GLOBALLY
ATTENTION_BUDGET_EXHAUSTED != EVENT_DROPPED
ASSIGNED != ACKNOWLEDGED
ACKNOWLEDGED != RESOLVED
ESCALATED != MORE_SEVERE
DEESCALATED_PRESENTATION != RESOLVED
DEVICE_OFFLINE != USER_UNASSIGNED
BROWSER_TAB_CLOSED != ATTENTION_EVENT_CLOSED
```

## 3. External interaction grammars reviewed

External products are interaction evidence, not provider commitments.

### 3.1 PagerDuty incident and escalation grammar

PagerDuty distinguishes triggered, acknowledged and resolved incident states. Acknowledgement means a responder is working the incident and stops escalation; it does not resolve the incident. Escalation policies notify targets in ordered levels and advance when no responder acts within the timeout. Reassignment changes the responder path independently of the underlying incident severity.

Extracted grammar:

`condition -> assignment -> delivery attempts -> acknowledgement/ownership -> escalation timeout -> reassignment/escalation -> resolution`.

Important separation:

`escalation is routing/ownership progression, not proof that the domain condition became more severe`.

### 3.2 Microsoft Teams quiet-time and multi-device grammar

Teams supports scheduled quiet time and can synchronize that schedule across mobile apps, while notifications remain visible when the user opens the application. Teams can also suppress mobile notifications while the user is active on desktop/web and resume them after inactivity.

Extracted grammar:

`user attention preference may synchronize across sessions/devices`, while `delivery suppression != event deletion` and `active elsewhere != acknowledged`.

### 3.3 Teams Activity feed and accessibility

Teams exposes a durable activity feed with unread filtering and keyboard/screen-reader navigation. This reinforces the separation between transient delivery and a navigable attention history.

Extracted grammar:

`push/toast delivery != durable attention projection`; `cross-session continuity requires an inspectable list, not replay of every transient interruption`.

## 4. Primary finding — policy composition must be explicit and non-scalar

Effective attention routing cannot be computed from one `priority` or by simple last-writer-wins preference merging.

Candidate policy inputs:

```text
platform accessibility constraints
security/safety floor
Builder fleet policy
Client policy
Workspace policy
application/category policy
user preference
session/device capability
current interaction context
current assignment/on-call context
currentness/authorization
attention budget
```

Candidate output:

```text
AttentionPolicyDecision
  decisionId
  candidateId
  evaluatedPolicyRevisions[]
  effectiveInterruptionLevel
  permittedSurfaces[]
  suppressedSurfaces[]
  bypassReason?
  deliveryTargets[]
  escalationContractRef?
  acknowledgementContractRef?
  confidentialityDisposition
  currentnessDisposition
  authorityDisposition = NONE
```

Policy composition must preserve provenance of the winning/limiting rules.

```text
PERSONAL_PREFERENCE != CLIENT_POLICY
CLIENT_POLICY != SECURITY_FLOOR
SECURITY_FLOOR != ALWAYS_INTERRUPT
MORE_RESTRICTIVE_UI != MORE_RESTRICTIVE_DOMAIN_AUTHORITY
POLICY_OVERRIDE != EVENT_REWRITE
```

A security floor may forbid complete suppression for a narrowly qualified class, but does not imply sound, focus theft or modal presentation in every context. Accessibility requirements can also constrain the chosen surface independently of semantic severity.

## 5. Policy lattice, floors and ceilings

A useful grammar is a constrained lattice rather than a precedence stack.

Examples:

- a user can reduce ordinary toast noise;
- a Client can require retention in Notification Center for named operational classes;
- a Workspace can route build progress to Status/Activity without changing Client-wide rules;
- a security floor can require eventual delivery/acknowledgement for a named security condition;
- accessibility preferences can prohibit animation while preserving equivalent textual/programmatic status;
- confidentiality can prohibit lock-screen/device delivery even when urgency is high.

Therefore:

```text
FLOOR_PRESENT != MAXIMUM_INTERRUPTION
CEILING_PRESENT != EVENT_HIDDEN
USER_MUTE != HISTORY_SUPPRESSED
CONFIDENTIAL != LOW_PRIORITY
ACCESSIBILITY_OVERRIDE != SEMANTIC_OVERRIDE
```

Conflict resolution must be inspectable: the shell should be able to explain why a candidate was routed to a surface or withheld from it.

## 6. Escalation is a response-routing lifecycle

Candidate escalation state:

```text
UNASSIGNED
 -> ASSIGNED
 -> DELIVERY_PENDING
 -> DELIVERED?
 -> ACK_PENDING
 -> ACKNOWLEDGED
 -> IN_PROGRESS?
 -> RESOLVED
```

Orthogonal escalation progression:

```text
LEVEL_0
 -> LEVEL_1
 -> LEVEL_2
 -> ...
 -> COVERAGE_GAP | EXHAUSTED
```

The two axes must not collapse.

```text
ESCALATION_LEVEL_2 != SEVERITY_LEVEL_2
ACK_TIMEOUT != INCIDENT_AGE
NO_ACK != NO_ONE_SAW_IT
DELIVERY_SUCCESS != HUMAN_RECEIPT
HUMAN_RECEIPT != ACK
ACK != OWNERSHIP_FOREVER
```

Escalation may be triggered by elapsed acknowledgement deadline, responder unavailability, explicit handoff/reassignment or policy change. It must re-check authorization/currentness before each delivery.

## 7. De-escalation is not resolution

Presentation may become quieter because:

- a responder acknowledged;
- the user entered the relevant foreground context;
- another qualified responder owns the item;
- the condition is no longer time-sensitive;
- the candidate became stale/superseded;
- policy changed.

These have different semantics.

```text
ACKNOWLEDGED -> may stop repeated interruption
ACKNOWLEDGED != RESOLVED
FOREGROUND_CONTEXT -> may replace toast with in-context status
FOREGROUND_CONTEXT != ACKNOWLEDGED
STALE -> retire attention projection
STALE != SUCCESS
```

A de-escalation reason must remain visible in history when material.

## 8. Assignment, acknowledgement and team semantics

Candidate identities:

```text
AttentionAssignment
  subjectRef
  assigneeKind = USER | ROLE | SCHEDULE | TEAM_QUEUE
  assigneeRef
  assignedAt
  assignmentRevision
  leaseOrTimeout?
  handoffFrom?

Acknowledgement
  acknowledgementId
  subjectRef
  actorRef
  actorAuthoritySnapshot
  scope
  acknowledgedAt
  expiresOrRetriggersAt?
```

Rules:

```text
ASSIGNED_TO_TEAM != EVERY_TEAM_MEMBER_ACKNOWLEDGED
USER_ACK != TEAM_ACK
OTHER_USER_ACK != MY_SEEN_STATE
TEAM_ACK != DOMAIN_RESOLUTION
REASSIGNED != RESOLVED
ACK_BY_EXPIRED_DELEGATE != CURRENT_ACK_AUTHORITY
```

The shell may project assignment and acknowledgement, but domain acknowledgement remains owned by the relevant capability contract.

## 9. Multi-device, multi-session and browser-tab continuity

Attention continuity needs at least four scopes:

```text
EVENT_SCOPE       // domain occurrence/currentness
USER_SCOPE        // seen/read/snooze/preferences where applicable
SESSION_SCOPE     // transient presentation and focus context
DEVICE_SCOPE      // delivery capability and local OS state
```

A fifth scope may exist for team/domain acknowledgement.

```text
DEVICE_DELIVERED != USER_SEEN
USER_SEEN != EVERY_SESSION_SEEN
SESSION_DISMISSED != USER_DISMISSED
TAB_CLOSED != EVENT_RESOLVED
BROWSER_TAB != SB_TAB
```

Candidate behavior:

- transient toasts should not be replayed blindly on every tab/device;
- a durable attention inbox should converge across authorized sessions;
- per-device delivery attempts remain auditable separately from user-level seen/ack state;
- opening the relevant item on one session may mark it seen for the user only if the configured semantics say so;
- domain acknowledgement should synchronize globally only after authoritative acknowledgement succeeds;
- stale authorization on one session must not be repaired merely because another session remains authorized.

## 10. Active-device routing and duplicate interruption

When the same user has multiple active sessions, routing should minimize duplicate interruption while preserving delivery guarantees.

Candidate decision inputs:

```text
session foreground state
recent interaction
input capability
notification capability
connectivity
quiet mode
confidentiality constraints
accessibility preferences
last successful delivery
acknowledgement deadline
```

Rules:

```text
ACTIVE_ON_DESKTOP != MOBILE_EVENT_DELETED
SUPPRESS_MOBILE_PUSH != MOBILE_HISTORY_REMOVED
PRIMARY_SESSION_SELECTED != OTHER_SESSIONS_UNAUTHORIZED
DELIVERED_ON_PRIMARY != ACKNOWLEDGED
```

Failover to another device/session is a delivery policy, not semantic escalation.

## 11. Offline continuity and return summaries

After an offline interval, replaying every missed toast is usually incorrect. The shell should reconstruct current attention state from retained events/currentness and produce a bounded return summary.

Candidate return classes:

```text
STILL_CURRENT_ACTION_REQUIRED
STILL_CURRENT_INFORMATIONAL
RESOLVED_WHILE_OFFLINE
SUPERSEDED_WHILE_OFFLINE
STALE_OR_UNAUTHORIZED
NEW_ASSIGNMENT
MISSED_ESCALATION_OR_HANDOFF
BACKGROUND_ACTIVITY_COMPLETED
```

Rules:

```text
MISSED_TOAST != MISSED_EVENT
OFFLINE_FOR_8H != REPLAY_8H_OF_INTERRUPTS
RESOLVED_WHILE_OFFLINE != CURRENT_ALERT
SUMMARY_COUNT != DOMAIN_COUNT
```

The summary must preserve UNKNOWN when currentness cannot be re-established.

## 12. Attention fairness and noisy-neighbor control

An application with a high event rate must not monopolize interruption surfaces.

Candidate fairness controls:

```text
per-source interruption budget
per-category budget
correlation/coalescing window
minimum spacing
foreground preference
unresolved-critical reservation
fair queue among eligible sources
burst detection
adaptive suppression of repeated equivalent presentations
```

But budgets constrain presentation, not truth:

```text
BUDGET_EXHAUSTED != EVENT_DROPPED
RATE_LIMITED_TOAST != RATE_LIMITED_DOMAIN_EVENT
NOISY_APP != LOW_SEVERITY_APP
FAIR_QUEUE != EQUAL_SEMANTIC_IMPORTANCE
COALESCED != RESOLVED
```

Security/safety floors can reserve capacity, but applications cannot self-assign that reservation.

## 13. Componentization impact

### primitive / atomic

Candidate shared primitives:

- `AttentionPolicySourceIndicator`
- `AttentionFloorIndicator`
- `AssignmentIndicator`
- `EscalationLevelIndicator`
- `DeliveryStateIndicator`
- `UserSeenIndicator`
- `TeamAckIndicator`
- `SessionContinuityIndicator`
- `OfflineSummaryIndicator`
- `AttentionBudgetIndicator`

### compound

- `EffectiveAttentionPolicySummary`
- `EscalationPathSummary`
- `AssignmentAndAckSummary`
- `MultiSessionDeliverySummary`
- `OfflineReturnSummary`
- `AttentionFairnessSummary`

### module component

- `AttentionPolicyComposerPanel`
- `EscalationTimelinePanel`
- `AssignmentQueuePanel`
- `SessionDeliveryPanel`
- `OfflineReturnPanel`

### tool

- `AttentionPolicyInspector`
- `AttentionPolicyConflictInspector`
- `EscalationInspector`
- `AcknowledgementScopeInspector`
- `MultiSessionContinuityInspector`
- `AttentionFairnessInspector`

### application/window/desktop/workspace/system view

Higher layers consume projections without inheriting semantic ownership. A Window can show an acknowledgement action; it does not own incident truth. A Desktop can aggregate attention across Applications; it does not merge their domain events. A Workspace can scope policy and activity; it remains distinct from Client policy and System View.

`composedOf/usedBy` edges should encode presentation/composition dependency, not domain authority.

## 14. State ownership

Candidate ownership split:

```text
Domain capability:
  occurrence truth
  semantic severity where domain-defined
  resolution
  authoritative domain acknowledgement

Attention orchestration:
  candidate qualification
  routing
  delivery attempts
  presentation grouping
  interruption budget
  shell-level seen/read/snooze state

Identity/governance:
  user/team/delegation authority
  Client/Workspace visibility

Session/device layer:
  focus/foreground
  delivery capability
  local quiet state where applicable

User preferences:
  mutable personal attention preferences within policy bounds
```

No layer may infer domain resolution from presentation state.

## 15. Commands and events

Candidate commands:

```text
MARK_SEEN
MARK_UNSEEN
SNOOZE_PRESENTATION
MUTE_CATEGORY_WITHIN_BOUNDS
ACKNOWLEDGE_DOMAIN_CONDITION
REASSIGN_ATTENTION_OWNER
ESCALATE_RESPONSE
OPEN_SOURCE_CONTEXT
```

They must not share semantics merely because they originate from the same menu.

Candidate events:

```text
ATTENTION_CANDIDATE_CREATED
ROUTING_DECIDED
DELIVERY_ATTEMPTED
DELIVERY_CONFIRMED
USER_SEEN
ACK_REQUESTED
ACK_EFFECTIVE
ACK_REJECTED
ASSIGNMENT_CHANGED
ESCALATION_ADVANCED
EVENT_RESOLVED
EVENT_STALE
POLICY_CHANGED
SESSION_BECAME_PRIMARY
OFFLINE_SUMMARY_COMPUTED
```

`ACK_REQUESTED != ACK_EFFECTIVE` preserves `PENDING != EFFECTIVE`.

## 16. Accessibility

Requirements under research:

- policy conflicts and winning constraints must be textual, not color-only;
- assignment, acknowledgement and resolution must be separately announced;
- escalation timeline needs list/table alternatives;
- timers/deadlines must not rely on animation alone;
- keyboard users must be able to inspect, acknowledge when authorized, reassign and snooze without drag;
- screen-reader announcements should be coalesced independently of visual grouping;
- device/session continuity state should be exposed as text where operationally relevant;
- reduced-motion preferences must not hide escalation/currentness changes;
- focus must not be stolen merely because escalation advanced.

```text
ASSERTIVE_ANNOUNCEMENT != FOCUS_TRANSFER
TEAM_ACK_VISUAL != ACCESSIBLE_ACK_STATE
COUNTDOWN_VISIBLE != DEADLINE_PROGRAMMATICALLY_AVAILABLE
```

## 17. Responsive and small-screen behavior

Small-screen projection may collapse columns and timelines, but must preserve:

- Client/Workspace context;
- semantic severity and currentness;
- assignment;
- acknowledgement vs resolution;
- escalation state;
- deadline when material;
- policy floor/bypass reason when relevant;
- UNKNOWN.

A compact badge must not collapse `ACKNOWLEDGED` and `RESOLVED` into one checkmark.

## 18. Performance and high-volume behavior

High-volume attention requires bounded presentation cost without semantic loss.

Candidate architecture grammar:

```text
source event stream
 -> cheap scope/currentness gate
 -> correlation/dedup projection
 -> policy composition
 -> assignment/escalation scheduler
 -> delivery fan-out
 -> per-user/session projection
 -> virtualized durable history
```

Proof concerns:

- 10k events/minute from one noisy source;
- 100k retained attention items;
- thousands of users/sessions;
- policy change affecting a large Client;
- reconnect storm after outage;
- many simultaneous escalation deadlines.

Rules:

```text
VIRTUALIZED != TRUNCATED
BATCHED_DELIVERY != BATCHED_ACK
CACHE_HIT != CURRENT_POLICY
DELAYED_PROJECTION != EVENT_RESOLVED
HIGH_FANOUT != CROSS_CLIENT_LEAKAGE
```

## 19. Failure and recovery

Failure modes must preserve truth:

- routing engine unavailable -> candidate remains pending/UNKNOWN, not silently suppressed;
- assignment service unavailable -> do not invent an assignee;
- delivery provider failure -> record failed delivery, preserve event;
- acknowledgement write timeout -> `ACK_UNKNOWN/PENDING`, not acknowledged;
- policy resolver unavailable -> conservative bounded behavior according to named fallback policy, never implicit success;
- session sync failure -> preserve per-session uncertainty;
- reconnect after crash -> reconstruct from canonical attention/domain state rather than replaying local toasts;
- authorization expiry -> immediately suppress unauthorized detail while preserving authorized audit history.

## 20. Adversarial scenarios

1. User mutes a category, then a qualified security-floor event arrives.
2. Application marks a recommendation `critical` with model score 0.99.
3. Primary responder receives delivery but never acknowledges.
4. Responder acknowledges; underlying incident remains unresolved for hours.
5. Responder loses delegated Client access after acknowledgement.
6. Incident is reassigned while old responder has an open Window.
7. Device A receives push; Device B is foreground and user acts there.
8. Browser tab A marks item seen while tab B is offline.
9. User closes all browser tabs; background condition remains unresolved.
10. User reconnects after eight hours with 4,000 missed progress events and three current failures.
11. Event resolved while user was offline but old local toast is queued.
12. Client switch occurs while an escalation timer expires.
13. Workspace switch occurs while acknowledgement is pending.
14. Quiet mode begins after first delivery but before escalation timeout.
15. Accessibility preference disables animation during active escalation.
16. Noisy application emits 10,000 low-value events/minute.
17. Two critical sources compete after ordinary attention budget is exhausted.
18. Assignment schedule has a coverage gap.
19. Policy revision changes the acknowledgement timeout mid-incident.
20. Delivery provider reports success but user never sees the notification.
21. Session-sync service is partitioned and two tabs disagree on seen state.
22. Acknowledgement request times out and later succeeds asynchronously.
23. Client policy allows a surface that confidentiality policy forbids on lock screen.
24. A stale event is reintroduced from a reconnecting device cache.

## 21. Proof obligations

A future implementation would need to prove, at minimum:

1. Personal mute cannot silently override named security/safety floors.
2. Floors do not automatically imply maximum interruption.
3. Acknowledgement and resolution remain independent.
4. Escalation level and semantic severity remain independent.
5. Assignment and acknowledgement remain independent.
6. Other-user acknowledgement does not rewrite personal seen state.
7. Delivery success does not imply acknowledgement.
8. Multi-device suppression does not delete durable attention history.
9. Closing browser tabs does not stop unrelated runtime/domain work.
10. Offline return produces a current summary rather than blind toast replay.
11. Resolved/stale offline events are not resurfaced as current alerts.
12. Attention budgets suppress/coalesce presentation without dropping domain events.
13. Noisy sources cannot starve unrelated qualified sources indefinitely.
14. Critical reservation cannot be self-claimed by arbitrary applications.
15. Client/Workspace switch cannot leak queued notification detail.
16. Delegated-access expiry removes visibility without rewriting event history.
17. `ACK_REQUESTED` remains distinct from `ACK_EFFECTIVE` and `ACK_UNKNOWN`.
18. Policy changes are revisioned and explainable for in-flight events.
19. Accessibility announcements remain bounded during event storms.
20. Keyboard-only users can inspect and perform authorized attention actions.
21. Small-screen layouts preserve ack/resolution/currentness distinctions.
22. Session disagreement is represented as uncertainty rather than false convergence.
23. Assignment coverage gaps remain visible/UNKNOWN rather than fabricated.
24. Reconnect caches cannot resurrect stale or unauthorized attention projections.

## 22. Research maturity

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

This slice materially strengthens shell attention foundations but does not freeze names, taxonomies, policy precedence, storage, provider choices or implementation architecture.

## 23. Remaining gaps / next vector

The highest-value next vector is **shell state convergence and conflict semantics across sessions/tabs/devices**, broader than notifications: focus/selection ownership, window/layout mutations, dirty drafts, command issuance, workspace/client switching and restore/recovery under concurrent sessions.

Questions:

- which shell state is user-global, Workspace-global, session-local, tab-local or Window-local?
- when can layout changes merge and when must one session fork?
- how are dirty drafts protected when another session changes revision/environment?
- how do focus and selection remain local while semantic edits synchronize?
- how does restore distinguish historical layout from current authorization/application registry?
- how should concurrent command attempts expose `PENDING`, `EFFECTIVE`, conflict and UNKNOWN?

Candidate invariants for the next slice:

```text
FOCUS_LOCAL != SELECTION_GLOBAL
LAYOUT_SYNC != SEMANTIC_SYNC
RESTORED_WINDOW != RESTORED_AUTHORITY
LAST_WRITER_WINS != SAFE_FOR_DIRTY_STATE
SESSION_CURRENT != WORKSPACE_CURRENT
OTHER_TAB_COMMAND_PENDING != LOCAL_COMMAND_EFFECTIVE
```
