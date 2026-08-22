# P13-PACKAGE-01 — Autonomous Runtime Functional Execution

Status: PLANNED / CONSTRUCTION A MATERIALIZED
Milestone: M13
Primary WBS: 13.1.1-13.1.3
Predecessor: P12-PACKAGE-01 CLOSED — SATISFIED at fresh main `7c85da5c217f645f7968e62328dd7ec1d56dc237`
Planning Sprint: `P13-AUTONOMOUS-RUNTIME-FUNCTIONAL-PLANNING-01`

## Package goal
Close the remaining functional Runtime Core gap so a compiled/deployed client runtime executes materialized entities/APIs/actions/workflows plus jobs/events/files/integrations from external configuration without requiring the Builder during normal operation.

## Planning result
Planning reconstructed the exact post-P12 closure main and inventoried runtime-core/compiler/deploy/state/configuration rather than treating the forecast as implementation truth.

Existing predecessor evidence is reused, not rebuilt:
- TASK-060: Compiler-generated runtime starts and exposes health with Builder/Observe unavailable;
- TASK-063: actual local factory -> release -> deploy -> autonomous Runtime vertical;
- P4: capability-driven PostgreSQL state/migration/runtime execution with durable state across redeploy;
- P5: deterministic transitive Assembly and exact capability/provider/version Compiler materializer registry;
- P6-P9: durable factory/release/deploy authority and managed Runtime lifecycle evidence already integrated;
- P10: production SecretResolver bindings plus fail-closed/no-value-leak and PostgreSQL TLS identity verification.

## Coverage matrix — fresh main

| Runtime class | Status | Concrete evidence / gap |
| --- | --- | --- |
| entities | MISSING | `SystemDefinition.entities` exists, but Compiler/runtime-core do not materialize or execute those entity definitions. Current generated behavior is the narrow `state.counter` capability. |
| APIs | PARTIAL | generated Runtime exposes `/health` and the capability-specific counter route, proving HTTP execution machinery, but no API surface is materialized from SystemDefinition entities/actions/processes. |
| actions | PARTIAL | `state.counter` is an actual capability-driven generated action; broad `SystemDefinition.actions` are not executable. The current action shape has identity/name/requirements but no executable effect descriptor. |
| workflows | MISSING | `SystemDefinition.processes` carries process identity/states only; no transition semantics are materialized or executed by Runtime. |
| jobs | MISSING | no generated Runtime scheduler/job execution surface found. |
| events | MISSING | no generated Runtime event dispatch/consumption surface found. |
| files | MISSING | no generated client file/storage execution surface found. |
| integrations | MISSING | `SystemDefinition.integrations` carries contract/direction identity but there is no generated Runtime connector execution. |
| external configuration | DELIVERED foundation / PARTIAL breadth | Runtime consumes external `EnvironmentProfile`, rejects inline values, validates required references, and Deploy/SecretResolver supplies resolved ephemeral values without durable leakage. Current binding contract is `config|secret-reference`; future service/storage/integration bindings must map through this boundary without embedding values. |

## Important contract finding
The current public `SystemDefinition` is sufficient to describe entity fields and process state names, but not sufficient to execute arbitrary actions/workflow transitions faithfully: actions have no effect/handler semantics and processes have no transition graph. `AssemblyPlan` also intentionally carries selected capability/provider/version identities, not the full SystemDefinition payload.

Disposition: this is a real P13 functional gap, not an excuse to infer behavior. Construction A explicitly authorizes only the minimum additive L3 SystemDefinition execution semantics required for actions/workflow transitions, with compatibility fixtures and no secret/value fields. It must preserve BusinessRecipe != SystemDefinition and must not create a new Builder/Runtime boundary. If implementation proves an L4 boundary change is required, stop and require an ADR.

