# PRE-M16-CONFORMANCE-INTEGRATION-01 — Construction B

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Package: PRE-M16-CONFORMANCE-HARDENING-PACKAGE-01
Base fresh-main truth: `12af9d4226d7cd0510a682c9eccc4335f77ab55e`
Intended execution branch: `sprint/PRE-M16-CONFORMANCE-INTEGRATION-01`
Predecessor: `PRE-M16-CONTRACT-CONFORMANCE-HARDENING-01` COMPLETE / SPRINT REVIEW PASS / INTEGRATED.

## Fresh-main gate
Construction A integrated after final exact-head Deterministic CI #860 and Heavy Product Tests #294 passed on `ad4ee8448d9cb4e855a35f6b0019ada13e2a63ab`; merge-main `12af9d4226d7cd0510a682c9eccc4335f77ab55e` has the identical tree `9b51361f597a278495cced60a2646bbf99e4b6e1`.

Construction A eliminated the two identified contract-governance defects and found no additional product capability gap. Construction B is nevertheless materialized because the package policy defines two required Construction Sprints by default and the Planning forecast explicitly reserved this increment for real-consumer/interoperability proof. This Sprint therefore adds proof only; it must not invent new product behavior.

## Goal
Prove that the hardened canonical SystemDefinition contract and canonical decision-verification trust boundary remain compatible through representative real Compiler/Runtime consumers and existing decision-audit paths, with no production-module modifications unless a bounded compatibility defect is objectively exposed.

## Committed TASKs and dependency order
1. TASK-321 — prove canonical SystemDefinition extensions through representative Compiler runtime-projection consumers.
2. TASK-322 — prove canonical verification trust through representative decision-audit consumers while preserving human authority and rejected/invalid behavior.
3. TASK-323 — integrated PRE-M16 consumer/interoperability growing proof and Sprint Report.

Dependency order: `TASK-321 -> TASK-322 -> TASK-323`.

## Growing proof expected at exit
- representative Compiler projection APIs consume a SystemDefinition carrying identity/session and authority/generated-interaction extensions without compatibility regression;
- canonical schema identity/publication remains identical to the imported contract during those consumer paths;
- legitimate canonical decision verification remains auditable, caller-forged/reconstructed verification remains fail-closed, and canonical rejected evidence remains auditable as rejected;
- no approval/authorization semantics are created and ADR-0010 remains untouched;
- no M16 provider implementation, registry, remote call, secret material, storage topology, Runtime Audit Trail replacement or L4 architecture change is introduced.

## Construction C
OPTIONAL / NOT MATERIALIZED. After this Sprint integrates, reconstruct fresh `main`. Promote only if a bounded residual defect necessary to the PRE-M16 Package Goal remains; otherwise proceed directly to Package Integration & Review.

## Package review / closure forecast
After Construction B integration and fresh-main revalidation, run Package Integration & Review for full regression, schema drift, interoperability, audit trust/security, debt classification and readiness; then Documentation & Closure.

## Final validation
At minimum: `npm run test:unit`, `npm run test:product`, `npm run check:tasks`, `npm run check:architecture`, `npm run verify`, followed by exact-head Deterministic CI and Heavy Product Tests.

## Stop / escalation conditions
Stop if a proof requires changing Compiler/Runtime architecture, schema-versioning policy, ADR-0010 authority semantics, provider/storage topology, public compatibility beyond additive L3 hardening, or any undeclared L4 decision.

## Explicit exclusions
No M16/M17 product implementation, no broader productization cleanup, and no absorption/re-ranking of TD-P13-01..04.
