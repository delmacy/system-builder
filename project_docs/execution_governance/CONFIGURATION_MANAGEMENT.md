# Configuration Management

## Controlled configuration items
- ADRs and architecture contracts;
- Scope Baseline/WBS/WBS Dictionary;
- requirements/RTM;
- capability/WP/task DAG data;
- public schemas/interfaces/artifact formats;
- task packs and executor instructions;
- CI/validators/evaluators;
- migrations;
- release/deployment manifests;
- evidence records and baselines.

## Rules
- Authoritative configuration items are version controlled.
- Task packs pin the applicable contract/spec revisions where practical.
- Public contract/schema changes require compatibility/version evidence.
- Destructive migrations require explicit data gate and rollback/backup strategy.
- Executors may not modify governance/evaluator files unless their task explicitly authorizes those paths and acceptance criteria.
- Generated evidence identifies the source commit/task and relevant configuration versions.
- A baseline is never silently overwritten; revisions remain attributable.

## Drift
CI/planning validation should detect stale task packs, missing contract references, DAG references to nonexistent nodes and evidence invalidated by later authoritative contract changes.
