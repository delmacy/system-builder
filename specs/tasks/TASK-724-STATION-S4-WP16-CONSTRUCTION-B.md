---
{
  "id": "TASK-724",
  "title": "Station WP16 actual owner-connected Workflow Studio browser journey",
  "status": "completed",
  "priority": 724,
  "milestone": "STATION-S4-WP16-OWNER-SERVICE-JOURNEY",
  "model_tier": "architecture",
  "risk": "high",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-718"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/016-station-owner-service-journey/ADDENDUM.md",
    "project_docs/execution_planning/STATION-S4-WP16-PLAN-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-OWNER-READINESS-01.md",
    "docs/adr/ADR-0016-station-core-gateway-boundary.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "docs/adr/ADR-0018-design-candidate-owner-service.md",
    "docs/operations/DESIGN_CANDIDATE_SERVICE.md",
    "packages/station-workflow-connection/index.ts",
    "packages/station-sdk/http-transport.ts",
    "apps/station/web/app/station-workflow-workbench.tsx",
    "apps/station/web/app/station-workflow-store.ts",
    "tests/browser/station-editor-workbench.spec.ts",
    "tests/browser/station-editor.playwright.config.ts",
    "tests/product/fixtures/design-owner-server.ts",
    "packages/postgres/index.ts",
    ".github/workflows/station-editor-browser.yml",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md"
  ],
  "allowed_paths": [
    "apps/station/web/app/station-workflow-connection-panel.tsx",
    "apps/station/web/app/station-workflow-workbench.tsx",
    "tests/browser/station-editor-workbench.spec.ts",
    "tests/browser/design-owner-harness.ts",
    "docs/operations/STATION_WORKFLOW_STUDIO.md",
    "project_docs/execution_planning/STATION-S4-WP16-PLAN-01.md",
    "docs/current/NEXT_WORK.md",
    "docs/current/RISKS.md",
    "project_docs/execution_planning/STATION-S4-WP16-CONSTRUCTION-B-01.md",
    "project_docs/execution_planning/STATION-S4-WP16-CONSTRUCTION-B-01.report.md",
    "specs/tasks/TASK-724-STATION-S4-WP16-CONSTRUCTION-B.md"
  ],
  "forbidden_paths": [
    "packages/**",
    "apps/station-gateway/**",
    ".github/**",
    "docs/adr/**",
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
Actual connected Studio send/exact readback/reopen/recovery UI and browser→SDK→Gateway→Design→PostgreSQL proof.

## Context
A#1117 independently integratedfa096d618172a6a828a81403dfb24d559f13ad40 after all seven checksPASS;109 heavy tests0skip,95 Chromium predecessors. Design owner independently CLOSED/READY_LOCAL.11 exact paths/max_files11 confirmed before edits; unchanged forbidden packages/backend/ADR/CI/runtime paths. Full userWP16 execution authorized.

## Current behavior
Actual SDK connection exists; Workflow Studio remains local before B.

## Required change
Accessible explicit local owner connection with ephemeral credential/context settings, deliberate clean candidate submit, exact read/reopen through existing dirty Cancel/Discard, stable pending result recovery/retry and stale/disconnect/generation protection.
Add isolated browser harness: use explicitly supplied testPostgres or create only uniquely named synthetic loopback DockerPostgres fixture, start actual existing owner server process, restart, stop only owned process/container. No production DB provision/reset or workflow edits.

## Inputs / contracts
AcceptedAdd016/ADR0016/Design contracts, actual closed owner/SDK APIs and actual WP15 authoring/store/session lifecycle.

## Outputs / contracts
Connected presentation-only Studio; actual browser/data/restart proof, no semantic/server authority or schema change.

## Acceptance criteria
Actual authored candidate arrives at owner, exact bytes/hash/full metadata, fresh browser reopens after local store cleared and owner restart. Lost-response durable recovery, stale/denied/unavailable preserve draft; late/context/dirty Cancel/Discard guarded. All95 inherited journeys plus new connected cases and full verify/build/CI PASS.

## Non-goals
Backend/schema changes, production IAM/remoteTLS/hosting/multitenancy, business approval/publication/runtime/deploy, blanket browser/accessibility/performance certification.

## Evidence expected
Actual production-built browser/API/PostgreSQL/service process chain, inherited regression, React hooks/accessibility/cleanup review, report/one commit/all triggered independent gates.

## Escalation
Missing actual provider/browser proof, undeclared owner/L3/L4/forbidden paths or unresolved failures. No mocks substitute operational exit.
