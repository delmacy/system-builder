# P13-PACKAGE-01 — Construction B bounded L3 change control

Date: 2026-08-22
Status: ACCEPTED / BOUNDED L3 AUTHORITY ONLY
Base: `57b8cf3c4c671dd06b590514acac9ce449e7e69b`
Work Package: `P13-PACKAGE-01 — Autonomous Runtime Functional Execution`
WBS: 13.1.2 + remaining 13.1.3 breadth

## Trigger
Fresh-main revalidation after Construction A proved that the integrated public contracts are insufficient to materialize Construction B faithfully: jobs/events/files have no public execution semantics, integrations expose identity/contract/direction only, and runtime projection does not carry those classes.

## Decision
Authorize only the minimum additive, backward-compatible L3 semantics needed so a future Construction B can explicitly materialize and execute representative jobs, events, file/storage operations and integrations through the existing SystemDefinition -> Compiler -> Release -> Deploy -> autonomous Runtime path.

This change control does not materialize Construction B and does not authorize product implementation by itself.

## Authorized L3 semantic envelope
A future committed Construction B may, only as required by its bounded TASKs:
- extend the existing public `SystemDefinition` contract family with optional declarative job execution descriptors that explicitly identify trigger/schedule semantics and the declared runtime behavior to invoke;
- extend the same contract family with optional declarative event source/routing descriptors and an explicit declared runtime target;
- extend the same contract family with optional declarative file/storage operation descriptors and explicit external binding references;
- extend existing integration entries with only the explicit operation/invocation and binding-reference semantics required for deterministic Runtime execution;
- extend `CompilerSystemDefinitionRuntimeProjection` only to carry the corresponding normalized deterministic descriptors into the generated Runtime;
- extend existing environment-binding contracts with minimum additive reference/classification metadata only when required to distinguish compatible runtime service/storage/integration bindings.

All durable descriptors remain reference-only. Resolved configuration, credentials, secrets, service tokens, storage credentials and endpoint values that repository policy treats as activation-time values remain outside SystemDefinition, generated immutable artifacts, ReleaseArtifact, PublishedRelease and durable deployment evidence.

## Mandatory semantic constraints
- Runtime must never infer behavior from names, array order, integration `direction`, environment requirement `kind`, provider naming or convention.
- New descriptors must be optional/backward-compatible so historical SystemDefinition/EnvironmentProfile fixtures remain valid unless an existing explicit validation rule already rejects them.
- Missing, unknown or incompatible required bindings fail closed with deterministic diagnostics.
- Jobs/events/files/integrations must reuse the existing autonomous generated-Runtime model; no Builder/Observe dependency may enter ordinary execution.
- No vendor-specific scheduler, broker, object store or integration provider becomes constitutional or mandatory.
- No exactly-once/distributed scheduling guarantee, new worker topology, broker topology, storage topology or production deployment topology is authorized by this change control.
- No auth/session/roles/views work from `P13-PACKAGE-02` and no production-topology work from `P13-PACKAGE-03` enters scope.

## Change classification
This is L3 contract authority only. It stays inside existing public contract families and the existing Builder -> Compiler -> Release -> Deploy -> Runtime pipeline.

No new L4 boundary is authorized or identified by this decision. If concrete Construction B planning or implementation requires a new bounded context, Builder/Runtime relation, release model, suite topology or production topology, stop and require an accepted ADR before proceeding.

## Successor gate
After this change-control record is reviewed, CI-valid and integrated:
1. reconstruct fresh `main`;
2. re-read actual contracts and predecessor outputs;
3. verify this bounded authority still matches the required implementation surface;
4. only then decide whether Construction B may become COMMITTED/materialized;
5. Construction B TASKs must separately declare exact allowed paths, validation, dependency order and concrete schema/API deltas.

Construction B remains FORECAST until that fresh-main gate. Construction C, Package Integration & Review, Documentation & Closure, `P13-PACKAGE-02` and `P13-PACKAGE-03` remain not started.
