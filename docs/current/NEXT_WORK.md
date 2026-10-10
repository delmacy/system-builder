# Next Work — Station S4 WP3 Construction A

Date: 2026-10-10
Base: main@5300763aafa3aac162d1a3e59535bc8a256545ac
Status: readiness integrated through #1045 at eaad7ef3; TASK-653 implemented on Construction A branch, validation/integration pending

## Authority
- AGENTS.md and docs/DOCUMENT_AUTHORITY.md.
- docs/contracts/CONTRACT_INDEX.md and docs/contracts/004-station-portable-composition-artifacts/ADDENDUM.md.
- docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-01.md.
- Accepted docs/adr/ADR-0009-public-artifact-envelope.md and specs/contracts/artifact-envelope/artifact-envelope.schema.json.
- project_docs/execution_planning/STATION-S4-WP3-LOCAL-ARTIFACT-PLANNING-01.md.
- project_docs/execution_planning/STATION-S4-WP3-CONSTRUCTION-A-01.md.
- specs/tasks/TASK-653-STATION-S4-WP3-PUBLIC-ENVELOPE-CODEC.md and every declared context_path.
- project_docs/schedule/SPRINT_MODE.md and SPRINT_GENERATION_POLICY.md.

## Integrated predecessors and present proof
WP2 closure #1039 merged at 9768c06e. WP3 planning #1040, readiness #1041, proposal #1042 and admission #1043 are integrated; #1043 merged at e9750fe4 after five passing workflows. Live pointer reconciliation #1044 merged at 5300763a after exact-head 38072814873, merge-candidate 38072815081, heavy 38072815017, browser 38072814890 and handoff 38072814982 succeeded. These are predecessor/documentation proofs, not codec proof.

TASK-652's distinct readiness commit changes only its permitted specification. It inventories common-envelope compatibility, source graph/session boundaries and new bounded-input policies. Contract resolution conforms to ADR-0009: public envelope plus strict composition payload, lossless inert optional metadata and unsupported required-extension rejection. No new ADR/architecture exception. Readiness-resolution #1045 passed all five triggered workflows and merged at eaad7ef3. Construction A is now executing under TASK-653; predecessor conditional labels are historical checkpoints.

## Next eligible execution
After validated resolution integration, reconstruct fresh main and competing PR/worker state, then execute TASK-653 on sprint/station-s4-wp3-construction-a. Confirm its seven exact allowed paths, forbidden shared contracts/settings/composition/workflow/provider/runtime/deploy paths, dependency TASK-652 and declared validations before writing. No code under TASK-652; no forecast promotion.

Implement pure package codec with app-local source-catalog adapter; explicit caller artifact metadata; strict input budgets/schema/source compatibility; cycles/connectivity/slot occupancy; deterministic serialization; immutable typed rejection/success. Growing proof must use the real catalog and editor mutation/session APIs. One authoritative TASK commit and one Construction A PR; attach report and observed Actions/build/browser evidence.

Declared validations: npm run verify; npm run station:build; npx playwright test --config tests/browser/station-editor.playwright.config.ts. Require all triggered exact-head/current-base checks before merge. No unobserved local execution claim.

Construction A codec is branch-only until validated merge. Construction B remains FORECAST until A integrates and fresh readiness materializes its provider/file workflow. Save remains session-only; no durable Save/Open, File Manager, .process, Core persistence or WP3 completion is claimed.

## Coordination
Owner authorized serial direct GitHub commits/merges. No competing open WP3 PR was found at planning start. Shared Windows worktree was not inspected/changed; historical clean/lock statements are not current proof. Recheck remote main/open PRs and applicable locks before product writes. No force/reset/direct main writes; preserve unrelated worker history. Separate IMPLEMENTED, PROVEN, INTEGRATED and CLOSED.
