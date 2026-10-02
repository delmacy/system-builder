# G4 — Web Desktop Command Registry Applicability & Execution Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Frontend Design System & UI Foundation / G4 Web Desktop & Application Environment
Date: 2026-09-22

## Purpose

Bounded research into the Command Registry shared by Ribbon, contextual tabs, Tool Rail, menus, Command Palette, keyboard shortcuts and equivalent small-screen command surfaces for the candidate hierarchy `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

This artifact does not authorize implementation, choose a command framework, or make presentation state an authority source. It extends `G4_WEB_DESKTOP_WINDOW_LIFECYCLE_RESEARCH.md` and `G4_WEB_DESKTOP_WORKSPACE_SESSION_RECOVERY_RESEARCH.md`.

## Evidence classes

### E1 — mature IDE command architecture

VS Code distinguishes command registration from presentation. Its command contribution model has an `enablement` expression that applies across menus and keybindings, while individual menu `when` conditions can decide whether a command is shown in a particular surface/context. This is useful evidence for separating discoverability/presentation from executable applicability rather than letting each menu invent command truth.

### E2 — accessibility interaction evidence

WAI-ARIA APG menu/menubar patterns define disabled menu items as perceivable/focusable but not activatable. APG toolbar guidance notes that disabled controls may remain focusable when discoverability is important. `aria-disabled` communicates disabled semantics without itself suppressing functionality; activation must still be prevented by behavior. Therefore visible/focusable/discoverable and executable are independent axes.

### E3 — existing G4 state/effect boundaries

Existing G4 research requires `SELECTED != FOCUSED`, `READ_ONLY != PERMISSION_DENIED`, `STALE != CURRENT`, `BLOCKED != DISABLED`, `PENDING != EFFECTIVE`, `ACK != effect`, and restored UI cannot upgrade authority/currentness. The Command Registry must project these distinctions instead of flattening them into one boolean `disabled`.

## Finding 1 — command identity is independent from command surfaces

Candidate identity:

```text
CommandDefinition {
  commandId
  semanticIntent
  targetKinds[]
  scopeKinds[]
  parameterContract?
  resultContract?
  effectClass
  idempotencyClass?
  presentationHints?
  applicabilityPolicyRef
  authorityPolicyRef?
  currentnessPolicyRef?
  concurrencyPolicyRef?
  recoveryPolicyRef?
}
```

A `CommandDefinition` may be projected into Ribbon, context menu, Command Palette, shortcut, Tool Rail, Inspector action or compact/mobile action surface without becoming multiple commands.

Invariants:

```text
COMMAND_IDENTITY != COMMAND_SURFACE
COMMAND_VISIBLE != COMMAND_APPLICABLE
COMMAND_FOCUSABLE != COMMAND_EXECUTABLE
SHORTCUT_BOUND != COMMAND_AUTHORIZED
RIBBON_BUTTON_STATE != COMMAND_AUTHORITY
CONTEXT_MENU_PRESENCE != SEMANTIC COMPATIBILITY
```

Surface-specific ordering/grouping/icon/label/shortcut hints are representation metadata. They do not own applicability or authority.

## Finding 2 — command disposition needs orthogonal axes

A single `enabled` boolean cannot explain why a command can or cannot execute. Candidate evaluation vector:

```text
CommandDisposition {
  visibility       = HIDDEN | VISIBLE
  discoverability  = NORMAL | EXPLAINABLE_UNAVAILABLE
  applicability    = APPLICABLE | NOT_APPLICABLE | APPLICABILITY_UNKNOWN
  authority        = AUTHORIZED | UNAUTHORIZED | AUTHORITY_UNKNOWN | AUTHORITY_STALE
  currentness      = CURRENT | STALE | CURRENTNESS_UNKNOWN
  readiness        = READY | BLOCKED | DEPENDENCY_PENDING | INPUT_REQUIRED
  execution        = IDLE | REQUESTED | PENDING | ACKNOWLEDGED | VERIFYING | EFFECTIVE | PARTIAL | REJECTED | FAILED | EFFECT_UNKNOWN
}
```

These dimensions are not interchangeable. Example: `Delete selected relation` may be visible/discoverable but `NOT_APPLICABLE` with no compatible relation selected. `Publish` may be applicable but `UNAUTHORIZED`. `Retry effect` may be authorized/applicable but `BLOCKED` until effect identity/current disposition is requalified.

Derived presentation may expose a simpler state, but the underlying reason remains inspectable.

New invariants:

```text
NOT_APPLICABLE != UNAUTHORIZED
UNAUTHORIZED != DISABLED_BY_UI
STALE != NOT_APPLICABLE
BLOCKED != UNAUTHORIZED
INPUT_REQUIRED != BLOCKED_BY_POLICY
PENDING != ACKNOWLEDGED
ACKNOWLEDGED != VERIFIED
VERIFIED != EFFECTIVE unless effect contract says verification proves effect
FAILED != EFFECT_UNKNOWN
```

## Finding 3 — evaluation occurs against a qualified CommandContext snapshot

Existing window research already defines active window, semantic selection, revision/environment and authority/currentness as separate context. Command evaluation therefore consumes a qualified snapshot rather than reading incidental DOM state.

Candidate:

```text
CommandEvaluationContext {
  evaluationId
  evaluatedAt
  clientRef
  workspaceRef
  desktopSphereRef?
  applicationRef?
  windowRef?
  viewRef?
  focusedControlRef?
  selectedSemanticRefs[]
  revisionRef
  environmentRef
  authorityEvidenceRef?
  currentnessEvidenceRef?
  draftDisposition?
  effectRefs[]
}
```

The snapshot is evidence for presentation and preflight only. Effectful execution MUST revalidate material guards at the authoritative execution boundary when race/revocation/currentness can change after evaluation.

```text
PREFLIGHT_PASS != EXECUTION_ADMISSION
VISIBLE_NOW != SAFE_TO_EXECUTE_LATER
SHORTCUT_RESOLVED != EFFECT AUTHORIZED
```

If selection/context changes between pointer/key activation and admission, execution uses explicit command target semantics or fails/requalifies; it must not silently retarget to a newly selected object.

## Finding 4 — command evaluation pipeline

Candidate pipeline:

```text
REGISTERED
 -> surface visibility qualification
 -> target/scope resolution
 -> semantic applicability qualification
 -> authority qualification
 -> currentness qualification
 -> readiness/input qualification
 -> PRESENTABLE_DISPOSITION

