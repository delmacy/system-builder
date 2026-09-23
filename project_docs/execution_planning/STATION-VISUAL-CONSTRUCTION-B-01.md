# STATION Visual Construction B — M1 Shell Composition

Sprint ID: `STATION-VISUAL-CONSTRUCTION-B-01`  
Status: COMMITTED  
Materialization base: `main@4434f21acc532a5481bb5412fcf228af11083458`  
Predecessor: Construction A integrated by PR #903; bounded shell fixes through PR #910 are already in main.  
Execution branch after materialization integration: `sprint/STATION-VISUAL-CONSTRUCTION-B-01`

## Goal
Transform the source-owned visual foundation into a coherent navigable M1 desktop shell:

`Navbar -> Toolbar/Command Surface -> Desktop Sphere -> Windows -> Taskbar/Launcher`

Station remains a thin perception/interaction client. Any visible Core status is a projection of known connection state only; a visible command is never equivalent to Core authorization.

## Existing fresh-main evidence that must not be repeated
- Next.js 16.3.6 with Station explicitly using Webpack;
- dedicated Station Next.js CI on Windows and Ubuntu;
- fullscreen shell and measured desktop bounds via ResizeObserver/SET_BOUNDS;
- maximize/right-bottom collision/titlebar fixes;
- vertical WindowFrame layout;
- move/focus/minimize/maximize/restore/close;
- full window resize;
- initial multi-window/taskbar/launcher foundation from PR #910.

## Committed TASK chain
```text
TASK-597 Navbar
 -> TASK-598 Toolbar / Command Surface
 -> TASK-599 Taskbar / Launcher completion
 -> TASK-600 multi-window journey + bounded snap completion
 -> TASK-601 Settings M1 + Component Lab
 -> TASK-602 presentation/layout persistence and reset
 -> TASK-603 keyboard/focus/accessibility
 -> TASK-604 Station browser/cross-platform M1 proof
 -> TASK-605 cumulative M1 shell proof
```

## Layering
`apps/station -> station-shell -> station-app-runtime -> station-windowing -> station-interaction -> station-settings -> ui-icons -> ui-core`.

`apps/station` remains the composition root.

## Authority boundary
`Station requests/intends -> Core validates/authorizes -> Core changes canonical truth/orchestrates -> Agent/Providers execute -> Station projects returned state`.

Construction B may distinguish Presentation Commands from Core Command Intents, but it may not simulate Core authorization or successful provider/domain effects.

## Final validation
Exact-head Deterministic CI, Merge Candidate CI, Heavy Product Tests when applicable, Station Next.js CI on Windows and Ubuntu, architecture/dependency checks and M1 browser proof. Do not merge with a relevant red gate.

## Stop/escalation
Stop if implementation requires moving canonical truth/authorization/workflows/provider effects/deploy/storage/schedulers/agents into Station or expanding into deferred subsystems.
