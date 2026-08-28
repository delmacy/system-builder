# P18-PACKAGE-01 — Process Version Identity & Immutable Revision Foundation

Status: ACTIVE / CONSTRUCTION A INTEGRATED / POST-CONSTRUCTION-A REVALIDATION
Date: 2026-08-28
Milestone: M18 Process Versioning
WBS coverage: 18.1.1–18.1.3
Planning base: `d7f812502895780d383a2f35c73a11b41453d33c`

## Package Goal
Establish deterministic, provider-neutral business artifact identity and revision semantics for versioned process knowledge: stable artifact identity distinct from immutable published revisions, explicit supersession/deprecation/archive lifecycle semantics, and fail-closed lineage proof without treating Git commits as the business version model.

## Fresh-main authority
- `project_docs/18-process-versioning/WBS.md` defines 18.1 identity/revision model before 18.2 semantic change and 18.3 process-to-system lineage.
- `project_docs/18-process-versioning/scope/README.md` includes Mirror/Recipe identity/version, immutable revisions, semantic evolution metadata and traceability; Git commit cannot be the sole business version model.
- P17/M17 is canonically CLOSED; this Package does not reopen Knowledge Boundary.

## Construction state
### Construction A — `P18-PROCESS-VERSION-IDENTITY-CONTRACT-01` — INTEGRATED
TASK-390..394 established the bounded WBS 18.1 contract surface and integrated growing proof through PR #469. Final lifecycle/report head `ee55b8d4c8df264a84327dc3083fcaf4b7baddeb` passed Deterministic CI #1107 / Heavy Product Tests #561 and merged as fresh main `22022c6d47291fb9b051a8289c3fbb3849f9010d`, with zero reviewed-head -> merge-main changed files.

### Construction B — `P18-PROCESS-VERSION-IDENTITY-INTEGRATION-01` — JUSTIFIED / NOT MATERIALIZED
Post-Construction-A fresh-main revalidation demonstrates the predeclared bounded representative-consumer integration gap. Separate Planning & Materialization remains required before any Construction B TASK executes.

### Construction C — `P18-PROCESS-VERSION-IDENTITY-HARDENING-01` — OPTIONAL / FORECAST / NOT MATERIALIZED
May be materialized only from fresh-main evidence after earlier Constructions.

## Out of scope
- WBS 18.2 semantic diff/breaking classification/change approval;
- WBS 18.3 Recipe→Analysis/Definition→Release/deployment lineage;
- migration execution or storage/topology redesign;
- Git commit as business-version authority;
- reopening P17, Decision Boundary changes, unrelated findings/TDs or inferred L4.

## Package exit
WBS 18.1.1–18.1.3 is proven through deterministic product tests, immutable-publication rejection and explicit revision lifecycle/lineage semantics, followed by fresh-main Package Integration & Review and Documentation & Closure.