activation
 -> CAPTURE_TARGET_AND_CONTEXT
 -> EXECUTION_REVALIDATION
 -> ADMITTED | REJECTED | BLOCKED | NEEDS_INPUT
 -> REQUESTED
 -> PENDING
 -> ACKNOWLEDGED?
 -> VERIFYING?
 -> EFFECTIVE | PARTIAL | FAILED | EFFECT_UNKNOWN
```

Invalid shortcuts/transitions:

```text
VISIBLE -> AUTHORIZED
APPLICABLE -> CURRENT
ACKNOWLEDGED -> EFFECTIVE without declared proof
PENDING -> EFFECTIVE because spinner stopped
EFFECT_UNKNOWN -> FAILED because window closed
STALE -> CURRENT because command surface rerendered
```

For local/pure UI commands, the effect lifecycle may legitimately collapse (e.g. focus a panel). For remote/business-effect commands, the lifecycle remains explicit. The registry must describe the command effect class so presentation does not assume every command has the same completion semantics.

## Finding 5 — explainable unavailability is distinct from hiding

Mature command surfaces need both clutter control and discoverability. Candidate policy:

- hide commands whose target/domain is genuinely irrelevant to the current surface;
- keep strategically discoverable commands visible but unavailable when the user can benefit from learning the prerequisite;
- expose a machine-readable reason code plus human-readable explanation/action where safe;
- never use `disabled` styling alone to communicate permission, stale context, missing selection, pending duplicate prevention or required input.

Candidate reason classes:

```text
NO_COMPATIBLE_TARGET
SELECTION_CARDINALITY_MISMATCH
READ_ONLY_CONTEXT
PERMISSION_DENIED
AUTHORITY_STALE
CURRENTNESS_UNKNOWN
REVISION_DRIFT
ENVIRONMENT_MISMATCH
DEPENDENCY_PENDING
DUPLICATE_EFFECT_PENDING
REQUIRES_INPUT
CONFLICT_REQUIRES_RECONCILIATION
RECOVERY_CONTEXT_NOT_QUALIFIED
```

`READ_ONLY_CONTEXT` and `PERMISSION_DENIED` remain distinct. A read-only review mode may still allow copy/export/inspect commands while effectful mutation commands are unavailable.

## Finding 6 — duplicate activation is an execution concern, not merely button disabling

Disabling a button after activation is useful presentation but is not a concurrency guarantee. Keyboard shortcut, palette, another window/surface or delayed event can race the visual update.

Candidate duplicate policy is declared per command/effect:

```text
ALLOW_PARALLEL
COALESCE_SAME_TARGET
REJECT_WHILE_PENDING
REUSE_INFLIGHT_EFFECT_ID
SERIALIZE_PER_TARGET
REQUIRE_FRESH_REQUALIFICATION
```

The authoritative execution boundary enforces the policy. `aria-disabled`, pointer suppression or a spinner cannot serve as duplicate-effect fencing.

```text
UI_DISABLED != DUPLICATE_EFFECT_FENCED
PENDING_INDICATOR != IDEMPOTENCY_PROOF
SAME_COMMAND_ID != SAME_EFFECT_ID
```

## Finding 7 — keyboard, Ribbon, menu and palette must converge on the same command contract

A shortcut first resolves a `commandId`, then the same disposition/admission path applies. No hidden keyboard-only authority exists.

For composite Ribbon/toolbars, APG-style arrow navigation can reduce tab stops. Disabled-but-discoverable controls may remain focusable when useful, but activation must be suppressed consistently for pointer and keyboard. Menu items can likewise remain focusable while disabled. Small-screen replacement surfaces may reorder/group commands but must preserve equivalent operation and reason/explanation access.

Candidate focus behavior:

```text
focus command != activate command
focus unavailable command -> may expose reason/help
Enter/Space unavailable command -> no effect; explanation MAY be announced/exposed
shortcut unavailable command -> same disposition/reason, no bypass
```

## Finding 8 — command state across suspension/recovery

Persisted session state MAY remember command-surface preferences and unresolved effect references. It MUST NOT persist `enabled=true` or `authorized=true` as current truth.

On restore:

```text
COMMAND_PRESENTATION_RESTORED
 -> CONTEXT_REQUALIFIED
 -> COMMAND_DISPOSITIONS_REEVALUATED
