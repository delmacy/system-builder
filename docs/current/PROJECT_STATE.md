# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. P12 and P13-PACKAGE-01..03 are CLOSED. M13 Autonomous Runtime is CLOSED at WBS 13.1-13.3.

## Current execution horizon — M14 Evidence & Provenance
`P14-PACKAGE-01 — Evidence Identity & Transformation Lineage` is active and covers WBS 14.1.1-14.2.3 only.

Construction A `P14-EVIDENCE-PROVENANCE-CONTRACT-01` / TASK-267..273 is COMPLETE / SPRINT REVIEW PASS / INTEGRATED. The final reviewed head `eb881c9a07882cba9ec1d9068056166c922779c4` passed Deterministic CI #717 and Heavy Product Tests #142 with zero blocking review threads and was squash-merged as `2ba94b028819e5daf8d4ff63bebe94209675774d`. Reviewed head and merge-main share tree `8fcd51469846fe7ab11aedf62ec18720fea0a2c6`.

Integrated Construction A establishes the additive provider-neutral evidence-provenance extension over ADR-0009: stable non-artifact source references, deterministic normalization, optional classification/confidence, transformation descriptors and compatible lineage-preservation/no-leak proof. Core artifact-envelope semantics remain unchanged.

## Current gate
Fresh-main post-Construction-A revalidation is now eligible to determine whether a real producer/transformer propagation gap remains for the P14-PACKAGE-01 goal. This gate does not materialize or authorize Construction B.

Construction B `P14-EVIDENCE-PROVENANCE-PROPAGATION-01` remains FORECAST / NOT MATERIALIZED / NOT AUTHORIZED FOR EXECUTION. Optional Construction C remains forecast-only and evidence-gated.

WBS 14.3.1-14.3.3 remains outside P14-PACKAGE-01 and forecast for successor P14 planning. No WBS 14.3 execution authority exists.

## Security and architecture boundaries
Evidence/provenance is traceability, not execution authority. Runtime Audit Trail is not replaced. No secret value, credential, mandatory provider resource identifier or mandatory storage locator belongs in the portable provenance contract. ADR-0009 core envelope meaning remains authoritative.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by M14 work.
