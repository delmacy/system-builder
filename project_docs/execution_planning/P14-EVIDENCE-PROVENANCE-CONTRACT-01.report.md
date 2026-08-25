# P14-EVIDENCE-PROVENANCE-CONTRACT-01 — Construction A report

Status: CONSTRUCTION COMPLETE / SPRINT REVIEW GATE PENDING
Work Package: P14-PACKAGE-01 — Evidence Identity & Transformation Lineage
Milestone: M14 Evidence & Provenance
Base main: `bb733323ea7918032a1de6632814c6d172c52093`
Sprint branch: `sprint/P14-EVIDENCE-PROVENANCE-CONTRACT-01`

## Goal evidence
Construction A establishes the additive, provider-neutral M14 evidence-provenance extension over ADR-0009 without changing core artifact-envelope semantics. The integrated branch proof covers stable source references, deterministic normalization, optional classification/confidence, transformation descriptors and compatible evidence-lineage preservation.

## TASK evidence
- TASK-267 — additive evidence-provenance extension contract: `d7057ad7a19c293052b7f992732995f29c03f038`; Deterministic CI #708 PASS; Heavy Product Tests #133 PASS.
- TASK-268 — deterministic validation/canonical normalization: `cdc18632055b6e485cac9a819214bb0183a9331c`; exact-head gates passed before dependency progression.
- TASK-269 — stable source-reference semantics: `16a726882a9b530f55d4be1c33309f11eccec9dc`; Deterministic CI #710 PASS; Heavy Product Tests #135 PASS.
- TASK-270 — optional classification/confidence semantics: `521195eaa710c7084f0b9ce845631e0c9528f046`; Deterministic CI #712 PASS; Heavy Product Tests #137 PASS. The original test assertion was reconstructed within the same authoritative TASK commit after a false-positive substring check matched the schema comment `provider-neutral`; contract semantics were unchanged.
- TASK-271 — transformation/tool/provider-neutral descriptor semantics: `72d53bb03f755e1c0f500250b0bdb90b5eeeb35f`; Deterministic CI #713 PASS; Heavy Product Tests #138 PASS.
- TASK-272 — compatible lineage round-trip preservation: `c37eb8d7d9281dc6e1a0c6408dd0b63a0ba57353`; Deterministic CI #714 PASS; Heavy Product Tests #139 PASS.
- TASK-273 — composed growing proof and this report were introduced by semantic commit `0f6e4b738173301d7616c98392c81cf70916d4cf`. A mechanical lint-only follow-up `2c8f9e3231069f4e41a927d8bdd9cd108427c851` removed unnecessary string escapes after CI #715; the corrected head passed Deterministic CI #716 and Heavy Product Tests #141 before this final evidence reconciliation. No product semantics changed in the follow-up.

Validation-only PRs used to obtain objective exact-head GitHub evidence were closed without merge; only the Sprint Review PR is eligible for eventual integration to `main`.

## Composed proof
The final product proof composes real TASK-267..272 contract behavior and verifies:
- a representative artifact envelope carries the complete optional M14 extension and round-trips deterministically;
- ADR-0009 artifact `provenance.inputs` remains distinct from non-artifact M14 `sources`;
- classification/confidence may remain absent without an implicit default;
- malformed source identity, ambiguous duplicate source identity and unsupported required-extension semantics fail explicitly;
- unknown optional sibling extension data is preserved by compatible re-emission;
- credentials, account/storage fields and secret payload material are not required or copied into provenance;
- the historical artifact-envelope 1.0.0 fixture remains valid without M14 metadata.

## Architecture and scope result
No ADR-0009 core field was reinterpreted. Provenance remains evidence/traceability only and grants no authorization or execution authority. No Runtime Audit Trail behavior, provider routing, persistence/query graph, migration framework, WBS 14.3 implementation or Builder/Runtime topology change was introduced.

## Deviations and bounded corrections
- TASK-270: a proof false positive checked the literal substring `provider` across schema comments and matched `provider-neutral`; the TASK was reconstructed as one authoritative commit and revalidated successfully.
- TASK-273: CI #715 found two `no-useless-escape` lint errors in the composed proof. A single mechanical source correction removed the unnecessary escapes. The connector safety layer did not permit the attempted force-ref reconstruction, so the lint-only correction remains as an explicit bounded follow-up commit after the semantic TASK-273 commit. CI #716 and Heavy #141 then passed on the corrected code head.

Neither correction changed contract meaning, product behavior, scope, architecture, or Work Package boundaries.

## Residual work / exclusions
Construction B `P14-EVIDENCE-PROVENANCE-PROPAGATION-01` remains FORECAST / NOT MATERIALIZED and receives no execution authority from this report. Optional Construction C remains forecast-only. WBS 14.3.1-14.3.3 and TD-P13-01..04 remain outside this Sprint.

## Sprint Review gate
Before merge to `main`, the final Sprint Review head, including this evidence reconciliation, must pass repository-wide Deterministic CI, Heavy Product Tests and review with no blocking finding. After integration, reconstruct fresh `main`, verify reviewed-head -> merge-main tree equivalence, and only then revalidate the post-Construction-A package gate. This report does not promote or materialize Construction B.
