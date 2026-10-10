# G4 Web Desktop — Attention, Notification & Activity Orchestration Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## 1. Research question

How should the G4 Web Desktop route status, activity, recommendations, warnings, failures and action-required events through taskbar/window registry, Status/Activity, notification center, in-context surfaces and interruptive UI without confusing model score, business severity, urgency, user attention, acknowledgement, resolution or semantic authority?

This extends the current Web Desktop / Componentes research and `G4_COMPONENTES_RECOMMENDATION_MODEL_QUALIFICATION_FEEDBACK_RESEARCH.md`. It is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or changes to G2/G3.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application candidate, not a navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`.
- `Client != Workspace != Desktop != Application != Window`.
- `Module != Capability != Application`.
- `Window lifecycle != runtime lifecycle`.
- `Close/minimize UI != stop service`.
- `Desktop presence != app loaded`.
- `Browser tab != SB tab`.
- `Display Surface != Workspace`.
- `Window movement/docking != semantic relation`.
- `3D projection != navigation foundation`.
- `SELECTED != FOCUSED`.
- `STALE != CURRENT`.
- `UNKNOWN != SUCCESS`.
- `BLOCKED != DISABLED`.
- `PENDING != EFFECTIVE`.
- `RECOMMENDATION != AUTHORITY`.
- `MODEL_SCORE != INTERRUPTION_RIGHT`.
- `Research candidate != implementation authority`.

## 3. External interaction grammars reviewed

External systems are evidence for interaction grammar, not provider commitments.

### 3.1 Windows notification guidance

Current Windows guidance emphasizes that notifications should be informative and valuable, should not be noisy, and can be suppressed into Notification Center instead of interrupting the user. It also treats progress as a notification/status case and expects stale notifications to be cleared when the underlying information has already been consumed elsewhere.

Extracted grammar:

`event -> relevance/intent -> interrupt or suppress -> persistent history -> context-preserving activation -> semantic retirement`.

Windows also distinguishes default/reminder/alarm/incoming-call/urgent scenarios. The useful lesson is not the exact taxonomy but that interruption behavior is a separately qualified projection of an event.

### 3.2 Android notification channels

Android channels separate notification category/channel from user-visible importance. Importance controls interruption level, while the user retains final control and can alter channel behavior.

Extracted grammar:

`producer category != effective interruption policy`; `application preference != user attention authority`.

### 3.3 Apple interruption levels

Apple distinguishes passive, active, time-sensitive and critical interruption levels, and users can disable time-sensitive interruptions. The useful grammar is that immediate delivery, sound, Focus bypass and critical interruption are separate policy consequences rather than synonyms for semantic severity.

### 3.4 Visual Studio Code

VS Code limits notifications to information/warning/error and explicitly advises extensions to respect attention and notify only when necessary.

Extracted grammar:

`extension/app can produce a candidate notification; shell owns a bounded presentation grammar`.

### 3.5 WAI-ARIA / WCAG status semantics

WAI-ARIA distinguishes advisory `status` updates from assertive `alert` updates. `status` is implicitly polite and should not receive focus merely because it changes. `alert` is for important/time-sensitive information and should be used sparingly. WCAG 4.1.3 requires status messages to be programmatically determinable so assistive technology can present them without moving focus.

Extracted grammar:

`status update != focus transfer`; `important update != automatic modal`; `visual notification != accessible announcement`.

## 4. Primary finding — attention is a bounded shell resource, not producer authority

Applications, tools, analytics, recommenders and background activities may emit candidate attention events. They must not directly decide that the user will be interrupted.

Candidate separation:

```text
DomainEvent / ActivityUpdate / Recommendation
        |
        v
AttentionCandidate
        |
        v
AttentionQualification
        |
        v
AttentionRoutingDecision
        |
        +--> IN_CONTEXT
        +--> STATUS_ACTIVITY
        +--> TASKBAR_BADGE
        +--> NOTIFICATION_CENTER
        +--> TOAST/BANNER
        +--> ASSERTIVE_ALERT
        +--> MODAL/INTERRUPTIVE_ACTION   [rare, separately justified]
        +--> SUPPRESSED/COALESCED
