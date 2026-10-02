# G4 — Web Desktop Accessible Operational Announcement Ownership

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: Web Desktop / Operating Environment — operational UX, multi-display, observability and resource lifecycle

## Purpose

Refines one remaining cross-cutting boundary in the operational Web Desktop research: how dynamic operational state is exposed to assistive technology when one logical Workspace/Desktop is projected through multiple browser top-level surfaces/displays, while alert storms, background throttling, freeze/discard and recovery remain possible.

This is research only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, provider adoption or a frontend package choice.

## Evidence reviewed

Primary sources:

- W3C WAI, WCAG 2.1 Understanding SC 4.1.3 Status Messages: https://www.w3.org/WAI/WCAG21/Understanding/status-messages
- MDN, Page Visibility API: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- MDN, Window.focus(): https://developer.mozilla.org/en-US/docs/Web/API/Window/focus
- MDN, Window pageshow: https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event
- MDN, Window pagehide: https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
- MDN, inert global attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert

W3C establishes that status messages should be programmatically exposed without unnecessarily moving focus and explicitly warns that overuse of live regions/alerts can make applications too chatty. MDN establishes that browser visibility is not equivalent to focus, background contexts may have animation/timers throttled, `focus()` is only a request and is not guaranteed to make a window frontmost, restored pages can surface through `pageshow`, and page termination signals are not perfectly reliable. `inert` removes descendants from both interaction and the accessibility tree.

These are platform/accessibility constraints, not implementation selections.

## Material finding

The existing operational corpus already requires rate-bounded/grouped announcements and forbids alert storms from becoming assistive-technology storms. The missing boundary is **announcement ownership across browser surfaces**.

New invariant:

`Operational event != one announcement per BrowserSurface`.

For one logical WorkspaceSession, the semantic event/incident/currentness transition may be projected on several displays, but accessibility announcement is itself a presentation obligation that needs bounded ownership and deduplication.

Additional invariants:

- `Visible on two displays != announce twice`.
- `Focused surface != guaranteed visible surface`.
- `window.focus() requested != focus transfer verified`.
- `BrowserSurface hidden != Workspace operational attention absent`.
- `Surface restored != replay every missed event`.
- `Live region rendered != announcement delivery proven`.
- `Announcement delivered != responder aware != incident acknowledged`.
- `Accessibility announcement != notification delivery != incident state`.
- `Reduced render cadence != permission to suppress material accessibility status`.
- `inert presentation != safe place for the only accessibility status channel`.

## Candidate announcement model

Treat assistive-technology messaging as a qualified projection downstream of operational semantics:

`Operational transition -> Attention significance -> Announcement candidate -> WorkspaceSession dedup/coalescing -> eligible BrowserSurface presentation -> accessibility API exposure`.

Candidate identity:

`OperationalAnnouncementRef { semanticEventRef, workspaceSessionRef, significanceClass, materialDeltaKey, createdAt, supersedes?, sourceCurrentnessRef }`.

Candidate disposition:

`PENDING | COALESCED | PRESENTED | SUPERSEDED | DEFERRED | SURFACE_UNAVAILABLE | UNKNOWN`.

`PRESENTED` means the application exposed the status through the qualified accessibility mechanism; it does **not** prove that a human perceived it.

## Multi-display ownership

A WorkspaceSession should have at most one active accessibility-announcement owner for a deduplication domain unless a user preference or assistive-technology topology explicitly requires otherwise. Ownership is presentation-only and cannot mutate incident, alert, monitoring or effect authority.

Candidate eligibility signals may include:

- surface connected and current;
- document visibility;
- local focus/interaction recency;
- surface accessibility role/preferences;
- recovery state;
- user-selected primary operational surface.

No single browser signal is sufficient authority. Page Visibility is useful but visibility is not focus. `window.focus()` cannot be treated as an acknowledgement because browsers may refuse or delay it.

If ownership becomes ambiguous during surface loss/freeze, the system should prefer bounded duplicate risk over silently losing a critical status, while preserving semantic deduplication keys so recovery does not replay an unbounded backlog.

## Recovery and missed history

A surface returning through navigation restoration, BFCache/mobile restoration or other recovery may receive `pageshow` without representing a newly created semantic session. It must reconcile WorkspaceSession state before announcing.

Candidate recovery behavior:

1. reconcile current WorkspaceSession/WindowRegistry epoch;
2. requalify authorization/disclosure/currentness;
3. obtain a bounded material-delta summary since the surface checkpoint;
4. announce the summary, not every historical transition;
5. retain detailed history for keyboard/screen-reader drill-down.

Example summary semantics:

`During absence: 2 incidents opened, 1 resolved, monitoring coverage was unavailable for 6 minutes, 1 critical incident remains unacknowledged.`

The exact wording is future UX work; the research requirement is bounded semantic summarization with access to details.

`History retained != history must be replayed as live announcements`.

## Alert storms and coalescing

Coalescing is accessibility presentation logic, not evidence deletion. A storm of 500 child alerts may produce one qualified announcement such as a material group change while preserving count, scope, severity/currentness changes and drill-down.

A coalescer must not hide:

