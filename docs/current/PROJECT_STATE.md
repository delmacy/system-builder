# Project State

Date: 2026-08-24

`delmacy/system-builder` is canonical. P12 and P13-PACKAGE-01..03 are CLOSED. M13 Autonomous Runtime is CLOSED at WBS 13.1-13.3.

## Current planning horizon — M14 Evidence & Provenance
A fresh-main planning/materialization cycle is authorized from `4d113432c089621c5f327aed50843b6fd2c8321a`. Baseline authority identifies WBS 14 Evidence & Provenance and WP-X01 as the successor planning candidate.

`P14-PACKAGE-01 — Evidence Identity & Transformation Lineage` is PLANNING MATERIALIZED on a planning branch only; it is not yet integrated. It covers WBS 14.1.1-14.2.3. Construction A `P14-EVIDENCE-PROVENANCE-CONTRACT-01` / TASK-267..273 is COMMITTED / MATERIALIZED / NOT EXECUTED and may execute only after the planning/materialization PR passes required gates and merges to `main`.

Fresh-main gap analysis treats ADR-0009/artifact-envelope 1.0.0 as predecessor evidence: stable artifact identity, createdAt, producer, input artifact references and optional qualified digests already exist. Remaining bounded gaps are portable non-artifact source references, optional classification/confidence, transformation descriptors and compatible lineage-preservation proof. Core envelope semantics must not be reinvented.

WBS 14.3.1-14.3.3 is forecast for successor `P14-PACKAGE-02` after P14-PACKAGE-01 integration/fresh-main revalidation; it is not materialized and grants no execution authority.

## Security and architecture boundaries
Evidence/provenance is traceability, not execution authority. Runtime Audit Trail is not replaced. No secret value, credential, mandatory provider resource identifier or mandatory storage locator belongs in the portable provenance contract. ADR-0009 core envelope meaning remains authoritative; additive namespaced extensions are preferred over core-envelope redesign.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by M14 planning.

## Current gate
Planning & Materialization must pass exact-head repository gates and integrate before TASK-267 executes. Construction B/C and P14-PACKAGE-02 remain forecast/not materialized.
