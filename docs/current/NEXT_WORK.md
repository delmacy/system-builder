# Next Work — Review P3-PACKAGE-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

PR #161 merged the mandatory P2 Integration & Technical Debt Review. The next eligible action is review of the successor rolling-wave package plan, not construction.

`P3-PACKAGE-01` proposes this sequence:

1. `P3-ARTIFACT-01` — verified artifact payload publication/retrieval and pre-activation integrity verification;
2. `P3-RUNTIME-SERVICE-01` — persistent generated Runtime lifecycle and HTTP health surface;
3. `P3-SECRET-STATE-01` — external secret resolution and first bounded stateful Runtime slice;
4. Integration & Technical Debt Review.

## Package rationale

The sequence directly addresses merged P2 review debt TD-P2-01 through TD-P2-04 and maps to WBS 9.3, 10.1 and 13.1/13.3.

Catalog/Assembly dependency solving remains high-priority debt but is deferred until a real non-trivial component graph requires it or a future package promotes it explicitly.

## Package target

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile -> external secret resolution -> local Deploy -> persistent autonomous Runtime -> HTTP health -> bounded stateful action -> DeploymentRecord`

## Review instructions

Review the package for sequencing, L3/L4 scope and the bounded stateful proof. Do not execute construction yet.

After the package plan merges, the next execution should:

1. re-read repository authorities from `AGENTS.md`;
2. revalidate the merged package against current `main`;
3. materialize the `P3-ARTIFACT-01` Sprint manifest and TASK-064..066 contracts with explicit `context_paths`, `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validations;
4. execute TASK-064 -> TASK-065 -> TASK-066 with one commit per TASK;
5. run final repository verification and stop at Sprint Review.