```

Hard boundaries:

```text
PRODUCER_SEVERITY != INTERRUPTION_LEVEL
MODEL_SCORE != INTERRUPTION_RIGHT
BUSINESS_CRITICALITY != UI_URGENCY
UI_URGENCY != MUTATION_AUTHORITY
HIGH_PRIORITY_QUEUE != SEMANTIC_PRIORITY
NOTIFICATION_PRESENT != WINDOW_FOCUSED
```

A recommendation producer can say that an item ranks highly under its qualified model. It cannot acquire the right to steal focus, bypass quiet mode, open a modal or promote a change.

## 5. Attention qualification is multidimensional

One scalar `priority` is insufficient.

Candidate vector:

```text
AttentionCandidate
  candidateId
  sourceApplicationId?
  sourceWindowId?
  clientId
  workspaceId?
  desktopId?
  subjectRef
  eventClass
  semanticSeverity
  timeSensitivity
  actionRequirement
  actionDeadline?
  reversibility
  safetyCriticality
  securityCriticality
  currentness
  confidenceOrEvidenceDisposition?
  userRelevance
  foregroundRelevance
  deduplicationKey?
  correlationKey?
  persistenceClass
  confidentialityClass
  permittedSurfaces[]
  preferredSurface?
  interruptionRequest?
  authorityDisposition = NONE
```

These dimensions must not collapse into each other:

```text
SEVERE != URGENT
URGENT != INTERRUPTIVE
ACTION_REQUIRED != MODAL_REQUIRED
TIME_SENSITIVE != SAFETY_CRITICAL
SECURITY_CRITICAL != ALWAYS_AUDIBLE
HIGH_CONFIDENCE != HIGH_URGENCY
UNKNOWN != LOW_SEVERITY
```

`UNKNOWN` can itself require attention when the missing knowledge is material, but it remains `UNKNOWN`.

## 6. Candidate attention classes

The following are research classes, not frozen product taxonomy:

```text
AMBIENT_STATUS
PROGRESS_UPDATE
INFORMATIONAL
RECOMMENDATION
ACTION_AVAILABLE
ACTION_REQUIRED
WARNING
FAILURE
SECURITY_WARNING
SAFETY_CRITICAL
DEADLINE_SENSITIVE
RECOVERY_REQUIRED
AUTHORITY_OR_CONTEXT_STALE
```

The class does not directly select a surface. A `FAILURE` in a background batch may belong in Status/Activity and Notification Center; a permission loss affecting the user's current destructive operation may justify immediate in-context interruption.

## 7. Interruption policy and user control

Candidate interruption levels:

```text
NONE
AMBIENT
PASSIVE
ACTIVE
TIME_SENSITIVE
CRITICAL
```

These names are deliberately generic and may change.

Effective interruption is a function of multiple inputs:

```text
candidate request
+ shell policy
+ Client/Workspace policy
+ user preference / quiet mode
+ current interaction context
+ accessibility preference
+ security/safety floor
+ currentness
= effective routing
```

Rules:

```text
REQUESTED_INTERRUPT != EFFECTIVE_INTERRUPT
APP_URGENT != SHELL_URGENT
USER_MUTED != EVENT_RESOLVED
QUIET_MODE != EVENT_DROPPED
SUPPRESSED_TOAST != SUPPRESSED_HISTORY
```

Critical bypass must be narrowly qualified. An application cannot self-label its way around user attention controls.

## 8. Routing surfaces have different contracts

### 8.1 In-context

Use when the event is materially tied to the object/tool the user is currently operating. Prefer this over global interruption when the user is already in the relevant context.

### 8.2 Status/Activity

Persistent shell projection for progress, background operations, degraded states, long-running work, completed work that merits history, and recoverable failures.

`STATUS_PRESENT != ATTENTION_REQUESTED`.

### 8.3 Taskbar/window registry

Badges/indicators may show that an application/window has unseen or unresolved activity. Badge count is a projection, not canonical business count.

```text
BADGE_COUNT != DOMAIN_OBJECT_COUNT
WINDOW_BADGED != WINDOW_LOADED
WINDOW_BADGED != WINDOW_FOCUSED
```

### 8.4 Notification Center

Durable attention inbox for events that should survive transient presentation. It is not the canonical activity ledger; it is a user-attention projection that can be rebuilt from retained qualified events where appropriate.

### 8.5 Toast/banner

Transient interruptive projection. Should be scarce, deduplicated and context-preserving on activation.

### 8.6 Modal / alert dialog

Reserved for cases where continuing the current interaction without a decision would be unsafe, semantically invalid or materially destructive. `IMPORTANT != MODAL`.

## 9. State and lifecycle semantics

Candidate notification lifecycle:

```text
CANDIDATE
 -> QUALIFIED
 -> ROUTED
 -> PRESENTED? | SUPPRESSED | COALESCED
 -> SEEN?
 -> ACKNOWLEDGED?
 -> ACTIONED?
 -> RESOLVED? | EXPIRED | SUPERSEDED | STALE
 -> RETIRED_FROM_ATTENTION_SURFACE
