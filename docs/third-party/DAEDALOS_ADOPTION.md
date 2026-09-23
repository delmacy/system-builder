# daedalOS adoption record

Date: 2026-09-23  
Upstream: `DustinBrett/daedalOS`  
License: MIT  
Upstream copyright notice observed: Copyright (c) 2025 Dustin Brett

## Purpose

daedalOS is evidence and a bounded donor/reference for mature browser-desktop interaction patterns. It is not the System Builder Station runtime authority, filesystem, session model or process model.

No daedalOS source code is copied by TASK-588. If a later task copies or substantially derives code, the applicable MIT copyright/license notice must accompany the derived distribution/source as required.

## Initial extraction classification

| Upstream area/pattern | Classification | Station treatment |
|---|---|---|
| Desktop composition | ADAPT | Re-express against SB shell/window contracts |
| Window drag/resize/focus | ADAPT | Candidate interaction mechanics behind SB WindowFrame |
| `react-rnd` dependency | REUSE-UPSTREAM-CANDIDATE | Evaluate/pin directly rather than inheriting daedalOS process state |
| Taskbar running-window interaction | ADAPT | Project SB WindowInstance state |
| Start menu/menu interaction | ADAPT | Later Launcher/Command surfaces |
| Dialog interaction patterns | REFERENCE | Build with source-owned accessible primitives |
| Apps/process context | REIMPLEMENT | AppManifest + WindowManager; no daedalOS process authority |
| Session context | DISCARD | Station/Core session semantics remain ADR-0016 owned |
| Browser filesystem | DISCARD | Never canonical SB resource/filesystem truth |
| Bundled apps/emulators | DISCARD | Outside Station M1 |
| daedalOS visual identity/theme | DISCARD | SB semantic design tokens own product identity |
| daedalOS backend assumptions | DISCARD | Station uses Station SDK/Gateway/Core boundaries |

## TASK-593 revalidation

Inspected against upstream `main` on 2026-09-23:

- `components/system/Window/RndWindow/index.tsx`
- `components/system/Window/RndWindow/useRnd.ts`
- `components/system/Window/RndWindow/useDraggable.ts`
- `components/system/Window/RndWindow/useResizable.ts`
- `components/system/Window/index.tsx`

Observed transferable patterns:

- controlled window position/size;
- drag and resize interaction translated into state updates;
- focus coupled to foreground/z-order interaction;
- bounds validation before state commit;
- minimized windows removed from interaction/render participation.

TASK-593 **does not copy upstream daedalOS source**. It reimplements these interaction ideas against SB `WindowInstance` / `WindowAction` contracts using native Pointer Events. `react-rnd` therefore remains a deferred provider candidate rather than an M1 dependency.

Explicitly rejected from the inspected upstream path:

- `useProcess` / process authority;
- `useSessionActions` / session-owned window truth;
- filesystem/app semantics;
- styled-components theme identity;
- iframe/process element linking.

Because no daedalOS source is copied or substantially derived in TASK-593, no additional MIT source notice is required beyond this adoption record. Any future copied code must carry the applicable upstream notice.
