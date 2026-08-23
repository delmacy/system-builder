# P13-AUTONOMOUS-RUNTIME-IDENTITY-AUTHORITY-PLANNING-01 — Planning & Materialization Report

Date: 2026-08-23
Status: PLANNED / REVIEW GATE
Base: `2186f2ffa32e00d06dbe2230498a3d748a5d6533`
Base tree: `9644bcc20ac5d6f2eeb5e97fa1f7ea2ae4b82265`
Work Package: `P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience`
Primary WBS: 13.2.1-13.2.3

## Authority and predecessor
Planning re-read the repository authority chain for P13 Package 02, including `AGENTS.md`, current repository memory, Sprint policy/mode, `P13-PACKAGE-02`, M13 WBS, Identity/Organization/Authorization WBS/scope, canonical `SystemDefinition`, Compiler Runtime projection/model and integrated P13 Package 01 evidence.

`P13-PACKAGE-01` is CLOSED on fresh main `2186f2ffa32e00d06dbe2230498a3d748a5d6533`. Its Runtime Core provides the actual generated/deployed execution substrate and is predecessor evidence, not work to recreate.

Carried `TD-P13-01..04` is preserved as explicit debt and is not absorbed into this package absent WBS/dependency authority.

## Delivered-vs-gap matrix

| Capability | Classification | Repository evidence / real gap |
| --- | --- | --- |
| Runtime entities/APIs/actions/workflows/services | DELIVERED / REUSE | P13-PACKAGE-01 is CLOSED; generated Runtime, persistence, action/workflow and service execution are available as the actor-aware substrate. |
| Subject/User/ServiceIdentity execution | MISSING | WBS 27 defines Person/Actor/User-ServiceIdentity separation, but no executable public identity/session projection or Runtime identity model was found. |
| Organization/unit/membership graph | DOCUMENTED FOUNDATION / NOT YET EXECUTABLE | WBS 27 defines organizations, units, memberships, roles and authority. No executable Runtime organization graph was found. Construction A does not invent the full organization model; Construction B may use only the minimum role/membership semantics proven necessary for WBS 13.2.2 after fresh-main revalidation. |
| Auth-provider binding | MISSING semantics / REUSE binding infrastructure | WBS 27 requires replaceable auth-provider binding. Existing EnvironmentProfile/external reference machinery can be reused, but `SystemDefinition` has no identity/auth-provider/session descriptor and Runtime does not authenticate. |
| Credentials / resolved authentication material | EXTERNAL-ONLY FOUNDATION / REUSE | Existing no-value-leak and external binding rules are reusable. Credential values must remain runtime inputs and must not enter SystemDefinition, ReleaseArtifact or durable evidence. |
| Session lifecycle | MISSING | No generated Runtime session issuance/validation/expiry path was found. |
| Permissions | DECLARED / NOT EXECUTED | Canonical SystemDefinition already requires `permissions` entries (`role`, `resource`, `actions`), but Compiler Runtime projection/model omit them and Runtime does not enforce them. |
| Policies | DECLARED / NOT EXECUTED | Canonical SystemDefinition already requires `policies`, but current statements are declarative/opaque and are not projected/evaluated by Runtime. Do not infer policy behavior from free text. |
| Views/forms | DECLARED / NOT GENERATED | Canonical SystemDefinition already requires `views` with view kinds including `form`, but Compiler Runtime projection/model omit views and no generated Runtime view/form rendering route was found. |
| Authorization result/audit hook | DOCUMENTED FOUNDATION / MISSING EXECUTION | WBS 27 requires contextual permission/policy evaluation and auditable authorization results; no actor-aware Runtime decision path was found. |

