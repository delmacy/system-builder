# Dependency-driven Schedule Planning

This folder is the scheduling and execution-governance bridge between controlled project scope and Sprint Mode delivery.

## Current authority

For newly planned Work Packages, read and apply these documents together with `AGENTS.md` and current repository memory:

1. `SPRINT_GENERATION_POLICY.md` — authoritative rolling-wave Work Package cadence and commitment horizons;
2. `SPRINT_MODE.md` — authoritative Sprint execution, review, integration and closure model;
3. `AUTHORITY_ORDER.md` — precedence between architecture/contracts/scope/repository memory and schedule artifacts;
4. `DAG.md` and related dependency artifacts — readiness and ordering constraints;
5. `SCHEDULE_SUPPORT.md` — milestone, critical-path, loading and traceability support.

`docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md` and `docs/current/NEXT_WORK.md` define current repository truth and active gates. Historical planning artifacts do not override them.

## Operating model

The project now operates in rolling-wave Work Packages:

`Planning & Materialization -> Construction A -> Construction B -> [Construction C only if justified] -> Package Integration & Review -> Documentation & Closure`

Only the active Sprint and its committed TASKs carry execution authority. Forecast Sprints, READY candidates, DAG nodes and backlog items are planning inputs, not permission to execute.

Planning and routine Sprint execution are local-first. The normal executor is the repository-defined local Sprint workflow; GitHub is source/history and objective CI. AgentFactory/scheduler material in this folder is preserved as automation design guidance unless explicitly reactivated, not as a prerequisite or active execution authority.

## Dependency principle

The DAG constrains what can become eligible; repository authority and fresh-main revalidation determine what may be committed; the active Sprint determines what is executed.

Do not infer missing architecture, silently promote forecast work, bypass predecessor gates, or use planning/review/closure artifacts to hide product construction.