## Architecture / trust revalidation
- Builder != Runtime: PASS. Ordinary generated Runtime must continue without Builder/Observe calls.
- Runtime autonomy: PASS as predecessor evidence; every new runtime path must extend that proof.
- Release/environment separation: PASS. Immutable generated files/artifacts may contain schemas, references and deterministic executable material only, never resolved secret/config values.
- external configuration: values remain activation-time inputs; missing/incompatible bindings fail closed.
- no Mirror/Recipe authoring/execution, Analysis, Canvas or Release-management authoring behavior enters Runtime.
- no production topology expansion is authorized.
- no new L4 boundary is identified by Planning.

## Package growing proof
Construction must grow one real chain rather than isolated stand-ins:

`real SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler generated runtime/model/migrations -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy + external EnvironmentProfile/SecretResolver -> autonomous Runtime`

Then extend behavior cumulatively:

`entity persistence + generated API -> declared action execution -> declared workflow transition -> jobs/events/files/integrations -> failure on missing/incompatible external binding`

At every stage Builder and Observe are unavailable during ordinary Runtime operation, and generated/durable evidence is checked for secret/config value leakage.

## Construction A — Materialized entity/API/action/workflow execution
Status: COMMITTED / MATERIALIZED
Sprint: `P13-RUNTIME-CORE-EXECUTION-01`
Tasks: TASK-212..220

Goal: close WBS 13.1.1 by materializing executable entity/API/action/workflow behavior from the real SystemDefinition/Assembly/Compiler chain, using PostgreSQL/external bindings already proven by predecessors and adding only the minimum additive L3 execution semantics that the current SystemDefinition lacks.

Exit proof:
- actual SystemDefinition entity definitions generate deterministic persistence/runtime model;
- deployed Runtime exposes generated entity APIs with validation and durable PostgreSQL behavior;
- declared action semantics execute and invalid/unknown actions fail closed;
- declared workflow transitions execute and invalid transitions fail closed;
- actual factory -> Compiler -> Release -> Deploy predecessor chain is used, not hand-authored downstream artifacts;
- Builder/Observe unavailable does not break behavior;
- no resolved secret/config value appears in SystemDefinition, generated files, ReleaseArtifact, PublishedRelease, Deployment evidence or logs asserted by the proof;
- repository-wide `npm run verify` passes.

## Construction B — Runtime services and external bindings
Status: FORECAST

Goal: close WBS 13.1.2 and remaining 13.1.3 breadth for jobs/events/files/integrations using the same generated-runtime model and existing external configuration/no-value-leak boundary.

Exit proof forecast: actual compiled runtime executes one representative materialized job, event path, file/storage path and integration path; required external bindings are reference-only in durable artifacts and missing/incompatible bindings fail explicitly; Builder/Observe remain unavailable.

## Optional Construction C — completeness gap only
Status: FORECAST / CONDITIONAL

Promote only after Construction B is merged and fresh-main evidence proves one bounded remaining WBS 13.1 acceptance gap is necessary for the Package Goal. Do not use for generic hardening, auth/UI (P13-PACKAGE-02), production topology (P13-PACKAGE-03) or debt cleanup.

## Package Integration & Review
Status: FORECAST

Regress the complete WBS 13.1 chain; inspect L3 contract compatibility, Builder/Runtime separation, secret/config boundaries, materializer duplication/extensibility, integration debt, CI health and relevant performance. Missing functional capability returns to explicit construction/change control.

## Documentation & Closure
Status: FORECAST

Reconcile current-state docs, P13 package/Sprint reports, WBS coverage, risks/readiness and runtime/compiler/deploy documentation. Declare package CLOSED only when repository memory matches integrated truth.

## Boundaries
- Builder != Runtime and runtime autonomy remain constitutional.
- No Mirror/Recipe authoring, Analysis, Canvas or Release-management authoring behavior enters Runtime.
- No production deployment topology expansion unless separately authorized.
- Additive L3 contract work must remain explicitly bounded to WBS 13.1.1 executable semantics and backward compatibility.
- No new L4 boundary without an accepted ADR.
- Construction B/C, Package Integration & Review and Documentation & Closure remain FORECAST.
- P13-PACKAGE-02 and P13-PACKAGE-03 are not started by this package.
