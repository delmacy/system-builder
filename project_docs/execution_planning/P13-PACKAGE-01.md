# P13-PACKAGE-01 — Autonomous Runtime Functional Execution

Status: ACTIVE / CONSTRUCTION A INTEGRATED / CONSTRUCTION B BLOCKED
Milestone: M13
Primary WBS: 13.1.1-13.1.3
Predecessor: P12-PACKAGE-01 CLOSED — SATISFIED at fresh main `7c85da5c217f645f7968e62328dd7ec1d56dc237`
Planning Sprint: `P13-AUTONOMOUS-RUNTIME-FUNCTIONAL-PLANNING-01`

## Package goal
Close the remaining functional Runtime Core gap so a compiled/deployed client runtime executes materialized entities/APIs/actions/workflows plus jobs/events/files/integrations from external configuration without requiring the Builder during normal operation.

## Integrated predecessor evidence
Existing evidence remains reused, not rebuilt:
- TASK-060: Compiler-generated runtime starts and exposes health with Builder/Observe unavailable;
- TASK-063: actual local factory -> release -> deploy -> autonomous Runtime vertical;
- P4: capability-driven PostgreSQL state/migration/runtime execution with durable state across redeploy;
- P5: deterministic transitive Assembly and exact capability/provider/version Compiler materializer registry;
- P6-P9: durable factory/release/deploy authority and managed Runtime lifecycle evidence;
- P10: production SecretResolver bindings plus fail-closed/no-value-leak and PostgreSQL TLS identity verification.

## Construction A — Materialized entity/API/action/workflow execution
Status: INTEGRATED
Sprint: `P13-RUNTIME-CORE-EXECUTION-01`
Tasks: TASK-212..220
Reviewed head: `4c0e965c4e351ea29f240c370205303d3ef87c43`
Deterministic CI: #561 PASS on exact reviewed head
Merge-main: `554bff25683d0b523e38279b151f1d6b87578d72`
Reviewed/merge tree: `fbc18c18511a4fa9aa140f124eacb995e82b189f` — zero tree drift

Construction A closed WBS 13.1.1 through the real SystemDefinition/Assembly/Compiler/Release/Deploy/autonomous-Runtime chain. It delivered deterministic entity persistence/APIs, explicit action effects, explicit durable workflow transitions and `process.initialState`, with restart persistence, fail-closed negative paths and no durable resolved-value leakage.

The shared-contract work was the explicitly authorized minimum additive backward-compatible L3 SystemDefinition semantics required by WBS 13.1.1. No L4 boundary changed.

## Fresh-main coverage after Construction A

| Runtime class | Status | Concrete integrated truth |
| --- | --- | --- |
| entities | DELIVERED for Package 01 growing proof | SystemDefinition-derived deterministic persistence/runtime model and generated API execute against PostgreSQL. |
| APIs | DELIVERED for current 13.1.1 scope | generated entity/action/workflow routes execute and fail closed on invalid/unknown paths. |
| actions | DELIVERED for explicit bounded semantics | explicit `entity.create|entity.update|entity.delete` effects execute; unsupported/unknown actions fail closed. |
| workflows | DELIVERED for explicit bounded semantics | explicit transition graph plus `initialState` executes with durable workflow state. |
| jobs | MISSING | no public SystemDefinition job execution structure and no Compiler runtime projection/executor exists. |
| events | MISSING | no public SystemDefinition event execution/routing structure and no generated Runtime event surface exists. |
| files | MISSING | no public SystemDefinition file/storage operation structure and no generated client storage execution surface exists. |
| integrations | MISSING executable semantics | SystemDefinition exposes only integration id/contract/direction/requirementRefs; Runtime has no executable connector invocation semantics. |
| external configuration | DELIVERED foundation / PARTIAL breadth | reference-only activation-time configuration and SecretResolver/no-value-leak are proven; EnvironmentProfile binding kinds remain `config|secret-reference`. |

## Construction B — Runtime services and external bindings
Status: FORECAST / BLOCKED — BOUNDED L3 CHANGE CONTROL REQUIRED

Forecast goal remains: close WBS 13.1.2 and remaining 13.1.3 breadth for jobs/events/files/integrations using the same generated-runtime model and existing external configuration/no-value-leak boundary.

Fresh-main revalidation after Construction A found that the integrated public contracts do not provide enough declarative/executable semantics to materialize this Sprint faithfully:
- `CompilerSystemDefinitionRuntimeProjection` carries only `entities`, `actions` and `processes`;
- public `SystemDefinition` contains no job, event or file/storage execution definitions;
- `SystemDefinition.integrations` contains identity/contract/direction metadata but no executable operation/connector/binding semantics;
- `EnvironmentProfile.bindings` remains reference-only and supports only `config|secret-reference` kinds.

The existing additive L3 authority in this package is explicitly bounded to WBS 13.1.1. Materializing Construction B now would require inventing undeclared public semantics for scheduler/job execution, event routing, file/storage operations, integration invocation and/or external-binding breadth.

Disposition: do not promote Construction B to COMMITTED until explicit bounded change control authorizes the minimum additive backward-compatible L3 public contract semantics required by WBS 13.1.2/13.1.3. Runtime behavior must not be inferred from names, array order, integration direction or environment-requirement kinds.

If the required design creates a new Builder/Runtime boundary, release model, suite topology or production topology, stop and require an accepted ADR before implementation.

After accepted change control is integrated, reconstruct fresh `main` and revalidate Construction B again before materialization.

Forecast exit proof, once eligible: actual compiled runtime executes one representative materialized job, event path, file/storage path and integration path; required external bindings are reference-only in durable artifacts and missing/incompatible bindings fail explicitly; Builder/Observe remain unavailable.

## Optional Construction C — completeness gap only
Status: FORECAST / CONDITIONAL

Not eligible. Promote only after Construction B is integrated and fresh-main evidence proves one bounded remaining WBS 13.1 acceptance gap is necessary for the Package Goal. Do not use for generic hardening, auth/UI (`P13-PACKAGE-02`), production topology (`P13-PACKAGE-03`) or debt cleanup.

## Package Integration & Review
Status: FORECAST

Not started. Missing functional capability required by the Package Goal must remain under explicit construction/change control rather than being hidden in package review.

## Documentation & Closure
Status: FORECAST

Not started. Final reconciliation occurs only after the Package Goal and package review gates are satisfied.

## Boundaries
- Builder != Runtime and Runtime autonomy remain constitutional.
- No Mirror/Recipe authoring, Analysis, Canvas or Release-management authoring behavior enters Runtime.
- No production deployment topology expansion unless separately authorized.
- Existing Construction A additive L3 authority is historical and bounded to WBS 13.1.1; it does not authorize WBS 13.1.2/13.1.3 public contract expansion.
- No new L4 boundary without an accepted ADR.
- Construction B remains FORECAST / BLOCKED pending bounded L3 change control.
- Construction C, Package Integration & Review and Documentation & Closure remain FORECAST.
- P13-PACKAGE-02 and P13-PACKAGE-03 are not started by this package.
