# OpenCode GitHub Work Package Factory

> **DEPRECATED / HISTORICAL DESIGN — DO NOT EXECUTE.** This document describes a prior GitHub-hosted Work Package/Sprint automation model. It is retained for architecture and operational traceability only. Hosted generation/execution workflows named below are not the current default executor and this document must not be used to authorize or schedule work. Follow `AGENTS.md`, `docs/README.md`, current repository memory, `project_docs/schedule/SPRINT_GENERATION_POLICY.md`, `project_docs/schedule/SPRINT_MODE.md`, and the current local-first Sprint execution procedure.

## Historical purpose

The design proposed a bounded GitHub-hosted execution chain in which GitHub Actions provided deterministic scheduling/isolation, OpenCode handled bounded cognitive units, Git stored durable memory, and GitHub CI supplied objective evidence.

Its conceptual hierarchy separated planning from construction:

`Work Package Planner -> projection PR -> human review/merge -> Work Package Executor`

and execution was modeled as:

`Work Package -> Sprint -> TASK -> fresh OpenCode session`

That separation remains useful historical rationale, but the workflows and dispatch instructions in this document are not current operational authority.

## Historical workflow model

The design referenced hosted workflows including:

- `.github/workflows/opencode-work-package-planner.yml`;
- `.github/workflows/opencode-work-package.yml`;
- `.github/workflows/opencode-sprint-task-loop.yml`;
- `.github/workflows/opencode-next-sprint-materialize.yml`.

It projected Work Packages from WBS/repository evidence, required human review of planning, executed bounded TASK units in fresh sessions, integrated Sprint PRs only after objective gates, reconstructed fresh `main` between Sprints, and stopped at architecture/governance blockers.

These names are historical references, not instructions to dispatch those workflows now.

## Historical safety properties

The design intentionally separated planning and construction authorization, limited forecast promotion, prohibited direct product writes to `main`, bounded recursion, stopped on no progress, preserved TASK path/dependency/validation constraints, and required escalation for ADR/L3/L4/security/governance/destructive-migration boundaries.

Current policy may preserve equivalent principles through different mechanisms. Current documents, not this file, determine the mechanism and authority.

## Historical P10 example

The original document used P10 SecretResolver/TLS sequencing to demonstrate that full-package authorization could not manufacture eligibility across an unresolved ADR gate. This example is historical and must not be interpreted as current package state.

## Relationship to current policy

The durable lesson is repository-first governance: planning eligibility is not execution authority, forecast work is not committed work, and fresh integrated evidence must control successor promotion.

For actual execution, ignore the hosted-dispatch procedure formerly documented here and use the current local-first Sprint model defined by repository authority.