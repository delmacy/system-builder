# P13-PACKAGE-01 — Autonomous Runtime Functional Execution

Status: ACTIVE / CONSTRUCTION A INTEGRATED / CONSTRUCTION B COMMITTED-MATERIALIZED
Milestone: M13
Primary WBS: 13.1.1-13.1.3
Predecessor: P12-PACKAGE-01 CLOSED
Planning Sprint: `P13-AUTONOMOUS-RUNTIME-FUNCTIONAL-PLANNING-01`

## Package goal
Close the remaining functional Runtime Core gap so a compiled/deployed client runtime executes materialized entities/APIs/actions/workflows plus jobs/events/files/integrations from external configuration without requiring the Builder during normal operation.

## Construction A — integrated
Sprint: `P13-RUNTIME-CORE-EXECUTION-01`
Tasks: TASK-212..220
Reviewed head: `4c0e965c4e351ea29f240c370205303d3ef87c43`
Deterministic CI: #561 PASS
Merge-main: `554bff25683d0b523e38279b151f1d6b87578d72`
Reviewed/merge tree: `fbc18c18511a4fa9aa140f124eacb995e82b189f`

Construction A closed WBS 13.1.1 through the real SystemDefinition -> Compiler -> Release -> Deploy -> autonomous Runtime chain. Its additive L3 work remained bounded to explicit action/workflow semantics and `process.initialState`; no L4 boundary changed.

## Post-A gates — integrated
PR #238 reconciled repository memory and recorded the real Construction B contract gap. It passed Deterministic CI #562 and merged as `57b8cf3c4c671dd06b590514acac9ce449e7e69b` with zero file drift.

PR #239 integrated `P13-PACKAGE-01.construction-b-l3-change-control.md`. Its exact head `60d24d36963d2866f65d6e5f5d6e108cd9b865db` passed Deterministic CI #563 and merged as `8e9e7f1e3c86588ec0edbca0344a48f398332c7c`, tree `62e871d54a522a1e9faa9ccb854e04aba9bced63`, with zero file drift.

The bounded L3 authority is ACCEPTED. It authorizes only minimum additive/backward-compatible semantics inside existing public contract families for explicit jobs/events/files-storage/integration execution, deterministic Compiler projection and reference-only binding compatibility metadata. It authorizes no L4 change.

## Construction B — Runtime services and external bindings
Status: COMMITTED / MATERIALIZED
Sprint: `P13-RUNTIME-SERVICES-BINDINGS-01`
Tasks: TASK-221..230
Materialization base: `8e9e7f1e3c86588ec0edbca0344a48f398332c7c`

Goal: close WBS 13.1.2 and remaining 13.1.3 breadth using the same generated-runtime model and external configuration/no-value-leak boundary.

Committed semantic envelope:
- optional explicit interval jobs with declared action target and recordId;
- optional explicit runtime-http events with declared actionRef and explicit invocation inputs;
- optional file/storage descriptors with allowed `put|get|delete` operations and explicit storage `bindingRef`;
- additive integration HTTP invocation (`method` + relative `path`) and explicit external-service `bindingRef`;
- optional EnvironmentProfile binding `requirementKind` classification using existing environment requirement kinds;
- deterministic normalized Compiler/runtime projection and fail-closed reference validation.

The Sprint deliberately reuses existing action execution, generated Runtime process, Deploy/SecretResolver activation-time resolution and Release/Environment separation. No scheduler/broker/object-store/integration vendor is selected; no new bounded context, worker topology or production topology is introduced.

Exit proof:
- one actual declared interval job executes through its explicit action target;
- one actual runtime-http event dispatch executes through its explicit action target;
- one actual file/storage put/get/delete path executes beneath an externally supplied storage-root binding and rejects traversal;
- one actual HTTP integration invocation uses an externally supplied external-service base-url binding plus declared method/relative path;
- missing/incompatible classified bindings fail closed;
- Builder/Observe unavailable does not break ordinary Runtime behavior;
- resolved storage/endpoint/config/secret values remain absent from immutable/durable evidence and asserted diagnostics;
- actual predecessor SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> Release -> verified ArtifactPayload -> Deploy chain is used;
- repository-wide `npm run verify` passes.

## Optional Construction C
Status: FORECAST / CONDITIONAL
Not eligible before Construction B is integrated and fresh-main evidence proves one bounded remaining WBS 13.1 package-goal gap.

## Package Integration & Review
Status: FORECAST
Not started. Missing functional capability required by the Package Goal returns to explicit construction/change control.

## Documentation & Closure
Status: FORECAST
Not started.

## Boundaries
- Builder != Runtime and autonomous ordinary Runtime remain constitutional.
- BusinessRecipe != SystemDefinition remains preserved.
- No Mirror/Recipe authoring, Analysis, Canvas or Release-management authoring behavior enters Runtime.
- No resolved secret/config/endpoint/storage values in immutable/durable artifacts.
- No provider-specific scheduler, broker, object-store or integration framework becomes mandatory.
- No exactly-once/distributed scheduling/event guarantee is authorized.
- No production topology expansion without separate authority.
- No new L4 boundary without accepted ADR.
- Construction C, Package Integration & Review and Documentation & Closure remain FORECAST.
- `P13-PACKAGE-02` and `P13-PACKAGE-03` remain not started.
