# Parallelism Policy

Default execution may be sequential to simplify supervision, but the plan must preserve safe parallelism.

## Parallel-safe
Two items can run concurrently when neither has a blocking path to the other, their public contracts are stable where shared, they do not contend for an exclusive migration/resource, and integration capacity exists.

## Examples
- Capability Registry work can progress while an Identity/Auth lane is being implemented when neither consumes the unfinished implementation.
- Authentication cannot precede the minimum Subject/User identity contract it authenticates.
- A Workflow slice using authorization cannot close before its authorization/runtime gate is satisfied.

## Merge/integration discipline
Parallel branches integrate through contracts and small PRs. A long-lived branch per module is discouraged. Integration conflicts discovered repeatedly become DAG/resource constraints for future planning.

## Capacity
Parallelism is bounded by reviewer/test/CI/integration capacity, not only coding-agent count. Adding agents without integration capacity increases WIP and risk.
