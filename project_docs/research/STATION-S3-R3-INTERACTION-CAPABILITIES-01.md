# Station S3-R3 — Interaction Capabilities 01

Date: 2026-09-27
Base: fresh `main@c09b291ee13cc846fbdab717cee31377bf6cc085`
Status: RESEARCH — NOT PRODUCT AUTHORITY

## Dependency/currentness

R2 final handoff is integrated. R3 is eligible for research only. Construction, Studios and AI/MCP foundation remain blocked until R1-R7, synthesis and explicit Construction materialization.

The accepted S3 hierarchy and boundaries remain unchanged. In particular: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; discrete/span authoring remains distinct from window geometry; Station cannot acquire Core/business authority.

## Station current state

`packages/station-interaction` already supplies a bounded presentation interaction layer:

- `PresentationCommandRegistry` owns presentation command identity, registration, availability and invocation;
- availability is re-evaluated at invocation time;
- shortcuts map to command identity rather than defining another command;
- `StationInteractionContext` keeps focus, selection and surface context explicit;
- `CoreCommandIntent` is a non-executable descriptor in the presentation registry and reserves authority for Core/domain owners;
- executable tests prove invocation-time availability recheck, multi-projection command identity, deterministic shortcut conflict handling, presentation-only focus/selection normalization, Core-intent rejection by the presentation registry and duplicate-command fail-closed behavior.

This is inherited evidence. R3 must not rebuild or retest it wholesale.

## Open question / hypothesis

Can C4 Capability remain a small provider-independent semantic layer above components/collections by separating:

`intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`

rather than putting domain action semantics into Button/Menu/Tree variants?

Working hypothesis: yes, but the existing presentation command registry covers only a bounded subset. It proves command identity and invocation-time presentation availability, not generic business authority, effect completion, partial effect, retry, compensation, evidence/currentness or accepted-vs-effective state.

## Independent benchmark evidence and delta

### VS Code command/context model — adopt-pattern

VS Code separates command identity from the surfaces that expose it. Commands can be invoked from command palette, keybindings and UI surfaces, while context/when clauses gate visibility and enablement. This independently converges with Station's existing command registry and projection identity rule.

Station consequence: conditions should be inspectable/context-derived inputs to command availability, but visibility/presentation gating must not be confused with execution authority. A hidden or disabled projection is not itself the authority decision.

Proof delta: same command identity across projections; context changes invalidate prior availability; invocation revalidates conditions; projection-specific visibility cannot silently create another action identity.

### Radix Menu/Toolbar — adopt-pattern, not provider authority

Radix Toolbar and Dropdown Menu independently show that navigation/focus ownership and activation are separate interaction contracts. Toolbar uses roving focus; Dropdown Menu owns item navigation, typeahead, dismissal and focus restoration; a menu trigger can be composed inside a toolbar without collapsing both state machines.

Station consequence: C4 capability activation must remain separate from C3 traversal/focus machinery. Contextual keyboard ownership from R2 is reinforced: the active interaction scope owns navigation keys, while activation resolves semantic command identity.

Proof delta: focus entry/transfer/restoration, no key stealing across nested scopes, activation identity invariant under projection.

### React Spectrum pending actions and MUI loading — divergence worth preserving

React Spectrum's pending Button remains focusable while press/hover are disabled and the pending state is announced. MUI's loading Button disables the control while showing a progress indicator. Both represent pending presentation, but differ in focus behavior.

Station consequence: `pending/loading` must not be promoted into universal command semantics. It is a presentation consequence derived from an execution/effect state under an explicit component/accessibility policy. The semantic execution model should expose enough result/currentness state for a projection to choose an appropriate pending representation without making that representation authoritative.

Proof delta: repeated activation policy while pending; focus/accessibility behavior belongs to the projection/component contract; command identity/result semantics remain unchanged.

## Candidate Interaction Grammar

Research candidate only; field names are not schema authority.

1. **Intent** — user/system request to attempt an action. Intent does not prove permission or success.
2. **Command identity** — stable semantic operation reference. Toolbar/menu/shortcut/overflow are projections of it by default.
3. **Target** — explicit ref(s) the command is requested against. Target identity is not placement or visual selection.
4. **Conditions** — deterministic contextual preconditions that can explain availability/applicability. Must be re-evaluated at execution boundary when stale state is possible.
5. **Authority** — owner allowed to decide whether the requested effect may occur. Presentation registry may own Station-local presentation commands; Core/domain commands remain Core/domain authority.
6. **Effects** — requested/observed state changes. `accepted` is not equivalent to `effective`.
7. **Result** — typed execution outcome/evidence envelope sufficient to distinguish at least rejected/unavailable, accepted/pending, effective/succeeded, failed, partial/indeterminate where semantics require them. Exact vocabulary remains synthesis work.
8. **Presentation consequences** — disabled/pending/error/success/navigation/focus/toast/etc. derived for a projection; they do not become effect authority.

## Failure/recovery semantics

R3 must preserve these distinctions:

