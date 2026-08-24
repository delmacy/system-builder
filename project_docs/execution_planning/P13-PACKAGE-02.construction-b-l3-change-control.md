# P13-PACKAGE-02 — Construction B bounded L3 change control

Date: 2026-08-23
Status: ACCEPTED / BOUNDED L3 AUTHORITY ONLY / PENDING INTEGRATION
Base: `9a0f1d653593a287fbf5c7fb2586ea36c1455c7e`
Work Package: `P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience`
Primary WBS: 13.2.2-13.2.3

## Trigger
Post-Construction-A fresh-main revalidation proved that WBS 13.2.2-13.2.3 remains necessary but cannot be materialized faithfully from the current public/shared-contract shape alone. The integrated actor/session path has no explicit executable actor/identity-to-role or membership linkage, existing `SystemDefinition.permissions` has no Runtime evaluator, existing `SystemDefinition.policies` remains opaque free text, and existing `SystemDefinition.views` lacks deterministic entity/field/action bindings.

The user has now granted explicit L1-L3 execution authority for changes necessary to fulfill already materialized TASK/Sprint/Work Package scope, while requiring scope containment and normal repository gates. This record converts that delegation into bounded repository authority for the already-forecast P13-PACKAGE-02 Construction B contract surface. It does not implement product behavior and does not itself materialize Construction B.

## Decision
Authorize only the minimum additive, backward-compatible L3 semantics required so a future committed P13-PACKAGE-02 Construction B can implement WBS 13.2.2-13.2.3 through the existing `SystemDefinition -> Compiler -> Release -> Deploy -> autonomous Runtime` path.

The existing concepts `permissions`, `policies`, `views`, identity/session actor context, Runtime entities/actions and WBS 27 organization/role authority must be reused rather than replaced.

## Authorized L3 semantic envelope
A future committed Construction B may, only as required by its bounded TASKs:

- extend the existing public `SystemDefinition` contract family with an optional explicit actor/identity-to-role or membership linkage sufficient to resolve Runtime authority deterministically;
- preserve WBS 27 distinctions among Person/Actor/User-ServiceIdentity/organization/membership/role and avoid collapsing them into a single implicit user-role concept;
- extend existing `permissions` only with the minimum optional context/reference semantics needed to evaluate declared `role/resource/actions` deterministically against the authenticated actor context;
- introduce an optional bounded structured policy representation only where permission-only semantics cannot satisfy the Package Goal; existing free-text `statement` remains descriptive and MUST NOT become executable authority;
- extend existing `views` with the minimum optional deterministic binding references needed to associate generated view/form interaction with already-declared Runtime entities, fields and actions;
- extend the Compiler Runtime projection only to carry the corresponding normalized deterministic authorization and generated-interaction descriptors;
- add deterministic Runtime authorization evaluation producing auditable allow/deny results shared by representative API/action and generated interaction paths;
- fail closed when membership/role, permission, policy context or view/action binding required for a request is missing, unknown, incompatible or ambiguous.

## Mandatory constraints
- Authentication never implies authorization.
- Roles, memberships, permissions or policies must never be inferred from identity names, ordering, provider names, successful authentication, defaults or naming conventions.
- Existing free-text policy statements are never interpreted as code, expressions or an executable DSL.
- View/entity/field/action bindings are never inferred from names or array ordering.
- New descriptors are optional and backward-compatible so historical fixtures remain valid unless an existing explicit validation rule already rejects them.
- Runtime ordinary operation remains autonomous and must not consult Builder/Observe to authorize requests or render generated interaction.
- Durable artifacts carry declarations/references only; resolved credentials, secrets, session tokens, provider values and endpoint values remain outside immutable/durable evidence.
- No mandatory provider-specific IAM/SSO framework, policy engine, frontend framework or UI renderer is authorized.
- No new bounded context, Builder/Runtime ownership change, release/environment ownership change, suite topology change or production deployment topology is authorized.
- `TD-P13-01..04` remain carried debt and are not absorbed.
- P13-PACKAGE-01 Construction B / TASK-221..230 remains predecessor Runtime services/bindings work and must not be recreated.
- P13-PACKAGE-03 remains outside scope.

## Change classification
This is L3 contract authority only. It stays inside existing public contract families and the existing Builder -> Compiler -> Release -> Deploy -> autonomous Runtime architecture.

No L4 change is authorized or currently required. If concrete successor planning or implementation requires a new bounded context, Builder/Runtime relation, release/environment ownership, suite topology or other architectural boundary change, stop and require an accepted ADR before implementation.

## Successor gate
This record must first pass the normal PR/review/CI gates and be integrated into `main`.

After integration:
1. reconstruct fresh `main`;
2. re-read the actual affected contracts, WBS 27, WBS 13.2 and integrated Construction A outputs;
3. verify that this bounded L3 envelope still matches the minimum required implementation surface;
4. materialize at most one P13-PACKAGE-02 Construction B Sprint with a fixed goal and committed TASK set;
5. each TASK must declare exact dependencies, `allowed_paths`, `forbidden_paths`, `max_files`, context paths, validation commands and concrete contract/API deltas;
6. execute product work only after that separate materialization step.

Construction B therefore remains FORECAST until this authority is integrated and the required fresh-main revalidation/materialization gate completes. Construction C remains FORECAST / CONDITIONAL; Package Integration & Review and Documentation & Closure remain FORECAST.