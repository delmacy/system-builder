# ADR-0017 — Station visual shell foundation

Status: Accepted  
Date: 2026-09-23  
Change level: L4  
Predecessor: ADR-0016 / Station Construction A integrated at `main@e0602eb51b1c8a4cee5bf4b89c0a1cfba26e9258`

## Context

ADR-0016 established the Station as a thin interaction client over Station SDK -> Station Gateway -> Core. Construction A proved that protocol boundary. The next owner-prioritized product milestone is visual: make the Station executable as an empty operating environment with reusable windows, shell chrome, commands, semantic icons and presentation settings before implementing real business studios or further Core/Agent improvements.

The frontend must avoid two traps:

1. rebuilding desktop mechanics from scratch when mature open-source interaction patterns exist;
2. embedding daedalOS, a browser filesystem, process model or application model as System Builder architecture.

The current public daedalOS repository is an MIT-licensed React/Next desktop environment. Its system tree separates Desktop, Window, Taskbar, StartMenu, Menu, Dialogs, Files and Apps, and it uses `react-rnd` for window interactions. These are useful implementation evidence, not canonical SB semantics.

## Decision

### 1. Station owns a source-controlled visual shell

`apps/station` remains the Station composition root. Reusable visual/runtime behavior lives in packages:

```text
apps/station
  -> station-shell
  -> station-app-runtime
  -> station-windowing
  -> station-interaction
  -> station-settings
  -> ui-icons
  -> ui-core
```

The shell is System Builder code and contracts. daedalOS is not a runtime dependency representing Station authority.

### 2. daedalOS is a donor/reference, not the product container

Every candidate daedalOS element is classified before reuse:

- `ADAPT`: Desktop/window/taskbar/start-menu/context-menu interaction patterns where useful.
- `REIMPLEMENT`: SB semantic command/app/window/settings contracts and state ownership.
- `DISCARD`: daedalOS browser filesystem, session authority, process semantics, bundled app ecosystem and backend assumptions.
- `REUSE`: small MIT-licensed implementation fragments or upstream libraries only when bounded and attributed.

Any copied/substantially derived code retains required MIT attribution. A third-party adoption record is mandatory if code is imported.

### 3. Initial frontend technology profile

For M1, use:

- React + Next.js as the visual host;
- semantic CSS variables / OKLCH tokens;
- Tailwind CSS v4 as the utility/style composition baseline;
- source-owned shadcn-style accessible primitives where useful;
- Lucide behind a semantic `IconRegistry`;
- `react-rnd` as the initial window geometry interaction provider unless the extraction spike disproves fit;
- React reducer/context style state for the bounded M1 runtime; no global state library is mandatory;
- Playwright for browser-level Station milestone proof;
- an internal Component Lab window rather than Storybook as the first component inventory.

Exact compatible dependency versions are pinned during Construction A and must pass repository verification.

### 4. State ownership

Three state classes remain distinct:

```text
Canonical system state       -> Core/domain owners
Station connection/context   -> existing StationApplication/SDK boundary
Presentation state           -> Station-local disposable state
```

Presentation state may include theme, density, reduced motion, shell visibility, window geometry, active window and saved layout. It must not contain canonical business truth, primary secrets, business authorization decisions or provider effects.

### 5. Commands precede controls

Buttons, toolbar items, taskbar actions, menu items and shortcuts invoke semantic commands. Controls must not independently implement business/system actions.

For M1, shell commands may be local presentation commands such as:

`window.open`, `window.close`, `window.minimize`, `window.maximize`, `settings.open`, `shell.toggleToolbar`.

Future Core-effecting commands continue through Station SDK.

### 6. Semantic icon indirection

Product code requests semantic icon tokens, not library-specific icons. The initial provider is Lucide. Changing icon provider must not rewrite product semantics.

### 7. First visual milestone

`STATION-VISUAL-M1-EMPTY-SHELL` proves an executable empty Station with:

- global navbar;
- command toolbar;
- desktop/work surface;
- taskbar/launcher;
- multiple utility/demo windows;
- move/resize/focus/minimize/maximize/close;
- Settings/Config Panel that live-adjusts shell presentation;
- local presentation persistence and restoration;
- Component Lab;
- keyboard/focus/accessibility baseline;
- explicit disconnected/simulator state rather than fabricated Core state.

## Non-goals

M1 does not implement File Manager semantics, Workflow Studio, Canvas, VFS, real Core transport, real authentication, deployment, Host Agent, Infrastructure UI, production notifications, multi-Core federation, installer/Tauri/Electron or client runtime UI.

## Consequences

- The Station becomes visibly executable before more backend improvements.
- Windowing/shell mechanics are reusable infrastructure rather than per-app code.
- daedalOS accelerates interaction engineering without defining SB authority or resource semantics.
- M1 can run with no Core attached while remaining honest about disconnected state.
- Later native hosting can replace the browser host without changing Station shell semantics.
