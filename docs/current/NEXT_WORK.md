# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-09-27
Repository truth base: `main@c09b291ee13cc846fbdab717cee31377bf6cc085`
Status: S3 / PLANNING & MATERIALIZATION — R3 HANDOFF CANDIDATE

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`
- M2 accepted contracts/plans only where explicitly preserved by the addendum

## Predecessor closure

Station M2 Component Composition/Editor is CLOSED. TASK-623..626 and cumulative proof are integrated; final closure merged through PR #952. Historical stale task markers identified by the documentation-normalization pass were reconciled through PR #964. S3-R1 census/parity and S3-R2 compounds/collections are complete as research evidence; the clean R2 handoff was integrated through PR #966. Do not reopen predecessors except for a bounded defect against accepted contracts.

## Current phase

**S3-R3 — Interaction Capabilities is at research handoff candidate in draft PR #967.**

R3 decomposes `intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`; preserves Station presentation-only authority; carries Component Grammar and Proof Grammar together; and records coverage strictly as `proven | failed | unproven-gap | not-applicable`. Research evidence never creates product authority. The C4 exit/proof matrix is the current handoff artifact; semantic reparent/cycle safety, sibling ordering, generic DnD/undo, Station save/version/publish authority, schema-driven Inspector, and broad projection round-trip remain explicit gaps/later-phase inputs rather than inferred PASS.

Dependency forecast:

`R1 census -> R2 compounds/collections -> R3 interaction capabilities -> R4 regions/patterns -> R5 templates/views -> R6 tool families -> R7 studio-readiness + Core projection census -> synthesis -> Construction materialization`

## Preserved constraints
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station remains presentation/composition-oriented;
- identity != placement != presentation != action semantics;
- constrained variants/patterns over arbitrary HTML/CSS;
- span/discrete composition authoring with responsive execution;
- lower-level proofs are inherited only when their preconditions remain unchanged; missing evidence is never PASS;
- human acceptance remains distinct from machine conformance;
- research/QA cannot silently create Core/business/product authority;
- no specialized Studios and no AI/MCP foundation before research/synthesis/materialization gates.

## Next eligible work

Revalidate the R3 C4 Exit / Proof Matrix against fresh main and integrate/record the R3 handoff. After that gate, S3-R4 — Pane/Region & Patterns becomes eligible for research/documentation only. No Construction TASK is eligible until R4-R7, synthesis, Test Review/Hardening planning, QA Coverage/Evidence Review planning, and explicit Construction materialization satisfy the S3 planning exit gate.
