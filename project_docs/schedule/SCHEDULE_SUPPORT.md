# Schedule Support

## Pipeline
Scope Baseline -> WBS -> Work Packages -> dependency/DAG validation -> milestone/readiness analysis -> Planning & Materialization -> committed Sprint -> execution/evidence -> fresh-main revalidation -> successor promotion.

Detailed estimates, critical-path analysis and capacity loading support decisions; they do not override repository authority or create execution permission.

## Milestone rule
A milestone is evidence-based, not date-only. It is reached when the defined integrated capability/evidence exists and repository memory records that truth.

Candidate milestone descriptions are planning aids. Current milestone truth is defined by `docs/current/CURRENT_MILESTONE.md` and related repository-memory documents.

## Critical path method
Duration estimates are attached to activities/tasks when useful; do not invent precision at WBS level. Recalculate critical-path assumptions after material scope, dependency, implementation or estimate changes. Critical-path priority never bypasses predecessor, contract, architecture, security or Sprint gates.

## Sprint loading gate
A TASK may be committed only when:
- its parent Work Package/Sprint transition is authorized by current policy;
- fresh `main` and predecessor evidence have been revalidated;
- mandatory predecessors or accepted contract gates are satisfied;
- acceptance/evidence and context are known;
- `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validations are defined;
- required environment/tooling is available;
- no unresolved escalation condition blocks commitment.

READY/candidate/FORECAST status alone is insufficient.

## Sequential default, parallel optional
Within one committed Sprint, execute TASKs in dependency order. Parallelism is allowed only when the committed manifest and dependency graph make it safe and the executor can still preserve authoritative per-TASK evidence/commits. Parallelism is an optimization, never a reason to violate dependency or review gates.

## Traceability
Every committed implementation TASK should remain traceable through the applicable chain:

`requirement -> WBS -> Work Package -> Sprint -> TASK -> predecessor(s)/contracts -> authoritative commit -> validation/CI evidence -> PR/integration -> repository-memory outcome`.

Forecast artifacts may stop before TASK/commit evidence because they are not execution commitments.