```

These are independent axes where necessary, not a universal linear state machine.

Hard boundaries:

```text
NOTIFIED != SEEN
SEEN != ACKNOWLEDGED
ACKNOWLEDGED != ACTIONED
ACTIONED != EFFECTIVE
EFFECTIVE != RESOLVED
DISMISSED != RESOLVED
SNOOZED != RESOLVED
EXPIRED != SUCCESS
STALE != RESOLVED
```

An event may be resolved by an external change before the user sees the notification. Conversely, a user may acknowledge a failure while the failure remains unresolved.

## 10. Acknowledgement is scoped

Candidate acknowledgement scopes:

```text
LOCAL_VIEW_ACK
USER_ACK
WORKSPACE_ACK
CLIENT_OPERATIONAL_ACK
DOMAIN_ACK
```

These are not interchangeable. Clicking a notification may mark it seen without acknowledging the domain condition. A domain acknowledgement must remain owned by the relevant capability/authority contract.

```text
UI_DISMISS != DOMAIN_ACK
USER_ACK != TEAM_ACK
TEAM_ACK != INCIDENT_RESOLVED
```

## 11. Deduplication, grouping and coalescing

Attention overload requires deduplication, but deduplication must not erase semantic multiplicity.

Candidate identities:

```text
occurrenceId        // immutable source occurrence
attentionCandidateId
correlationKey      // related occurrences
presentationGroupKey
semanticSubjectRef
```

Rules:

```text
SAME_MESSAGE != SAME_OCCURRENCE
SAME_SUBJECT != SAME_FAILURE
SAME_CORRELATION_KEY != ONE_DOMAIN_EVENT
COALESCED_PRESENTATION != COALESCED_SEMANTICS
GROUP_COUNT != SAFE_TO_HIDE_DETAILS
```

A group may say `12 related failures`, but the underlying occurrences remain independently inspectable when authorized.

Dedup windows are presentation policy, not evidence-retention policy.

## 12. Snooze, mute and quiet modes

Snooze affects presentation timing, not truth or resolution.

Candidate model:

```text
SnoozeDisposition
  subject/candidate/group scope
  user scope
  until
  reason?
  createdAt
  overriddenByCriticalPolicy?
