# Contract Addendum 004 — Station Portable Composition Artifacts

Date: 2026-10-10
Status: ACCEPTED via #1043; RESOLUTION-01 effective via #1045; A/B/review integrated; bounded WP3 CLOSED on validated Documentation & Closure integration
Predecessor: WP2 closed through PR #1039; WP3 planning PR #1040 and readiness PR #1041 integrated.

## Admitted bounded scope
Admit one portable, versioned, *data-only* composition artifact codec for the existing Station editor and source-owned catalog. A serialized artifact is an untrusted document, never a component/provider definition, executable script, business command, Core record, or window setting. The user explicitly exports and imports it. The separately gated Construction B origin-local retention and Save As/Open workflow are resolved in RESOLUTION-02 and integrated through #1047 after proven codec #1046.

## Envelope resolution
Public interchange uses the accepted ADR-0009 envelope and existing common schema. The earlier flat envelope proposal is superseded by `RESOLUTION-01.md`: applicationRef/compositionRef/baseRevision/graph are strict payload fields; identity/SemVer/schema/provenance remain common-envelope fields. Preserve optional inert extensions/provenance per ADR-0009 and reject unsupported required semantics. Unknown payload/graph fields reject; no ADR exception. Exact versions, source compatibility, codec budgets, deterministic metadata handling and compound .composition.json hint are normative in RESOLUTION-01 after validated integration.

## Trust and version gates
- Parse untrusted bytes with explicit maximum byte length and bounded node count before graph normalization; use RESOLUTION-01's documented codec-specific admission budgets with N-1/N/N+1 tests; do not claim them as pre-existing repository-wide limits.
- Reject duplicate refs, prototype-unsafe keys, unknown component references, incorrect root/parent/slot, invalid spans, cycles, unsupported envelope/payload schema versions, foreign application identity and incompatible revision.
- Resolve component registry from the **installed source-owned catalog**, not the incoming payload. The codec may not grant capabilities or instantiate arbitrary components.
- Preserve prior editor session and stored artifact on every failure; replacement is atomic only after full validation and explicit user action.
- Export deterministically from an accepted graph and verify round trips; no implicit migration or overwrite of newer revisions. Proven changes must not weaken existing WP1/WP2 protections.
- Artifacts are separate from StationPresentationState/preferences and Core. Import/export alone is not durable saving, filesystem authority, synchronization or server-side versioning.

## Candidate work breakdown
1. Contract and resource-format inventory / scope admission.
2. Codec with typed success/failure result, strict parser, deterministic serializer and negative tests.
3. Browser integration with explicit download/upload and safe dirty-state transitions, plus durable provider only if separately admitted.
4. Integration/review with exact-head, merge-candidate, heavy, Station build/browser tests, retained screenshot, documentation closure.

## Not in this addendum
Arbitrary external component installation, JS execution, HTML/CSS import, Core business persistence, multi-tenant permissions, full File Manager, Studio-specific documents, `.process` canonical format, AI authoring, network sync, publishing and deployment.

## Admission gate
Scope admission is effective only after validation and merge of the admission PR. Existing `packages/station-composition/graph.ts` defines rootRef/nodes/ref/componentRef/placement; `graph-validation.ts` requires additional caller-side guards against cycles and strict external JSON shape. WP2 catalog supplies source-owned registry and identity. Codec implementation must be separately validated and integrated; no functionality is claimed here.

## Admission checkpoint
PR #1043 passed all five triggered workflows and merged; scope admission is effective. Resolution applies ADR-0009 rather than changing it. No codec or persistence implementation is claimed by admission/readiness documents.

## Delivery checkpoint
A #1046, B #1047 and review #1048 implement/prove/integrate the admitted bounded goal. RESOLUTION-01/02 are effective; shared envelope/ADR semantics remain unchanged. WP3 CLOSED becomes effective on validated STATION-S4-WP3-DOCUMENTATION-CLOSURE-01 integration. Closure report maps scope to real codec/store/browser/CI evidence and residual limits; original admission-only statements describe the historical admission gate.
