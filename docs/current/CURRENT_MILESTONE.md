# Current Execution Milestone — M10 P9 Sprint 1

## Goal

Execute `P9-MANAGED-RUNTIME-PROCESS-01` from the merged P9 package plan, proving a bounded Deploy-owned managed Runtime process lifecycle without introducing external orchestration topology.

## Integrated predecessor

- P8 review merged through PR #192.
- P9 planning merged through PR #193 at `14cdccbd391d3c337f749bc14e470e5a8bb1742f`, planning CI #349 PASS.
- Existing Deploy local-process path verifies artifact/environment, applies migrations, resolves runtime-only secrets, starts Runtime, checks health and then terminates/cleans the process.

## Active Sprint

`P9-MANAGED-RUNTIME-PROCESS-01`

Branch: `sprint/P9-MANAGED-RUNTIME-PROCESS-01`
Status: `MATERIALIZED / PRE_CODE_CI_PENDING`.

TASK order: TASK-119 -> TASK-120 -> TASK-121.

## Exit proof

`verified ReleaseArtifact + Environment -> managed Runtime start -> health PASS -> process remains managed/queryable -> explicit stop -> deterministic cleanup` plus predecessor one-shot compatibility.

## Boundary

Single-host Deploy-owned reference lifecycle only. External traffic switching, fleet/scheduler/cloud topology, canonical contract expansion and L4 Builder/Runtime changes are forbidden without escalation/ADR.

## Current gate

Run materialization Deterministic CI. If PASS, begin TASK-119 only.
