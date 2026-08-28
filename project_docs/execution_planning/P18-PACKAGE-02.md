# P18-PACKAGE-02 — Semantic Process Change Classification & Approval Evidence

Status: ACTIVE PLANNING / CONSTRUCTION A MATERIALIZED / NOT EXECUTED
Date: 2026-08-28
Milestone: M18 Process Versioning
WBS coverage: 18.2.1–18.2.3
Planning base: `e205683422907edf8c27f99c01aab317cca3f66c`

## Package Goal
Establish provider-neutral, deterministic semantic-change evidence between canonical process revisions: represent semantic diff, carry explicit breaking/non-breaking classification when applicable, and record reason/evidence plus a domain process-change approval/rejection decision backed by canonical `human-decision` authority, without treating classification/model output/Git as approval authority.

## Fresh-main authority
- P18-PACKAGE-01 / WBS 18.1 is canonically CLOSED and supplies stable artifact/revision identity, immutable publication evidence and lifecycle/lineage truth.
- WBS 18.2.1–18.2.3 requires semantic diff, breaking/non-breaking classification when applicable, and reason/approval/evidence of change.
- Process Versioning scope includes semantic diffs and migration/evolution metadata; input is knowledge artifacts and approved changes; output includes versioned diff/history.
- Existing Decision Boundary reserves human authority through `human-decision` + explicit `authorityRef`; this Package does not change Decision Boundary or reuse ADR-0010 engineering/PR approval as business approval.

## Construction forecast
### Construction A — `P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01` — COMMITTED / MATERIALIZED / NOT EXECUTED
Materializes TASK-399..403 only. Establishes the bounded public WBS 18.2 contract/evidence surface and growing proof over canonical WBS 18.1 predecessor identity.

### Construction B — `P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01` — FORECAST / NOT MATERIALIZED
Candidate goal: integrate the canonical semantic-change truth through one representative existing consumer seam and prove callers cannot bypass predecessor/diff/classification/human-approval validation. Must be re-derived from fresh main after Construction A integration.

### Construction C — `P18-PROCESS-SEMANTIC-CHANGE-HARDENING-01` — OPTIONAL / FORECAST / NOT MATERIALIZED
May be materialized only if fresh integrated evidence after Construction B shows a bounded residual required for the Package Goal.

## Growing proof
Across the Package, prove:
- diff endpoints are real same-artifact WBS 18.1 revisions with ordered predecessor truth;
- semantic diff representation is deterministic and payload-minimal;
- classification is explicit evidence and cannot silently become approval authority;
- process-change approval/rejection requires canonical `human-decision` with matching authority reference;
- deterministic/probabilistic classifications or outputs cannot substitute for human approval;
- forged revision refs, reversed endpoints, classification/ref mismatch, authority mismatch and payload/content injection fail closed;
- Git identity remains non-authoritative for business version/change approval.

## Package gates
1. Planning head exact-head Deterministic CI + Heavy Product Tests, protected integration, fresh-main revalidation.
2. Construction A exact-head validation/review/integration.
3. Fresh-main derivation/materialization of Construction B only if still justified.
4. Optional Construction C only if evidence-gated.
5. Package Integration & Review.
6. Documentation & Closure and canonical CLOSED reconciliation.

## Out of scope
- WBS 18.3 Recipe/Analysis/SystemDefinition/Release/deployment lineage;
- Git commit as business-version or approval authority;
- reuse of ADR-0010 PR approval as process-change approval;
- Decision Boundary public-contract change;
- automatic approval by deterministic/probabilistic/model output;
- migration execution, storage/topology redesign, unrelated findings/TDs or inferred L4.