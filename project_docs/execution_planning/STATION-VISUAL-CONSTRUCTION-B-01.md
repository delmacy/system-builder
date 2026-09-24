# STATION Visual Construction B — M1 Shell Composition

Sprint ID: `STATION-VISUAL-CONSTRUCTION-B-01`  
Status: COMPLETED — AWAITING EXACT-HEAD INTEGRATION GATES  
Materialization base: `main@4434f21acc532a5481bb5412fcf228af11083458`  
Predecessor: Construction A integrated by PR #903; bounded shell work through PR #910 is already in main.  
Execution branch: `sprint/STATION-VISUAL-CONSTRUCTION-B-01`

## Goal
Compose `Navbar -> Toolbar/Command Surface -> Desktop Sphere -> Windows -> Taskbar/Launcher` into a coherent M1 desktop shell while keeping Station thin.

## Already integrated — do not replay
Next.js 16.3.6 + explicit Webpack; Windows/Ubuntu Station CI; fullscreen/measured desktop bounds; SET_BOUNDS/maximize/collision/titlebar fixes; vertical WindowFrame; move/focus/minimize/maximize/restore/close; full resize; initial multi-window/taskbar/launcher from PR #910.

## TASK chain
`TASK-597 -> TASK-598 -> TASK-599 -> TASK-600 -> TASK-601 -> TASK-602 -> TASK-603 -> TASK-604 -> TASK-605` — complete. TASK-604 predecessor exact head `5cd2c9600a4e2784ebe26984771f5fb559123da2` is green across Deterministic CI, Merge Candidate CI, Heavy Product Tests, Station Next.js CI and Automation Handoff State Machine. TASK-605 records cumulative closure only; its own exact-head gates remain the integration prerequisite.

## Layering
`apps/station -> station-shell -> station-app-runtime -> station-windowing -> station-interaction -> station-settings -> ui-icons -> ui-core`. `apps/station` remains composition root.

## Authority
`Station requests/intends -> Core validates/authorizes -> Core changes canonical truth/orchestrates -> Agent/Providers execute -> Station projects returned state`.

Presentation Commands may execute locally. Core Command Intents may only represent requested intent; visibility never means authorization.

## M1 cumulative proof
Station starts explicitly disconnected; Navbar/Toolbar/Desktop/Taskbar compose; utility apps, multi-window interaction, bounded snap, Settings, local presentation persistence/reset and keyboard accessibility are present. The browser journey executes on the dedicated Windows/Ubuntu Station gate. Semantic icons and ui-core remain source-owned. `Station presentation state != Core truth`, `Window lifecycle != runtime lifecycle`, and `Focused Window != Selected Semantic Object` remain intact.

## Validation
Exact-head Deterministic CI, Merge Candidate CI, Heavy Product Tests when applicable, Station Next.js CI Windows/Ubuntu, architecture/dependency checks and browser M1 proof. No merge with a relevant red gate.
