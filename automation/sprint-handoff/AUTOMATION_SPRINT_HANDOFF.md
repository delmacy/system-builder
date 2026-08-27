# Automation Sprint Handoff

status: CORRECTION_PENDING
worker_slot: :30
started_at: 2026-08-27T13:30:16-03:00
updated_at: 2026-08-27T13:32:45-03:00
lease_until: null
observed_main_sha: 3d435e183c757c551d7b0abd4edd3affa961692a
active_branch: sprint/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01
active_pr: 435
active_head_sha: 4161f029ae1425a98cca1387ec1503fd3f790c1d
current_step: Conformance correction remains authoritative before TASK-364. Previous corrective head `5891a528cc44a115fd157c02a7a90581f4349f61` had Heavy #442 PASS but Deterministic CI #996 FAIL because probabilistic substitution was rejected by a lower-level missing-authorityRef diagnostic before the canonical category rejection. Bounded correction `4161f029ae1425a98cca1387ec1503fd3f790c1d` now validates Decision Boundary category `human-decision` before reading human-only authorityRef, then continues through corrected Knowledge Classification Decision / M15 Decision Boundary verification. Exact-head CI #997 and Heavy #443 are running. TASK-364 remains forbidden until both PASS with no head/main drift.

## Authorization
User authorized the next three eligible Work Packages sequentially, with all L1-L3/process approvals pre-granted. L4 requires explicit materialization plus ADR/change control. Automation remains active through all three authorized Packages.

## Required conformance property
- `KnowledgeClassificationReferenceProjection` preserves canonical payload-minimal `humanAuthority` proof;
- standalone projection normalization cannot accept only `decisionRef` as final authority;
- standalone normalization re-verifies through corrected Knowledge Classification Decision and M15 Decision Boundary with expected `human-decision` semantics;
- deterministic/probabilistic authority substitution fails closed;
- `decisionActorRef` must equal verified `authorityRef` on final knowledge classification;
- assisted proposal remains non-authoritative and distinct from final human decision;
- no Decision Boundary public-contract change.

## Current corrective evidence
- PR #435 remains OPEN / DRAFT / MERGEABLE;
- base/main: `3d435e183c757c551d7b0abd4edd3affa961692a`;
- previous corrective head `5891a528cc44a115fd157c02a7a90581f4349f61`: Heavy #442 PASS, Deterministic CI #996 FAIL on exactly one product assertion because the diagnostic order was too low-level;
- bounded corrective commit/head `4161f029ae1425a98cca1387ec1503fd3f790c1d` changes only `packages/contracts/knowledge-boundary/reference-projection.ts` beyond the prior correction, adding category-first rejection while preserving canonical downstream re-verification;
- exact-head Deterministic CI #997 and Heavy Product Tests #443 are in progress.

last_completed_step: applied bounded category-first human-authority validation correction on PR #435 head `4161f029ae1425a98cca1387ec1503fd3f790c1d`.
next_authorized_step: Revalidate exact-head CI #997 + Heavy #443. Only if both PASS, PR head remains `4161f029ae1425a98cca1387ec1503fd3f790c1d`, main has not drifted incompatibly, and there are no blockers, resume TASK-364 as one authoritative commit; then gate before TASK-365 and TASK-366 serially. Do not merge #435 before Sprint completion/review gates.

## Boundaries
No WBS 17.2/17.3, no automatic reuse/promotion authority, no provider topology/credential lifecycle, no sensitive payload carriage, no Decision Boundary public-contract change, no unrelated finding/technical-debt or TD-P13-01..04 absorption, and no undeclared L4.

## resume_prompt
Resume `delmacy/system-builder` at PR #435, branch `sprint/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01`, corrective head `4161f029ae1425a98cca1387ec1503fd3f790c1d`, base/main `3d435e183c757c551d7b0abd4edd3affa961692a`. Keep status CORRECTION_PENDING. Heavy #443 and Deterministic CI #997 must both PASS on this exact head before TASK-364. The conformance invariant is that KnowledgeClassificationReferenceProjection carries canonical humanAuthority and standalone normalization rejects deterministic/probabilistic substitution by category before reading human-only metadata, while still re-verifying valid human authority through corrected Knowledge Classification Decision / M15 Decision Boundary. If gates pass with zero drift/blockers, execute TASK-364 only, then gate before 365 and 366. Preserve WBS 17.1 only and do not advance successor Package scope.