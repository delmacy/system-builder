# P13-RUNTIME-CORE-EXECUTION-01 — Construction A

Status: COMMITTED / MATERIALIZED
Work Package: P13-PACKAGE-01
Milestone: M13
WBS: 13.1.1, with 13.1.3 boundaries reused
Planning base: `7c85da5c217f645f7968e62328dd7ec1d56dc237`
Execution base: `39e6353d608c75d9a9a961f1a830924acb3dc90a`
Intended execution branch: `sprint/P13-RUNTIME-CORE-EXECUTION-01`

## Sprint goal
Materialize and execute SystemDefinition-derived entities, APIs, actions and workflows in the autonomous generated Runtime, preserving deterministic compilation, PostgreSQL durability, external configuration, no-value-leakage and Builder != Runtime.

## Predecessor gate
SATISFIED for materialization:
- P12-PACKAGE-01 CLOSED;
- TASK-060 autonomous runtime proof integrated;
- TASK-063 full local factory/release/deploy/runtime proof integrated;
- P4 PostgreSQL state/migration/runtime slice integrated;
- P5 Assembly/materializer registry integrated;
- P6-P10 durable release/deploy/runtime/config/secret predecessor evidence integrated;
- Planning found no required L4 change.

## Committed tasks and dependency order
1. TASK-212 — additive executable SystemDefinition action/workflow semantics (L3, backward-compatible)
2. TASK-213 — Compiler runtime projection intake and reference validation
3. TASK-214 — deterministic runtime model and entity migration materialization
4. TASK-215 — generated PostgreSQL entity persistence and validation
5. TASK-216 — generated entity API execution
6. TASK-217 — generated declared action execution
7. TASK-218 — generated workflow transition execution
8. TASK-219 — no-value-leak/external-binding regression for new generated surfaces
9. TASK-220 — full predecessor-integrated autonomous Runtime growing proof

Execute in numeric order. TASK-215 depends on 212-214; TASK-216 depends on 215; TASK-217 depends on 212-216; TASK-218 depends on 212-217; TASK-219 depends on 214-218; TASK-220 depends on all predecessors.

## Explicit L3 authority
TASK-212 may make the minimum additive shared `SystemDefinition` contract change necessary to represent executable action effects and workflow transitions. It must remain backward-compatible, deterministic, reference-oriented and free of environment/secret values.

Construction evidence at TASK-218 exposed one missing datum inside that already-authorized SystemDefinition workflow semantics: an executable transition graph cannot initialize durable process state without an explicit initial state. Inferring the first state, sorted state or first transition source is forbidden. The Sprint therefore records one bounded materialization correction: TASK-218 may add only optional `process.initialState` to the same SystemDefinition process shape and require it whenever executable `transitions` are present. Historical processes without executable transitions remain valid. This is an additive L3 correction in the same shared-contract family, not a new contract family or L4 boundary.

No other shared-contract change is authorized. If implementation requires changing Builder/Runtime ownership, Release/Environment boundaries, suite topology, authoring/execution ownership, or any other L4 decision, STOP and require an ADR.

## Growing integration proof
`SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy + external EnvironmentProfile/SecretResolver -> autonomous Runtime -> entity API -> action -> workflow transition`

Proof requirements:
- actual predecessor APIs/modules are invoked;
- no hand-authored ReleaseArtifact/runtime stand-in when executable predecessor exists;
- PostgreSQL persistence is used for the entity/workflow slice;
- Builder and Observe are unavailable during ordinary Runtime behavior;
- missing entity/action/transition/binding fails closed;
- resolved secret/config values do not enter immutable/durable evidence.

## Final validation
`npm run verify`

## Stop / escalation conditions
- any required L4 architecture change;
- any public shared-contract change beyond TASK-212 plus the bounded TASK-218 `process.initialState` correction above;
- inability to derive executable behavior without inventing semantics outside the declared contract;
- required modification under `.github/**` or repository settings;
- production topology/fleet/network-control expansion;
- need to enter P13-PACKAGE-02 or P13-PACKAGE-03 scope;
- validation cannot be made green inside committed scope.

## Successor state
Construction B, optional C, Package Integration & Review and Documentation & Closure remain FORECAST. Completing this Sprint does not authorize them automatically.