```

An execution that was `PENDING/ACKNOWLEDGED/EFFECT_UNKNOWN` before crash remains tied to its effect identity and is requalified from effect authority; it is not converted to idle merely because the original button/window disappeared.

## Componentization impact

### Primitive / atomic

- `CommandStateIndicator`
- `CommandReasonIndicator`
- `ShortcutHint`
- `PendingEffectIndicator`
- `CurrentnessIndicator`
- `AuthorityDispositionIndicator`

### Compound

- `CommandButton`
- `CommandMenuItem`
- `CommandPaletteItem`
- `ContextualCommandGroup`
- `UnavailableReasonPopover`
- `CommandProgressItem`

### Module component / tool

- `CommandRegistry`
- `CommandContextResolver`
- `CommandDispositionEvaluator`
- `CommandApplicabilityInspector`
- `CommandExecutionTracker`
- `ShortcutResolver`
- `RibbonProjection`
- `ContextMenuProjection`
- `CommandPalette`

### Application / window / desktop / workspace

- applications contribute command definitions/presentation hints without owning shell routing;
- windows/views provide qualified context and explicit targets;
- Desktop Sphere can project contextual command groups without changing command identity;
- Workspace scope supplies revision/environment/currentness/authority evidence but remains distinct from command presentation.

Candidate Componentes metadata additions:

```text
commandRole
commandId?
commandSurfaceKinds[]
commandTargetKinds[]
commandEffectClass?
commandApplicabilityContract?
commandAuthorityContract?
commandCurrentnessContract?
commandConcurrencyContract?
commandRecoveryContract?
unavailableReasonContract?
keyboardActivationContract?
```

## Accessibility findings

- `aria-disabled`/disabled presentation communicates operability but does not enforce business guards; behavior must suppress activation and execution admission must independently validate guards.
- Discoverability policy determines whether an unavailable command remains keyboard reachable; this is not one universal rule for every surface.
- Ribbon/toolbars should use established composite keyboard patterns where applicable; menus/menubars use their established arrow-key navigation.
- Reason for unavailability must be available without hover-only interaction; keyboard/focus and textual status/description paths are required.
- Focus/selection remain independent when moving between WorkSurface, Ribbon, Inspector and Palette.
- Color/icon alone cannot distinguish permission, applicability, stale, blocked or pending states.
- Reduced motion changes progress presentation, never command disposition/effect state.

## Performance findings

Command evaluation can become a hot shell path at high component/window counts. Candidate constraints:

- evaluate against explicit context keys/evidence refs rather than traversing arbitrary component trees;
- dependency-track command predicates so selection/currentness/authority changes invalidate only affected dispositions;
- virtualized palettes may defer rendering rows, not semantic evaluation required for search/filter/result correctness;
- expensive remote authority/currentness qualification should expose `UNKNOWN/PENDING` rather than block the entire shell or guess;
- repeated presentation surfaces consume one shared evaluated disposition where context/evidence identity is equal;
- high command count should favor indexed registry/search and lazy presentation metadata, while command identity remains stable.

No performance optimization may convert `UNKNOWN -> ENABLED`, drop material unavailable reasons, or use stale authorization as current.

## Adversarial scenarios

1. User presses a shortcut exactly as permission is revoked: preflight may have shown authorized, but execution admission rejects/requalifies.
2. Pointer double-clicks a pending publish command before UI rerender: concurrency policy prevents duplicate effect independent of button state.
3. Command Palette and Ribbon show the same command under identical context: disposition/reason must agree.
4. Semantic selection remains while focus moves to Ribbon: target resolution preserves selection without treating focused button as semantic target.
5. Selection changes between menu opening and activation: explicit target snapshot/revalidation prevents silent retargeting.
6. Command is applicable but revision evidence becomes stale: it remains distinct from `NOT_APPLICABLE` and cannot execute as current.
7. Read-only workspace: inspect/copy commands remain usable while mutation commands expose read-only disposition, not generic permission denial.
8. Remote request ACK arrives, then verification is unknown: command remains unresolved rather than effective.
9. Browser crash during pending effect: restore requalifies effect identity and does not offer a duplicate command as if nothing happened.
10. Small-screen compact surface omits Ribbon geometry: equivalent command identity, disposition, reason and effect tracking remain available.
11. Unavailable menu item remains focusable for discoverability: Enter/Space produces no effect and cannot bypass admission.
12. Context menu hides an irrelevant command while Command Palette offers it only when globally relevant: presentation difference does not change command identity/authority.

## Proof obligations

1. All command surfaces resolve the same `commandId` to the same semantic applicability/authority/currentness under an equivalent qualified context.
2. No surface-local `disabled/enabled` flag is authoritative for execution.
3. Effectful execution revalidates material guards at admission when evidence can race.
4. Duplicate activation cannot create duplicate effects merely because multiple presentation surfaces exist.
5. `ACK` cannot become `EFFECTIVE` without the command's declared effect proof.
6. Unavailability reason is available without hover and remains distinguishable across applicability, authority, currentness, readiness and pending duplicate states.
7. Keyboard shortcuts cannot bypass command guards or concurrency policy.
8. Restore cannot revive persisted authorization/currentness or erase unresolved effect identity.
9. Small-screen/non-Ribbon surfaces preserve equivalent operation for required commands.
10. Registry/presentation metadata cannot become business truth or semantic ownership.
11. Evaluation optimization cannot silently promote `UNKNOWN/STALE/BLOCKED` to executable.
12. Selection/focus divergence does not cause unintended command retargeting.

## Deduplication

This artifact does not redefine window lifecycle, WorkspaceSession checkpointing, effect semantics or business authorization. It consumes those contracts to research command presentation/admission. It preserves the prior candidate routing precedence while making applicability/authority/currentness and execution lifecycle explicit.

## Maturity / remaining gaps

This slice is `MATERIAL_DELTA / PARTIALLY_MATURE`.

Material gaps before implementation planning:

1. command parameter/input transaction model for dialogs, inspectors and multi-step commands;
2. bulk command algebra for partial success, per-target authority/currentness and retry subsets;
3. undo/redo boundaries for pure UI/local draft/canonical mutation/external effects;
4. empirical command-registry scale budgets and predicate invalidation benchmarks;
5. privacy/security of unavailable-reason disclosure across delegated client access;
6. command contribution collision/namespacing/versioning across replaceable applications;
7. formal relationship between command execution tracking and Status/Activity aggregation.

Next recommended vector: bulk/multi-target command execution and partial-result algebra, including per-target `APPLICABLE/AUTHORIZED/CURRENT`, `PARTIAL`, retry subset, ACK/verification/effective and non-atomic external effects.