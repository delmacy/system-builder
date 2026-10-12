---
{
  "id": "TASK-725",
  "title": "WP16 bounded escaped-response and native fetch qualification",
  "status": "completed",
  "priority": 725,
  "milestone": "STATION-S4-WP16-OWNER-SERVICE-JOURNEY",
  "model_tier": "architecture",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-724"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/016-station-owner-service-journey/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP16-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-CONSTRUCTION-B-01.report.md",
    "packages/station-sdk/http-transport.ts",
    "packages/contracts/design-candidate/index.ts",
    "packages/station-workflow-connection/index.ts",
    "apps/station/web/app/station-workflow-connection-panel.tsx",
    "tests/product/station-workflow-connection.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "docs/operations/STATION_WORKFLOW_STUDIO.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md"
  ],
  "allowed_paths": [
    "packages/station-sdk/http-transport.ts",
    "apps/station/web/app/station-workflow-connection-panel.tsx",
    "tests/product/station-workflow-connection.test.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "docs/operations/STATION_WORKFLOW_STUDIO.md",
    "project_docs/execution_planning/STATION-S4-WP16-PLAN-01.md",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/STATION-S4-WP16-CONSTRUCTION-C-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-CONSTRUCTION-C-01.report.md",
    "specs/tasks/TASK-725-STATION-S4-WP16-CONSTRUCTION-C.md"
  ],
  "forbidden_paths": [
    "packages/design/**",
    "packages/contracts/**",
    "packages/postgres/**",
    "apps/station-gateway/**",
    ".github/**",
    "docs/adr/**",
    "packages/compiler/**",
    "packages/runtime-core/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 11,
  "validation": [
    "npm run verify",
    "npm run station:build"
  ]
}
---

## Objective
Qualify admitted candidate escaping and browser-native fetch in SDK default, not caller workaround.

## Context
Fresh B#1118 integratedcac8866bb983fdfac1b2e55c0e1041fe557d548b, all seven checksPASS,102 actual Chromium/109 heavy0skip. Read-only actual WP15 create/open/edit/materialize probe shows valid raw candidate~801KB expands past existing1MiB+64KiB response cap. First B browser trace also proved native fetch receiver needs Window; B public injection workaround passed102. These are indispensable bounded integration gaps before Review, not missing owner implementation.11 exact paths/max_files11 and forbidden backend/contracts/ADR/CI/runtime confirmed before edits.

## Current behavior
Valid escaped candidate can retain but readback becomes unknown due response cap; generic native SDK default requires caller binding workaround.

## Required change
Bound response cap for2x admitted raw1MiB JSON escaping plus64KiB envelope, preserve fail-closed overflow. Bind standard fetch to actual global realm; remove UI workaround. Add actual large escaped candidate provider/browser and receiver regression proof.

## Inputs / contracts
Unchanged acceptedAdd016/Station protocol/Design candidate raw1MiB contract, actual ready owner and integrated A/B.

## Outputs / contracts
Bounded correct SDK transport/native default and exact large candidate readback; no API/schema/backend change.

## Acceptance criteria
Actual WP15 escaped candidate->SDK->real owner/PG full readback, actual browser metadata encoding/reopen, all102 predecessors plusnewcase, native fetch provider correct realm and overflow still rejected. Full own gatesPASS.

## Non-goals
New owner/service/contract, unbounded response, runtime/deploy, production IAM/remoteTLS/scale certification.

## Evidence expected
Freshmain necessity probe, actual provider and production browser/default-native proof, full verify/build/all triggered independent CI; no mocks substitute positive exit.

## Escalation
Undeclared paths/new L3/L4/owner scope or unresolved failure; no Review/Closure implementation overflow.
