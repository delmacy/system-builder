# P13-RUNTIME-IDENTITY-SESSION-01 — Construction A

Status: INTEGRATED
Work Package: P13-PACKAGE-02
Milestone: M13
WBS: 13.2.1, with 13.2.2-13.2.3 explicitly deferred
Planning base: `2186f2ffa32e00d06dbe2230498a3d748a5d6533`
Execution branch: `sprint/P13-RUNTIME-IDENTITY-SESSION-01`
Integration PR: #250
Integrated main: `adc739c1370df380a31ad196bf24fcdff4b0bf2d`
Reviewed head: `b149f823eddcc3e2589ba42e3794f01879f23629`

## Sprint goal
Make the generated autonomous Runtime actor-aware at the identity/session layer: carry explicit identity/auth-provider/session declarations from SystemDefinition through Compiler/Release/Deploy, resolve authentication inputs externally, authenticate a representative identity, issue/validate bounded session state and reject invalid/expired/disabled/unauthenticated paths without Builder or Observe dependence.

## Integration result
The Sprint goal is integrated for WBS 13.2.1.

Exact reviewed-head gates:
- Deterministic CI #616 — PASS.
- Heavy Product Tests #39 — PASS.

TASK-231..239 remain the nine authoritative implementation commits in committed dependency order. `a60f1d818e77f1f8bc00e9533924a8916cda7de9` is a bounded verification-only correction; `b149f823eddcc3e2589ba42e3794f01879f23629` adds the repository-required Sprint Report. Neither changes task authority or expands scope.

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

## Explicit L3 authority used
TASK-231 used only the minimum additive backward-compatible shared `SystemDefinition` change needed to represent explicit subject/technical identity references, replaceable authentication-provider reference, active/disabled identity state and bounded session policy/lifetime metadata.

Provider credentials, passwords, tokens, signing material, resolved endpoint values and other secrets remain forbidden in SystemDefinition and immutable artifacts. EnvironmentProfile/reference binding machinery was reused unchanged. No additional shared-contract family or L4 change was introduced.

Existing `permissions`, `policies` and `views` were not given executable semantics by this Sprint; those remain successor scope and require their own authority.

## Integrated growing proof
`real SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy + external EnvironmentProfile/SecretResolver -> autonomous Runtime -> explicit authentication provider -> authenticated identity -> session -> actor context -> representative authenticated Runtime request`

The proof covers authentication failure, disabled/unknown identity, invalid/unknown/expired session, unauthenticated actor-required execution, Runtime operation without Builder/Observe, and no leakage of resolved credential/provider/session values into durable evidence.

## Security boundary preserved
- authentication does not imply authorization;
- no role/permission/policy grant is inferred;
- no production/federation/SSO topology claim;
- no EnvironmentProfile schema change;
- no Builder runtime lookup;
- no `TD-P13-01..04` absorption;
- no P13-PACKAGE-03 work.

## Successor state
Construction A is complete and integrated. Fresh-main revalidation after merge found Construction B still necessary for WBS 13.2.2-13.2.3 but blocked pending bounded L3 change control for minimum executable role/membership, permission/policy and generated-view/form binding semantics. Construction B must not be materialized or executed from this Sprint authority.

Construction C, Package Integration & Review, Documentation & Closure and P13-PACKAGE-03 remain forecast.
