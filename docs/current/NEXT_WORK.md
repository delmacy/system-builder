# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-04
Repository truth base: `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`
Status: S3 / WP8 — TASK-633 GATE B EXECUTED / INTEGRATED; S3 CLOSURE BLOCKED ONLY BY C3 COLLECTION UNPROVEN-GAP; TASK-634 MATERIALIZED / ADMISSION PENDING

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Predecessor truth
C01–C05 remain PROVEN under unchanged recorded preconditions. C06A/TASK-630 and C06B/TASK-631 are CLOSED / PROVEN / INTEGRATED. C07A/TASK-632 is CLOSED / PROVEN / INTEGRATED. C10 remains deferred/unproven. No C07B/C08 product successor is inferred.

TASK-633 Gate B execution PR #1003 is integrated at `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`; its exact review head was `78a20f3c526e1aba1424b93be4607f590e7560f9`. That exact head had current GREEN Deterministic CI, Heavy Product Tests, Automation Handoff and distinct Merge Candidate CI. Product mutation was zero.

Gate B preserved the integrated C01–C07 Construction slices as `proven` under unchanged owner contracts/preconditions. C5 Pane/Region and C6 Pattern remain `not-applicable` to promotion. C10 remains deferred / `unproven-gap` and blocks only C10 promotion.

## BLOCKER-FIRST result
Gate B is not fully proven. The sole demonstrated S3-closure blocker is C3 Collection / Ticketing: representative executable evidence is missing for keyed membership/topology/order plus explicit visual-order != semantic-order/reorder distinction. C04 responsive semantic-order preservation does not prove keyed Collection reorder semantics. No integrated C01–C07 slice is `failed`, and missing evidence is not converted to PASS.

TASK-611 already owns generic stable collection identity and deterministic selection in `packages/station-interaction/**`; therefore the smallest dependency-safe follow-up is proof-first and bounded to that existing owner. It must not create a Ticketing product or a generic DnD/reparent engine.

## TASK-634 materialization
Task: `TASK-634-STATION-S3-C3-COLLECTION-PROOF-FOLLOWUP`.
Planning branch: `planning/station-s3-wp8-c3-collection-proof-followup`.
Materialization base: `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`.
Construction status: BLOCKED pending materialization admission.

Allowed after admission: focused executable proof under `tests/product/**`; `packages/station-interaction/selection.ts` only if the proof demonstrates a bounded missing domain-neutral contract; TASK-634 and this pointer; max_files 4.

Acceptance/proof obligations: stable keyed membership/topology/canonical semantic order; explicit distinction between visual presentation order and semantic reorder; semantic reorder, if represented, must be intentional/deterministic/idempotent rather than inferred from DOM/visual position; duplicate/unknown/malformed refs fail safely before canonical mutation with zero partial mutation; TASK-611 and C02 proof may be inherited only under unchanged preconditions; after integration rerun/reconcile Gate B only for C3/Ticketing.

Forbidden: Ticketing product/domain behavior; generic drag/drop/reparenting; UI/DOM/accessibility surface; all `apps/**`; Core/business/command authority; persistence/storage; provider/runtime/deploy/secrets; mutation of unrelated C01–C07 owners; C07B/C08; C10/Studio; AI/MCP.

## Handoff to Construction :10
Predecessor truth: `C01–C07 admitted slices PROVEN/INTEGRATED → TASK-633 Gate B review exact-head 78a20f3c GREEN → PR #1003 INTEGRATED@9bdcc9b6 → C3/Ticketing unproven-gap remains sole S3 closure blocker → TASK-634 materialized from fresh main@9bdcc9b6`.

Authorization: materialization only. Construction is NOT yet authorized. The next action is to validate the exact TASK-634 materialization head with required deterministic repository/handoff gates and a distinct current merge-candidate. Correct only a demonstrated bounded documentation/conformance blocker. If GREEN/current, integrate the materialization, revalidate fresh main, then authorize only TASK-634 Construction. Do not implement product in this handoff lane.