```

Rules:

```text
SNOOZED != ACKNOWLEDGED
MUTED != RESOLVED
MUTED_SOURCE != DISABLED_SOURCE
QUIET_MODE != BACKGROUND_SERVICE_STOPPED
```

When a snooze expires, the system must requalify currentness before resurfacing. A stale event must not reappear as though still current.

## 13. Context switching and tenant safety

Attention state is Client/Workspace scoped where the underlying event is scoped.

On Client/Workspace switch:

- visible notification projections must be requalified;
- unauthorized detail must disappear immediately;
- taskbar/window badges must be recomputed for the destination context;
- queued toast presentation must recheck authorization/currentness before display;
- background activity may continue if independently authorized, but its UI projection cannot leak into another Client;
- delegated access expiry must invalidate visibility without rewriting underlying event history.

```text
BACKGROUND_EVENT_EXISTS != CURRENT_CLIENT_CAN_VIEW
PREVIOUS_CLIENT_BADGE != DESTINATION_CLIENT_BADGE
QUEUED_TOAST != STILL_AUTHORIZED_TO_DISPLAY
DELEGATED_ACCESS_EXPIRED != EVENT_DELETED
```

Global Builder Home aggregates must obey the previously researched tenant-safe disclosure rules; rare event presence can itself be sensitive.

## 14. Focus, selection and interruption

Attention orchestration must preserve focus/selection invariants.

```text
NOTIFICATION_ARRIVED != FOCUS_MOVED
ALERT_ANNOUNCED != WINDOW_ACTIVATED
WINDOW_ACTIVATED != SUBJECT_SELECTED
SUBJECT_SELECTED != COMMAND_AUTHORIZED
```

Opening a notification should navigate to its context only after current Client/Workspace/revision/environment authorization and currentness are revalidated.

If a dirty modal/editing state blocks navigation, the notification does not gain authority to discard edits.

## 15. Accessibility

Accessibility is a routing dimension, not an afterthought.

Research requirements:

- advisory updates use non-interruptive programmatic status semantics where appropriate;
- assertive announcements are reserved for important/time-sensitive cases;
- status updates do not steal focus merely because content changed;
- notification history, unread state, acknowledgement, snooze and resolution are keyboard reachable;
- every icon/badge/color encoding has textual semantics;
- grouped notifications expose count and group meaning programmatically;
- screen-reader announcement deduplication is distinct from visual deduplication;
- rapid progress changes are rate-limited/coalesced for announcements while preserving accessible on-demand status;
- reduced-motion preferences affect animation/pulsing, not semantic visibility;
- critical state never relies on sound alone;
- no drag gesture is required to dismiss, reorder, snooze or inspect.

```text
VISUALLY_QUIET != SCREEN_READER_QUIET
TOAST_SUPPRESSED != STATUS_UNAVAILABLE_TO_AT
ASSERTIVE != FOCUS_STEAL
ANIMATION_DISABLED != ATTENTION_STATE_HIDDEN
```

## 16. Performance and attention storms

High-volume events must not create notification storms or main-thread storms.

Candidate containment pipeline:

```text
EVENT BURST
 -> CHEAP CLASSIFICATION
 -> DEDUP/CORRELATION
 -> CURRENTNESS/AUTHORIZATION FILTER
 -> ATTENTION BUDGET
 -> SURFACE ROUTING
 -> VIRTUALIZED HISTORY
