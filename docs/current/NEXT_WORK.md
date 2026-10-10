# Next Work — Station S4 WP3 Construction A

Date: 2026-10-10
Base: main@5300763aafa3aac162d1a3e59535bc8a256545ac
Status: Construction A INTEGRATED #1046; Construction B IMPLEMENTED_ON_SPRINT_BRANCH, exact-head validation/integration pending

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
Construction A #1046 merged at 1c39ee81 with all seven exact-head workflows passed. Construction B is COMMITTED under explicit owner authorization to conclude WP3: project_docs/execution_planning/STATION-S4-WP3-CONSTRUCTION-B-01.md and TASK-654-STATION-S4-WP3-FILE-LOCAL-JOURNEY.md. Provider/file policy is docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-02.md; common public envelope is unchanged.

Execute TASK-654 on sprint/station-s4-wp3-construction-b, confirming all nine allowed paths, forbidden paths, dependency TASK-653 and declared validations before code. Run npm run verify, npm run station:build and npx playwright test --config tests/browser/station-editor.playwright.config.ts; require exact-head/current-base CI and build/browser evidence before merge. Extend real codec proof through actual downloads, reload/Open saved, dirty cancellation, corrupt input, metadata versioning and storage failure. Shared Windows worktree was not changed and local locks are not claimed inspected. Preserve other PRs/history; no force/reset/direct main writes.

B implementation is on its Sprint branch; integration is pending. Optional C, Package Review and Documentation & Closure remain FORECAST until predecessor gates pass. Save still session-only until B integrates; no WP3 completion is claimed.
