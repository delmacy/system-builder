# Quality and Architecture Gates

Agents are not trusted to remember every architectural rule. Important invariants must be machine-enforced when implementation begins.

## Baseline gate sequence

```text
scope check
 -> formatting/lint
 -> typecheck
 -> unit tests
 -> contract tests
 -> architecture dependency tests
 -> integration tests when applicable
 -> build
 -> evidence
```

## Target structural gates

- Builder packages cannot import client adaptations.
- Runtime cannot import Mirror/Recipe/Analysis/Compiler authoring internals.
- Suite modules consume public contracts, not sibling internals.
- Client-specific code cannot enter universal capability packages.
- Compiler consumes AssemblyPlan, not upstream discovery internals.
- Observability outage cannot be a runtime availability dependency.
- secret values cannot appear in ReleaseArtifact/manifests.
- task executor cannot modify paths outside declared scope without escalation.

## Risk policy

Simple/low-risk tasks may eventually be highly automated after deterministic validation. Contract, database, auth/security and architecture work requires stronger review.

## Evidence

Completion should record commands/results and artifacts necessary to reproduce the claim. A prose statement such as 'tests passed' is insufficient when the command can be run or output captured.
