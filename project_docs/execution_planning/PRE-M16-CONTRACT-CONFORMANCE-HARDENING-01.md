# PRE-M16-CONTRACT-CONFORMANCE-HARDENING-01 — Construction A

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Package: PRE-M16-CONFORMANCE-HARDENING-PACKAGE-01
Base planning truth: `6762118ce959903f271f96e9214aac79f61c9464`
Intended execution branch: `sprint/PRE-M16-CONTRACT-CONFORMANCE-HARDENING-01`
Predecessor: M15 / P15-PACKAGE-02 CLOSED.

## Goal
Remove the two bounded contract-governance trust gaps found by Architecture Conformance & Product Traceability Review before M16 provider-facing work: (1) SystemDefinition schema identity/publication drift and (2) critical-decision audit evidence accepting a caller-supplied valid verification verdict without canonical proof. Preserve all existing authority semantics and backward compatibility.

## Committed TASKs and dependency order
1. TASK-317 — make SystemDefinition schema identity resolve to the same complete canonical contract consumed by code.
2. TASK-318 — add publication/equivalence proof for canonical SystemDefinition schema and its extensions.
3. TASK-319 — harden critical-decision audit verification trust boundary without creating approval/authorization semantics.
4. TASK-320 — integrated conformance regression proof across contract publication and decision audit evidence.

Dependency order: `TASK-317 -> TASK-318`; `TASK-319` may proceed independently after base revalidation; `TASK-318 + TASK-319 -> TASK-320`.

## Growing proof expected at exit
- the public SystemDefinition schema identity, published/dereferenceable representation and imported canonical schema are semantically equivalent;
- identity/session and authority/generated-interaction extensions cannot disappear for an external schema consumer while remaining active internally;
- critical audit evidence cannot claim canonical `valid` verification solely from a structurally coherent caller-forged verdict;
- deterministic/human/probabilistic classification and ADR-0010 human authority semantics remain unchanged;
- existing Compiler/Runtime consumers remain backward-compatible;
- no M16 provider infrastructure, secrets, storage topology or L4 architecture change is introduced.

## Construction B forecast
`PRE-M16-CONFORMANCE-INTEGRATION-01` — FORECAST / NOT MATERIALIZED. Revalidate fresh main after Construction A; focus only on real consumer/interoperability proof and residual compatibility gaps required by this package goal.

## Construction C
OPTIONAL / NOT MATERIALIZED. Promote only if fresh integrated evidence after Construction B proves it necessary.

## Package review / closure forecast
After required construction, run Package Integration & Review for schema/contract drift, compatibility, audit trust, security boundaries and regression; then Documentation & Closure. No product capability expansion is allowed in review/closure.

## Final validation
At minimum: `npm run test:unit`, `npm run test:product`, `npm run check:tasks`, `npm run check:architecture`, `npm run verify`, followed by exact-head Deterministic CI and Heavy Product Tests on the Sprint PR.

## Stop / escalation conditions
Stop if correction requires a new schema-versioning policy, changes public compatibility semantics beyond additive/backward-compatible L3 hardening, changes ADR-0010/human authority, alters Builder/Runtime boundaries, introduces provider/storage topology, or otherwise requires undeclared L4 architecture. Such a change requires explicit ADR/change control.

## Explicit exclusions
This Sprint does not absorb broader productization gaps found in Process Mirror, Business Recipe, System Analysis, System Design, Business Catalog, Assembly adapters/migrations, Validation supply-chain, Compiler production generation, Observe telemetry, or TD-P13-01..04. Those remain successor-planning findings rather than opportunistic scope.