- stale condition/target: availability observed earlier cannot authorize execution later;
- unavailable/rejected: no effect should be inferred;
- accepted != effective: acknowledgement/queueing does not prove final state;
- partial/indeterminate effect: must not be collapsed into success;
- retry: requires an explicit retry-safety/idempotency policy or fresh command attempt; UI must not assume retry is safe;
- compensation/rollback: only where the authoritative capability declares it; not a generic Station promise;
- evidence/currentness: outcome evidence needs enough identity/currentness to avoid presenting stale completion as current truth.

Station presentation commands that are synchronous/local may legitimately mark several of these concerns not-applicable. That decision is per capability contract, not global.

## C4 promotion and dedup rule

Promote a C4 Capability only when there is reusable semantic behavior above component/collection mechanics: stable command/action identity, target/condition semantics, reusable state transition, execution boundary, or result/recovery contract with its own proof delta.

Do **not** create a new capability merely for another button label/icon/color, another toolbar/menu placement, another domain noun, responsive relocation, or a projection-specific pending/error rendering.

`ApproveDocumentButton` remains a rejected direction when `Button + binding -> approve command + document target + conditions/authority` expresses the case. A genuinely distinct approval capability is justified only by distinct reusable semantic/authority/effect obligations, not by its visual trigger.

## Proof Grammar — inherited vs R3 delta

Coverage vocabulary: `proven | failed | unproven-gap | not-applicable`. Absence of evidence is never PASS.

| Obligation | Status | Rule |
|---|---|---|
| presentation command unique identity | proven | inherit existing Station test |
| invocation-time presentation availability recheck | proven | inherit existing Station test |
| multiple presentation projections -> one command identity | proven | inherit existing Station test |
| shortcut conflict fail-closed | proven | inherit existing Station test |
| focus/selection presentation-context normalization | proven | inherit existing Station test |
| Core intent cannot execute in presentation registry | proven | inherit authority-boundary test |
| target identity/currentness beyond presentation context | unproven-gap | R3/synthesis delta |
| conditions vs authority separation | unproven-gap | R3/synthesis delta |
| stale-state rejection at authoritative boundary | unproven-gap | future boundary proof where applicable |
| accepted != effective representation | unproven-gap | future result-contract proof |
| partial/indeterminate effect semantics | unproven-gap | capability-specific proof |
| retry safety/idempotency declaration | unproven-gap | capability-specific; may be N/A |
| compensation/rollback | unproven-gap | capability-specific; may be N/A |
| result evidence/currentness | unproven-gap | boundary/integration proof |
| contextual keyboard ownership | inherited R2 gap | do not mark PASS; refine with capability projection |
| projection command-identity invariance | partially proven for presentation command + shortcut; broader projections unproven-gap | delta-only proof |
| pending presentation focus/a11y | policy-dependent | component/projection proof; not command authority |

## Smallest future proofs

Future Construction should not build a giant end-to-end suite for every command. The minimum adequate proof follows ownership:

- command registry: identity/conflict/availability transition unit tests;
- binding/projection: one test that multiple surfaces resolve the same semantic command and preserve target;
- authoritative boundary: stale/unauthorized request fails closed without claiming effect;
- asynchronous effect contract where applicable: accepted/pending is distinguishable from effective/final;
- retry/compensation only when admitted by the capability contract;
- accessibility/focus proof belongs to the interactive projection, inheriting command semantics rather than re-proving them.

Human acceptance remains separate: it validates whether the intended command/result/presentation policy is correct, not whether the machine proof happened to pass.

## Grammar sufficiency implications

The future sufficiency test should attempt the same small Interaction Grammar against approval, ticketing, CRUD, operational dashboard and deployment configuration. R3 success is not a numeric score. Record for each exemplar whether existing primitives/collections + command/target/conditions/authority/effect/result contracts express the behavior, which lower proofs are inherited, and which gaps force a genuinely new abstraction.

A domain-specific button/component created only to make an exemplar fit counts as a dedup/sufficiency warning, not success.

## Disposition

- **own**: Station presentation-command identity/context contracts; proof inheritance; provider-independent capability vocabulary.
- **adapt**: mature context gating, focus arbitration and result/pending representation mechanisms only where accepted semantics require them.
- **adopt-pattern**: one semantic command across projections; invocation-time revalidation; separation of navigation/focus from activation; pending as presentation consequence rather than authority.
- **defer**: generic Core executor, transaction engine, retry framework, compensation engine, AI/MCP command generation, or product-specific capability catalog.

## Current R3 gaps / next work

1. Census existing Station dirty/validation/drag-drop/resize/ordering capabilities and classify component-owned vs shared service vs projection.
2. Search existing Core contracts before proposing any cross-boundary result/effect schema.
3. Benchmark editor/workstation command models only against concrete open questions: target resolution, contextual enablement, undo/redo ownership, async result/currentness and projection invariance.
4. Extend proof matrix for each promotable capability; do not convert implementation presence to PASS.
5. Keep R4 blocked until R3 handoff bounds capability ownership and proof debt.
