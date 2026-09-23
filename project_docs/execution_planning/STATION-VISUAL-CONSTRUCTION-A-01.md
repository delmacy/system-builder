# STATION Visual Construction A — frontend substrate and windowing core

Sprint ID: `STATION-VISUAL-CONSTRUCTION-A-01`  
Status: COMMITTED  
Predecessor: planning PR integrated on fresh main  
Branch: `sprint/STATION-VISUAL-CONSTRUCTION-A-01`

## Goal

Establish the reusable Station frontend substrate without prematurely building real Studios: executable React/Next host, design system baseline, semantic icons, command runtime, windowing model/provider boundary, app manifests and local presentation settings.

## Committed TASK chain

```text
TASK-588
  -> TASK-589
  -> TASK-590
  -> TASK-591
  -> TASK-592
  -> TASK-593
  -> TASK-594
  -> TASK-595
  -> TASK-596
```

## Growing proof

Construction A must finish with the Station host rendering an empty desktop and at least one manifest-driven utility window using the real ui/icons/command/window/settings packages. It may run disconnected from Core, but the disconnected state must be explicit.

## Final validation

`npm run verify` plus the Station build command introduced by TASK-588.

## Stop/escalation

Stop for explicit architecture/change control if implementation requires:

- daedalOS filesystem/session/process semantics becoming SB authority;
- canonical business state in browser presentation persistence;
- direct Core/domain implementation imports from visual packages;
- a wholesale daedalOS fork with unbounded app/filesystem scope;
- changing ADR-0016 Station/Core authority;
- introducing File Manager/Workflow/Canvas domain scope into M1 foundation.