```

Candidate performance obligations:

- 10,000 background events must not imply 10,000 toasts;
- taskbar badge computation should use bounded aggregates rather than loading every application/window;
- Notification Center history should virtualize high counts without silent omission;
- progress events should be coalesced by presentation cadence without fabricating progress;
- expensive recommendation explanations should lazy-load after the attention shell can render identity/severity/currentness;
- inactive/minimized windows need not be resident merely to retain attention state;
- restore after refresh/crash reconstructs unresolved attention from durable sources rather than trusting stale DOM/UI state.

```text
EVENT_RATE != INTERRUPTION_RATE
HIGH_EVENT_COUNT != HIGH_WINDOW_RESIDENCY
VIRTUALIZED_HISTORY != TRUNCATED_HISTORY
PROGRESS_COALESCED != PROGRESS_FABRICATED
```

## 17. Componentization impact

### primitive / atomic

Candidate shared primitives:

- `AttentionSeverityIndicator`
- `InterruptionLevelIndicator`
- `UnreadIndicator`
- `AcknowledgementIndicator`
- `ResolutionIndicator`
- `SnoozeIndicator`
- `CurrentnessIndicator`
- `AttentionSourceIndicator`
- `QuietModeIndicator`
- `AttentionCountBadge`

Shared behavior: textual semantics, keyboard reachability where interactive, currentness display, non-color-only meaning.

### compound

- `NotificationSummary`
- `ActivitySummary`
- `AttentionGroupSummary`
- `SnoozeControl`
- `AttentionRoutingSummary`
- `ProgressActivityItem`
- `ActionRequiredSummary`

### module component

- `NotificationCenterPanel`
- `StatusActivityPanel`
- `TaskbarAttentionProjection`
- `WindowAttentionProjection`
- `InContextAttentionRegion`

### tool

- `AttentionInspector`
- `NotificationHistoryInspector`
- `AttentionRoutingInspector`
- `AttentionDeduplicationInspector`
- `AttentionPolicyInspector`
- `AttentionStormDiagnostics`

### application

An application may own domain-specific interpretation and actions, but consumes shell attention contracts rather than inventing incompatible global notification behavior.

### window

A window may project unseen/current activity and navigate to subjects. Window close/minimize does not resolve activity or stop services.

### desktop

Desktop owns spatial/window-level attention projection and taskbar aggregation, not domain truth.

### workspace

Workspace scopes relevant attention by system/revision/environment/context and persists layout independently of notification truth.

### system view

System-wide attention may aggregate across desktops/applications while preserving Client/Workspace isolation, counts, UNKNOWN and drill-down authorization.

## 18. Shared vs specialized behavior

Shared shell behavior:

- routing contract;
- presentation lifecycle;
- currentness/authorization recheck;
- snooze/mute semantics;
- dedup/group presentation;
- keyboard/accessibility baseline;
- attention history;
- taskbar/status projections;
- interruption budgets.

Specialized application/domain behavior:

- semantic severity source facts;
- domain acknowledgement authority;
- remediation commands;
- resolution predicates;
- subject-specific explanation;
- legal/safety/security policy requiring stronger interruption.

```text
SHARED_PRESENTATION != SHARED_BUSINESS_OWNERSHIP
SHELL_ROUTING != DOMAIN_RESOLUTION
```

## 19. Commands and events

Candidate shell commands:

```text
attention.open
attention.markSeen
attention.snooze
attention.dismissPresentation
attention.openHistory
attention.filter
attention.mutePresentationClass
attention.restorePresentationPreference
```

Commands that mutate domain state (`incident.acknowledge`, `deployment.retry`, `permission.approve`, etc.) remain domain/application commands with their own authority and effect lifecycle.

Candidate events:

```text
AttentionCandidateProduced
AttentionQualified
AttentionRouted
AttentionPresented
AttentionSeen
AttentionSnoozed
AttentionPresentationDismissed
AttentionCurrentnessChanged
AttentionSuperseded
AttentionRetired
```

These are shell/presentation events and do not replace canonical domain events.

## 20. Failure and recovery

Failure cases must remain explicit:

- routing service unavailable -> retain candidate/history if durable; do not fabricate delivery;
- toast presentation failure -> Notification Center/Status may remain available;
- currentness resolver unavailable -> show `UNKNOWN`/defer sensitive interruption rather than claim current;
- notification action fails -> preserve action failure separately from notification acknowledgement;
- crash during snooze -> restore snooze from durable preference if applicable;
- stale notification opened after revision switch -> block stale action and offer current context resolution;
- source application unloaded -> attention identity/history remains inspectable without forcing app residency;
- Client access revoked -> suppress unauthorized content immediately while preserving authorized audit lineage.

```text
ROUTING_FAILED != EVENT_LOST
PRESENTATION_FAILED != DOMAIN_FAILURE_RESOLVED
ACTION_FAILED != NOTIFICATION_UNSEEN
SOURCE_APP_UNLOADED != ATTENTION_DELETED
```

## 21. Adversarial scenarios

1. 10,000 identical background failures arrive in 30 seconds.
2. 500 distinct failures share the same text but different occurrence identities.
3. A recommendation with score 0.99 asks for critical interruption while no safety/time requirement exists.
4. A low-confidence detector identifies a potentially catastrophic security condition.
5. User is in quiet mode when a time-sensitive but non-critical event arrives.
6. Client A toast is queued; user switches to Client B before presentation.
7. Delegated access expires while Notification Center is open.
8. User dismisses a warning; underlying condition remains unresolved.
9. User acknowledges an incident; another operator resolves it later.
10. Event resolves remotely before its toast is displayed.
11. Snoozed event becomes stale before snooze expiry.
12. Progress producer emits 100 updates/second.
13. Screen reader receives rapid grouped progress and error updates simultaneously.
14. A minimized application accumulates activity while its code is suspended.
15. Browser refresh occurs with unresolved notifications and dirty application windows.
16. Notification click targets a revision/environment no longer current.
17. Badge aggregate says `12`, but user lacks authorization to inspect 3 occurrences.
18. Two applications emit correlated warnings about one underlying condition.
19. One producer repeatedly re-emits the same unresolved recommendation to bypass dismissal.
20. Modal alert arrives while the user is resolving a dirty-state navigation conflict.
21. Small-screen mode cannot display taskbar and notification center simultaneously.
22. Accessibility user disables motion/sound while critical semantic state remains.
23. Routing/currentness dependency is unavailable and interruption eligibility becomes `UNKNOWN`.
24. Source app is hibernated/unloaded when user opens its notification.

## 22. Proof obligations

Future executable work, if ever authorized, should prove at minimum:

1. Producers cannot directly force an interruption surface.
2. `MODEL_SCORE` cannot independently select interruption level.
3. Dismissal never rewrites domain resolution.
4. Seen/acknowledged/actioned/effective/resolved remain distinguishable.
5. Client switch prevents queued notification leakage.
6. Delegation expiry removes unauthorized details without deleting history.
7. Deduplication preserves occurrence multiplicity and drill-down counts.
8. Grouping never converts multiple semantic occurrences into one canonical event.
9. Snooze expiry revalidates currentness before resurfacing.
10. Quiet mode suppresses presentation without erasing history.
11. Critical bypass requires explicit qualified policy.
12. Status updates are programmatically exposed without automatic focus movement.
13. Assertive accessibility announcements are bounded and justified.
14. Keyboard-only users can inspect, snooze, dismiss presentation and reach actions.
15. Reduced motion/sound never removes semantic state.
16. 10,000-event bursts do not create equivalent toast/window-residency bursts.
17. Progress coalescing preserves truthful latest/aggregate progress semantics.
18. Notification Center virtualization preserves counts and authorized drill-down.
19. Restore after refresh/crash reconstructs unresolved attention without treating stale UI as truth.
20. Source application suspension/hibernate does not erase shell attention identity.
21. Opening a stale notification cannot silently execute a stale command.
22. Notification action failure remains distinct from presentation/acknowledgement state.
23. Small-screen mode preserves severity, currentness, action requirement and history access.
24. Unavailable currentness/authorization evidence degrades to explicit `UNKNOWN`, never guessed success.

## 23. Findings on Desktop Spheres

This slice does not provide evidence sufficient to freeze the candidate Desktop Sphere taxonomy. Attention routing appears cross-cutting across all candidate spheres. A sphere may influence relevance and filtering, but sphere membership must not define semantic severity or interruption authority.

```text
DESKTOP_SPHERE != ATTENTION_AUTHORITY
SPHERE_VISIBLE != APP_LOADED
SPHERE_SWITCH != EVENT_RESOLVED
```

## 24. Maturity and saturation

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

Material findings:

- attention is a bounded shell resource;
- semantic severity, time sensitivity, action requirement and interruption are independent dimensions;
- producers request attention but shell/user/policy context qualifies effective routing;
- Status/Activity, taskbar, Notification Center, toast and modal have distinct contracts;
- acknowledgement, dismissal and resolution must not collapse;
- dedup/grouping are presentation operations, not semantic event merging;
- attention state survives application unload without implying application residency;
- Client/Workspace switches require requalification before queued presentation;
- accessibility announcement policy is a first-class routing dimension;
- high event rate must be contained before becoming interruption rate.

The shell foundation is not saturated enough for implementation planning.

## 25. Remaining gaps / next vector

Highest-value next vector:

**attention policy composition, escalation/de-escalation and cross-surface continuity under multi-actor work**.

Research questions:

- how personal, Client, Workspace, security/safety and application policies compose without allowing weak local policy to defeat hard floors;
- how unresolved events escalate over time without equating age with severity;
- how acknowledgement by one actor affects another actor's attention state;
- how ownership/on-call/assignment changes reroute attention without rewriting event history;
- how notification continuity behaves across browser tabs/devices/sessions while `Browser tab != SB tab`;
- how cross-device seen/ack state avoids both duplicate interruption and accidental global acknowledgement;
- how recovery after offline periods summarizes bursts without hiding unresolved critical items;
- how attention budgets/fairness prevent a noisy application from starving other applications.

Candidate invariants to test next:

```text
LOCAL_MUTE != SECURITY_FLOOR_OVERRIDE
OLDER != MORE_SEVERE
ESCALATED != RESOLVED
OTHER_USER_SEEN != I_HAVE_SEEN
ASSIGNEE_CHANGED != EVENT_RECREATED
DELIVERED_ON_DEVICE_A != ACKNOWLEDGED_GLOBALLY
ATTENTION_BUDGET_EXHAUSTED != EVENT_DROPPED
```

Do not advance to implementation planning while these gaps remain material.
