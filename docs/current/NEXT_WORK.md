# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@f1511e8462bbec712aa2b7073658ef83d9149a61`
Status: S3 / WP5 C05A — TASK-627 IMPLEMENTED / CLOSURE BLOCKED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `project_docs/research/STATION-S3-R6-C8-REPOSITORY-EVIDENCE-AND-PROOF-MATRIX-01.md`
- `specs/tasks/TASK-627-STATION-S3-C05A-TOOL-ACTIVE-CONTEXT.md`

## Fresh-main / predecessor truth

Fresh main is `f1511e8462bbec712aa2b7073658ef83d9149a61`, a documentation-only reconciliation whose parent is integrated TASK-627 materialization `53af4c5460f34a5805b52d8658eee1c18995c1c4`. TASK-615/C01 through TASK-618/C04 remain CLOSED / PROVEN only under unchanged owner/precondition inheritance. PR #985/TASK-619 remains closed as a colliding, non-authoritative duplicate and grants no product authority.

Preserve throughout S3: `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; discrete/span composition distinct from WindowGeometry; Station presentation/orchestration-only with no Core/business authority; C10 Studio DEFER/UNPROVEN.

## TASK-627 Construction delta

PR #986 / branch `sprint/station-s3-wp5-c05a-construction` implements only C05A in new `packages/station-tool/index.ts` plus focused `tests/product/station-s3-c05-tool-active-context.test.ts` and this operational handoff. Tool identity is stable; required participant roles admit exactly one participant and reject ambiguity before Tool state exists; active context selects only declared participants/routes; routing returns command identity + target qualification and never executes, authorizes, retries, compensates, persists, restores or mutates lower-layer owners.

The same semantic command id can qualify to different declared targets across active contexts without domain-name branching. Participant refs and Tool id remain stable across context activation. Composition/interaction/shell/ui-core/apps/Core/runtime/provider/deploy paths are untouched.

Restoration, multi-view consequence propagation, retry/compensation, failure/recovery presentation, extension seams, AppManifest/C06 and C10 remain carried gaps/non-goals.

## Test Review / Hardening

Focused proof covers stable Tool/participant identity across context switch; same-command deterministic target qualification; ambiguous required-role rejection without input mutation; unknown participant/context rejection; undeclared-route rejection; normalized route-ref ambiguity rejection; and absence of `authorized`/`execute` authority on Tool state. Semantic/architecture review found no Core/business authority, lower-owner mutation or domain-name branching. Accessibility is NOT-APPLICABLE to this non-UI C05A package; no accessibility claim is inherited or expanded.

## QA Coverage / Evidence Review

PROVISIONAL-PROVEN by focused source proof: identity preservation, fail-closed role admission, deterministic active-context qualification, normalized-route adversarial rejection and no executable/authorization surface. UNPROVEN-GAP for closure: current exact-head CI/repository architecture/predecessor regression has not been observed on the latest head. NOT-APPLICABLE in C05A: persistence/restoration, retry/compensation, failure/recovery and multi-view consequence propagation because TASK-627 explicitly defers them.

## Gates / blockers

Fresh main advanced to `f1511e8462bbec712aa2b7073658ef83d9149a61`. PR #986 then advanced through the bounded normalized-route hardening to exact-head `cca7673ddd3486f05c78bffdb9fe504c827bd866`; at hardening review time GitHub exposed no check runs/workflow runs for that head, so prior GREEN evidence is stale and cannot close the TASK. PR history also contains three Construction commits (`dc9b712...`, `441dee60...`, `cca7673...`) rather than the required one authoritative TASK commit. This handoff write is operational repository memory only and must be included in the eventual normalization rather than treated as another authoritative Construction unit.

Do not merge while either blocker remains. Normalize the complete bounded delta onto current fresh main as one authoritative TASK-627 commit, then require the resulting exact-head mandatory gates GREEN and a current merge-candidate GREEN, recording their distinct SHAs. If normalization changes the exact-head, all earlier head evidence is stale by definition.

C05B/C06+, AppManifest, provider/runtime/deploy, Core/business authority, C10/Studio and AI/MCP remain ineligible.

## Handoff :50

Closure/merge: BLOCKED; PR #986 remains draft/open and TASK-627 is not CLOSED.
Fresh main: `f1511e8462bbec712aa2b7073658ef83d9149a61`.
Reviewed Construction head before this handoff write: `cca7673ddd3486f05c78bffdb9fe504c827bd866`.
Evidence: 3 bounded changed paths before handoff; product delta only in `packages/station-tool/index.ts`; focused proof only in `tests/product/station-s3-c05-tool-active-context.test.ts`; no forbidden owner mutation; negative/adversarial fail-closed coverage includes ambiguous roles, unknown participant/context, undeclared route and normalized-route ambiguity; accessibility N/A because no UI surface is introduced.
Residual debt/blockers: normalize branch history to one authoritative TASK-627 commit on current fresh main; rerun/reconfirm mandatory exact-head gates on the normalized SHA; separately reconfirm current merge-candidate GREEN and record its SHA; only then may PR #986 become merge-eligible.
Next dependency-safe work: TASK-627 normalization/gate collection/hardening/closure only. Do not start C05B or C06+ before TASK-627 is exact-head GREEN, merge-candidate GREEN, integrated, fresh-main revalidated and repository memory reconciled.