## Reuse classification
- **REUSE** — P13-01 Runtime Core, generated APIs/actions/workflows, release/deploy chain, EnvironmentProfile/SecretResolver reference-only binding behavior, deterministic Compiler/Runtime model mechanics.
- **REUSE** — existing `SystemDefinition.permissions`, `SystemDefinition.policies` and `SystemDefinition.views` as declarative source material; do not recreate these concepts.
- **ADAPT / L3** — add only the minimum backward-compatible identity/auth-provider/session declaration needed by WBS 13.2.1, and project it through Compiler/Runtime. This is explicit Construction A contract authority.
- **FORECAST / likely L3 in Construction B** — if existing permission/policy/view declarations prove insufficient for executable authorization or generated interaction, any minimum additive semantics require fresh-main revalidation and explicit Construction B authority; do not pre-implement them in A.
- **MISSING** — generated authentication/session execution and actor context propagation.

## Security and threat boundary
Construction A must fail closed and prove at minimum:
- unknown, disabled, malformed or unmapped identity state is rejected;
- malformed/missing authentication binding is rejected;
- invalid/expired session state is rejected;
- unauthenticated access to an actor-required representative Runtime operation is rejected;
- no credential, provider secret, session signing secret/token value or resolved endpoint is persisted in immutable/durable factory artifacts or diagnostics;
- Runtime ordinary authentication/session behavior performs no Builder or Observe lookup;
- identity references are explicit; no role, subject, provider or privilege is inferred from names/order/defaults;
- authorization semantics beyond identity/session are deferred to Construction B rather than silently permitted.

Any requirement to create a new bounded context, move identity authority into Builder ordinary operation, change release/environment ownership, introduce a mandatory provider-specific IAM platform or alter another L4 boundary is a STOP + ADR condition.

## Construction A materialized
Sprint: `P13-RUNTIME-IDENTITY-SESSION-01`
Status: COMMITTED / MATERIALIZED
Tasks: TASK-231..239

Goal: close WBS 13.2.1 by carrying explicit identity/auth-provider/session declarations through the actual SystemDefinition -> Compiler -> Release -> Deploy -> generated Runtime chain and proving authenticated actor/session behavior without Builder dependency.

Explicit L3 authority is limited to the minimum additive backward-compatible SystemDefinition identity/auth-provider/session semantics required for WBS 13.2.1. Existing EnvironmentProfile binding kinds must be reused when sufficient; a second shared-contract family change is not authorized by default.

## Forecast after Construction A
- Construction B: FORECAST — WBS 13.2.2-13.2.3, authorization plus generated interaction, after fresh-main revalidation.
- Construction C: FORECAST / CONDITIONAL — only if fresh-main post-B evidence proves one bounded remaining Package Goal gap.
- Package Integration & Review: FORECAST.
- Documentation & Closure: FORECAST.
- `P13-PACKAGE-03`: FORECAST / NOT STARTED.

## Package growing proof
Reuse the actual P13-01 proof chain:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy + external bindings -> autonomous generated Runtime`

Construction A extends it through:

`explicit identity/auth binding -> authentication -> session -> actor context -> representative actor-required Runtime request`.

Construction B is forecast to extend the same proof through:

`role/membership -> permission/policy decision -> allowed API/action + denied API/action -> generated view/form interaction under the same actor authority`.

No hand-authored downstream Runtime artifact may replace an executable predecessor API in the growing E2E proof.

## Planning-only change proof
This Planning Sprint introduces no product behavior. It may change only repository memory, Work Package/Construction planning artifacts, this report and TASK-231..239 specifications. Product contracts/compiler/runtime/tests remain unchanged until the separately executed Construction A Sprint.

## Review gate
Before planning integration:
- exact-head Deterministic CI and Heavy Product Tests must pass;
- PR diff must remain planning/materialization only;
- no `.github/**`, product code, shared contract implementation or repository setting change is authorized;
- no L4 change may be hidden in task materialization.

After approved merge, reconstruct fresh `main` and stop. Do not execute `P13-RUNTIME-IDENTITY-SESSION-01`, Construction B/C or P13-PACKAGE-03 without successor authorization permitted by repository policy.