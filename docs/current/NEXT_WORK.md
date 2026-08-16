# Next Work — P2 package review and first Sprint commitment

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

P1-PACKAGE-01 and its Integration & Technical Debt Review are merged. Successor planning has been explicitly authorized.

`P2-PACKAGE-01 — First Autonomous Local Runtime` is the proposed next Sprint Package.

## Package forecast

1. `P2-BOUNDARY-01` — executable boundary hardening;
2. `P2-RUNTIME-01` — runnable artifact and autonomous Runtime bootstrap;
3. `P2-LOCAL-DEPLOY-01` — local-process deployment and autonomous Runtime E2E;
4. Integration & Technical Debt Review.

## After P2 package merges

Do not execute forecast TASK names directly from this planning document.

For `P2-BOUNDARY-01`:

1. re-read `AGENTS.md`, state/milestone, Sprint Generation Policy, Sprint Mode and `P2-PACKAGE-01.md`;
2. inspect current canonical schemas and executable outputs;
3. materialize/revalidate TASK-055..057 with complete `context_paths`, `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validations;
4. confirm explicit L3 contract authority for the EnvironmentProfile work;
5. freeze the committed `P2-BOUNDARY-01` Sprint manifest;
6. create `sprint/P2-BOUNDARY-01` from synchronized `main`;
7. execute TASKs in dependency order, one distinct commit per TASK;
8. run declared validation and final repository CI;
9. produce Sprint Report and stop for Sprint Review.

## P2 package target

Reach the first bounded autonomous local Runtime proof:

`SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> Release -> Environment -> local Deploy -> autonomous Runtime`

The Runtime proof must not require Builder availability during ordinary startup/health operation, and secret values must remain outside immutable ReleaseArtifact/PublishedRelease content.

## Deferred debt

Catalog/Assembly production-grade dependency solving remains HIGH-priority debt but is not silently included in the first P2 Sprint unless actual runtime work requires it. Persistence and production deployment adapters remain forecast/backlog concerns until evidence promotes them.

## AgentFactory track

AgentFactory Supervisor/runtime remains frozen and non-blocking.
