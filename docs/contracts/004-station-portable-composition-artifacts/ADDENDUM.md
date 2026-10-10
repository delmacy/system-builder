# Contract Addendum 004 — Station Portable Composition Artifacts (Proposal)

Date: 2026-10-10
Status: ACCEPTED ONLY ON VALIDATED ADMISSION PR INTEGRATION
Predecessor: WP2 closed through PR #1039; WP3 planning PR #1040 and readiness PR #1041 integrated.

## Proposed bounded scope
Admit one portable, versioned, *data-only* composition artifact codec for the existing Station editor and source-owned catalog. A serialized artifact is an untrusted document, never a component/provider definition, executable script, business command, Core record, or window setting. The user explicitly exports and imports it. A future Construction B may add local durable storage and Save As/Open UI only after the codec is proven.

## Envelope proposal (subject to contract review)
A strict JSON object with fields: `format` (fixed identifier), `schemaVersion` (initial 1), `applicationRef`, `compositionRef`, `baseRevision`, and `graph` (root and nodes containing only canonical ref/componentRef/placement fields). No author-supplied descriptors, labels, registry, code, HTML, CSS, secrets, focus, selection or window coordinates. Adopt a file extension only after existing file/resource contract inventory. JSON object keys and nesting are fixed; all unknown fields reject rather than silently migrate.

## Trust and version gates
- Parse untrusted bytes with explicit maximum byte length and bounded node count before graph normalization; bounds must be established from existing repository validation constraints, documented and tested.
- Reject duplicate refs, prototype-unsafe keys, unknown component references, incorrect root/parent/slot, invalid spans, cycles, unknown format/schemaVersion, foreign application identity and incompatible revision.
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
