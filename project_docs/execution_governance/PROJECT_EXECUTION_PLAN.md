# Project Execution Plan

## Objective
Convert approved System Builder scope into controlled, mostly autonomous delivery through AgentFactory, GitHub Actions and OpenCode while preserving traceability, deterministic gates and human authority over material decisions.

## Operating chain

```text
Approved Scope/WBS
  -> Work Packages
  -> Capability/WP DAG
  -> near-horizon decomposition
  -> DoR + risk/model routing
  -> READY queue
  -> sprint candidate/commitment
  -> Task Pack
  -> OpenCode executor
  -> deterministic CI + independent review
  -> PR/integration
  -> structured evidence
  -> RTM/gate/DAG update
  -> next READY work
  -> periodic system integration/debt review
```

## Planning model
- Whole-project scope and coarse dependencies are maintained broadly.
- Task-level decomposition and estimates use rolling-wave planning.
- Sprint numbering is not dependency semantics.
- A small forecast package may exist, but only active work is committed.
- Sprints close on Goal/DoD; later discoveries create traceable successor/corrective work.

## Execution authority
AgentFactory decides readiness/selection from approved machine data. GitHub Actions supplies execution compute/orchestration. OpenCode is the principal coding-agent adapter. Models are routed by risk/complexity. CI/reviewer validates output. Human authority is reserved for policy-defined material decisions.

## Required task inputs
Requirement/WP references, objective, dependencies/gates, pinned authoritative context, allowed paths, acceptance/evidence, commands/tests, risk/model tier and stop/escalation conditions.

## Required outputs
Structured evidence protocol, changed artifacts, validation results, discovered risks/issues/changes, satisfied gates and measurable execution actuals.

## Governance
No autonomous component may create unapproved business scope, bypass mandatory gates, weaken acceptance controls, expose secrets, approve its own material architecture change or perform destructive/high-risk actions outside explicit authority.

## Review cadence
Every task receives ordinary CI/review. Periodically (initial policy: after roughly three construction sprints, or earlier by trigger), run cross-system integration/technical-debt review and refresh forecast/DAG confidence.

## Success criteria for AgentFactory v1
A human can approve a READY task/sprint candidate and the pipeline can execute through OpenCode, validate, create/integrate evidence, update task state/gates and identify the next READY work without manually reconstructing project context.
