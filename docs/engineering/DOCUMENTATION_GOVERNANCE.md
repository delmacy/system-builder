# Documentation Governance

Status: `CURRENT_AUTHORITY`
Authority level: `documentation-governance`
Applies to: development, engineering and operations documentation lifecycle
Last reconciled: 2026-09-13

## Purpose

Keep repository documentation aligned with integrated truth without erasing historical evidence. The goal is to prevent stale instructions from masquerading as current authority while preserving useful rationale and audit history.

Documentation quality is judged independently from code quality. A green CI run does not make stale prose safe, and a historically accurate document does not become current authority merely because it remains in the repository.

## Status taxonomy

Use one of these statuses when a document can influence development or operations:

- `CURRENT_AUTHORITY` — defines policy/authority within its declared scope.
- `CURRENT_REFERENCE` — maintained implementation/engineering guidance subordinate to higher authority.
- `CONDITIONAL_REFERENCE` — valid only when an explicitly named mode, tool or automation is active.
- `EVIDENCE` — records observed/tested/integrated facts; cannot create scope or execution authority.
- `HISTORICAL` — preserved for traceability; not valid for current work selection/execution.
- `DEPRECATED` — intentionally retained but not recommended for new work.
- `SUPERSEDED` — replaced by a named current policy/process/document.

## Required metadata

New or materially reconciled development/operations documents should state, near the top:

```text
Status: <classification>
Authority level: <scope>
Applies to: <bounded applicability>
Superseded by: <path, when applicable>
Last reconciled: YYYY-MM-DD
```

`Superseded by` is required for `SUPERSEDED` and strongly recommended for `DEPRECATED` documents.

## Authority principles

1. `AGENTS.md` and accepted architecture/contract authority are never silently overridden by lower documentation.
2. Current-state files under `docs/current/` describe integrated truth and near-horizon gates; they are not historical logs.
3. Planning/schedule documents may order approved work but may not manufacture architecture, scope or execution authority.
4. Evidence records facts; it does not authorize new work.
5. Historical documents remain useful only when clearly prevented from acting as current instructions.
6. A tool's continued existence does not make its old workflow the current workflow.
7. Stable documents should avoid hard-coding fast-changing milestone/task state; link to `docs/current/*` instead.

## Conflict handling

When two documents disagree:

1. determine each document's status and authority scope;
2. follow the higher current authority;
3. do not choose the instruction that merely permits more work;
4. reconcile or reclassify the lower/stale document before relying on it again;
5. if the conflict reaches architecture/L4 or changes a public/shared contract, use the required ADR/change authority.

## Staleness indicators

Treat a development document as a reconciliation candidate when it contains any of the following and the referenced mechanism/state has changed:

- old milestone/package/task IDs presented as current;
- obsolete executor/model/provider assumptions;
- task-per-PR instructions when Sprint Mode is authoritative;
- hosted workflow names that are disabled;
- stale branch naming or merge policy;
- old authorization/review boundaries;
- old model-tier requirements;
- references to removed/renamed scripts or workflows;
- claims that contradict `docs/current/*`;
- operational schedules presented without a conditional-status boundary.

## Reconciliation outcomes

A stale document should receive one explicit disposition:

- `REFRESH_CURRENT` — rewrite to current behavior.
- `BOUND_CONDITIONALLY` — retain as `CONDITIONAL_REFERENCE` with named activation condition.
- `SUPERSEDE` — keep only the durable/historical lessons and point to the replacement.
- `HISTORICIZE` — preserve full historical context but remove current operational authority.
- `RETIRE_REFERENCE` — remove from normal navigation when it no longer has useful evidence/reference value.

Do not rewrite historical records merely to make old execution look like current policy.

## Review triggers

Documentation reconciliation is required or strongly expected at these boundaries:

- Package Integration & Review: inspect architecture/reference drift, duplicate instructions and obsolete process assumptions.
- Documentation & Closure: reconcile affected current-state, module, public and operations documentation before package closure.
- executor/CI/workflow changes: review every document that describes the replaced mechanism.
- architecture/contract changes: update references and explicitly supersede old guidance where necessary.
- recurring confusion or conflicting agent behavior: treat as a documentation defect, not only an agent defect.

## Quality baseline dimensions

A documentation review should evaluate at least:

1. **Authority clarity** — can a reader tell whether the document is policy, reference, evidence or history?
2. **Currentness** — does it match integrated repository truth within its declared scope?
3. **Conflict containment** — are obsolete/conditional instructions prevented from overriding current policy?
4. **Discoverability** — can a new maintainer/agent find the correct starting documents quickly?
5. **Operational correctness** — do commands, branches, gates and workflows match current executable reality?
6. **Historical traceability** — are prior decisions preserved without being misread as current instructions?
7. **Low volatility** — do stable documents link to current-state authorities instead of duplicating fast-changing state?

## Severity

Documentation findings should be classified as:

- `CRITICAL` — stale instruction can authorize unsafe/destructive/wrong-scope behavior.
- `HIGH` — stale instruction can materially change branch/PR/execution/review topology.
- `MEDIUM` — misleading currentness, naming or sequencing with bounded operational impact.
- `LOW` — clarity, navigation or editorial drift without meaningful execution risk.

`CRITICAL`/`HIGH` findings in current development instructions should be reconciled before treating the affected document as operational guidance.

## Minimum closure check

Before closing a Work Package, ask:

> Can a fresh maintainer or agent start from repository documentation and reach the correct current authority chain without being diverted by an older workflow?

If not, documentation closure is incomplete even when product code is correct.
