# P13-RUNTIME-IDENTITY-SESSION-01 — Construction A

Status: COMMITTED / MATERIALIZED
Work Package: P13-PACKAGE-02
Milestone: M13
WBS: 13.2.1, with 13.2.2-13.2.3 explicitly deferred
Planning base: `2186f2ffa32e00d06dbe2230498a3d748a5d6533`
Intended execution branch: `sprint/P13-RUNTIME-IDENTITY-SESSION-01`

## Sprint goal
Make the generated autonomous Runtime actor-aware at the identity/session layer: carry explicit identity/auth-provider/session declarations from SystemDefinition through Compiler/Release/Deploy, resolve authentication inputs externally, authenticate a representative identity, issue/validate bounded session state and reject invalid/expired/disabled/unauthenticated paths without Builder or Observe dependence.

## Predecessor gate
SATISFIED for materialization:
- `P13-PACKAGE-01` CLOSED on fresh main `2186f2ffa32e00d06dbe2230498a3d748a5d6533`;
- WBS 27 already establishes Person/Actor/User-ServiceIdentity separation and replaceable auth-provider binding as domain authority;
- existing SystemDefinition contains views/permissions/policies, but current Compiler Runtime projection/model does not consume them;
- P13-01 Runtime Core provides actual generated API/action/workflow/service execution substrate;
- external reference-only configuration/no-value-leak machinery is integrated;
- planning found no required L4 boundary change.

## Committed tasks and dependency order
1. TASK-231 — additive SystemDefinition identity/auth-provider/session declaration semantics (L3)
2. TASK-232 — Compiler identity/session projection and reference validation
3. TASK-233 — deterministic RuntimeModel identity/session materialization
4. TASK-234 — activation-time authentication binding validation without value leakage
5. TASK-235 — generated authentication execution against explicitly declared provider binding
6. TASK-236 — generated bounded session issuance/validation/expiry
7. TASK-237 — actor context propagation and authenticated representative Runtime request
8. TASK-238 — identity/session fail-closed and no-value-leak regression
9. TASK-239 — full predecessor-integrated autonomous identity/session growing proof

Execute in numeric order. TASK-232 depends on 231; TASK-233 depends on 231-232; TASK-234 depends on 231-233; TASK-235 depends on 231-234; TASK-236 depends on 231-235; TASK-237 depends on 231-236; TASK-238 depends on 231-237; TASK-239 depends on all predecessors.

## Explicit L3 authority
TASK-231 may make the minimum additive backward-compatible shared `SystemDefinition` change needed to represent:
- explicit subject/technical identity references without conflating Person/Actor/User-ServiceIdentity;
- an explicit replaceable authentication-provider binding/reference;
- identity active/disabled state needed for fail-closed authentication;
- explicit bounded session policy/lifetime metadata required for runtime validation.

The representation must remain declarative/reference-oriented. Provider credentials, passwords, tokens, signing material, resolved endpoint values and other secrets are forbidden in SystemDefinition and immutable artifacts.

Existing EnvironmentProfile/reference binding machinery must be reused when sufficient. No EnvironmentProfile schema change, new identity bounded context, provider-specific IAM requirement, Builder runtime lookup or other shared-contract family change is authorized by default. If implementation proves another L3 contract change necessary, STOP for explicit change-control authority. Any L4 consequence requires ADR.

TASK-231 must preserve all existing valid SystemDefinition fixtures and must not alter executable semantics of existing `permissions`, `policies` or `views`; those remain Construction B scope.

## Authentication/session reference-path constraints
Construction A may implement one bounded replaceable reference path sufficient to prove WBS 13.2.1, but it must satisfy all of the following:
- provider selection/interaction is explicit in durable descriptors, never inferred from names;
- resolved credential/provider/session-secret values exist only at activation/runtime;
- session state has explicit validity/expiry semantics and fails closed when malformed/expired/unknown;
- disabled/unmapped identity fails closed;
- unauthenticated actor-required request fails closed;
- Runtime ordinary operation does not call Builder or Observe;
- no authorization privilege is inferred merely because authentication succeeded;
- no production/federation/SSO topology claim is made.

## Growing integration proof
`real SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy + external EnvironmentProfile/SecretResolver -> autonomous Runtime -> explicit authentication provider -> authenticated identity -> session -> actor context -> representative authenticated Runtime request`

Proof requirements:
- use actual predecessor APIs/modules rather than hand-authored downstream artifacts;
- preserve P13-01 entity/action/workflow behavior;
- authentication failure, disabled/unknown identity, invalid session and expiry have deterministic negative evidence;
- Builder and Observe are unavailable during ordinary Runtime behavior;
- resolved credential/provider/session-secret/token values do not enter immutable/durable evidence or controlled diagnostics.

## Final validation
`npm run verify`

Heavy validation remains required at the Sprint PR exact head according to repository policy.

## Stop / escalation conditions
- any required L4 architecture/bounded-context/Builder-Runtime/release model change;
- any public shared-contract change beyond TASK-231's bounded SystemDefinition authority;
- any need to change EnvironmentProfile schema rather than reuse existing bindings;
- inability to authenticate/session-bind without inventing provider or identity semantics not supported by repository authority;
- any permissive fallback or silent privilege grant;
- required modification under `.github/**` or repository settings;
- production/federation/enterprise IAM topology expansion;
- need to execute roles/permissions/policies/views/forms from WBS 13.2.2-13.2.3;
- need to enter P13-PACKAGE-03 or absorb TD-P13-01..04;
- validation cannot be made green inside committed scope.

## Successor state
Construction B, optional C, Package Integration & Review, Documentation & Closure and P13-PACKAGE-03 remain FORECAST. Completing this Sprint does not authorize them automatically.