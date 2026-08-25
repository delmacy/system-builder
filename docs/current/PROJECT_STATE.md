# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. P12 and P13-PACKAGE-01..03 are CLOSED. M13 Autonomous Runtime is CLOSED at WBS 13.1-13.3.

## Current execution horizon — M14 Evidence & Provenance
`P14-PACKAGE-01 — Evidence Identity & Transformation Lineage` is active and covers WBS 14.1.1-14.2.3 only.

Construction A `P14-EVIDENCE-PROVENANCE-CONTRACT-01` / TASK-267..273 is COMPLETE / SPRINT REVIEW PASS / INTEGRATED. Final reviewed head `eb881c9a07882cba9ec1d9068056166c922779c4` passed Deterministic CI #717 and Heavy Product Tests #142 and integrated as `2ba94b028819e5daf8d4ff63bebe94209675774d` with identical reviewed/merged tree `8fcd51469846fe7ab11aedf62ec18720fea0a2c6`.

Post-Construction-A reconciliation/revalidation is integrated through PR #334 / main `4923892f66bc3dc0bd1915b96c336b5e7301c4c3` and confirmed the producer/transformer propagation gap.

Construction B `P14-EVIDENCE-PROVENANCE-PROPAGATION-01` / TASK-274..279 is CONSTRUCTED / SPRINT REVIEW. TASK-274..279 executed in dependency order with one authoritative commit each. TASK-279 head `670527e56bbe5d81d881eb6c47a9ccb429f6bd61` passed Deterministic CI #728 and Heavy Product Tests #154. The Sprint now carries the Construction A provenance extension through actual Compiler -> Release -> Deploy -> Observe APIs with backward-compatible absence, deterministic preservation, explicit malformed-input failure and no-leak boundaries. Final exact-head Sprint Review validation on PR #336 remains required before integration.

Optional Construction C remains FORECAST ONLY / NOT MATERIALIZED and evidence-gated. WBS 14.3.1-14.3.3 remains outside P14-PACKAGE-01 and forecast for successor P14 planning.

## Security and architecture boundary
Evidence/provenance is traceability, not execution authority. Runtime Audit Trail is not replaced. ADR-0009 core artifact-envelope meaning remains authoritative. No secret value, credential, mandatory provider resource identifier or mandatory storage locator belongs in portable provenance. No new L4 topology was introduced by Construction B.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by M14 work.
