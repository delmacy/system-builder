# P13-RUNTIME-CORE-EXECUTION-01 — Construction A Sprint Report

Date: 2026-08-22
Status: READY_FOR_SPRINT_REVIEW / EXACT-HEAD CI REQUIRED
Work Package: `P13-PACKAGE-01 — Autonomous Runtime Functional Execution`
WBS: 13.1.1 with 13.1.3 trust boundaries reused
Execution base: `39e6353d608c75d9a9a961f1a830924acb3dc90a`
Branch: `sprint/P13-RUNTIME-CORE-EXECUTION-01`

## Goal result
Construction A materializes actual SystemDefinition-derived entities, entity APIs, explicit action effects and explicit durable workflow transitions into the autonomous generated Runtime. PostgreSQL persistence, ReleaseArtifact integrity, external EnvironmentProfile/SecretResolver delivery, Builder != Runtime and no-value-leak boundaries are preserved.

## TASK results
- TASK-212 — `4676bc353f61495fda99183eaba00cc3e5c9e5c6` — additive L3 action effect / workflow transition semantics.
- TASK-213 — `3051fe1eaa87d03ac1d89920f2f9d9853592a170` — bounded deterministic Compiler runtime projection.
- TASK-214 — `dd8b70e08e68dec9060dffa4976c249e63dfb117` — deterministic runtime model and entity migrations.
- TASK-215 — `d346b85c1d46365cba761d34707c64732cd6ca39` — generated PostgreSQL entity persistence.
- TASK-216 — `8d3d07b6a497128552464111cdc872aa88c85415` — generated entity HTTP API.
- TASK-217 — `bf99732181d10b951a2c0c8b671266437b5e9eff` — explicitly declared generated actions.
- Materialization correction — `5b679562715db27c529aa8a68b7c056999053acf` — bounded L3 authority for explicit `process.initialState`; not a TASK implementation commit.
- TASK-218 — `fecaa0f62dd7707bac250d7f60cb8741789aaeaf` — explicit initial state plus durable PostgreSQL workflow transition execution.
- TASK-219 — `21aafcc5ff1f41b45ea4c902d984a024662f1afa` — Construction A no-value-leak/external-binding regression.
- TASK-220 — this closure commit — integrated growing proof and Sprint Report.

Each TASK has exactly one authoritative implementation commit. The materialization correction is repository governance/evidence required by TASK-218's escalation gate and does not implement Runtime behavior.

## Escalation discovery and disposition
TASK-218 correctly stopped because `states + transitions` did not identify a durable initial state. Inferring list order, sorted order or first transition source would invent semantics. No L4 boundary was required. The Sprint manifest and TASK-218 authority were narrowly corrected to allow only optional `process.initialState` in the existing SystemDefinition family, required for executable transition graphs. Historical non-executable processes remain valid. No second shared-contract family changed.

No process `entityRef` was added. Workflow state is stored independently by `(processId, instanceId)`. When an explicit transition links an action, `action.effect.entityRef` is already the declared entity target and the workflow instance identifier is the record identifier supplied to that execution call.

## Growing proof
The closure test exercises:

`SystemDefinition -> SoftwareCatalogRegistry/AssemblyPlan -> ValidationEvidence -> Compiler runtime model/migrations -> ReleaseArtifact -> InMemoryArtifactPayloadRepository verified payload -> PublishedRelease -> Local Deploy migration/health -> exact verified generated Runtime -> entity API -> declared action -> declared workflow transition -> Runtime restart -> persisted workflow state`

Proof includes positive and negative paths:
- generated entity create/read and unknown entity failure;
- declared action execution, unknown action failure and unsupported action failure;
- valid explicit workflow transition from declared `initialState`;
- repeated invalid transition fails without applying its action payload;
- restart preserves workflow state;
- Builder and Observe URLs are deliberately unavailable;
- resolved PostgreSQL value is absent from immutable/durable evidence and asserted Runtime diagnostics.

## Architecture / trust result
- Builder != Runtime: preserved.
- BusinessRecipe != SystemDefinition: preserved.
- autonomous ordinary Runtime: preserved.
- external configuration/reference-only durable evidence: preserved.
- resolved secret/config values in immutable artifacts: none authorized or introduced.
- shared contracts changed: only SystemDefinition additive L3 semantics authorized by TASK-212 plus the bounded TASK-218 `initialState` correction.
- L4 change: none.
- `.github/**` / repository settings: unchanged.
- P13-PACKAGE-02/03: untouched.

## Validation
TASK-scoped tests are committed with their respective changes. Repository-wide required validation is `npm run verify` through exact-head Deterministic CI on the single Sprint Review PR. The Sprint is not merge-authorized unless that exact head passes. Any failure must be corrected inside Construction A scope and revalidated before Sprint Review approval.

## Successor state
STOP at Sprint Review. Construction B, optional Construction C, Package Integration & Review, Documentation & Closure, P13-PACKAGE-02 and P13-PACKAGE-03 remain FORECAST / not started.