- newly affected Client/Environment/tenant scope;
- severity escalation;
- loss of evidence coverage/currentness;
- ownership/acknowledgement change;
- maintenance deviation;
- notification-path failure;
- authorization/requalification failure;
- transition from known to `UNKNOWN`.

`Coalesced announcement != coalesced evidence`.

## Status versus interruption

WCAG SC 4.1.3 supports programmatic status exposure without focus movement. Operational UX should therefore avoid moving focus for routine status changes. Assertive/interruption semantics are reserved for a separately qualified critical-interruption policy; severity alone does not automatically justify stealing focus.

Candidate separation:

`semantic severity != visual prominence != announcement politeness != focus interruption`.

This also preserves multi-display usability: an incident appearing on a monitor wall must not unexpectedly move keyboard focus away from an editor on the primary display.

## Resource lifecycle implications

Background/hidden surfaces may throttle timers and animation. Therefore accessibility correctness cannot depend on every BrowserSurface executing a local timer-based announcement loop.

The semantic queue/coalescing state should survive presentation throttling according to WorkspaceSession durability policy. When the presentation owner becomes unavailable, ownership may migrate or remain pending; no background tab is assumed continuously executable.

Resource degradation order must preserve material status semantics even when expensive charts, animations or render trees are suspended.

`Chart suspended != status semantics suspended`.

## External application boundary

An embedded/external application may operate its own live regions, alerts and focus behavior. SB cannot prove or control those semantics merely because the iframe is visible.

Therefore:

- native SB operational summaries remain independently accessible where SB owns the common operational path;
- opaque embeds are not used as the sole accessibility notification channel for SB-owned operational obligations;
- external UI announcement behavior does not prove SB notification delivery or incident acknowledgement;
- deep-link/advanced UI remains an escape hatch, not an excuse to omit qualified SB status semantics.

## Monitor wall and mosaic implications

Monitor-wall visual duplication across displays should not imply accessibility duplication. The mosaic editor should distinguish widget visual placement from announcement participation.

Candidate per-widget policy is not `aria-live everywhere`; instead widgets contribute material semantic deltas to the WorkspaceSession attention/announcement layer. This reduces both independent polling and independent accessibility chatter.

## Proof obligations / adversarials

1. Same critical incident is visible on two displays -> one logical announcement domain; no routine duplicate announcement.
2. Announcement-owner surface freezes before presentation -> another eligible surface can recover bounded attention without changing incident state.
3. `window.focus()` request fails -> system does not mark attention/acknowledgement as delivered.
4. Secondary display closes during alert storm -> no loss of evidence; surviving surface receives bounded material summary.
5. Restored surface has missed 10,000 telemetry/alert transitions -> no 10,000-message live-region replay.
6. Five hundred child alerts join one qualified incident group -> coalesced announcement preserves material cardinality/scope and drill-down.
7. Group severity escalates after coalescing -> new material announcement is eligible.
8. Evidence becomes stale while last health sample is green -> stale/currentness loss remains announceable; green cache cannot suppress it.
9. Monitoring source disappears with no alert -> coverage/currentness failure remains announceable.
10. Hidden primary surface is timer-throttled -> accessibility correctness does not rely on its local timer loop.
11. BFCache/pageshow restoration -> reconcile epoch/currentness before announcing restored state.
12. Dirty editor owns keyboard focus while monitor wall receives incident -> routine status does not steal focus.
13. User uses reduced motion -> announcement semantics remain unchanged.
14. Visual graph is suspended under memory pressure -> textual operational status remains available.
15. An `inert` subtree contains the only status node -> fail qualification because it is absent from the accessibility tree.
16. External iframe emits its own alert -> SB does not infer provider incident acknowledgement or SB announcement completion.
17. Authorization expires during surface absence -> restored surface requalifies before disclosing incident details.
18. Incident resolves and reopens during absence -> summary preserves the currently actionable state and historical transitions remain inspectable.
19. Notification route fails while alert evaluation remains healthy -> announcement distinguishes notification-path degradation from target health.
20. Announcement coalescer fails/unknown -> operational evidence remains intact and UI exposes degraded accessibility-attention coverage rather than inventing successful delivery.

## Componentes impact

Candidate records, deduplicated against existing operational components:

- `WorkspaceAnnouncementCoordinator`
- `OperationalAnnouncementSummary`
- `AnnouncementCoverageIndicator`
- `AnnouncementOwnerSurfaceIndicator`
- `MissedOperationalDeltaSummary`
- `AccessibilityAttentionDegradedNotice`

These are research candidates only and should be merged with existing Status/Activity/OperationalAttention primitives if future synthesis finds them semantically redundant.

## Saturation assessment

Disposition: `MATERIAL_DELTA / NARROW`.

The delta is not a new operational subsystem. It closes an accessibility/multi-display interaction boundary left implicit by prior Observatory, Extended Desktop, headless monitoring, incident-attention and resource-lifecycle research.

After this refinement, the :40 program is at documentary saturation for its broad requested scope. Remaining high-value questions are predominantly empirical: assistive-technology behavior across target browser/screen-reader combinations; acceptable coalescing windows; NORMAL/STRESS performance; leakage/revocation/failover timing; memory/currentness budgets; and user testing of monitor-wall interruption policy. Those require executable fixtures or usability/accessibility validation rather than additional abstract taxonomies.
